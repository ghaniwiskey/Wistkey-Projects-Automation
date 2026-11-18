import { requireEnv } from '@shared/utils/env';

// Example: credentials for the "standard" role, read from .env.
export function standardUser() {
  const env = requireEnv('HLW_STANDARD_USER', 'HLW_STANDARD_PASS');
  return { username: env['HLW_STANDARD_USER'], password: env['HLW_STANDARD_PASS'] };
}
