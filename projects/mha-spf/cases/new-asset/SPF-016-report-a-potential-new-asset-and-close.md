---
id: SPF-016
title: "Report a potential new asset and close it as LOGS1"
feature: new-asset
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
Any user can report a potential asset (photo mandatory); LOGS1 can close it with a reason.

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) with Logistics Officer 1 active

## Data
- Cost Centre: the first one offered (the account's units); Description `QA auto new asset <unique>`; Remarks `QA test, please ignore`
- Address: the unit's postal code `<postal>` (Postal Code on the Location tab of the first AVAILABLE asset, found when the test runs) and the first address the search returns; location Remarks `QA location`
- Photo: projects/mha-spf/data/qa-asset.png
- Close reason: Not an Asset

## Steps
1. Open **Asset > New Asset**, click **Create**, keep **Report New Asset**, **Next**.
2. Pick Cost Centre, type Description and Remarks, **Next**.
3. Pick the Postal Code, type location Remarks, **Next**.
4. Upload the photo and **Submit**.
5. Search the request number in **Asset > New Asset** and open it.
6. Click **Close Item**, pick **Not an Asset**, **Submit**.

## Expected
- After step 4 the End step shows "New Asset #RNA<number> has been created."
- The list shows the request with the description and status OPEN; the details page shows **Cancel Item** and **Close Item** and the entered description.
- After step 6 the message "The reported new asset has been closed." is shown and the list shows status CLOSED.

## Notes
Emails all LOGS1 and VET IC (manual). Cleanup cancels any OPEN request whose description starts with "QA auto".

Automated in tests/e2e/new-asset/new-asset.spec.ts (page objects in tests/pages, cleanup fixtures in tests/fixtures/pages.fixture.ts).
