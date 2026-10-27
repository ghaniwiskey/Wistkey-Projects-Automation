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

## Exploration 2026-10-27

- Customer CRUD verified with a QA member (create, validate, edit, delete); birthday validation bug filed (BUG-001). In the customer list, count `input.item_checkbox` for selected rows (hidden column toggles are also checked).
- Product Actions > "Make product terminated in all platforms" runs without confirmation (BUG-003); select one row only.
- Left on staging: member MEMy001164525 and order TXN0126102700002 (Pending Payment, Bank Transfer, HKD 400) placed from the eShop with user approval; terminated product 3199.
- Notes: `explorations/2026-10-27-crm-eshop-critical.md`.

## Testing permissions (user, 2026-10-27)

Staging only. Production is read-only.
- Allowed without asking each time, on our own QA data: create, edit, submit/confirm, cancel and delete; placing eShop orders.
- Payment: **Bank Transfer only** (`fn-bank-transfer`). Never card, wallet or other gateways.
- Test data can use normal, realistic names; no QA prefix or special email format is required.
- Also allowed: refunds, voids and cancellations of orders; stock-changing steps (PO Receive, transfer ship/receive, replenish approve, stock-take completion); in-store POS sales; actions that send messages or notifications to customers (WhatsApp/SMS/Messenger/email).
- Ask first: changes to other people's records, bulk/Select All actions on data we did not create, and settings or staff mapping changes.

## Web POS and order lifecycle (explored 2026-10-27)

- Web POS: Physical Stores POS > Use (`/webpos?store_id=<id>`). It has no accessibility tree; use DOM text clicks, `button.remove-item-btn`, `.swal2-popup button`, CSS-pixel coordinates.
- Select a cash drawer first (POS menu > Settings > Cash In Out); it is stored only in localStorage `cashDrawerConfig`. Without it Total does nothing (BUG-014).
- POS tender for tests: Cash only (user, 2026-10-27). Storeberry HK sells from warehouse TEST12; 偈油x10 is untracked and quota (needs a customer).
- Refund/Void are under order detail Actions. Both reset Delivery Status to Pending on POS sales (BUG-012). Refund is also offered on unpaid orders and does nothing (BUG-013). Unpaid orders are cancelled with Void.
- Notes: `explorations/2026-10-27-pos-order-lifecycle.md`.
