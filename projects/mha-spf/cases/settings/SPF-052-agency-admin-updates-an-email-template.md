---
id: SPF-052
title: "Agency Admin updates an email template and Subject is required"
feature: settings
priority: P2
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
Settings > Email Template saves template changes and checks mandatory fields.

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) with Agency Admin active

## Data
- The first template in the list
- Remarks `QA auto remark <unique>` (internal, not sent in emails)

## Steps
1. Settings > Email Template, pencil of the first template
2. Clear Email Subject, Update
3. Reload; set Remarks, Update
4. Reload the form
5. Cleanup: put the original Remarks back, Update

## Expected
- Step 2 shows "Subject is required" and nothing is saved
- Step 3 shows "Email template has been saved."
- Step 4 shows the new Remarks, Subject unchanged
- Step 5 restores the original Remarks

## Notes
Only Remarks is changed so no real email content changes. BUG-014: the Remarks counter says / 250 (not asserted).

Automated in tests/e2e/settings/admin-settings.spec.ts.
