---
id: BUG-033
title: "Ownership failures return 500 and leak internal Prisma errors"
severity: minor
status: wont-fix
env: local
url: "http://localhost:3000/api/templates/<id>"
updated: 2026-10-28T09:24:31.282Z
found: 2026-10-28T08:18:32.071Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: []
frequency: always
---
## Summary
Editing or deleting another user's template returns a server error (500) instead of 403/404, and the edit error exposes internal database details.

## Steps to reproduce
1. As admin, open a template and note its id in the URL: /templates/<template id>.
2. Log in as an editor. In the browser console: `await fetch('/api/templates/<template id>', {method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({questionTitle: 'x'})}).then(r => r.text())`

## Expected
403 (forbidden) or 404 (not found) with a short message.

## Actual
500 {"error":"更新失敗","detail":"PrismaClientKnownRequestError: ... __TURBOPACK__imported__module__ ..."} (更新失敗 = "Update failed"). The detail shows the internal database error and module paths. Deleting another user's template also returns 500 (see BUG-029).

## Evidence
- Screenshot: ![44-role-findings.png](../explorations/2026-10-28-core-journeys/44-role-findings.png)

## Environment
- Base URL: http://localhost:3000/api/templates/<id>
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
- 2026-10-28: status open -> wont-fix.
- 2026-10-28: wont-fix applied: TWW-086 now expects the accepted behavior (notes updated), context.md updated, tests list emptied.
