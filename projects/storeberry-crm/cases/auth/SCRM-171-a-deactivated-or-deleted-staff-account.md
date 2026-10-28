---
id: SCRM-171
title: "A deactivated or deleted staff account loses CRM and POS access at once, including open sessions"
feature: auth
priority: P0
tags: [regression, security, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Former staff cannot keep using the CRM or the till.

## Preconditions
- A second QA staff account. Ask the user first: creating/deactivating staff needs approval; never touch other people's accounts

## Steps
1. Log in as the QA staff account in the CRM and Web POS
2. As ghani, deactivate (or delete) the QA staff account
3. In the QA staff tabs, open another page and try a POS sale
4. Try to log in again

## Expected
- Step 3: the open sessions are ended (redirect to login), no data or sale is saved
- Step 4: login is refused
- Cleanup: delete the QA staff account

## Notes
Critical flow inside a feature first covered on 2026-10-29 (feature-coverage review follow-up). Never tested. Related: SCRM-138, SCRM-163.
