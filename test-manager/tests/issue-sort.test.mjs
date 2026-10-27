import { test } from 'node:test';
import assert from 'node:assert/strict';
import { latestIssueDate, sortIssues, formatIssueDate } from '../public/js/issue-sort.js';
// Synthetic dates and IDs isolate ordering from mutable project records.
const rows = [{id:'BUG-002',found:'2026-10-01'}, {id:'BUG-010',found:'2026-10-01'}, {id:'BUG-001',found:'2026-09-01',updated:'2026-10-20'}, {id:'BUG-011',found:''}];
test('recent uses updates, numeric ID ties, missing dates last, without mutation', () => {
  assert.deepEqual(sortIssues(rows).map(x=>x.id), ['BUG-001','BUG-010','BUG-002','BUG-011']);
  assert.equal(rows[0].id, 'BUG-002');
});
test('oldest reverses dates and ties, leaving missing dates last', () => {
  assert.deepEqual(sortIssues(rows,'oldest').map(x=>x.id), ['BUG-002','BUG-010','BUG-001','BUG-011']);
});
test('original order and empty lists remain supported', () => {
  assert.deepEqual(sortIssues(rows,'default'), rows);
  assert.notEqual(sortIssues(rows,'default'), rows);
  assert.deepEqual(sortIssues([]), []);
});
test('legacy history and answered dates contribute to latest activity', () => {
  assert.equal(latestIssueDate({found:'2026-10-01',answered:'2026-10-03'}, '## History\n- 2026-10-08: closed.\n- 2026-10-02: asked.\n\n## Other\n- 2027-01-01: irrelevant.'), '2026-10-08');
});
test('exact timestamps win; invalid and absent dates are safe', () => {
  assert.equal(latestIssueDate({updated:'2026-10-08T15:00:00.000Z',found:'2026-10-08'}), '2026-10-08T15:00:00.000Z');
  assert.equal(latestIssueDate({found:'invalid'}), '');
  assert.equal(latestIssueDate({}), '');
});

test('formats timestamps as local date and 24-hour hours/minutes', () => {
  assert.equal(formatIssueDate('2026-10-27T08:05:49.123Z', 'Asia/Jakarta'), '2026-10-27 15:05');
  assert.equal(formatIssueDate('2026-10-27T17:03:00Z', 'Asia/Jakarta'), '2026-10-28 00:03');
});
test('does not fabricate times for legacy dates or missing data', () => {
  assert.equal(formatIssueDate('2026-10-27', 'Asia/Jakarta'), '2026-10-27');
  assert.equal(formatIssueDate(''), '-');
  assert.equal(formatIssueDate(undefined), '-');
  assert.equal(formatIssueDate('invalid'), '-');
});
