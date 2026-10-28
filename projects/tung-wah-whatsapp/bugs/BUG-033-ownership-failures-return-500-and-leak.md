---
id: BUG-033
title: "Ownership failures return 500 and leak internal Prisma errors"
severity: minor
status: open
env: local
url: "http://localhost:3000/api/templates/<id>"
updated: 2026-10-28T08:18:32.071Z
found: 2026-10-28T08:18:32.071Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-086]
frequency: always
---
## Summary
Editing or deleting another user's template returns HTTP 500 rather than 403 or 404. The PATCH response also exposes internal Prisma error details and module paths.

## UI labels in English
- 更新失敗: Update failed

## Steps to reproduce
1. As a QA editor PATCH /api/templates/<admin template id> {"questionTitle":"x"}

## Expected
403/404 with a short message.

## Actual
500 {"error":"更新失敗","detail":"PrismaClientKnownRequestError: ... __TURBOPACK__imported__module__ ..."}

## Evidence
- Screenshot: ![44-role-findings.png](../explorations/2026-10-28-core-journeys/44-role-findings.png)

## Environment
- Base URL: http://localhost:3000/api/templates/<id>
- Env: local

## History
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
