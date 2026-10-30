# Storeberry Flower CRM: testing context

Current facts by topic (docs/conventions.md > Knowledge files). Session notes, evidence and the QA data each session left on staging: `explorations/`. Bugs and statuses, incl. accepted behavior: `.\qa bugs storeberry-crm`; open questions: `.\qa questions storeberry-crm --open`.

## Login and lists
- The root redirects to `/auth/login`; the staging test account lands on `/get-start`.
- Order and customer lists (Last 12 Months, Pending payment, customers) change daily: never hard-code counts.
- Order list: status tabs filter by `status=`; Exchanged is a separate flag (`exchanged_order=1`) whose rows keep their own status. Product Name / SKU search (`search_product_name`) matches the product name only: the list's "name (option)" text finds nothing. Delivered/POS rows list no items, so check matches in the order detail.

## Products and customers
- On Sale Products = at least one variant with Final Price below Original Price. The list's Promotions column shows the whole-basket promotion on every product, so it says nothing about sales.
- Hidden Product: not viewable online but still purchasable; the setting persists after save/edit. A terminated product leaves the active list and stays in the terminated list.
- Product Actions > "Make product terminated in all platforms" runs without confirmation (BUG-003, accepted): select one row only.
- Customer create, edit and delete work with a QA member; an invalid birthday is silently saved as today (BUG-001, accepted). In the customer list count `input.item_checkbox` for selected rows (the hidden column toggles are checked too).

## Orders, payments and fulfilment
- Refund and Void are under order detail Actions. On POS sales both reset Delivery Status to Pending (BUG-012, accepted). Refund is also offered on unpaid orders and does nothing (BUG-013, accepted). Unpaid orders are cancelled with Void.
- Paid path: the receipt is uploaded on the eShop order's Upload Receipt tab (`input[name=receipt_img]`); CRM order detail > Receipt > Accept > OK (also bulk). Points are awarded at payment acceptance, not at completion: $100 = 10 points (percentage, floored) on the net total; a refund reverses points and level spending.
- Payment review reject: order detail > Receipt tab > comment > Deny > OK -> Payment Rejected; the comment reaches the customer's Order Tracking.
- Fulfilment: order detail > Delivery > Pack All > Save > Dispatch > OK completes a pickup order and deducts stock (DELIVERED). Dispatch with nothing packed and Save with more than the ordered qty are silently ignored (BUG-018, accepted).
- Partial refunds: Actions > Refund this order is full-refund only. Exchange / Partial Return (offered once the order is paid) asks for the store, then opens the POS; select items with `.btn-add-qty` in `.select-exchange-products-view .cart-item`, Next, Cancel the Shipping popup, Exchange & refund, pick the method. Item shares are prorated on the paid total. The refund is a separate linked order (generic "退款 Refund" line + the returned line); the original keeps its total and shows "Exchanged: n". Picking the refund method can complete it without CHECK OUT (SCRM-133). Refund rounding can refund slightly more than the share (BUG-029, accepted); level spending is wrong (BUG-028).
- After a partial return, Refund this order is no longer offered; further refunds go through Exchange / Partial Return, whose Refund pencil (Adjust balance due > Adjust final price, negative value) accepts any amount, even above what was paid (BUG-032, accepted).
- Online Shop warehouses: TaiPo (main) + 半島倉, IFC Warehouse, Office; Storeberry KN POS sells from Office, Storeberry HK from TEST12 (inventory/warehouses-stores). Loyalty levels: Level 2 from - Edit this order on a paid order loses the payment, Level 3 $2000, Level 4 $3000, Level 5 $5000 (carryover).
- Edit this order on a paid order loses the payment: the A order is Pending Payment for its full total, no refund (BUG-027, accepted).
- Exchange / Partial Return opens the POS inside `iframe.webpos-iframe` on the order page (`webpos?exchange_txn_key=<order>&store_id=<store>`); `snapshot` cannot see it, so drive it through `document.querySelector('iframe.webpos-iframe').contentDocument`. The exchange takes back more points than the order earned (BUG-017, accepted).
- Add Order > Add Online Store Order via WebPOS opens a new POS tab (store_id=1). Shipping is mandatory and works since the BUG-016 fix (retested 2026-10-28): member via `#searchMemberInput`, 門市自取 needs Address + store radio, then Total > Bank Transfer > CHECK OUT gives a Pending Payment online order. The POS tab runs at DPR 1.25: divide screenshot pixels by 1.25 for mouse clicks. Aside's screenshot of a popup tab times out unless `page.bringToFront()` is called first.
- Editing an order can change its warehouse, Shipping Store, remark and product-name language (BUG-010, accepted; which warehouse online orders should use: Q-009).

## Web POS
- Physical Stores POS > Use (`/webpos?store_id=<id>`). No accessibility tree: use DOM text clicks, `button.remove-item-btn`, `.swal2-popup button` and CSS-pixel coordinates.
- Select a cash drawer first (POS menu > Settings > Cash In Out); it is stored only in localStorage `cashDrawerConfig`. Without it Total does nothing (BUG-014, accepted).
- Storeberry HK sells from warehouse TEST12; 偈油x10 is untracked and a quota product (needs a customer).
- Promotion code box `input[placeholder="Promotion code"]` + Apply; codes of other shops get "Invalid promotion code.".

