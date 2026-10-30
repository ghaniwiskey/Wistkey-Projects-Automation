import { requireEnv } from '@shared/utils/env';

// Admin account (Internal accounts / SYSTEM domain), read from .env.
export function adminUser() {
  const env = requireEnv('VZ_ADMIN_USER', 'VZ_ADMIN_PASS');
  return { username: env['VZ_ADMIN_USER'], password: env['VZ_ADMIN_PASS'] };
}
