---
project: mha-mobile
env: staging
charter: "Explore the MHA Mobile areas the first 2026-10-22 session did not touch (Asset Registration, Stocktake Ad Hoc, offline FAVE mode, VERIFY tab, Assign & Relocate, FALO role, HTA) with invalid inputs, interruptions and network loss to discover bugs; finish the open checks of the first session (EX-19, BUG-007 follow-up)"
date: 2026-10-22
timebox: 60m (ran ~55m, 10:49-11:45 WIB)
status: done
---

## Scope
- In scope: SPF UAT (agency SPF), phone account MHM_USER (Tan Jun Yong Shawn) as LOGS1, FALO and Stocktaker on 332100, 332140, 332600; MHA web (web test account as LOGS1, FALO, VET IC, Agency Admin) for setup and checks; a short HTA pass (MHM_HTA_USER, LOGS1 | 338000).
- Out of scope: approvals, RFID scanner hardware, automation.
- Known bugs not re-reported: BUG-001..019 (BUG-007..019: explorations/2026-10-22-bug-hunt-edges.md).
- Data rules kept: one PROGRESS asset registered (602000003903); relocations put back; sightings reset to PENDING.

## Test scenarios
| ID | Area | Scenario (steps) | Looking for | Result |
|---|---|---|---|---|
| EX2-01 | Registration | Register Asset list: count vs web; search | Same count, search | Pass: 51 PROGRESS in 332140, 50 after one registration. The list has no search box (Q5) |
| EX2-02 | Registration | Save with Block, Level, Room, Remarks all empty | "at least one" validation | Pass: "Please input block or level or room or remark"; photo is optional |
| EX2-03 | Registration | Postal code with no address, Save | Refused | **Bug** BUG-021: registered with postal 000099 and the old 138507 address |
| EX2-04 | Registration | More than 5 photos; remove one | Limit enforced | Not run (the form shows 5 photo slots; the gallery needs pushed images) |
| EX2-05 | Registration | Fill, Back, reopen | Warning or kept | Seen with EX2-06: typed data is not kept (same family as BUG-015) |
| EX2-06 | Registration | Network off > Save | Message, form kept | **Bug** BUG-023: "Network Error", form closed, data lost (2/2) |
| EX2-07 | Registration | Double tap Save | One registration | Not run: the one asset allowed was used by EX2-03 |
| EX2-08 | FALO | FALO tiles, Register Asset, Assign | Matches the role | Pass: 6 tiles like LOGS1; Register Asset (0) in 332600; Select Asset lists all 405 unit assets, the same as web FALO (2,633 over its units) |
| EX2-09 | Assign & Relocate | Role and user picked, postal code emptied, Complete | Location validation | Pass: "Please input postal code" (Building/Address keep the old values while empty) |
| EX2-10 | Assign / Relocate | Two assets, RELOCATE | Both moved, unique number | One transaction for both (ASG00006473), form pre-fills nothing with 2 assets; number duplicated again (BUG-007 History) |
| EX2-11 | Offline FAVE | CONFIRM with the network off | Clear message | Pass: "Error / Network Error" |
| EX2-12 | Offline FAVE | Sight offline, reopen the FAVE online before Submit | Sighting kept | Pass: REVIEW 1 kept, Submit works |
| EX2-13 | Offline FAVE | Web reassigns the asset, phone submits | Conflict handled | **Bug** BUG-022: accepted; web shows the new stocktaker's name |
| EX2-14 | VERIFY tab | Open VERIFY without a scanner | Empty state, hint | Empty list, no hint that no scanner is connected (Q6); no crash |
| EX2-15 | FAVE | 262-character remarks (EX-19) | Limit or intact | **Bug** BUG-024: phone accepts 262, web keeps 200 |
| EX2-16 | Ad Hoc | ADST00000037: offline download, Not sighted + Sighted with remarks, Submit | Web matches | Pass: web NOT SIGHTED / SIGHTED with the remarks |
| EX2-17 | Ad Hoc | Home / back / logout with unsent results | Warnings, data kept | **Bug** BUG-020: Logout has no warning and deletes them (2/2). **Bug** BUG-025: Home icon does nothing |
| EX2-18 | Web | Open both records sharing an ASG number | Each opens its own | Pass: separate pages (Teo's SUBMITTED 332400 / Tan's APPROVED 332600) |
| EX2-19 | HTA | Offline login, ASSIGN with 0 assets | Same bugs? | BUG-012 and BUG-011 reproduce on HTA (History lines added); the agency falls back to SPF after a refused login (known) |