## Stock: purchase orders, transfers, replenish, inventory
- Purchase order form: picking the Supplier also filters the product picker to that supplier; reset the picker to All Suppliers before choosing products. Supplier and Warehouse are select2: click the combobox, then `.select2-results__option`. Receive qty is capped at the outstanding qty.
- Transfer: Add Transfer Order > Submit > Confirm (Pending, source available reserved) > Transfer > OK (In-transit) > row toggle or Received All > Receive > OK (Received). Submit is a link (`a.button-save`, not the Cancel one) that opens an inline CONFIRM TRANSFER ORDER panel (Confirm button). Receive with no toggle does nothing (BUG-019, accepted); there is no receive-qty input. "Cancel Transfer" on In-transit returns it to Pending; "Cancel Transfer Orders" then cancels. After a partial receive only Receive is offered (Q-016). Transfer and receive times are overwritten by later actions (BUG-025, accepted).
- Replenish: "Approve and Create Transfer Order" opens a prefilled transfer form (`transfer-create?replenish_request_id=<id>`); the request turns Approved only after that form is submitted and confirmed.
- Inventory: `inventory?view_mode=variants&warehouse_id=<id>&search_str=<name>`; TaiPo Warehouse is warehouse_id 12. Warehouse columns show available qty: an unpaid online order lowers Available and the order's warehouse (TaiPo), not Stock Qty; Void restores them. Reconcile stock by transfer number in Inventory History, not by totals.
- Stock take: Create Job (name, warehouse, mapped assignee, visibility) > choose variants > Review > Create > Start Counting > enter Counted qty > Save manual changes > Submit Count > Approved qty > Save Review Changes > Reconcile (cannot be undone) -> Completed; Inventory History logs it as REPLENISHMENT 'Stock Take #<id> reconciliation'. Open count is ignored: jobs run as Blind count (BUG-030, accepted); Created At is UTC (BUG-031). Cancel Job ends a draft or in-progress job.
- Online Shop stock comes from Office, TaiPo, IFC Warehouse and 半島倉 (labels in the transfer warehouse list). eShop Add To Cart checks that total; checkout checks TaiPo only (storeberry-compare BUG-017).

## Promotions and promo codes
- Add Promotion opens a type picker. Rows are divs (not `<tr>`); actions are icon links (`.fa-pencil` edit -> `/promotions/edit?pid=<id>`, `.fa-trash` delete with a DELETE/CANCEL confirm). Validation errors appear only as a short-lived toast.
- Start/End picker is hourly (typed minutes are dropped, Q-015); an end before the start is accepted and listed as expired (BUG-024, accepted); Y > X is accepted and the eShop caps the discount at the sub-total (Q-014).
- Promo Code types ("Get $Y / Y% off with discount code X") offer Multiple Promotion Code with a quota. Generate, Assign and Revoke work only on the edit page (pencil); on the view page (file icon) the Generate dialog is read-only. Generate: prefix + count (`input[name=gen_code_prefix]`, `gen_code_qty`); over quota -> "Not enough code quota to generate code". Assign takes a Member ID ("Target Member Not found" if unknown). Revoke is immediate, with no confirmation and no undo.
- Used codes record Txn No. and member; voiding the order keeps the code Used (Q-017). Staff Reserved At is in UTC (BUG-026).
- eShop promo box: `#promotion_code` + APPLY at checkout; the discount is re-checked when items are removed.
- Loyalty cash dollar: 100 points = $100, at most $100 per order; voiding the order returns the points.

## Courses, enrolment, appointments
- Course creation keeps the selected Category across the Info and Session & Timetable tabs (SCRM-090). Timetable 70 ("QA Course Flow 2026-10-27", active, capacity 1, not linked to a course) was made for that retest and can be removed when no longer needed.
- Courses & Enrolment > Status List: the Details/Order links wrap over two lines; click the link text (not the centre of the box) or call `element.click()`. Details = `/bookings/bookings-detail?id=<enrolment>`.
- CRM appointment pages call cmsapiv2.storeberry.ai and get 403 (BUG-022). Customers book on the eShop at `/appointment` (resource 3 "Course").

## Customer CSV import
- Customers > Import > Import CSV provides the sample template; New Member List creates an empty list, not the upload workflow.
- The sample includes member level, Initial Spending, Initial Loyalty Point and Initial Loyalty Wallet, but no marketing-consent column. A duplicate mobile is refused with 'The mobile is already registered.'
- Imported base points and Register Reward are separate point-history entries. Do not assume the displayed total equals the imported points alone.
- New-member opt-in defaults and where Initial Spending appears need clarification (Q-020, Q-021). The completion message can claim emails were sent with registration email unchecked; actual sending is unverified (Q-022, SCRM-181).

