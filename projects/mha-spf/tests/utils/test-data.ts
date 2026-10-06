import { requireEnv } from '@shared/utils/env';

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
} as const;
