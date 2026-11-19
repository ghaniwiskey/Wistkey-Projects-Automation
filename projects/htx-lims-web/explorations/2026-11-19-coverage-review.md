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

## Findings

| # | Type | Finding | Link |
|---|---|---|---|
| 1 | question | Item Register has no PO field: nothing links an item to its purchase order | Q-010 |
| 2 | info | My Account Edit only changes Email: there is no way to change one's own password in the web | - |
| 3 | info | Edit User has Extra permissions > Stock adjustment, "Takes effect within a minute" | HLW-055 |

## QA data left behind

None.
