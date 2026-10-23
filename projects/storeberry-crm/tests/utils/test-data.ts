import { requireEnv } from '@shared/utils/env';

// Example: credentials for the "standard" role, read from .env.
export function standardUser() {
  const env = requireEnv('SCRM_STANDARD_USER', 'SCRM_STANDARD_PASS');
  return { username: env['SCRM_STANDARD_USER'], password: env['SCRM_STANDARD_PASS'] };
}
