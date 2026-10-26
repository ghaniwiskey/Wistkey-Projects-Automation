import { requireEnv } from '@shared/utils/env';

export type StoreberryAdmin = {
  company: string;
  username: string;
  password: string;
};

export function storeberryAdmin(): StoreberryAdmin {
  const env = requireEnv('SCRM_COMPANY', 'SCRM_USERNAME', 'SCRM_PASSWORD');
  return {
    company: env.SCRM_COMPANY,
    username: env.SCRM_USERNAME,
    password: env.SCRM_PASSWORD,
  };
}

export function uniqueProductName(): string {
  return `ASIDE-QA-${Date.now().toString(36).toUpperCase()}`;
}

export function uniqueNoMatchQuery(): string {
  return `QA-NOMATCH-${Date.now().toString(36)}`;
}
