---
id: BUG-021
title: "Missing pages: English 404 and contacts tools for a non-existent template"
severity: trivial
status: open
env: local
url: "http://localhost:3000/templates/doesnotexist123/contacts"
updated: 2026-10-28T07:16:23.673Z
found: 2026-10-28T07:16:23.673Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-063]
frequency: always
---
## Summary
A missing page shows an English Next.js 404. A contacts URL for a nonexistent template instead shows the contacts-management page and its Reset all and Refresh controls, rather than "模板不存在" (Template does not exist).

## UI labels in English
- 模板不存在: Template does not exist

## Steps to reproduce
1. Open /nope
2. Open /templates/doesnotexist123/contacts

## Expected
Traditional Chinese not-found message with a link back.

## Actual
As described.

## Evidence
- Screenshot: ![23-nonexistent-template.png](../explorations/2026-10-28-core-journeys/23-nonexistent-template.png)

## Environment
- Base URL: http://localhost:3000/templates/doesnotexist123/contacts
- Env: local

## History
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
