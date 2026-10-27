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

## Course flow (explored 2026-10-27)

- Course creation currently loses the selected Category when switching from Info to Session & Timetable; Save then says `Please select a category!` (BUG-015; SCRM-090).
- QA timetable ID 70 (`QA Course Flow 2026-10-27`) was created for a controlled course test. It is active, capacity 1, Wednesday 14:00–15:00, and not yet linked to a course. Remove it after successful retest if no longer needed.
- Details and evidence: `explorations/2026-10-27-course-flow/README.md`.

## Web POS and order lifecycle (explored 2026-10-27)

- Web POS: Physical Stores POS > Use (`/webpos?store_id=<id>`). It has no accessibility tree; use DOM text clicks, `button.remove-item-btn`, `.swal2-popup button`, CSS-pixel coordinates.
- Select a cash drawer first (POS menu > Settings > Cash In Out); it is stored only in localStorage `cashDrawerConfig`. Without it Total does nothing (BUG-014).
- POS tender for tests: Cash only (user, 2026-10-27). Storeberry HK sells from warehouse TEST12; 偈油x10 is untracked and quota (needs a customer).
- Refund/Void are under order detail Actions. Both reset Delivery Status to Pending on POS sales (BUG-012). Refund is also offered on unpaid orders and does nothing (BUG-013). Unpaid orders are cancelled with Void.
- Notes: `explorations/2026-10-27-pos-order-lifecycle.md`.

## Fulfilment, exchange, Add Order, PO receive (explored 2026-10-27, afternoon)

- BUG-009 verified: receipt Accept works (detail and bulk). Points are awarded at payment acceptance, not at completion.
- Fulfilment: order detail > Delivery > Pack All > Save > Dispatch > OK completes a pickup order and deducts stock (DELIVERED). Dispatch with nothing packed and over-qty Save are silently ignored (BUG-018).
- Exchange / Partial Return opens the POS inside `iframe.webpos-iframe` on the order page (`webpos?exchange_txn_key=<order>&store_id=<store>`); snapshot cannot see it. Drive it through `document.querySelector('iframe.webpos-iframe').contentDocument`. Points deduction on exchange is wrong (BUG-017).
- Add Order > Add Online Store Order via WebPOS opens a new POS tab (store_id=1). Shipping is mandatory and currently always fails with check-shipping 500 (BUG-016). Aside's screenshot of a popup tab times out unless `page.bringToFront()` is called first.
- Purchase order form: selecting the Supplier also filters the product picker to that supplier; reset the picker filter to All Suppliers before choosing products. Supplier/Warehouse are select2: click the combobox, then `.select2-results__option`. Receive qty is capped at the outstanding qty.
- Another tester uses the same `ghani` staff account; identify our records by order/lot number, not staff name.
- Notes: `explorations/2026-10-27-fulfilment-stock.md`.

## Stock movement and payment rejection (explored 2026-10-27, evening)

- Transfer: Add Transfer Order > Submit > Confirm (Pending, source available reserved) > Transfer > OK (In-transit) > turn on the row toggle or Received All > Receive > OK (Received). Receive with no toggle does nothing (BUG-019). There is no receive-qty input.
- Replenish: "Approve and Create Transfer Order" opens a prefilled transfer form (`transfer-create?replenish_request_id=<id>`); the request turns Approved only after that form is submitted and confirmed.
- Inventory: `inventory?view_mode=variants&warehouse_id=<id>&search_str=<name>`; TaiPo Warehouse is warehouse_id 12.
- Payment review reject: order detail > Receipt tab > comment > Deny > OK -> Payment Rejected; the comment reaches the customer's Order Tracking.
- Another tester (jacky) moves the same products at the same time; reconcile stock by transfer number in Inventory History, not by totals alone.
- Notes: `explorations/2026-10-27-stock-movement.md`.
- Appointments (2026-10-27): CRM appointment pages call cmsapiv2.storeberry.ai and currently get 403 (BUG-022). Customer booking is on the eShop at `/appointment` (resource 3 "Course").
- Loyalty cash dollar: 100 points = $100, max $100 per order; voiding the order returns the points.
- Courses & Enrolment > Status List: the Details/Order links wrap over two lines; click the link text (not the centre of the box) or call element.click(). Details = /bookings/bookings-detail?id=<enrolment>.
