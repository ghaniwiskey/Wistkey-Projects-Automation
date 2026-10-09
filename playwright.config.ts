import { defineConfig, devices, type Project } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

// Multi-project config: every projects/<slug>/project.yaml becomes a Playwright project named <slug>.
//   npx playwright test                              all projects, each on its defaultEnv
//   npx playwright test --project=scg-store          one project
//   npx playwright test --grep @smoke                the smoke suite everywhere
//   QA_ENV=staging npx playwright test               another env (PowerShell: $env:QA_ENV='staging')
//   SCG_BASE_URL=https://... npx playwright test     override one project's base URL (<PREFIX>_BASE_URL)

// Credentials and overrides from .env (Node 20.12+ built-in, no dotenv needed)
try {
  process.loadEnvFile(path.join(__dirname, '.env'));
} catch {
  /* no .env file, rely on real environment variables */
}

const PROJECTS_DIR = path.join(__dirname, 'projects');
const BROWSERS: Record<string, (typeof devices)[string]> = {
  chromium: devices['Desktop Chrome'],
  firefox: devices['Desktop Firefox'],
  webkit: devices['Desktop Safari'],
  mobile: devices['Pixel 7'],
};

type ProjectYaml = {
  testIdPrefix?: string;
  defaultEnv?: string;
  envs?: Record<string, { baseUrl?: string; allowWrites?: boolean }>;
  playwright?: {
    testDir?: string; browsers?: string[]; fullyParallel?: boolean; timeout?: number; retries?: number; use?: Project['use'];
    runner?: 'mobilewright'; // native app: runs with its own projects/<slug>/playwright.config.ts
  };
};

const projects: Project[] = [];
for (const slug of fs.existsSync(PROJECTS_DIR) ? fs.readdirSync(PROJECTS_DIR).sort() : []) {
  if (slug.startsWith('_') || slug.startsWith('.')) continue; // _template and hidden folders
  const file = path.join(PROJECTS_DIR, slug, 'project.yaml');
  if (!fs.existsSync(file)) continue;
  const cfg = (YAML.parse(fs.readFileSync(file, 'utf8')) || {}) as ProjectYaml;
  if (cfg.playwright?.runner === 'mobilewright') continue; // native app: its own projects/<slug>/playwright.config.ts runs it
  const envName = process.env.QA_ENV || cfg.defaultEnv || '';
  const env = cfg.envs?.[envName];
  if (!env?.baseUrl) continue; // project has no such env: skip it so QA_ENV can target a subset
  const baseURL = (cfg.testIdPrefix && process.env[`${cfg.testIdPrefix}_BASE_URL`]) || env.baseUrl;
  const pw = cfg.playwright || {};
  const browsers = pw.browsers?.length ? pw.browsers : ['chromium'];
  browsers.forEach((browser, i) => {
    if (!BROWSERS[browser]) throw new Error(`projects/${slug}/project.yaml: unknown browser "${browser}" (use ${Object.keys(BROWSERS).join(', ')})`);
    projects.push({
      name: i === 0 ? slug : `${slug}-${browser}`,
      testDir: path.join(PROJECTS_DIR, slug, pw.testDir || 'tests/e2e'),
      fullyParallel: pw.fullyParallel ?? true,
      grepInvert: env.allowWrites ? undefined : /@writes/, // read-only env: skip tests that change data
      ...(pw.timeout ? { timeout: pw.timeout } : {}),
      ...(pw.retries !== undefined ? { retries: pw.retries } : {}),
      metadata: { slug, env: envName, baseUrl: baseURL, browser },
      use: { ...BROWSERS[browser], baseURL, ...(pw.use || {}) },
    });
  });
}

export default defineConfig({
  // Generated output lives under reports/ (gitignored): scratch attachments of the current run.
  outputDir: 'reports/test-results',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // One worker by default: projects may share test accounts (SCG's cart). Raise with --workers or QA_WORKERS.
  workers: Number(process.env.QA_WORKERS) || 1,
  timeout: 60_000,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'reports/playwright-html' }], // latest run only; npm run report
    ['json', { outputFile: 'reports/playwright-results.json' }],
    // Test Manager: records every run in projects/<slug>/runs/ (see test-manager/README.md)
    ['./test-manager/reporters/qa-reporter.mjs'],
    ...(process.env.QA_LIVE ? [['./test-manager/reporters/live-reporter.mjs'] as const] : []), // live progress for the web app
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off', // screenshots + traces on failure are enough; videos slow runs and fill disk
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects,
});
