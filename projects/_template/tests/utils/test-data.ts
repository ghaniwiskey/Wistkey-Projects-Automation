import { requireEnv } from '@shared/utils/env';

// Example: credentials for the "standard" role, read from .env.
export function standardUser() {
  const env = requireEnv('{{prefix}}_STANDARD_USER', '{{prefix}}_STANDARD_PASS');
  return { username: env['{{prefix}}_STANDARD_USER'], password: env['{{prefix}}_STANDARD_PASS'] };
}
