import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Emulator housekeeping that mobilewright has no API for, through adb: switching the network (offline
 * stocktake) and putting a photo into the gallery (New Asset needs one). None of these use Android's UI
 * automation, so they do not clash with mobilecli. adb comes from ANDROID_HOME / ANDROID_SDK_ROOT, or the
 * default SDK folder; set ANDROID_SERIAL when more than one device is attached.
 */
function adbPath(): string {
  const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || path.join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk');
  const exe = path.join(sdk, 'platform-tools', process.platform === 'win32' ? 'adb.exe' : 'adb');
  return fs.existsSync(exe) ? exe : 'adb';
}

export function adb(...args: string[]): string {
  // stderr is captured: adb prints transfer progress there.
  return execFileSync(adbPath(), args, { encoding: 'utf8', timeout: 60_000, stdio: ['ignore', 'pipe', 'pipe'] });
}

/** Turn Wi-Fi and mobile data on or off. */
export function setNetwork(on: boolean): void {
  const state = on ? 'enable' : 'disable';
  adb('shell', 'svc', 'wifi', state);
  adb('shell', 'svc', 'data', state);
}

/**
 * Copy a photo into the gallery (Pictures/) as the newest image, so the photo picker lists it first.
 * Returns its file name on the device.
 */
export function pushGalleryPhoto(localFile: string): string {
  const name = `qa-mobile-${Date.now().toString(36)}${path.extname(localFile)}`;
  const remote = `/sdcard/Pictures/${name}`;
  adb('push', localFile, remote);
  adb('shell', 'touch', remote); // adb push keeps the local file's date; the picker sorts by it
  adb('shell', 'am', 'broadcast', '-a', 'android.intent.action.MEDIA_SCANNER_SCAN_FILE', '-d', `file://${remote}`);
  return name;
}

/** Remove a photo pushed by pushGalleryPhoto (the gallery index forgets it at the next scan). */
export function removeGalleryPhoto(name: string): void {
  const remote = `/sdcard/Pictures/${name}`;
  adb('shell', 'rm', '-f', remote);
  adb('shell', 'am', 'broadcast', '-a', 'android.intent.action.MEDIA_SCANNER_SCAN_FILE', '-d', `file://${remote}`);
}
