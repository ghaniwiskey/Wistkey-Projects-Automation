---
id: BUG-028
title: "Updating a contact that no longer exists returns 500"
severity: trivial
status: open
env: local
url: "http://localhost:3000/api/contacts/<id>"
updated: 2026-10-28T09:08:46.326Z
found: 2026-10-28T08:06:33.292Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-076]
frequency: always
---
## Summary
Updating a contact that no longer exists returns a server error (500) instead of "not found" (404).

## Steps to reproduce
1. Upload contacts to a draft template. In the browser console, get a contact id: `(await fetch('/api/templates/<template id>/contacts').then(r => r.json()))[0].id`
2. Delete the template.
3. Send a PATCH to /api/contacts/<contact id> for that id.

## Expected
404 (not found).

## Actual
500 {"error":"更新失敗"} ("Update failed").

## Evidence
- Screenshot: ![35-template-status-sync.png](../explorations/2026-10-28-core-journeys/35-template-status-sync.png)

## Environment
- Base URL: http://localhost:3000/api/contacts/<id>
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
