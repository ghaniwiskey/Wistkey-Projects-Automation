import path from 'node:path';
import { requireEnv } from '@shared/utils/env';

// The MHA Mobile account, read from .env. The mobile login is the account's full NRIC; the UAT account is
// passwordless, so MHM_PASS may be empty. Never print it: the login screen object types it privately.
export function mhmAccount() {
  const env = requireEnv('MHM_USER');
  return { username: env['MHM_USER'], password: process.env['MHM_PASS'] ?? '' };
}

// The MHA web account for the cross-checks (setup and verification on the web): MHM_WEB_USER / MHM_WEB_PASS,
// or the mha-spf account (SPF_USER / SPF_PASS) when MHM_WEB_USER is not set. It needs VET IC (MHM-005) and
// LOGS1 (MHM-006) on a unit whose FAVE the mobile officer can be a stocktaker of; roles come from the app.
export function webAccount() {
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

/** Home tiles per mobile role (seen on UAT 2026-10-16; FALO = LOGS1, Stocktaker = VET IC). */
export const ROLE_TILES: Record<string, string[]> = {
  'Logistics Officer 1': ['Asset Registration', 'Assign', 'Search Asset', 'Stocktake', 'New Asset', 'Settings'],
  'Unit Resource Officer': ['Assign', 'Search Asset', 'Stocktake', 'New Asset', 'Settings'],
  'Verification Team IC/2IC': ['Search Asset', 'Stocktake', 'New Asset', 'Settings'],
  Stocktaker: ['Search Asset', 'Stocktake', 'New Asset', 'Settings'],
};

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

/** Amount of a money text: "$26145.0" (phone) and "$26,145.00" (web) both give 26145. */
export function amount(text: string): number {
  return Number(text.replace(/[^\d.-]/g, ''));
}
