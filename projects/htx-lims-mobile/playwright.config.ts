import type { PlaywrightTestConfig } from '@playwright/test';
import { MobilecliDriver } from '@mobilewright/driver-mobilecli';
import { defineConfig, type MobilewrightConfig, type MobilewrightUseOptions } from 'mobilewright';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

// HTX LIMS Mobile is a native Android app (com.htx.lims.dev), tested on the emulator with mobilewright. Like
// mha-mobile it has its own config (mobilewright's global setup starts its device pool and mobilecli); the root
// playwright.config.ts skips it (project.yaml `playwright.runner: mobilewright`).
//   .\qa test -c projects/htx-lims-mobile/playwright.config.ts                     every test (emulator running)
//   .\qa test -c projects/htx-lims-mobile/playwright.config.ts --grep "HLM-001:"   one test
//   .\qa auto -c projects/htx-lims-mobile/playwright.config.ts                     with Test Manager's heal flow

const ROOT = path.resolve(__dirname, '../..');
try {
  process.loadEnvFile(path.join(ROOT, '.env'));
} catch {
  /* no .env file, rely on real environment variables */
}

type ProjectYaml = {
  defaultEnv?: string;
  envs?: Record<string, { baseUrl?: string; allowWrites?: boolean; mobileAccount?: string }>;
  playwright?: { testDir?: string };
};
const cfg = (YAML.parse(fs.readFileSync(path.join(__dirname, 'project.yaml'), 'utf8')) || {}) as ProjectYaml;
const envName = process.env.QA_ENV || cfg.defaultEnv || '';
const env = cfg.envs?.[envName] ?? {};
const baseURL = process.env.HLM_BASE_URL || env.baseUrl;
// The env's app account prefix, for tests/utils/test-data.ts (workers load this config too).
process.env.HLM_MOBILE_ACCOUNT ||= env.mobileAccount || 'HLW_ADMIN';

const config: PlaywrightTestConfig<MobilewrightUseOptions> & Pick<MobilewrightConfig, 'driver'> = {
  // mobilecli's default port 12000 is inside a port range Windows reserves for Hyper-V/WSL on this machine
  // (see projects/mha-mobile/README.md > Setup notes), so its server runs on 13000.
  driver: new MobilecliDriver({ url: `ws://localhost:${process.env.MHM_MOBILECLI_PORT || 13000}/ws` }),
  testDir: path.join(__dirname, cfg.playwright?.testDir || 'tests/e2e'),
  outputDir: path.join(ROOT, 'reports/test-results'),
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // one emulator
  // Every screen read waits ~6 s and a tap ~12 s: uiautomator's idle wait times out because the app never goes
  // idle (README > Speed). Sign-out plus sign-in alone is about 3 minutes.
  timeout: 360_000,
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
    name: 'htx-lims-mobile',
    grepInvert: env.allowWrites ? undefined : /@writes/, // read-only env: skip tests that change data
    metadata: { slug: 'htx-lims-mobile', env: envName, baseUrl: baseURL, browser: 'android' },
    // mobilewright launches the app fresh before each test. ignoreHTTPSErrors: the UAT web server has a
    // self-signed certificate (for tests that also use the browser `page`).
    // launchOptions: HTX LIMS web prints through Zebra Browser Print, a local agent on http://127.0.0.1:9100; Chromium's
    // local network access checks block a public https page from calling it, so the printer list stays empty.
use: { baseURL, ignoreHTTPSErrors: true, launchOptions: { args: ['--disable-features=LocalNetworkAccessChecks,BlockInsecurePrivateNetworkRequests,PrivateNetworkAccessRespectPreflightResults'] }, platform: 'android', bundleId: 'com.htx.lims.dev', animations: 'off' },
  }],
};

export default defineConfig(config as MobilewrightConfig);
