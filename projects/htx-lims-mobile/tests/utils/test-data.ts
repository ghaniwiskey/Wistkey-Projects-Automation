import { requireEnv } from '@shared/utils/env';

// The app account, read from .env: <prefix>_USER / <prefix>_PASS with the env's mobileAccount prefix
// (project.yaml; the app takes the HTX LIMS web accounts, default HLW_ADMIN). Never print it: the login screen
// object types it without logging the value.
export function appAccount() {
  const prefix = process.env['HLM_MOBILE_ACCOUNT'] || 'HLW_ADMIN';
  const env = requireEnv(`${prefix}_USER`, `${prefix}_PASS`);
  return { username: env[`${prefix}_USER`], password: env[`${prefix}_PASS`] };
}

/** Dashboard tiles (title -> subtitle) as of app 0.1.0 (2026-11-18). */
export const DASHBOARD_TILES: Record<string, string> = {
  'Pre Check-in': 'Store · tag new items',
  'Check-in': 'Lab · scan items in',
  'Check-out': 'Scan items leaving',
  'All Assets': 'Search assets & locations',
  Stocktake: 'Scan & reconcile assets',
  Settings: 'RFID reader & device',
  'Upload queue': 'Upload saved records',
};
