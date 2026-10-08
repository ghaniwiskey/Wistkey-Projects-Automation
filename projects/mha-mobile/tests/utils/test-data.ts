import { requireEnv } from '@shared/utils/env';

// Example: credentials for the "standard" role, read from .env.
export function standardUser() {
  const env = requireEnv('MHM_STANDARD_USER', 'MHM_STANDARD_PASS');
  return { username: env['MHM_STANDARD_USER'], password: env['MHM_STANDARD_PASS'] };
}
