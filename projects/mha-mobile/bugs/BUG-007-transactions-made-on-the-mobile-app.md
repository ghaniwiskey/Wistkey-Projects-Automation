---
id: BUG-007
title: "Transactions made on the mobile app reuse ASG numbers already given to web transactions (ASG00006469, ASG00006470 exist twice)"
severity: major
status: open
env: staging
url: Mobile app Assign > Relocate; checked on https://mhauatweb.southeastasia.cloudapp.azure.com/Asset/Assignment
found: 2026-10-22
foundBy: "explorations/2026-10-22-bug-hunt-edges.md"
tests: []
frequency: always
---
## Summary
Two relocations completed on the phone on 2026-10-22 got transaction numbers ASG00006469 and ASG00006470, which already belong to web relocations created by Teo Siew Inn on 2026-10-16 (332400, SUBMITTED). Web transactions had already reached ASG00006564 (2026-10-19), so the mobile side hands out numbers from a sequence that lags behind and collides with existing ones. A transaction number no longer identifies one transaction (search, approval links, audit trail).

## Steps to reproduce
1. Mobile app (MHM_USER, Tan Jun Yong Shawn): Switch > Logistics Officer 1 | 332600 > Assign
2. Select Asset > search 111000011297 > + > close; transaction type RELOCATE; Complete (toast 'Submit success') at 10:27 WIB / 11:27 SGT; repeat once at 10:29 WIB
3. MHA web (Agency Admin) > Asset > Assignment: search the asset 111000011297 -> ASG00006469 and ASG00006470, RELOCATE, Tan Jun Yong Shawn, 22-Oct-2026, APPROVED
4. Search ASG00006469, then ASG00006470

## Expected
Each transaction gets a new, unique number after the highest one issued (above ASG00006564); searching a transaction number returns exactly one transaction.

## Actual
Search ASG00006469 -> 2 records: '332400 RELOCATE Teo Siew Inn, Logistics Officer 1, 16-Oct-2026 16:43:15, SUBMITTED' and '332600 RELOCATE Tan Jun Yong Shawn, -, 22-Oct-2026 11:27:34, APPROVED'. Same for ASG00006470 (16-Oct-2026 16:43:39 Teo Siew Inn / 22-Oct-2026 11:29:53 Tan Jun Yong Shawn). ASG00006468 and ASG00006471 are Teo's only. The listing (sorted by number) also hides the new mobile transactions far down the list.

## Evidence
- Web Asset > Assignment search results quoted above (Agency Admin, 2026-10-22 ~10:40 WIB)
- Session notes: ../explorations/2026-10-22-bug-hunt-edges.md (finding 1)

## Environment
- Base URL: Mobile app Assign > Relocate; checked on https://mhauatweb.southeastasia.cloudapp.azure.com/Asset/Assignment
- Env: staging

## History
- 2026-10-22: filed from explorations/2026-10-22-bug-hunt-edges.md in the Test Manager app.
- 2026-10-22: Reproduced again in explorations/2026-10-22-bug-hunt-untouched.md: phone relocations ASG00006472 (332140, 11:55 SGT) and ASG00006473 (332600, two assets in one transaction, 12:04 SGT) also duplicate Teo Siew Inn's 16-Oct web transactions; ASG00006471 was skipped (only Teo's). Each record's view link opens its own transaction.
