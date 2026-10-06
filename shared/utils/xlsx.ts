import fs from 'node:fs';
import zlib from 'node:zlib';

/**
 * Minimal .xlsx reader for checking exported reports in tests, without extra dependencies.
 * Reads the first worksheet (or `sheet`) into rows of cell text: shared strings, inline strings and
 * plain values. Formulas, dates and styles are returned as the raw stored value.
 */
export function readXlsxRows(file: string | Buffer, sheet = 'xl/worksheets/sheet1.xml'): string[][] {
  const zip = unzip(typeof file === 'string' ? fs.readFileSync(file) : file);
  const sheetXml = zip.get(sheet);
  if (!sheetXml) throw new Error(`No ${sheet} in the workbook (entries: ${[...zip.keys()].join(', ')})`);
  const shared = [...(zip.get('xl/sharedStrings.xml') ?? '').matchAll(/<(?:\w+:)?si>([\s\S]*?)<\/(?:\w+:)?si>/g)].map((m) => texts(m[1]));

  const rows: string[][] = [];
  for (const r of sheetXml.matchAll(/<(?:\w+:)?row\b[^>]*>([\s\S]*?)<\/(?:\w+:)?row>/g)) {
    const row: string[] = [];
    for (const c of r[1].matchAll(/<(?:\w+:)?c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/(?:\w+:)?c>)/g)) {
      const attrs = c[1];
      const body = c[2] ?? '';
      const col = columnIndex(attrs.match(/\br="([A-Z]+)\d+"/)?.[1]);
      const type = attrs.match(/\bt="(\w+)"/)?.[1];
      const value = body.match(/<(?:\w+:)?v>([\s\S]*?)<\/(?:\w+:)?v>/)?.[1] ?? '';
      const text = type === 's' ? shared[Number(value)] ?? '' : type === 'inlineStr' ? texts(body) : decode(value);
      row[col ?? row.length] = text;
    }
    rows.push(Array.from(row, (v) => v ?? ''));
  }
  return rows;
}

/** Text of all <t> runs inside an XML fragment. */
function texts(xml: string): string {
  return [...xml.matchAll(/<(?:\w+:)?t\b[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/g)].map((m) => decode(m[1])).join('');
}

function decode(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, '&');
}

/** "A" -> 0, "AA" -> 26. */
function columnIndex(letters?: string): number | undefined {
  if (!letters) return undefined;
  return [...letters].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;
}

/** Text entries of a zip file, read through its central directory (stored or deflated). */
function unzip(buf: Buffer): Map<string, string> {
  const files = new Map<string, string>();
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error('Not a zip/xlsx file (no end of central directory).');
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  for (let i = 0; i < count; i++) {
    const method = buf.readUInt16LE(p + 10);
    const size = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const raw = buf.subarray(start, start + size);
    if (!name.endsWith('/')) files.set(name, (method === 8 ? zlib.inflateRawSync(raw) : raw).toString('utf8'));
    p += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}
