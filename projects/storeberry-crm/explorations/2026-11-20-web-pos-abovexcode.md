---
project: storeberry-crm
env: staging
charter: Verify a spend-threshold percentage code at, below, and above its cutoff in Web POS.
date: 2026-11-20
timebox: 20m
status: done
---

## Scope and results
- Storeberry KN staging Web POS, promotion 681 (abovexcode). Separate guest test cart; unrelated Gold offer turned off in that cart only.
- HKD 49 (product test 2): label said Applied abovexcode, but there was no promo deduction. Returning below the threshold removed the deduction while keeping the label.
- HKD 50 (one 毛絨掛件盲盒): HKD 10 off, HKD 40 total. Confirmed again after clearing and re-entering the code. This is inclusive even though the text says above 50.
- HKD 100 (two units of the same item): HKD 20 off, HKD 80 total.

## QA records
- SCRM-187 pass; SCRM-188 fail against offer wording, awaiting confirmation in Q-025. Manual run: 2026-11-20_0711_staging_manual.
- Test cart cleared. No sale placed and no promotion settings changed. Original POS cart untouched.
