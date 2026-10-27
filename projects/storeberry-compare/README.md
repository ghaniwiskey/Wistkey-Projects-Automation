# Storeberry Flower comparison

This project contains guest eShop checks. CRM workflows are tracked separately in `projects/storeberry-crm/`.

## Environments

- `staging` (default): `https://storeberry-flower.stagingl10.storeberry.xyz/`
- `production`: `https://storeberry-flower.mystoreberry.com/` (the published storefront reached from the CRM's “Visit my online store” link)

Staging allows writes for approved temporary cart tests. Production is read-only. Select the environment with `QA_ENV=staging` or `QA_ENV=production`.

The originally supplied `https://www.mystoreberry.com/` is the CRM login, not the public eShop. CRM tests and credentials are in `projects/storeberry-crm/`. Guest storefront checks require no login.

## Known staging issues (as of 2026-10-27)

- `BUG-001` (open): search ignores the query; every search returns the same 24 products.
- `BUG-002` (open, not reproduced on 2026-10-27): cart drawer stayed empty after add-to-cart.
- `BUG-003`..`BUG-008` (open): registration birthday saved as today, raw payment-method keys, late quota-product warning, notification popup blocking Proceed to checkout, stale checkout data, copy errors.

## Checkout notes

- Orders are allowed on staging only with user approval and Bank Transfer (`fn-bank-transfer`) only. Never use card/wallet methods.
- Close the promo popup with `#close_promo_popup`; dismiss the notification prompt (`button.close-button` NOT NOW) before clicking Proceed to checkout.
- Shipping Address/Method only appear when the cart has a weighted item; quota products (e.g. test product EN 1) need a logged-in member.
- Session log: `explorations/2026-10-27-eshop-critical.md`.
- Guests cannot buy quota products (偈油x10, test product EN 1); use a non-quota item such as the NAKAJIMA cake (HKD 0.10). 住宅送貨 requires every Delivery Info field, including 回收聖誕樹日期 (November dates only).
- Guest Order Tracking: `/guest-order-tracking` with order number + order email (case-insensitive). Forgot password: `/forgot-password` (BUG-011). Notes: `explorations/2026-10-27-guest-order-recovery.md`.

## Run

```powershell
$env:QA_ENV='staging'     # or production
& 'C:\Users\USER\.aside\runtime\node\node.exe' node_modules/playwright/cli.js test --project=storeberry-compare
```

## Testing permissions (user, 2026-10-27)

Staging only. Production is read-only.
- Allowed without asking each time, on our own QA data: create, edit, submit/confirm, cancel and delete; placing eShop orders.
- Payment: **Bank Transfer only** (`fn-bank-transfer`). Never card, wallet or other gateways.
- Test data can use normal, realistic names; no QA prefix or special email format is required.
- Also allowed: refunds, voids and cancellations of orders; stock-changing steps (PO Receive, transfer ship/receive, replenish approve, stock-take completion); in-store POS sales; actions that send messages or notifications to customers (WhatsApp/SMS/Messenger/email).
- Ask first: changes to other people's records, bulk/Select All actions on data we did not create, and settings or staff mapping changes.
