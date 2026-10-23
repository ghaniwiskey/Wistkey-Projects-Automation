import { requireEnv } from '@shared/utils/env';

// Example: credentials for the "standard" role, read from .env.
export function standardUser() {
  const env = requireEnv('TWW_STANDARD_USER', 'TWW_STANDARD_PASS');
  return { username: env['TWW_STANDARD_USER'], password: env['TWW_STANDARD_PASS'] };
}
