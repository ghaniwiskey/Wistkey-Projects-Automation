import path from 'node:path';
import { requireEnv } from '@shared/utils/env';

/** Small PNG for photo uploads (New Asset report needs one). */
export const PHOTO = path.join(__dirname, '..', '..', 'data', 'qa-asset.png');

/**
 * Role slugs used by the tests (	est.use({ role })) -> labels in the header Role dropdown. See context.md > Roles.
 * HTA has only these six roles (User > Role Listing): no FALO, HQ AO, HQ FALO or End User.
 */
export const ROLES = {
  'agency-admin': 'Agency Admin',
  uao: 'Unit Approving Officer',
  uro: 'Unit Resource Officer',
  logs1: 'Logistics Officer 1',
  'vet-ic': 'Verification Team IC/2IC',
  stocktaker: 'Stocktaker',
} as const;

export type RoleSlug = keyof typeof ROLES;

/** .env variables of the test account (see .env.example > mha-hta). */
export const ACCOUNT_ENV = { user: 'HTA_USER', pass: 'HTA_PASS' } as const;

/**
 * The test account, from .env only: HTA_USER (login ID) and HTA_PASS (leave empty for a passwordless UAT
 * account). Nothing about the account is fixed in the code: its officer name is read from the page header
 * after login (fixture `officer`) and its roles from the header Role dropdown (a test that needs a role the
 * account does not have is skipped), so another account or agency only needs a different .env.
 */
export function testAccount(): { username: string; password: string } {
  const env = requireEnv(ACCOUNT_ENV.user);
  return { username: env[ACCOUNT_ENV.user], password: process.env[ACCOUNT_ENV.pass] ?? '' };
}

/** Option texts of the Assign step Role dropdown (HTA offers only LOGS1: no FALO or End User). */
export const ASSIGN_ROLES = {
  logs1: 'Logistics Officer 1 (LOGS1)',
} as const;

/** Prefix of every text a write test types, so leftovers are easy to find and clean up. */
export const QA_PREFIX = 'QA auto';

/** Name prefix of the users the user admin tests create (User Listing search finds them by it). */
export const QA_USER_NAME = `${QA_PREFIX} user`;

/** A new test user: Web Login ID "QA-AUTO-MFX3K2", name "QA auto user mfx3k2". */
export function newQaUser(): { loginId: string; name: string } {
  const id = Date.now().toString(36);
  return { loginId: `QA-AUTO-${id.toUpperCase()}`, name: `${QA_USER_NAME} ${id}` };
}

/** Unique, readable value for one run: "QA auto relocate mfx3k2". */
export function unique(what: string): string {
  return `${QA_PREFIX} ${what} ${Date.now().toString(36)}`;
}
