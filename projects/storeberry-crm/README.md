# Storeberry Flower CRM

CRM project for the Storeberry Flower tenant. The login flow was verified against staging using the shared account.

## Environments

- `staging` (default): `https://www.stagingl10.storeberry.xyz/` (writes allowed for controlled temporary test data)
- `production`: `https://www.mystoreberry.com/` (read-only)

Use `QA_ENV=staging` or `QA_ENV=production`. Do not create, edit, terminate or otherwise alter production records. The production URL is the CRM; its “Visit my online store” link opens the public eShop at `https://storeberry-flower.mystoreberry.com/`.

## Test account

Set `SCRM_COMPANY`, `SCRM_USERNAME` and `SCRM_PASSWORD` in local `.env` (ignored by Git). Never commit real credential values. Company name is entered along with username and password on the CRM login form.

## Current staging coverage

- Products: created a unique hidden test product, edited its name, and terminated it through the CRM action menu. It disappeared from active products and appeared in the terminated count.
- Orders: list loaded with 1,017 orders for the default 12-month range; the Pending payment filter reduced the displayed set to 204.
- Customers: customer list loaded with 320 records. Only read-only inspection was done.

The Test Manager contains manual scenarios for product create/update/terminate and orders filtering. CRM production has not been tested because no CRM bug has yet been found on staging.
