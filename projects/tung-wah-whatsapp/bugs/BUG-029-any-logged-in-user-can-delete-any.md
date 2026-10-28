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
Any logged-in editor or viewer can delete another user's Twilio template. The delete endpoint removes the Twilio content before the ownership check fails inside the database transaction. The app returns 500 and retains its record, but the Twilio content is permanently gone, including if it is an approved production template. Sync exposes all template IDs.

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
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
