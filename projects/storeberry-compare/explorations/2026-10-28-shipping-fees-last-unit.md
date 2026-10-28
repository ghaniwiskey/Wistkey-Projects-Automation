---
project: storeberry-compare
env: staging
charter: "Explore member checkout shipping fees (flat fee, free-shipping threshold, cart changes, delivery date) and the last available unit at checkout, reconciling with CRM orders and TaiPo inventory, to find wrong totals and overselling."
date: 2026-10-28
timebox: 30m
status: done
---

## Scope
- In scope: never-run P0/P1 cases SBF-028, SBF-029, SBF-030; CRM Online Store > Shipping rules (read only); member checkout (MEMy001164526); CRM order detail; TaiPo inventory; one transfer order used to take stock away.
- Out of scope: guest checkout, card/wallet payments, courier auto-calculated fees (SF / ShipAny need a full address and live courier quotes), SBF-031/SBF-032.

## Coverage notes
- Shipping rules (CRM `/shipping/edit-method/<id>`, values filled by JS, so read them in the browser): Testing (111) flat HKD 30, free from HKD 1600; ShipAnySF350free (109) flat 30, free from 350; 門市自取（3日前下單）(93) flat 60, free from 1000 (not offered at checkout); JD (107) free from 1500 and 到付 (113) free from 699.99 with auto-calc; most other methods are free. No method has weight bands enabled.
- Fee at checkout: C x1 (Silver, discounted 510) Testing 30 -> Total 540; ShipAnySF350free 0; SF 住宅 "Please fill-in delivery address for obtaining shipping fee". Threshold basis is the discounted total: sub-total 1794 / discounted 1494 still pays 30; 2088 -> 0; back below -> 30 without reload.
- Order TXN0126102800009 (C, Testing): CRM Delivery Cost $30.00, Total $540.00, Bank Transfer $540.00 (SBF-029 pass).
- Cart change at checkout (trash or -) resets Shipping Method to "-- Select --" but the Summary keeps the old fee in Total (BUG-021, twice). Sometimes (- on a single line) the method stays selected.
- Testing's Delivery Info field "test" is a date (range 2026-09-05..09-22, 5 preparation days): the picker greys out every date, but the input is plain text. Typed 2026-12-01 kept; typed text -> today; order TXN0126102800010 stored 2026-10-28 (BUG-020, twice; 009 stored 0001-01-01 after a programmatic fill).
- Last unit (partial SBF-028, one session): product test 2 TaiPo Available 8 in cart; transfer Transfer261028042128d05d (TaiPo -> Causeway Bay, 1, Pending) -> 7; Proceed with 8 refused: "The following item(s) are out of stock/not enough stock now: - product test 2", line "Not enough stock". Qty 7 -> TXN0126102800011 placed, Available 0 (not negative); 1 more refused at Proceed (Add To Cart still accepts it, BUG-017 accepted).
- Heuristics: follow the money (rule -> checkout -> CRM), boundaries (threshold above/below, last unit), interrupted state (cart change after method choice), bypassing client-side controls (typing in a picker field).

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | Typed delivery date bypasses the picker: same-day / out-of-range dates and text accepted | major | bugs/BUG-020-checkout-accepts-a-typed-delivery-date.md |
| 2 | bug | Shipping fee stays in Total after a cart change clears the method | minor | bugs/BUG-021-checkout-keeps-the-old-shipping-fee-in.md |

## Test cases written
- SBF-033 Changing the cart at checkout never leaves a shipping fee without a method (P2) - fail, BUG-021
- SBF-034 Checkout refuses a delivery date outside the method's allowed dates (P1) - fail, BUG-020
- Updated: SBF-028 notes (partial check; true two-session race still open).
- Manual run `runs/2026-10-28_1127_staging_manual`: SBF-029 pass, SBF-030 pass (exact T and promo-code basis not covered), SBF-033 fail, SBF-034 fail. SBF-028 left out (partial).

## Knowledge and data
- context.md: Checkout (shipping rules, threshold basis, delivery date field, stock re-check at Proceed).
- QA data: TXN0126102800009, 010, 011 voided (Canceled); transfer Transfer261028042128d05d canceled; product test 2 TaiPo Available back to 8; member cart empty.
