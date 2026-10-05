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
