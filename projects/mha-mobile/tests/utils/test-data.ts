import { requireEnv } from '@shared/utils/env';

// The MHA Mobile account, read from .env. The mobile login is the account's full NRIC; the UAT account is
// passwordless, so MHM_PASS may be empty.
export function mhmAccount() {
  const env = requireEnv('MHM_USER');
  return { username: env['MHM_USER'], password: process.env['MHM_PASS'] ?? '' };
}