## Coverage notes
Order: Registration (EX2-06, 02, 03, then a phone relocation to repair 602000003903), FALO (EX2-08, web FALO comparison), Assign & Relocate (EX2-09), two-asset relocate (EX2-10) and the ASG numbers (EX2-18), offline FAVE (EX2-11, 12, 14, 13), long remarks (EX2-15), web Ad Hoc setup (ADST00000037), Ad Hoc (EX2-17, 16), HTA (EX2-19).
Heuristics: data lifecycle (unsent data across logout, offline copies vs server changes), inputs (length limits phone vs web, unmatched postal codes), errors and resilience (network off at Save), roles (FALO), consistency between screens (FAVE vs Ad Hoc warnings and Home button).

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | Logout with unsent Ad Hoc results: no warning, results deleted | major | [BUG-020](../bugs/BUG-020-logging-out-with-unsent-ad-hoc.md) |
| 2 | bug | Asset Registration saves an unmatched postal code with the old address | major | [BUG-021](../bugs/BUG-021-mobile-asset-registration-saves-a.md) |
| 3 | bug | Sighting of a reassigned asset accepted and credited to the new stocktaker | major | [BUG-022](../bugs/BUG-022-phone-sighting-of-an-asset-reassigned.md) |
| 4 | bug | Registration without network closes the form and loses the input | minor | [BUG-023](../bugs/BUG-023-asset-registration-without-network.md) |
| 5 | bug | FAVE remarks > 200 characters silently cut on web | minor | [BUG-024](../bugs/BUG-024-fave-remarks-longer-than-200-characters.md) |
| 6 | bug | Home icon on an Ad Hoc stocktake does nothing | minor | [BUG-025](../bugs/BUG-025-home-button-on-the-ad-hoc-stocktake.md) |
| 7 | bug (update) | BUG-007 reproduced (ASG00006472, ASG00006473); BUG-011 and BUG-012 reproduce on HTA; BUG-009 seen again; BUG-019 gets the download dialog text | - | History lines on those bugs |
| Q5 | question | Register Asset (51 items) has no search; finding one asset means scrolling. Intended? | - | - |
| Q6 | question | VERIFY shows an empty list without saying that no RFID scanner is connected. Should it prompt to connect one (Settings)? | - | - |
| Q7 | question | Web Ad Hoc Setup (LOGS1) offers RETIRED assets for an ad hoc stocktake. Intended? | - | - |
| Q8 | question | The offline download dialog has CONTINUE and OK; what does each do? (both seem to close it) | - | - |
| R3 | risk | The web session of the test account ended twice within ~5 minutes of activity (11:12 -> 11:16 WIB), not only after 15 minutes idle; cause unknown | - | - |
| Tool | fix | Test Manager store wrote bug `url` unquoted, so a url with ": " broke the YAML (BUG-019 vanished from the store); fixed in commit 710dc33 | - | - |

## Data left on UAT
- 602000003903 (332140): registered from the phone (now AVAILABLE, room QX3, postal 138507 after the repair relocation ASG00006472); Register Asset 332140 is down to 50.
- 111000011297 and 111000011298 (332600): relocated in place in one transaction (ASG00006473); both now have location Remarks "Duty Office" (11298 had it already; 11297 had "No Remarks").
- ADST00000037 "QA explore mobile adhoc 2026-10-22" (one-off, 332100, created by the web test account, stocktaker Tan): both assets submitted (111000021250 NOT SIGHTED, 111000021888 SIGHTED). One-offs cannot be cancelled.
- FAVE FY26-2001 / 332600: 111000010978 back to PENDING and stocktaker Tan (after the EX2-13 reassignment and EX2-15 submit).
- Phone logged out; network on.

## New test ideas
- [ ] Logout with unsent Ad Hoc results warns and keeps them. P1, @regression @stocktake @adhoc (BUG-020)
- [ ] Asset Registration refuses an unmatched postal code. P1, @regression @registration (BUG-021)
- [ ] A stocktaker cannot upload a sighting for an asset reassigned to someone else (or keeps the credit). P2, @regression @stocktake @offline (BUG-022)
- [ ] Remarks length: phone limit equals web limit (200) for FAVE, Ad Hoc, New Asset, Registration. P3, @regression (BUG-024)
- [ ] Ad Hoc: Home icon and back arrow behave like FAVE. P3, @regression @adhoc (BUG-025)
- [ ] Offline FAVE: sighting made offline survives reopening online and submits (passes today). P2, @regression @offline

## Knowledge updates
- context.md: session 2 notes (Registration validation order, FALO scope, Ad Hoc list per cost centre and its missing warnings, offline download dialogs, web limits, how to create an ad hoc stocktake as the web test account).
