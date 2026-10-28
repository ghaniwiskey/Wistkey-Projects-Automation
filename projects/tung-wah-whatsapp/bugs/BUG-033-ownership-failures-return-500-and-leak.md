---
id: BUG-033
title: "Ownership failures return 500 and leak internal Prisma errors"
severity: minor
status: open
env: local
url: "http://localhost:3000/api/templates/<id>"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T08:18:32.071Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-086]
frequency: always
---
## Summary
When a user edits or deletes another user's template, the server returns 500 (server error) instead of 403 (forbidden) or 404 (not found). For edits (PATCH), the response also includes a "detail" field with the internal database error (PrismaClientKnownRequestError) and internal module paths.

## Steps to reproduce
1. As a QA editor, send PATCH /api/templates/<admin template id> with {"questionTitle":"x"}.

## Expected
403 or 404 with a short message.

## Actual
500 {"error":"更新失敗","detail":"PrismaClientKnownRequestError: ... __TURBOPACK__imported__module__ ..."} (更新失敗 = "Update failed").

## Evidence
- Screenshot: ![44-role-findings.png](../explorations/2026-10-28-core-journeys/44-role-findings.png)

## Environment
- Base URL: http://localhost:3000/api/templates/<id>
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
