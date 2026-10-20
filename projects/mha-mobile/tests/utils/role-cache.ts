import fs from 'node:fs';
import path from 'node:path';
import { agency } from './test-data';

// What the mobile account holds, remembered for the rest of the run: its roles, and the cost centres of each role.
// Neither changes during a run, and reading them from the phone is slow: the roles cost the Switch Role panel, a
// role's cost centres a role switch, a trip through Settings (BUG-005) and a full scroll of the dropdown. So only
// the first test of the run that needs them reads them. Scoped to the run (MHM_RUN_ID, set once by
// playwright.config.ts) and keyed by agency and the .env account prefix, never by the login itself.
const CACHE_DIR = path.resolve(__dirname, '../../../../reports/.cache');

type RunCache = { runId: string; roles?: string[]; costCentres?: Record<string, string[]> };

function runId(): string {
  return process.env['MHM_RUN_ID'] || '';
}

function cacheFile(): string {
  return path.join(CACHE_DIR, `mha-mobile-account-${agency()}-${process.env['MHM_MOBILE_ACCOUNT'] || 'MHM'}.json`);
}

function load(): RunCache {
  try {
    const cache = JSON.parse(fs.readFileSync(cacheFile(), 'utf8')) as RunCache;
    if (cache.runId && cache.runId === runId()) return cache;
  } catch {
    /* nothing cached yet */
  }
  return { runId: runId() };
}

function save(cache: RunCache): void {
  if (!cache.runId) return; // outside a configured run: do not remember anything
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cacheFile(), JSON.stringify(cache));
}

/** The mobile account's roles, if a test of this run read them. */
export function knownMobileRoles(): string[] | undefined {
  return load().roles;
}

export function saveMobileRoles(roles: string[]): void {
  save({ ...load(), roles });
}

/** True when the roles read earlier in this run lack the role (unknown = false: the test then checks). */
export function knownToLack(role: string): boolean {
  const roles = knownMobileRoles();
  return !!roles && !roles.includes(role);
}

/** The cost centres the account holds as this role, if a test of this run read them. */
export function knownCostCentres(role: string): string[] | undefined {
  return load().costCentres?.[role];
}

export function saveCostCentres(role: string, costCentres: string[]): void {
  const cache = load();
  save({ ...cache, costCentres: { ...cache.costCentres, [role]: costCentres } });
}
