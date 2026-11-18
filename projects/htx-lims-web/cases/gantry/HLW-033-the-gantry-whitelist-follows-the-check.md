---
id: HLW-033
title: "The gantry whitelist follows the check-out purpose"
feature: gantry
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Whitelist by purpose

Verify that checking out on Loan or No return puts the item on the gantry whitelist, For use does not, and checking the item in again takes it off.

## Preconditions
- Three items with status IN

## Data
- Purposes: Loan (due date tomorrow), No return, For use

## Steps
1. Log in to HTX LIMS web with the administrator account
2. Check out the first item on Loan, the second on No return and the third For use
3. Open Gantry > Gantry Whitelist (and, if available, Swagger GET /api/Gantry: the list the gantries download)
4. Check the Loan item in again through the return flow (pre check-in, count, check in)
5. Open Gantry > Gantry Whitelist again

## Expected
- After step 2 the Loan and No return items are on the whitelist and the For use item is not
- After step 4 the returned Loan item is no longer on the whitelist

## Notes
Data check 2026-11-18: items checked out on Loan / No return since 11 Nov are whitelisted, For use items are not; 6 Loan / No return items checked out on 8-9 Nov are not whitelisted (Q-002).
