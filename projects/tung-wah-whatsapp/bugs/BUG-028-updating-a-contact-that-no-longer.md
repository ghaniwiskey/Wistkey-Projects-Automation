---
id: BUG-028
title: "Updating a contact that no longer exists returns 500"
severity: trivial
status: open
env: local
url: "http://localhost:3000/api/contacts/<id>"
updated: 2026-10-28T08:06:33.292Z
found: 2026-10-28T08:06:33.292Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-076]
frequency: always
---
## Summary
PATCH /api/contacts/<deleted id> returns 500 "更新失敗" instead of 404.

## Steps to reproduce
1. Delete a template with contacts
2. PATCH one of its contact IDs

## Expected
404.

## Actual
500 {"error":"更新失敗"}.

## Evidence
- Screenshot: ![35-template-status-sync.png](../explorations/2026-10-28-core-journeys/35-template-status-sync.png)

## Environment
- Base URL: http://localhost:3000/api/contacts/<id>
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
