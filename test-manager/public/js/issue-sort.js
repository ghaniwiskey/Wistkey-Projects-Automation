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
