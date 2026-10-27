# Storeberry Flower comparison

This project contains guest eShop checks. CRM workflows are tracked separately in `projects/storeberry-crm/`.

## Environments

- `staging` (default): `https://storeberry-flower.stagingl10.storeberry.xyz/`
- `production`: `https://storeberry-flower.mystoreberry.com/` (the published storefront reached from the CRM's “Visit my online store” link)

Staging allows writes for approved temporary cart tests. Production is read-only. Select the environment with `QA_ENV=staging` or `QA_ENV=production`.

The originally supplied `https://www.mystoreberry.com/` is the CRM login, not the public eShop. CRM tests and credentials are in `projects/storeberry-crm/`. Guest storefront checks require no login.

## Known staging issues (as of 2026-10-27, afternoon)

- Open: `BUG-003` registration birthday saved as today, `BUG-007` stale checkout data, `BUG-008` copy errors.
- Verified fixed: `BUG-001` search, `BUG-002` cart drawer, `BUG-009` false Whoops on receipt upload.
- Won't fix (accepted behavior): `BUG-004` raw payment-method keys, `BUG-005` late quota-product warning, `BUG-006` notification popup, `BUG-010` silent Proceed without shipping method, `BUG-011` forgot password reveals registered emails.

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

## Guest checkout notes (2026-10-27, evening)

- Plus-addressed emails (`name+tag@...`) are refused at guest checkout with only "Please fill all required info" (BUG-012); use dotted unique emails for test data.
- 門市自取 requires an Address (Q-007). Receipt upload in automation: use `input[name=receipt_img]` ("Or Choose File") then Submit.
- Notes: `explorations/2026-10-27-cart-payment-review.md`.
