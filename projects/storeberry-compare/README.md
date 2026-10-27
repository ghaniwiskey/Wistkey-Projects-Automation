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

## Run

```powershell
$env:QA_ENV='staging'     # or production
& 'C:\Users\USER\.aside\runtime\node\node.exe' node_modules/playwright/cli.js test --project=storeberry-compare
```
