import fs from 'node:fs';
import path from 'node:path';
import type { Browser, BrowserContextOptions, Page } from '@playwright/test';

/**
 * Login session reuse (Playwright storageState), shared by every project.
 *
 * A test opts in through its project's fixture (e.g. `test.use({ role: 'logs1' })`). The first such
 * test logs in once through the project's page objects and saves cookies + localStorage to
 * playwright/.auth/<project>/<env>/<account>.json (gitignored). Later tests, and later runs while the
 * file is fresh, start already logged in. A saved session is checked before it is reused; if the app
 * has expired it, the fixture logs in again. Tests that exercise the login itself do not opt in and
 * keep a fresh, logged-out context.
 *
 *   QA_AUTH_MAX_AGE_MIN=30   reuse a saved session for up to N minutes across runs (default 30)
 *   QA_AUTH_MAX_AGE_MIN=0    always log in again (once per worker per run)
 */
export type SessionOptions = {
  /** Project slug, keeps sessions of different projects apart. */
  project: string;
  /** Environment name (QA_ENV / defaultEnv); staging and prod sessions never mix. */
  env: string;
  /** Account key: user name, role or "default". One session file per account. */
  account: string;
  /** Log in on a fresh page using the project's page objects. Must leave the page logged in. */
  login: (page: Page) => Promise<void>;
  /** Open a page that needs a session and tell whether it is still logged in. Must not throw for "no". */
  isLoggedIn: (page: Page) => Promise<boolean>;
  /** Options for the login context; pass the test's baseURL and viewport. */
  contextOptions?: BrowserContextOptions;
  /** Override QA_AUTH_MAX_AGE_MIN for this account. */
  maxAgeMinutes?: number;
};

export const AUTH_DIR = path.resolve(__dirname, '..', '..', 'playwright', '.auth');

const safe = (s: string) => s.replace(/[^\w.-]+/g, '_');

/** Path of the saved session for a project/env/account. */
export function sessionFile(project: string, env: string, account: string): string {
  return path.join(AUTH_DIR, safe(project), safe(env || 'default'), `${safe(account)}.json`);
}

// One preparation per account per worker process: parallel tests in a worker share the same promise.
const prepared = new Map<string, Promise<string>>();

/** Returns a storageState file for the account, logging in only when no valid saved session exists. */
export function savedSession(browser: Browser, opts: SessionOptions): Promise<string> {
  const file = sessionFile(opts.project, opts.env, opts.account);
  let ready = prepared.get(file);
  if (!ready) {
    ready = prepare(browser, opts, file).catch((e) => {
      prepared.delete(file);
      throw e;
    });
    prepared.set(file, ready);
  }
  return ready;
}

/**
 * Save the session of a page that just logged in again (e.g. after the app ended the saved session),
 * so later tests in this run and later runs reuse the new one.
 */
export async function resaveSession(page: Page, project: string, env: string, account: string): Promise<void> {
  const file = sessionFile(project, env, account);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await page.context().storageState({ path: file });
}

/** Forget the cached session (e.g. after a test logged the account out or changed its password). */
export function forgetSession(project: string, env: string, account: string): void {
  const file = sessionFile(project, env, account);
  prepared.delete(file);
  fs.rmSync(file, { force: true });
}

async function prepare(browser: Browser, opts: SessionOptions, file: string): Promise<string> {
  const maxAgeMin = opts.maxAgeMinutes ?? Number(process.env.QA_AUTH_MAX_AGE_MIN ?? 30);
  const age = fs.existsSync(file) ? Date.now() - fs.statSync(file).mtimeMs : Infinity;

  if (maxAgeMin > 0 && age < maxAgeMin * 60_000) {
    const ctx = await browser.newContext({ ...opts.contextOptions, storageState: file });
    try {
      if (await opts.isLoggedIn(await ctx.newPage())) return file;
    } catch {
      /* treat any error as "not logged in" and log in again below */
    } finally {
      await ctx.close();
    }
  }

  const ctx = await browser.newContext({ ...opts.contextOptions, storageState: undefined });
  try {
    const page = await ctx.newPage();
    await opts.login(page);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    await ctx.storageState({ path: file });
  } finally {
    await ctx.close();
  }
  return file;
}
