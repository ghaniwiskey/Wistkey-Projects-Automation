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
/nope shows Next.js "404 This page could not be found." in English; /templates/<bad id>/contacts renders 聯繫人管理 with 全部重置 and 刷新 instead of "模板不存在".

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
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
