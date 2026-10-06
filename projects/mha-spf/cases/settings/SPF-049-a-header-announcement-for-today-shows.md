---
id: SPF-049
title: "A HEADER announcement for today shows on the login page"
feature: settings
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
Agency Admin can broadcast a maintenance notice: an announcement within its date range shows to users on the login page.

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) with Agency Admin active
- At least one HEADER announcement that has ended (reused and restored; announcements cannot be deleted)

## Data
- Content `QA auto announcement <unique>`
- Start and End Date: today

## Steps
1. Settings > Announcement, open the first HEADER announcement whose end date is past
2. Set Content, Start Date and End Date (today), Update
3. In a separate (logged-out) browser session open the login page
4. Cleanup: put back the original content and dates, Update; open the login page again

## Expected
- Step 2 shows "Announcement has been updated." and the list shows the HEADER with today's date
- Step 3 shows the Announcement banner with the QA content
- After step 4 the QA content is gone from the login page

## Notes
The banner is visible to every UAT user for the few seconds the test runs. HEADER announcements show only on the login page (not on the Dashboard).

Automated in tests/e2e/settings/admin-settings.spec.ts.
