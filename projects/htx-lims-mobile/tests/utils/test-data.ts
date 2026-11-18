import { requireEnv } from '@shared/utils/env';

// Example: credentials for the "standard" role, read from .env.
export function standardUser() {
  const env = requireEnv('HLM_STANDARD_USER', 'HLM_STANDARD_PASS');
  return { username: env['HLM_STANDARD_USER'], password: env['HLM_STANDARD_PASS'] };
}
