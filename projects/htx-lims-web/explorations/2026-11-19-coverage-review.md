# Coverage review 2026-11-19: untested critical flows in HTX LIMS web

- **Charter:** Compare the 48 cases (HLW-001..048) and the runs of 2026-11-18 with the item lifecycle (context.md) and the live menu, and turn every untested flow into a case.
- **Env:** staging (UAT), ADMIN only. Read-only: edit dialogs opened and closed, nothing saved.
- **Tester:** Aside.

## State before the review

- Every lifecycle step had a case; 44 of 48 cases ran by hand on 2026-11-18. Only HLW-001 (home page) is automated.
- Failing or blocked P0s: HLW-014 / HLW-033 (BUG-001 critical, returned loan stays whitelisted after web Check In), HLW-020 (BUG-005, Acknowledge does nothing), HLW-009 blocked (POs are APPROVED at once, Q-001). HLW-038 blocked (tag type not visible), HLW-030 fails (BUG-006).

## Gaps found and cases written

| Gap | Case |
|---|---|
| No end-to-end receiving case: one new item from registration to IN and stock +1 | HLW-049 (P0) |
| Item Register Edit | HLW-050 |
| PO Edit (Manager / Officer required but empty on existing POs) | HLW-051 |
| PO Delete | HLW-052 |
| Deleting a user / open session | HLW-053 |
| Changing a user's role | HLW-054 |
| Extra permission "Stock adjustment" for the User role | HLW-055 |
| Overdue loans (Loan Out Report has an Overdue status) | HLW-056 |
| High stock alert (>= Max) | HLW-057 |
| CoA / SDS / photo uploads, chemical SDS and license fields | HLW-058 |
| Stock Received & Utilised Report | HLW-059 |
| Stock Transaction Report | HLW-060 |
| Stock take Abort | HLW-061 |
| Two users checking out the same item | HLW-062 |
| For use item (OUT, not whitelisted) through an exit gantry | HLW-063 (P0) |

## Findings

| # | Type | Finding | Link |
|---|---|---|---|
| 1 | question | Item Register has no PO field: nothing links an item to its purchase order | Q-010 |
| 2 | info | My Account Edit only changes Email: there is no way to change one's own password in the web | - |
| 3 | info | Edit User has Extra permissions > Stock adjustment, "Takes effect within a minute" | HLW-055 |

## QA data left behind

None.

## Round 2: untested P0s run by hand

Run `runs/2026-11-19_0944_staging_manual` (2 pass), web as ADMIN + handheld on emulator Medium_Phone + gantry API.

- HLW-049 pass: 002000025 "QA receive 789896" (Consumable / Glove) registered, printed (printer "test"), pre check-in + count and check-in on the handheld -> IN at Airlock 1, Glove Stock 2 -> 3, all steps in the Audit Trail. The web Check In page does not list NOT CHECKED IN items, so a new item can only be checked in on the handheld (Q-006).
- HLW-063 pass: 003000025 (OUT For use, not whitelisted) through 3b EXIT via `unauthorizerfid` -> Unauthorized removal alert (Dashboard 21 -> 22), Unauthorized Log OUT / Airlock 2, status stays OUT; moved back with a read at 2a.
- Seen: the Dashboard already raises "Overdue loan" alerts (HLW-056 updated).
- Left behind: 002000025 IN Airlock 1; 003000025 OUT For use in Chemistry; open alert "Unauthorized removal: QA print chem 42609 (Item Number 003000025) passed exit gantry 3b EXIT." (not acknowledged).
