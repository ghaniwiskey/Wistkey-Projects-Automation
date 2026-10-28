---
id: BUG-029
title: "Any logged-in user can delete any template from Twilio (delete runs before the ownership check)"
severity: critical
status: open
env: local
url: "http://localhost:3000/api/templates/<id>"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T08:18:31.424Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-085]
frequency: always
---
## Summary
When a template is deleted (DELETE /api/templates/<id>), the server does things in the wrong order:
1. It loads the template without checking who owns it.
2. It deletes the template's content in Twilio.
3. Only then does the ownership check fail, inside the database transaction (500 "刪除失敗", "Delete failed").

The Twilio template is gone for good, including approved production templates. Every user can get all template IDs from 從 Twilio 同步 (Sync from Twilio). Editors and viewers can both do this.

## Steps to reproduce
1. As QA admin, create a disposable draft (qa_owner_test_<n>).
2. Log in as a QA editor.
3. Send DELETE /api/templates/<draft id>.
4. Fetch the content from Twilio.

## Expected
403 (forbidden) or 404 (not found) before anything is deleted; the Twilio content is not touched.

## Actual
500 {"error":"刪除失敗"} ("Delete failed"). Twilio GET Content/HX48dca5307e5691b57e5ddfa581012183 returns 404 (deleted). The template is still listed in the app.

## Evidence
- Screenshot: ![44-role-findings.png](../explorations/2026-10-28-core-journeys/44-role-findings.png)

## Environment
- Base URL: http://localhost:3000/api/templates/<id>
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
