---
id: BUG-029
title: "Any logged-in user can delete any template from Twilio (delete runs before the ownership check)"
severity: critical
status: open
env: local
url: "http://localhost:3000/api/templates/<id>"
updated: 2026-10-28T08:18:31.424Z
found: 2026-10-28T08:18:31.424Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-085]
frequency: always
---
## Summary
DELETE /api/templates/<id> loads the template without checking the owner, deletes its Twilio content, and only then fails the ownership check inside the database transaction (500 "刪除失敗"). The Twilio template is gone for good, including approved production templates, and every user gets all template IDs from 從 Twilio 同步. Works for editors and viewers.

## Steps to reproduce
1. As QA admin create a disposable draft (qa_owner_test_<n>)
2. Log in as a QA editor
3. DELETE /api/templates/<draft id>
4. Fetch the content from Twilio

## Expected
403/404 before anything is deleted; Twilio content untouched.

## Actual
500 {"error":"刪除失敗"}; Twilio GET Content/HX48dca5307e5691b57e5ddfa581012183 -> 404 (deleted); app record still listed.

## Evidence
- Screenshot: ![44-role-findings.png](../explorations/2026-10-28-core-journeys/44-role-findings.png)

## Environment
- Base URL: http://localhost:3000/api/templates/<id>
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
