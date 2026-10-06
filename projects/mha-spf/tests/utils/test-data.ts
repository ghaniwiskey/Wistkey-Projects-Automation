import path from 'node:path';
import { requireEnv } from '@shared/utils/env';

/** Small PNG for photo uploads (New Asset report needs one). */
export const PHOTO = path.join(__dirname, '..', '..', 'data', 'qa-asset.png');

/** Role slugs (project.yaml > auth.accounts[].roles) -> labels in the header Role dropdown. See context.md > Roles. */
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

/** Keep in sync with project.yaml > auth.accounts. Usernames come from .env, never hard-coded. */
export const ACCOUNTS = [
  {
    envUser: 'SPF_AGENCY_ADMIN_USER',
    envPass: undefined as string | undefined, // passwordless
    officer: 'Wong Pui Lai Annie',
    // uro was added to this account in User > Role Listing on 2026-10-06 (approves LOGS1 > LOGS1).
    roles: ['agency-admin', 'falo', 'logs1', 'stocktaker', 'uao', 'uro', 'vet-ic'] as RoleSlug[],
  },
];

/** First account holding the role, with its username (and password, if any) read from .env. */
export function accountFor(role: RoleSlug) {
  const account = ACCOUNTS.find((a) => a.roles.includes(role));
  if (!account) throw new Error(`No test account has the role "${role}" (see project.yaml > auth.accounts).`);
  const env = requireEnv(account.envUser);
  const password = account.envPass ? requireEnv(account.envPass)[account.envPass] : '';
  return { ...account, username: env[account.envUser], password };
}

/**
 * FAVE stocktake data. Tests open the first (newest) FAVE in the list (UAT: FAVE FY26-2007, created
 * 02-Oct-2026).
 */
export const FAVE = {
  /**
   * Cost centres the repeatable FAVE tests (SPF-019..021, 025, 026) may work on, in order of preference.
   * The faveTarget fixture takes the first one that is not APPROVED in the current FAVE (approval is
   * final), brings it back to VET IC and uses its first asset (APD: 111000010977). FY26-2007: 332100 A&F
   * and 332370 CAD are approved, so they are not listed.
   */
  costCentres: ['332600', '332300'],
  /**
   * Cost centres SPF-027 may approve (UAO approval is final: one run per cost centre per FAVE).
   * Never APD (the repeatable FAVE tests need it). FY26-2007: 332370 CAD approved by hand on
   * 2026-10-06; the user allowed two approvals, so only A&F is listed. Add more only with the team's OK.
   */
  approvalCostCentres: ['332100'],
} as const;

/**
 * The test account's officer (from ACCOUNTS), who holds both LOGS1 and FALO. Other officers (another FALO,
 * stocktakers) and all assets are found at runtime, never fixed here.
 */
export const OFFICER = ACCOUNTS[0].officer;

/** Option texts of the Assign step Role dropdown. */
export const ASSIGN_ROLES = {
  logs1: 'Logistics Officer 1 (LOGS1)',
  falo: 'Fixed Asset Liaison Officer (FALO)',
  enduser: 'End User (ENDUSER)',
} as const;

/**
 * UAT location used when registering or reporting assets: the unit's own address (332600 APD, Airport
 * Police Station). Kept fixed on purpose: the location must belong to the account's unit and the postal
 * code search needs a known address; it changes only if the account moves to another unit.
 */
export const LOCATION = {
  group: 'APD',
  costCentre: '332600 - APD',
  postalQuery: '819645',
  postalOption: '819645 - 35 AIRPORT BOULEVARD AIRPORT POLICE STATION SINGAPORE 819645',
} as const;

/** Prefix of every text a write test types, so leftovers are easy to find and clean up. */
export const QA_PREFIX = 'QA auto';

/** Unique, readable value for one run: "QA auto relocate mfx3k2". */
export function unique(what: string): string {
  return `${QA_PREFIX} ${what} ${Date.now().toString(36)}`;
}
