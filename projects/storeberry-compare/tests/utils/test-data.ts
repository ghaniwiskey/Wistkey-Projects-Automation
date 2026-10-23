import { requireEnv } from '@shared/utils/env';

// Example: credentials for the "standard" role, read from .env.
export function standardUser() {
  const env = requireEnv('SBF_STANDARD_USER', 'SBF_STANDARD_PASS');
  return { username: env['SBF_STANDARD_USER'], password: env['SBF_STANDARD_PASS'] };
}
