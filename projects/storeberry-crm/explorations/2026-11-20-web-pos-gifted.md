---
project: storeberry-crm
env: staging
charter: Verify fixed-amount minimum-spend code in Web POS at and around the cutoff.
date: 2026-11-20
timebox: 15m
status: done
---

## Scope and results
- Storeberry KN staging Web POS, active offer 621 (Gifted), HKD 23 off spending over HKD 200. Gold was disabled in the separate test cart only.
- HKD 100: Applied Gifted shown, no deduction. HKD 200: HKD 23 deduction, total HKD 177. HKD 249: HKD 23 deduction, total HKD 226. Code was entered afresh at each subtotal.
- Above cutoff passed (SCRM-189); exact cutoff failed against the wording (SCRM-190). Q-025 updated. Manual run: 2026-11-20_0718_staging_manual.
- Test cart cleared; no sale and no promotion settings changed.
