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
    roles: ['agency-admin', 'falo', 'logs1', 'stocktaker', 'uao', 'vet-ic'] as RoleSlug[],
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
 * Known UAT assets (iLMS data, not created by tests). Visible to SPF-A2216GA as LOGS1.
 * If one changes status, unit or location, pick another and update context.md > Test data.
 */
export const ASSETS = {
  /** AVAILABLE, not owned by a LOGS1/FALO, not in an ongoing transaction (checked 2026-10-06). */
  available: {
    id: '111000010978',
    description: 'VARIABLE REFRIGERANT VOLUME AIR CON(VRV)',
    status: 'AVAILABLE',
    category: '1KZ0 / Mechanical & Electrical System of Building',
    costCentre: '332600',
    costCentreLabel: '332600 / APD',
    acquisitionValue: '$26,145.00',
    group: 'APD',
    groupLong: 'Airport Police Division (APD)',
    postalCode: '819645',
  },
  /**
   * Write-test asset for assignment flows (relocate, assign, return, approve, reject, cancel).
   * Same unit and location as `available`, never used by the read-only tests.
   */
  writable: {
    id: '111000010979',
    status: 'AVAILABLE',
    group: 'APD',
    postalCode: '819645',
  },
} as const;

/** The test account's officer, who holds both LOGS1 and FALO (assign to yourself in another role). */
export const OFFICER = 'Wong Pui Lai Annie';

/** Option texts of the Assign step Role dropdown. */
export const ASSIGN_ROLES = {
  logs1: 'Logistics Officer 1 (LOGS1)',
  falo: 'Fixed Asset Liaison Officer (FALO)',
  enduser: 'End User (ENDUSER)',
} as const;

/** UAT location used when registering or reporting assets (unit 332600 APD). */
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
