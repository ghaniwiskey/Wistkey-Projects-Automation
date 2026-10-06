---
project: mha-spf
env: staging
charter: "Explore FAVE results other than SIGHTED + WORKING and the Stocktake Follow up (Close Item) flow as VET IC and FALO to find bugs and cover the last untested critical FAVE flow"
date: 2026-10-06
timebox: 20m
status: done
---

## Scope
- In scope: FAVE Update Result mappings (NOT SIGHTED, SIGHTED with each Asset Condition, each HTD Follow-up) on FAVE FY26-2007 / 332600 APD; Stocktake > Follow up Close Item wizard. Account SPF-A2216GA as Verification Team IC/2IC and Fixed Asset Liaison Officer.
- Out of scope: FAVE(HQ) (no HQ role on the account), Follow up as URO/UAO.

## Coverage notes
1. Update Result dialog on 111000010977: every Sighted Result / Asset Condition / HTD Follow-up combination, read without saving; then repeated from PENDING.
2. Follow up: Start > Choose Asset (225 open items, FAVE FY24-2001, cost centre 332300), Next with nothing ticked, tick one, Review, Submit; then search the closed asset.

Changes left: Follow up item FAVE FY24-2001 / 602000000146 closed (cannot be undone). No FAVE result saved.

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | SIGHTED + NOT WORKING maps to To Repair but FSSC Outcome says "Working condition" | minor | bugs/BUG-010-fave-sighted-not-working-fssc-outcome.md (wont-fix: not a bug, intended mapping) |
| 2 | risk | Follow up closes items with no reason and no confirmation; nothing records why an item was closed | - | - |
| 3 | question | The Follow up list holds only FY24 items: approved FY26 cost centres (332100, 332370) had no OPEN results. Expected | - | - |

## New test ideas
- [x] SPF-040 NOT SIGHTED result, HTD/FSSC mapping, reset (P1, writes)
- [x] SPF-041 Close a FAVE follow-up item (P1, writes, uses one item per run)
- [x] SPF-042 SIGHTED + NOT WORKING / NOT IN USE mappings (P2, BUG-010)
- [ ] Report > Stocktake Follow up export lists the open items (P2)

## Knowledge updates
- context.md: FAVE mapping table, Follow up flow and page map row, test data note.
- Selectors: Follow up `#followUpType`, `#tblist`, `#tbreview`, End h2 + `#summary`, `#tbfail`. HTD Follow-up `select[name=UnitFollowUp]` options are rebuilt after a condition change (read with a retry).
