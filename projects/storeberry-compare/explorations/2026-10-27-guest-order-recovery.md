---
project: storeberry-compare
env: staging
charter: "Explore guest purchase and self-service flows not covered yet (guest Bank Transfer checkout with home delivery, guest Order Tracking, forgot password) with boundary inputs to find blockers and data leaks."
date: 2026-10-27
timebox: 25m
status: done
---

## Scope
- In scope: guest checkout (Bank Transfer only), 住宅送貨 delivery info, guest Order Tracking, forgot password.
- Out of scope: card/wallet payments, real inboxes (reset email went to an example.com QA member).
- CRM half: `projects/storeberry-crm/explorations/2026-10-27-pos-order-lifecycle.md`.

## Coverage notes
- The guest cart still had 11 x 偈油x10 and the old guest "AsideQA QuotaRetest" from an earlier session. 偈油x10 is a quota product: Proceed -> "Member is requried for quota product." only at the end (BUG-005, still open). Afterwards the entered guest details and store selection reverted to the old values (BUG-007 family).
- With NAKAJIMA cake (HKD 0.10, 0 kg) Shipping Address/Method appear; 住宅送貨 asks for phone, address, delivery date (xdsoft picker; today and tomorrow disabled, past days disabled but not greyed), time slot and a 回收聖誕樹日期 field (Nov dates only). Missing field -> "All Delivery info selection should be choose." Shipping fee HKD 0.00.
- Order TXN0126102700006 placed (thank-you page, UPLOAD PAYMENT PROVE). Delivery date stored as "2026-10-29 11:18:29" (stray time).
- Order Tracking (/guest-order-tracking, POST txn_key + shipping_email): correct pair shows full details; wrong email and other order -> "The related order does not exist."; email and order number are case-insensitive; member orders are not trackable here. After the CRM void, status CANCELED.
- Forgot password: registered email -> Success + redirect to /login; unknown well-formed email -> "Please provide correct email." (BUG-011); empty submit gives no feedback.
- Modals are Bootstrap `.modal` (not swal); read them with `getComputedStyle(m).display !== 'none'`.

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | Forgot password reveals whether an email is registered | minor | bugs/BUG-011-forgot-password-reveals-whether-an.md |
| 2 | bug (existing) | More copy errors: "should be choose", "Receipient" (added to BUG-008) | trivial | bugs/BUG-008-eshop-checkout-copy-errors.md |
| 3 | bug (existing) | BUG-005 still reproduces for 偈油x10; guest details revert afterwards | major | bugs/BUG-005-guest-can-fill-the-whole-checkout.md |
| 4 | risk | Delivery date saved with a random time component | - | - |
| 5 | risk | Disabled dates in the delivery picker look identical to enabled ones | - | - |
| 6 | risk | Empty forgot-password submit gives no feedback | - | - |

## New test ideas
- [x] SBF-016 Guest places a bank transfer order with home delivery (P0)
- [x] SBF-017 Guest tracks an order by order number and email (P1)
- [x] SBF-018 Forgot password gives the same answer for registered and unknown emails (P2)
- [x] Shipping fee by method/weight (SF, ShipAny) and free-shipping threshold: not explored -> case SBF-029, SBF-030

## Test Manager
- Manual run `runs/2026-10-27_1125_staging_manual` (exploratory-2026-10-27-guest): SBF-016, SBF-017 pass; SBF-018 fail (BUG-011).

## Evidence
- `2026-10-27-guest-order-recovery/01-forgot-password-unknown-email.png`, `02-guest-thank-you.png`, `03-tracking-after-cancel.png`.
