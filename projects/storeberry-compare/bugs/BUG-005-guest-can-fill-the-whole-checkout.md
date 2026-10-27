---
id: BUG-005
title: "Guest can add a package (quota) product and fill the whole checkout before being told it needs a member"
severity: minor
status: open
env: staging
url: "https://storeberry-flower.stagingl10.storeberry.xyz/checkout"
found: 2026-10-27
foundBy: "explorations/2026-10-27-eshop-critical.md"
tests: [SBF-011]
frequency: always
---
## Summary
"Quota product" in the message means a **Package** product (CRM product type Package, e.g. 偈油x10, Facial Package): its uses are tracked per member, so guests cannot buy it. The block itself is intended. The defect is the flow: a guest can add a package product to the cart and fill in the whole checkout; only after Proceed to checkout does a modal say "Member is requried for quota product." It does not name the item, does not offer login/register, and "requried" is misspelled.

## Steps to reproduce
1. As a guest (logged out), add 偈油x10 (CRM type Package) to the cart.
2. Open checkout, fill guest details, choose Bank Transfer, tick 結帳前同意.
3. Click Proceed to checkout.

## Expected
The product page or cart tells the guest that this package product requires login (naming the item, with Login/Register links) before checkout details are entered; the text is spelled correctly.

## Actual
Modal "Member is requried for quota product." only after the full form is filled. No order is created.

## Evidence
- Logged in as a new member, the same cart placed order TXN0126102700002 successfully.

## Environment
- Base URL: https://storeberry-flower.stagingl10.storeberry.xyz/checkout
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-eshop-critical.md in the Test Manager app.
- 2026-10-27: Retested 2026-10-27 ~11:20 after the user could not reproduce: still reproduces for guests whenever a Package product is in the cart (cart A: 2 x 偈油x10 + test product EN 1 large-blue; cart B: 11 x 偈油x10 only). Root cause of the earlier confusion: 偈油x10 is CRM type Package (= quota product); test product EN 1 is a Physical Product and is not involved. Title/steps corrected and severity lowered to minor because the block is intended; the issue is the late, unnamed, misspelled warning. Members are not affected..
- 2026-10-27: still reproduces: guest checkout with 偈油x10 only warned at Proceed ("Member is requried for quota product."), and the guest details/store selection reverted afterwards (explorations/2026-10-27-guest-order-recovery.md).
