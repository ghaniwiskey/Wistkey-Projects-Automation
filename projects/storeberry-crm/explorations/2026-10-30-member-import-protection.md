---
project: storeberry-crm
env: staging
charter: "Verify SCRM-165 existing-member protection with one approved customer CSV import"
date: 2026-10-30
timebox: 30m
status: done
---

## Scope
- Only SCRM-165, QA-owned members, staging. One approved import; no retry.
- No production changes, cleanup, marketing-audience checks or other test execution.

## Coverage notes
- Compared QA member MEMy001164525 before and after the single two-row import. CSV attempted Level 5, points 1234 and Initial Spending 8000 with a changed name.
- Existing row refused: "The mobile is already registered." Baseline and post-import match: 738 points, Level 2, Level spending $368.00, Opt-in No, original name/email/mobile.
- Import reported one successful customer. New MEMy001164528: Level 1, 542 points (42 base points + 500 Register Reward), Level spending $0.00, Opt-in Yes, Email Verify No.
- Current template has no opt-in field; conflicting-consent input was not possible. Existing opt-out was checked, not an explicit consent overwrite attempt.
- Registration email was unchecked. Result text nevertheless claimed emails were sent to customers with email addresses. No delivery claim is made.
- An Edit Shopping Cart link was opened accidentally during final readback; the empty cart was left without save or checkout.

## Findings
- Q-020: clarify consent default; existing coverage SCRM-166, not run.
- Q-021: clarify Initial Spending versus Level spending; existing coverage SCRM-154, not run.
- Q-022: clarify registration-email result message versus actual queueing; SCRM-181 added, not run.
- No confirmed bug filed: no repeat import approved, and intended behavior/delivery is unknown.

## Test cases written
- SCRM-181 (P1, regression/writes/final): disabling registration email during import sends none and shows accurate result text. Not executed.
- SCRM-165 aligned to the live upload path and missing consent column; retention exception documented.

## Knowledge and data
- Import workflow and point-history behavior merged into context.md.
- Retained at the user's explicit request: empty list "Member protection 165-mvunl6n9" (ID 22), new member MEMy001164528, and existing QA member MEMy001164525. No cleanup or deletion performed.
- CSV: 2026-10-30-member-import-protection/SCRM-165-members.csv.
- Evidence: 01-existing-before.png, 02-import-result.png, 03-new-member.png, 04-new-point-history.png, 05-existing-after.png, 06-existing-point-history.png in the matching folder.
- Business result: PASS with documented limits; cleanup waived by the user. No other case executed in this run.
