import path from 'node:path';
import { requireEnv } from '@shared/utils/env';

/** The app's login agency of this env (project.yaml envs.<env>.agency): SPF or HTA. */
export function agency(): string {
  return process.env['MHM_AGENCY'] || 'SPF';
}

// The MHA Mobile account, read from .env: <prefix>_USER / <prefix>_PASS with the env's mobileAccount prefix
// (MHM on SPF, MHM_HTA on HTA). The mobile login is the user's Mobile Login ID (an NRIC); the UAT accounts are
// passwordless, so the password may be empty. Never print it: the login screen object types it privately.
export function mhmAccount() {
  const prefix = process.env['MHM_MOBILE_ACCOUNT'] || 'MHM';
  const env = requireEnv(`${prefix}_USER`);
  return { username: env[`${prefix}_USER`], password: process.env[`${prefix}_PASS`] ?? '' };
}

// The MHA web account for the cross-checks (setup and verification on the web): MHM_WEB_USER / MHM_WEB_PASS,
// or the mha-spf account (SPF_USER / SPF_PASS) when MHM_WEB_USER is not set. It needs VET IC (MHM-005) and
// LOGS1 (MHM-006) on a unit whose FAVE the mobile officer can be a stocktaker of; roles come from the app.
export function webAccount() {
  // An env with its own web account (HTA: HTA_USER / HTA_PASS, the mha-hta account).
  const prefix = process.env['MHM_WEB_ACCOUNT'];
  if (prefix) {
    const env = requireEnv(`${prefix}_USER`);
    return { username: env[`${prefix}_USER`], password: process.env[`${prefix}_PASS`] ?? '' };
  }
  const own = process.env['MHM_WEB_USER'];
  const username = own || process.env['SPF_USER'];
  if (!username) throw new Error('Set MHM_WEB_USER (or SPF_USER) in .env for the MHA web checks (see .env.example).');
  const password = (own ? process.env['MHM_WEB_PASS'] : process.env['SPF_PASS']) ?? '';
  return { username, password };
}

/** MHA web role slugs -> header Role dropdown labels. */
export const WEB_ROLES = {
  'vet-ic': 'Verification Team IC/2IC',
  logs1: 'Logistics Officer 1',
  uro: 'Unit Resource Officer',
  'agency-admin': 'Agency Admin',
} as const;
export type WebRole = keyof typeof WEB_ROLES;

/** Mobile Switch Role labels. */
export const MOBILE_ROLES = {
  stocktaker: 'Stocktaker',
  logs1: 'Logistics Officer 1',
  falo: 'Fixed Asset Liaison Officer',
  uro: 'Unit Resource Officer',
  vetIc: 'Verification Team IC/2IC',
} as const;

/**
 * Home tiles per mobile role and agency (each role's MOBILE functions in MHA web > User > Role Listing).
 * SPF seen on UAT 2026-10-16 (FALO = LOGS1); its Stocktaker has Stocktake (Ad Hoc) since 2026-10-19 (BUG-003,
 * configuration). HTA seen on UAT 2026-10-20: Agency Admin has every tile, UAO = VET IC (4 tiles); its Stocktaker
 * got Stocktake (Ad Hoc) the same day (the user ticked the role's MOBILE function, off until then like on SPF).
 */
const TILES_BY_AGENCY: Record<string, Record<string, string[]>> = {
  SPF: {
    'Agency Admin': [],
    'Logistics Officer 1': ['Asset Registration', 'Assign', 'Search Asset', 'Stocktake', 'New Asset', 'Settings'],
    'Unit Resource Officer': ['Assign', 'Search Asset', 'Stocktake', 'New Asset', 'Settings'],
    'Verification Team IC/2IC': ['Search Asset', 'Stocktake', 'New Asset', 'Settings'],
    Stocktaker: ['Search Asset', 'Stocktake', 'New Asset', 'Settings', 'Stocktake (Ad Hoc)'],
  },
  HTA: {
    'Agency Admin': ['Asset Registration', 'Assign', 'Search Asset', 'Stocktake', 'New Asset', 'Settings', 'Stocktake (Ad Hoc)'],
    'Logistics Officer 1': ['Asset Registration', 'Assign', 'Search Asset', 'Stocktake', 'New Asset', 'Settings'],
    'Unit Resource Officer': ['Assign', 'Search Asset', 'Stocktake', 'New Asset', 'Settings'],
    'Verification Team IC/2IC': ['Search Asset', 'Stocktake', 'New Asset', 'Settings'],
    Stocktaker: ['Search Asset', 'Stocktake', 'New Asset', 'Settings', 'Stocktake (Ad Hoc)'],
  },
};

/**
 * Agency code inside FAVE numbers: "FAVE FY26-2006" = FY 26, agency 20, running number 06. SPF = 20 (CR12 user
 * manual); HTA = 90 (seen on UAT 2026-10-20: FAVE FY26-9001).
 */
export const FAVE_AGENCY_CODE: Record<string, string> = { SPF: '20', HTA: '90' };

/** Home tiles per mobile role for this env's agency. */
export const ROLE_TILES: Record<string, string[]> = TILES_BY_AGENCY[agency()] ?? TILES_BY_AGENCY.SPF;

/** Photo for New Asset reports (a 70 KB screenshot of the app, no personal data). */
export const QA_PHOTO = path.join(__dirname, '..', '..', 'data', 'qa-photo.png');

/** MHA web shows an empty field as "-"; the phone shows the field's hint ("Block", "Level", "Room"). */
export function blankable(value: string, hint = ''): string {
  const v = value.trim();
  return v === '-' || (hint && v === hint) ? '' : v;
}

/** Prefix of everything the tests type into the app (find and clean up by it). */
export const QA_PREFIX = 'QA auto mobile';

/** Short unique suffix for values the server stores. */
export function unique(): string {
  return Date.now().toString(36);
}

/** Names compare case-insensitively: the phone shows "TAN JUN YONG SHAWN", MHA web "Tan Jun Yong Shawn". */
export function sameName(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/**
 * Amount of a money text: "$26145.0" (phone) and "$26,145.00" (web) both give 26145; the phone's scientific
 * notation for amounts of 10 million and more (BUG-006) is read too: "$1.36449E8" gives 136449000.
 */
export function amount(text: string): number {
  return Number(text.replace(/[^\d.eE+-]/g, ''));
}
