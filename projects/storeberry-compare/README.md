# Storeberry Flower comparison

This project contains guest eShop checks. CRM workflows are tracked separately in `projects/storeberry-crm/`.

## Environments

- `staging` (default): `https://storeberry-flower.stagingl10.storeberry.xyz/`
- `production`: `https://storeberry-flower.mystoreberry.com/` (the published storefront reached from the CRM's “Visit my online store” link)

Staging allows writes for approved temporary cart tests. Production is read-only. Select the environment with `QA_ENV=staging` or `QA_ENV=production`.

The originally supplied `https://www.mystoreberry.com/` is the CRM login, not the public eShop. CRM tests and credentials are in `projects/storeberry-crm/`. Guest storefront checks require no login.

## Known staging issue

- `BUG-002` (open): adding an available item reports success and increments the cart badge, but the cart drawer does not show the item; after reload it may remain on a spinner. Do not place an order during cart checks. See `projects/storeberry-compare/bugs/BUG-002-cart-drawer-stays-empty-after.md`.

## Run

```powershell
$env:QA_ENV='staging'     # or production
& 'C:\Users\USER\.aside\runtime\node\node.exe' node_modules/playwright/cli.js test --project=storeberry-compare
```
