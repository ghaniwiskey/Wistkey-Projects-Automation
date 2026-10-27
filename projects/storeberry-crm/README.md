# Storeberry Flower CRM

Staff CRM of the Storeberry Flower tenant: products, orders, customers, Web POS, stock, promotions, courses. Guest and member eShop checks: `projects/storeberry-compare/`. App behavior and quirks: `context.md`.

## Environments

- `staging` (default): https://www.stagingl10.storeberry.xyz/ (writes allowed within the permissions below)
- `production`: https://www.mystoreberry.com/ (read-only: never create, edit, terminate or otherwise alter records). Its "Visit my online store" link opens the public eShop https://storeberry-flower.mystoreberry.com/.

Select with `$env:QA_ENV='staging'` or `$env:QA_ENV='production'`.

## Test account

`SCRM_COMPANY`, `SCRM_USERNAME` and `SCRM_PASSWORD` in the local `.env` (the company name is entered with username and password on the CRM login form). Never commit real values. The login session is reused through `shared/auth/session.ts`. Other testers use the same `ghani` staff account and move the same products (e.g. `jacky`): identify our records by order, lot or transfer number, never by staff name or stock totals.

## Testing permissions

Set by the user on 2026-10-27; they apply to storeberry-compare too. Staging only; production is read-only.
- Allowed without asking each time, on our own QA data: create, edit, submit/confirm (forms, transfer orders), cancel and delete (e.g. our QA promotions); placing eShop orders.
- Payment: **Bank Transfer only** (`fn-bank-transfer`); never card, wallet or other gateways. Web POS tender: Cash only.
- Also allowed: refunds, voids and cancellations of orders; stock-changing steps (PO Receive, transfer ship/receive, replenish approve, stock-take completion); in-store POS sales; actions that send messages or notifications to customers (WhatsApp/SMS/Messenger/email).
- Test data can use normal, realistic names; no QA prefix or special email format is required.
- Ask first: changes to other people's records, bulk/Select All actions on data we did not create, settings or staff mapping changes.

## Automation

- SCRM-001 and SCRM-005: sign-in page availability and successful staging login. SCRM-003 and SCRM-004: read-only order-filter and customer-search checks; assertions avoid customer and order details.
- SCRM-002 creates, edits and permanently terminates a test product. It is `@final`: get explicit approval for each run and retry. It skips unless it is specifically targeted with `SCRM_002_RUN_APPROVED=true` set for that process; never store that flag in `.env` or include it in automated preflights.
- Run: `.\qa test --project=storeberry-crm` (staging by default).
