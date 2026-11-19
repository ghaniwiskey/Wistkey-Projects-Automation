---
project: storeberry-crm
env: staging
charter: Verify the membership discount by changing customer tier and mixing eligible and excluded products.
date: 2026-11-20
timebox: 20m
status: done
---

## Scope and results
- Storeberry KN Web POS, offer 679 (`level3`), configured as 10% off for Level 3. With Gold disabled in the test cart, the HKD 100 snack stayed HKD 100 for a guest and dropped to HKD 90 for a Level 3 member. Removing the member removed the offer. Two CRM-confirmed Level 2 members received Silver rather than `level3` on exact-member searches.
- Pinky Star1 remained HKD 480 on its own. CRM product 224 had **Excluded from whole order promotions** checked. Adding a HKD 100 eligible snack yielded HKD 20 off from Gold and HKD 8 off from `level3`, consistent with 10% of the eligible HKD 80 after Gold. No bug filed for the configured exclusion.

## Test cases and cleanup
- SCRM-185 and SCRM-186 passed in manual run `2026-11-20_0659_staging_manual`. Evidence is attached to the run.
- Cart cleared and member deselected. No sale completed or CRM settings changed.
