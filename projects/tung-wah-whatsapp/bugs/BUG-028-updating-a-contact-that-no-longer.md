---
id: BUG-028
title: "Updating a contact that no longer exists returns 500"
severity: trivial
status: open
env: local
url: "http://localhost:3000/api/contacts/<id>"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T08:06:33.292Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-076]
frequency: always
---
## Summary
Updating a contact that was deleted (PATCH /api/contacts/<deleted id>) returns a server error, 500 "更新失敗" ("Update failed"), instead of 404 (not found).

## Steps to reproduce
1. Delete a template that has contacts.
2. Send PATCH /api/contacts/<id> for one of its contact IDs.

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
