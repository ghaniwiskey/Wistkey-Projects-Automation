import { requireEnv } from '@shared/utils/env';

export const PRODUCT = {
  name: 'RA-TECH WE M14 CNC steel Gas Cylinder Plug | NO.72',
  sku: 'RAG-WE-M14-010',
};

export function credentials() {
  const env = requireEnv('SCG_EMAIL', 'SCG_PASSWORD');
  return { email: env.SCG_EMAIL, password: env.SCG_PASSWORD };
}
