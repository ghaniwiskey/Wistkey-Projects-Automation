# Storeberry Flower CRM

CRM project for the Storeberry Flower tenant. The login flow was verified against staging using the shared account.

## Environments

- `staging` (default): `https://www.stagingl10.storeberry.xyz/` (writes allowed for controlled temporary test data)
- `production`: `https://www.mystoreberry.com/` (read-only)

Use `QA_ENV=staging` or `QA_ENV=production`. Do not create, edit, terminate or otherwise alter production records. The production URL is the CRM; its “Visit my online store” link opens the public eShop at `https://storeberry-flower.mystoreberry.com/`.

## Test account

Set `SCRM_COMPANY`, `SCRM_USERNAME` and `SCRM_PASSWORD` in local `.env` (ignored by Git). Never commit real credential values. Company name is entered along with username and password on the CRM login form.

## Current staging coverage (explored 2026-10-26)

- Authentication: root redirects to `/auth/login`; the staging test account reached `/get-start`.
- Products: a unique Hidden Product was created, edited, and terminated. The form describes this type as not viewable online but still purchasable; its setting persisted after save/edit and it no longer appears in the active list. The test record remains in the terminated list; no order was created.
- Orders: the Last 12 Months list loaded with 1,012 orders; Pending payment showed 203 on this exploration date. These counts change and must not be hard-coded.
- Customers: the list loaded with 320 records; a unique no-match search returned zero. No customer records were changed.

## Automation

- `SCRM-001` and `SCRM-005` cover sign-in page availability and successful staging login.
- `SCRM-003` and `SCRM-004` are read-only order-filter and customer-search checks; assertions avoid customer/order details.
- `SCRM-002` creates, edits, and permanently terminates a test product. It is tagged `@final`; obtain explicit approval for each scenario and run/retry. It skips unless the test is specifically targeted and `SCRM_002_RUN_APPROVED=true` is set for that process. Do not store that flag in `.env` or include it in automated preflights.

The login session is reused for authenticated checks through `shared/auth/session.ts`. Credentials come only from local `.env`: `SCRM_COMPANY`, `SCRM_USERNAME`, and `SCRM_PASSWORD`. Production CRM remains read-only and untested.
