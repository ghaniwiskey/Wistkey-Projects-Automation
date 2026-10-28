---
id: BUG-021
title: "Missing pages: 404 page is in English, and a non-existent template still shows contact tools"
severity: trivial
status: wont-fix
env: local
url: "http://localhost:3000/templates/doesnotexist123/contacts"
updated: 2026-10-28T10:39:30.106Z
found: 2026-10-28T07:16:23.673Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: []
frequency: always
---
## Summary
Pages that do not exist show an English 404, and a non-existent template's contacts page still shows the contact tools.

## Steps to reproduce
1. Open http://localhost:3000/nope
2. Open http://localhost:3000/templates/doesnotexist123/contacts

## Expected
A not-found message in Traditional Chinese with a link back (e.g. "模板不存在", "Template does not exist").

## Actual
- Step 1: the default Next.js page "404 This page could not be found." in English.
- Step 2: the 聯繫人管理 (Contact management) page with the 全部重置 (Reset all) and 刷新 (Refresh) buttons.

## Evidence
- Screenshot: ![23-nonexistent-template.png](../explorations/2026-10-28-core-journeys/23-nonexistent-template.png)

## Environment
- Base URL: http://localhost:3000/templates/doesnotexist123/contacts
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
- 2026-10-28: status open -> wont-fix.
- 2026-10-28: Wont-fix follow-up: TWW-063 now expect the accepted behavior; tests list emptied..
