---
id: BUG-029
title: "Any logged-in user can delete any template from Twilio (delete runs before the ownership check)"
severity: critical
status: open
env: local
url: "http://localhost:3000/api/templates/<id>"
updated: 2026-10-28T09:08:46.326Z
found: 2026-10-28T08:18:31.424Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-085]
frequency: always
---
## Summary
Any logged-in user, even an editor or viewer, can permanently delete any template from Twilio, including approved production templates. The ownership check runs only after the Twilio delete.

## Steps to reproduce
Note: this permanently deletes the template in Twilio. Use only a throwaway draft.
1. As admin, create a draft template (Meta unticked), e.g. qa_owner_test_<n>. Note its id in the URL: /templates/<template id>.
2. Log in as an editor (or viewer).
3. In the browser console: `await fetch('/api/templates/<template id>', {method: 'DELETE'}).then(async r => [r.status, await r.text()])`
4. Look for the template in Twilio Console > Messaging > Content Template Builder, and in the app as admin.

## Expected
403 (forbidden) or 404 (not found) before anything is deleted; the Twilio template is untouched.

## Actual
- Step 3: 500 {"error":"刪除失敗"} ("Delete failed").
- Step 4: the template is gone from Twilio for good, but still listed in the app.
- Order in the code: it loads the template without checking the owner, deletes the Twilio content, and only then fails the ownership check inside the database transaction.
- Every user can get all template ids through 從 Twilio 同步 (Sync from Twilio).

Our run: Twilio GET Content/HX48dca5307e5691b57e5ddfa581012183 returned 404 (deleted) after an editor's delete.

## Evidence
- Screenshot: ![44-role-findings.png](../explorations/2026-10-28-core-journeys/44-role-findings.png)

## Environment
- Base URL: http://localhost:3000/api/templates/<id>
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
