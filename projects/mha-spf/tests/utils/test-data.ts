import path from 'node:path';
import { requireEnv } from '@shared/utils/env';

/** Small PNG for photo uploads (New Asset report needs one). */
export const PHOTO = path.join(__dirname, '..', '..', 'data', 'qa-asset.png');

/** Role slugs used by the tests (`test.use({ role })`) -> labels in the header Role dropdown. See context.md > Roles. */
export const ROLES = {
  'agency-admin': 'Agency Admin',
  'hq-ao': 'HQ Approving Officer',
  'hq-falo': 'HQ Fixed Asset Liaison Officer',
  uao: 'Unit Approving Officer',
  uro: 'Unit Resource Officer',
  logs1: 'Logistics Officer 1',
  falo: 'Fixed Asset Liaison Officer',
  'vet-ic': 'Verification Team IC/2IC',
  stocktaker: 'Stocktaker',
  enduser: 'End User',
} as const;

export type RoleSlug = keyof typeof ROLES;

/** .env variables of the test account (see .env.example > mha-spf). */
export const ACCOUNT_ENV = { user: 'SPF_USER', pass: 'SPF_PASS' } as const;

/**
 * The test account, from .env only: SPF_USER (login ID) and SPF_PASS (leave empty for a passwordless UAT
 * account). Nothing about the account is fixed in the code: its officer name is read from the page header
 * after login (fixture `officer`) and its roles from the header Role dropdown (a test that needs a role the
 * account does not have is skipped), so another account or agency only needs a different .env.
 */
export function testAccount(): { username: string; password: string } {
  const env = requireEnv(ACCOUNT_ENV.user);
  return { username: env[ACCOUNT_ENV.user], password: process.env[ACCOUNT_ENV.pass] ?? '' };
}

/**
 * FAVE. Tests open the first (newest) FAVE in the list and read its cost centres from the page: the
 * repeatable tests (faveTarget) take the first cost centre that is not APPROVED, the read-only SPF-019 the
 * first one listed. Nothing here is test data.
 */
export const FAVE = {
  /**
   * Permission list, not test data: cost centres SPF-027 is ALLOWED to approve. UAO approval is final
   * (one approval per cost centre per FAVE), so every entry needs the team's OK; the repeatable FAVE tests
   * never use these. Leave it empty for another agency (e.g. HTA) until approvals are agreed; SPF-027 then
   * skips. SPF UAT FY26-2007: 332370 CAD approved by hand and 332100 A&F by SPF-027 on 2026-10-06.
   */
  approvalCostCentres: ['332100'] as readonly string[],
} as const;

/** Option texts of the Assign step Role dropdown. */
export const ASSIGN_ROLES = {
  logs1: 'Logistics Officer 1 (LOGS1)',
  falo: 'Fixed Asset Liaison Officer (FALO)',
  enduser: 'End User (ENDUSER)',
} as const;

/** Prefix of every text a write test types, so leftovers are easy to find and clean up. */
export const QA_PREFIX = 'QA auto';

/** Unique, readable value for one run: "QA auto relocate mfx3k2". */
export function unique(what: string): string {
  return `${QA_PREFIX} ${what} ${Date.now().toString(36)}`;
}
