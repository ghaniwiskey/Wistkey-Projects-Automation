import path from 'node:path';
import type { Download } from '@playwright/test';
import { readXlsxRows } from './xlsx';

/**
 * Save a downloaded .xlsx into `dir` (use `test.info().outputPath()`) and read its first sheet.
 * Returns the suggested file name and the rows as cell text.
 */
export async function readXlsxDownload(download: Download, dir: string): Promise<{ name: string; file: string; rows: string[][] }> {
  const name = download.suggestedFilename();
  const file = path.join(dir, name);
  await download.saveAs(file);
  return { name, file, rows: readXlsxRows(file) };
}
