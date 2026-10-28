---
id: BUG-021
title: "Missing pages: 404 page is in English, and a non-existent template still shows contact tools"
severity: trivial
status: open
env: local
url: "http://localhost:3000/templates/doesnotexist123/contacts"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T07:16:23.673Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-063]
frequency: always
---
## Summary
Two problems with pages that do not exist:
- /nope shows the default Next.js page "404 This page could not be found." in English, while the rest of the app is in Traditional Chinese.
- /templates/<bad id>/contacts shows the 聯繫人管理 (Contact management) page with the 全部重置 (Reset all) and 刷新 (Refresh) buttons, instead of "模板不存在" ("Template does not exist").

## Steps to reproduce
1. Open /nope
2. Open /templates/doesnotexist123/contacts

## Expected
A not-found message in Traditional Chinese with a link back.

## Actual
- /nope: "404 This page could not be found." in English.
- /templates/doesnotexist123/contacts: 聯繫人管理 (Contact management) with 全部重置 (Reset all) and 刷新 (Refresh).

## Evidence
- Screenshot: ![23-nonexistent-template.png](../explorations/2026-10-28-core-journeys/23-nonexistent-template.png)

## Environment
- Base URL: http://localhost:3000/templates/doesnotexist123/contacts
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
