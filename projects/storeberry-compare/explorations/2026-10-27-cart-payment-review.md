---
project: storeberry-compare
env: staging
charter: "Explore guest cart add/remove and a guest Bank Transfer order through receipt upload and CRM rejection with boundary inputs to find blockers in the uncovered P0 cart flow."
date: 2026-10-27
timebox: 15m
status: done
---

## Scope
- In scope: guest cart drawer (SBF-004), guest checkout with 門市自取 and Bank Transfer, receipt upload, Order Tracking after rejection.
- Out of scope: card/wallet payments, member flows, production.
- CRM half: `projects/storeberry-crm/explorations/2026-10-27-stock-movement.md`.

## Coverage notes
- Cart (SBF-004): NAKAJIMA cake (HKD 0.10) Add To Cart -> "Item added successfully", badge 1, drawer line Qty 1 HKD 0.10. Drawer remove icon (no accessible name) -> "Item remove successfully", badge 0, empty message, still 0 after reload.
- Checkout: Bank Transfer is now preselected. 門市自取 shows a required "Address *" and a store radio (荔枝角). Empty address -> generic "Please fill all required info" with no field named (Q-007). The Remark textarea is also `name="address"`.
- Email `chan.taiman+<id>@example.com` -> same generic dialog and both Email labels turn red with no text, twice; without "+" the order was placed: TXN0126102700016 -> BUG-012.
- Receipt: thank-you > Upload Payment Prove opens guest tracking. Submit with no file: no feedback. Setting a file on the "+" dropzone input left a "Please wait..." overlay that never cleared (may be an automation artifact; the image was still saved). "Or Choose File" + Submit worked -> Payment Review, two receipts shown.
- After the CRM Deny: tracking shows STATUS REJECTED, the Receipt tab shows "Rejected" with the staff comment and Replace links.

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | Guest checkout rejects a valid plus-addressed email with only "Please fill all required info" | major | bugs/BUG-012-guest-checkout-rejects-a-valid-plus.md |
| 2 | question | Should 門市自取 require a Delivery Address? | - | questions/Q-007-should-store-pickup-require-a-delivery.md |
| 3 | risk | Receipt dropzone may leave "Please wait..." up after upload (seen once via automation) | - | - |
| 4 | risk | Receipt Submit with no file gives no feedback; remove-from-cart icon has no accessible name | - | - |

## New test ideas
- [x] SBF-019: Guest checkout accepts a plus-addressed email (P1, regression, writes) - created, fails (BUG-012).
- [ ] Re-upload a receipt after rejection moves the order back to Payment Review (P1, regression, writes).

## Knowledge updates
- README: plus-addressed emails fail at guest checkout; use dotted unique emails for test data until BUG-012 is fixed. Use the "Or Choose File" input (`input[name=receipt_img]`) for receipt upload in automation.

## Round 4 (19:15-19:40 HKT): course purchase, eGift, home delivery
- Course page lets a past date be picked and books the next session instead (BUG-014, SBF-021). Full session shows "Service is full".
- E-Gift: reserve + redeem works; expired gift by URL: silent failure (BUG-015) and stack trace in the API error (BUG-016) (SBF-022). The gift name link (href="#") does not open the detail; only the image does.
- Home delivery 香港本地送貨 and the JD minimum rule work (SBF-023 pass). Details: storeberry-crm explorations/2026-10-27-stock-movement.md, Round 4.
