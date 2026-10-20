import { devices, type PlaywrightTestConfig } from '@playwright/test';
import { MobilecliDriver } from '@mobilewright/driver-mobilecli';
import { defineConfig, type MobilewrightConfig, type MobilewrightUseOptions } from 'mobilewright';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

// MHA Mobile is a native Android app, tested on the emulator with mobilewright: Playwright Test plus `device` and
// `screen` fixtures. It has its own config because mobilewright's defineConfig adds a global setup that starts
// its device pool and mobilecli, which web runs must not pay for; the root playwright.config.ts skips this
// project (project.yaml `playwright.runner: mobilewright`).
//   npm run test:mhm                                                     every MHA Mobile test (emulator running)
//   npm run test:mhm -- --grep MHM-002                                   one test
//   npm run test:auto -- -c projects/mha-mobile/playwright.config.ts     with Test Manager's heal flow
// The reporters match the root config, so Test Manager records the runs in projects/mha-mobile/runs/.

const ROOT = path.resolve(__dirname, '../..');
try {
  process.loadEnvFile(path.join(ROOT, '.env'));
} catch {
  /* no .env file, rely on real environment variables */
}

type ProjectYaml = {
  defaultEnv?: string;
  envs?: Record<string, { baseUrl?: string; allowWrites?: boolean; agency?: string; mobileAccount?: string; webAccount?: string }>;
  playwright?: { testDir?: string };
};
const cfg = (YAML.parse(fs.readFileSync(path.join(__dirname, 'project.yaml'), 'utf8')) || {}) as ProjectYaml;
const envName = process.env.QA_ENV || cfg.defaultEnv || '';
const env = cfg.envs?.[envName] ?? {};
const baseURL = process.env.MHM_BASE_URL || env.baseUrl;
// The env's agency and account variables, for tests/utils/test-data.ts (workers load this config too).
process.env.MHM_AGENCY ||= env.agency || 'SPF';
process.env.MHM_MOBILE_ACCOUNT ||= env.mobileAccount || 'MHM';
if (env.webAccount) process.env.MHM_WEB_ACCOUNT ||= env.webAccount;
// One id per run (the runner sets it, its workers inherit it): what tests learn about the mobile account (roles,
// cost centres per role) is remembered for the rest of the run only (tests/utils/role-cache.ts).
process.env.MHM_RUN_ID ||= String(Date.now());
// Browser settings for tests that also check MHA web, minus the `screen` option: mobilewright's phone fixture
// has that name, and Playwright refuses a config value for a fixture that is not an option.
// (The descriptor carries `screen` at runtime although its type does not declare it.)
const { screen: _browserScreen, ...desktopChrome } = devices['Desktop Chrome'] as (typeof devices)[string] & { screen?: unknown };

const config: PlaywrightTestConfig<MobilewrightUseOptions> & Pick<MobilewrightConfig, 'driver'> = {
  // mobilecli's default port 12000 is inside a range Windows reserves for Hyper-V/WSL on this machine
  // (11906-12005, see `netsh int ipv4 show excludedportrange protocol=tcp`), so its server runs on 13000.
  driver: new MobilecliDriver({ url: `ws://localhost:${process.env.MHM_MOBILECLI_PORT || 13000}/ws` }),
  testDir: path.join(__dirname, cfg.playwright?.testDir || 'tests/e2e'),
  outputDir: path.join(ROOT, 'reports/test-results'),
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // one emulator
  // App launch, login and data loading; each screen read with a dropdown open takes ~5 s (uiautomator idle wait).
  timeout: 240_000,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: path.join(ROOT, 'reports/playwright-html') }],
    ['json', { outputFile: path.join(ROOT, 'reports/playwright-results.json') }],
    [path.join(ROOT, 'test-manager/reporters/qa-reporter.mjs')],
    ...(process.env.QA_LIVE ? [[path.join(ROOT, 'test-manager/reporters/live-reporter.mjs')] as [string]] : []),
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [{
    name: 'mha-mobile',
    grepInvert: env.allowWrites ? undefined : /@writes/, // read-only env: skip tests that change data
    metadata: { slug: 'mha-mobile', env: envName, baseUrl: baseURL, browser: 'android' },
    // mobilewright launches the app fresh before each test.
    // MHA web hides header labels (Role:, Last Login) below 1400px, so the browser gets 1440x900 like mha-spf.
    // animations 'off' turns off the emulator's system animations: reading the screen waits for the UI to be
    // idle, which with animations on takes seconds per read (dropdowns, dialogs).
    use: { ...desktopChrome, viewport: { width: 1440, height: 900 }, baseURL, platform: 'android', bundleId: 'com.iconsult.mhasgtwo', animations: 'off' },
  }],
};

// mobilewright's config type covers a subset of Playwright's (no project metadata, no trace or screenshot);
// its defineConfig passes everything through to Playwright Test.
export default defineConfig(config as MobilewrightConfig);
