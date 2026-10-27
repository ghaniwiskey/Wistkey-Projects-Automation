---
project: storeberry-compare
env: staging
charter: "Explore the critical eShop journeys (search, product page, cart, checkout, registration/login, bank-transfer order) with boundary inputs and guest/member roles to find blockers before release."
date: 2026-10-27
timebox: 45m
status: done
---

## Scope
- In scope: staging eShop home, search, product page, cart drawer, checkout (guest and member), promo codes, registration, login, one Bank Transfer order (approved by the user; Bank Transfer only).
- Out of scope: card/wallet payments, production, real email addresses.
- CRM half of this session: `projects/storeberry-crm/explorations/2026-10-27-crm-eshop-critical.md`.

## Coverage notes
- Home: promo popup on first load; closes via `#close_promo_popup` (its X has no accessible name) and stays closed after reload.
- Search (BUG-001 retest): still broken. "Shoesss", "偈油x10" and nonsense "zzqxnotexist123" all return the same 24 unrelated products.
- Product page 偈油x10: qty 0 and -3 -> "Quantity must be greater than or equal to 1", nothing added. Qty 2 -> "Item added successfully", badge 2, drawer shows line HKD 20.00, persists after reload. BUG-002 not reproduced today (note added; left open for the user).
- test product EN 1: sold-out variants switch the button to SOLD OUT; Add To Cart without choosing uses the preselected default variant (sku123-7).
- Checkout (guest): invalid promo -> "Promotion code is invalid, expired or exceed the usage limit"; VIP888 takes HKD 20 off (whole-order promo #605, correct). REMOVE leaves "VIP888" in the box. Empty Continue only turns labels red (no text). Payment list has raw i18n keys and duplicates -> BUG-004. With only 偈油x10 (0 kg) no shipping section appears; with a 2 kg item Shipping Address/Method appear. Guest Proceed with a quota product -> "Member is requried for quota product." only at the end -> BUG-005.
- Registration: missing policy / short password / mismatch reported together. Birthday 02-30 accepted and stored as 10-27 -> BUG-003. Login works before email verification. Guest cart carried over to the member.
- Checkout (member): details pre-filled, but shipping Email kept the old guest email (reverted after reload) -> BUG-007. A notification permission modal blocked Proceed twice with no order and no message -> BUG-006. After dismissing it: order TXN0126102700002, HKD 400.00, Bank Transfer, 門市自取 荔枝角; thank-you page, My Orders = Pending Payment, CRM matches.
- Round 3: after an apparent deploy (~11:00) checkout has a country-code picker and no Continue button; ocu-20000 now 'Custom1'. Placed QA bank-transfer orders TXN0126102700003 (偈油x10) and TXN0126102700004 (product test 2). Receipt upload works (false Whoops only on the edited 2A order). Profile edit (syncs to CRM; email/birthday read-only), address book add/edit/delete, change password (wrong current / mismatch / too short / success), logout protects My Orders, old password rejected and new one accepted: all OK. URL typo /my-account/package-reocrd.
- No JS errors or HTTP >= 400 responses captured on the eShop during the session.

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | Registration birthday 02-30 stored as today | major | bugs/BUG-003-registration-with-an-impossible.md |
| 2 | bug | Payment methods show raw translation keys and duplicate FPS/PayMe | major | bugs/BUG-004-checkout-payment-method-list-shows-raw.md |
| 3 | bug | Quota product: guest only warned after filling the whole checkout | major | bugs/BUG-005-guest-can-fill-the-whole-checkout.md |
| 4 | bug | Notification popup swallows Proceed to checkout; no order, no feedback | major | bugs/BUG-006-notification-permission-popup-swallows.md |
| 5 | bug | Stale data: removed-items notice, old guest shipping email, removed promo code still shown | minor | bugs/BUG-007-cart-and-checkout-keep-stale-data.md |
| 6 | bug | Copy errors: "leave you gift message", "PAYMENT PROVE", "requried" | trivial | bugs/BUG-008-eshop-checkout-copy-errors.md |
| 7 | bug (existing) | BUG-001 search ignores the query: still reproduces | major | bugs/BUG-001-product-search-returns-unrelated.md |
| 8 | retest | BUG-002 cart drawer empty: not reproduced today | - | bugs/BUG-002-cart-drawer-stays-empty-after.md |
| 6b | bug | Receipt upload on an edited order shows a false 'Whoops! Please contact our admin' modal | major | bugs/BUG-009-receipt-upload-on-an-edited-order-shows.md |
| 6c | bug | Proceed to checkout silently does nothing when Shipping Method is missing | minor | bugs/BUG-010-proceed-to-checkout-does-nothing-when-a.md |
| 6d | question | product test 2 shows HKD 100.00 on the product page but HKD 49.00 in the member cart, with no member-price label. Intended? | - | - |
| 9 | question | Is it intended that a 0 kg product skips shipping address/method? | - | - |
| 10 | question | Login allowed before email verification: intended? | - | - |
| 11 | question | Marketing opt-in defaults to Yes on registration (consent/PDPO concern)? | - | - |
| 12 | risk | Registration name/email/password inputs and the notification modal buttons have no accessible names | - | - |

## New test ideas
- [x] SBF-005 Member places a bank transfer order with store pickup (P0, smoke, writes)
- [x] SBF-006 New member registers and can log in (P0, smoke, writes)
- [x] SBF-007 Registration validates policy, password length, confirmation and birthday (P2, regression)
- [x] SBF-008 Product page rejects quantity below 1 and sold-out variants (P2, regression)
- [x] SBF-009 Promotion code: invalid code message and whole-order discount (P1, regression)
- [x] SBF-010 Checkout payment methods have readable unique names (P2, regression)
- [x] SBF-011 Guest is told before checkout that a quota product needs login (P1, regression)

## Knowledge updates
- Promo popup: `#close_promo_popup`. Notification prompt: `button.close-button` with text NOT NOW (not in the a11y tree; Playwright click fails, DOM click works).
- Checkout is a single page: Shipping Store buttons, cart, Your Details (Continue), Shipping Address (only when the cart has weighted items), Payment Methods `<select>` (Bank Transfer value `fn-bank-transfer`), terms checkbox 結帳前同意 enables Proceed to checkout.
- Thank-you URL: /checkout/thank-you?txn_key=TXN...
- Screenshots in `explorations/2026-10-27-eshop-critical/`.
