// Shared by the browser lists and store: use recorded dates, never checkout mtimes.
export function latestIssueDate(fm, body = '') {
  const history = (/^##\s+History\s*$([\s\S]*?)(?=^##\s|(?![\s\S]))/m.exec(body) || [])[1] || '';
  const dates = [fm.updated, fm.found, fm.answered, ...Array.from(history.matchAll(/^\s*-\s*(\d{4}-\d{2}-\d{2})(?=[:\s])/gm), (m) => m[1])];
  return dates.filter((d) => d && Number.isFinite(Date.parse(d))).map(String)
    .sort((a, b) => Date.parse(b) - Date.parse(a))[0] || '';
}

export function sortIssues(rows, order = 'recent') {
  if (order === 'default') return [...rows];
  const time = (row) => Date.parse(row.updated || row.found);
  return [...rows].sort((a, b) => {
    const at = time(a), bt = time(b);
    if (!Number.isFinite(at) || !Number.isFinite(bt)) {
      if (Number.isFinite(at)) return -1;
      if (Number.isFinite(bt)) return 1;
    } else if (at !== bt) return order === 'oldest' ? at - bt : bt - at;
    return order === 'oldest' ? a.id.localeCompare(b.id, undefined, { numeric: true }) : b.id.localeCompare(a.id, undefined, { numeric: true });
  });
}

// Browser-local 24-hour display; date-only legacy records have no known time.
export function formatIssueDate(value, timeZone) {
  if (!value) return '-';
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const date = new Date(text);
  if (!Number.isFinite(date.getTime())) return '-';
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date).map(({ type, value }) => [type, value]));
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
}
