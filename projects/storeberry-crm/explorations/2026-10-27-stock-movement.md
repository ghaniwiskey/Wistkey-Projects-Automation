---
project: storeberry-crm
env: staging
charter: "Explore the uncovered P0 stock flows (inventory by warehouse/variant, transfer ship/receive, replenish approve) and payment-review rejection with boundary inputs and stock reconciliation to discover silent failures and stock drift."
date: 2026-10-27
timebox: 30m
status: done
---

## Scope
- In scope: Inventory (View by Variants, warehouse filter), Transfer Orders (create, ship, receive), Replenish Request (create, approve, linked transfer), Inventory History, order Receipt Deny (SCRM-022, 028, 029, 049).
- Out of scope: Stock Take (blocked, Q-008: no warehouse assignees; mapping staff needs the user's OK), card/wallet payments, other people's records.
- eShop half (guest order used for the rejection): `projects/storeberry-compare/explorations/2026-10-27-cart-payment-review.md`.

## Coverage notes
- Inventory (SCRM-022, read-only): View by Variants for test product EN 1 lists 9 variants with Available/Stock/Pre-order and one column per warehouse. Variant sums reconcile with the product row (available 77, stock 84, Office 22, TaiPo 34, TEST12 20). Warehouse button TaiPo (`warehouse_id=12`) switches the three totals to TaiPo (large-blue 35/39) without touching stock. Data still has negative per-warehouse available values (large-red TaiPo -1, Sample promo group a -1).
- Transfer (SCRM-028): QA-TO-mvqhvu1l (id 308), custom number accepted. Same From/To -> "From warehouse and to warehouse cannot be the same." Office -> TaiPo, product test 2 x2: Submit > Confirm -> Pending, Office available 48 -> 46. Transfer > OK -> In-transit (Office stock 46). Receive > OK with no row toggle -> POST /inventory/transfer-receive 200, nothing changes, no message (twice) -> BUG-019. With the row toggle on -> Received, TaiPo 7/6 -> 9/8. Inventory History: PENDING_TRANSFER -2 / IN_TRANSIT -2 / TRANSFERRED -2 / TRANSFER_RECEIVED +2, all linked to the transfer. Another tester (jacky) moved product test 2 out of Office at the same minute; check the history rows by transfer number before reconciling.
- Replenish (SCRM-029): QA-RR-mvqi08o1 (id 155), Office -> TaiPo, product test 2. Qty 999 against 45 available reaches the Confirm dialog with no warning (not confirmed; noted on BUG-007). Created with qty 1 -> Awaiting. "Approve and Create Transfer Order" opens a prefilled Add Transfer Order form (`transfer-create?replenish_request_id=155`); after Submit > Confirm the request is Approved with linked Transfer26102709445029e9 (id 310). Shipped and received it: request shows Transfer order status Received, TaiPo 10/9. Detail times still UTC while the list shows HKT (BUG-006).
- Payment-review rejection (SCRM-049): guest order TXN0126102700016 (Bank Transfer HKD 0.10, receipt uploaded) -> Receipt tab > comment > Deny > "change order status to REJECTED?" OK -> Order Status Payment Rejected, Payment Status Pending payment, Status History "Rejected" with the comment. The guest sees REJECTED and the comment in Order Tracking and can Replace the receipt.
- Heuristics: boundaries (same warehouse, qty above available, receive nothing), interrupted flow (receive before toggling), cross-module reconciliation (transfer -> inventory -> history; CRM -> eShop tracking), concurrent users on the shared account.

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | Transfer Receive with no product toggled silently does nothing (server 200, no message) | minor | bugs/BUG-019-transfer-receive-with-no-product.md |
| 2 | bug | Replenish/transfer create accepts qty 999 against 45 available up to Confirm (creation path of BUG-007) | major | bugs/BUG-007-transfer-order-can-reserve-more-stock.md |
| 3 | bug | Replenish detail times still in UTC (BUG-006 still open) | minor | bugs/BUG-006-replenish-request-times-are-shown-in.md |
| 4 | risk | Receive has no quantity input: partial receipt is only per product row, not per unit | - | - |
| 5 | risk | NAKAJIMA cake sells at HKD 0.10 with avg. cost HKD 36.49 (shown in order detail); test data, but margin reports will be skewed | - | - |

## New test ideas
- [x] SCRM-094: Receive with no product toggled tells staff to select items (P2, regression, writes) - created, fails (BUG-019).
- [ ] Cancel an In-transit transfer and check stock returns to the source (P1, regression, writes).
- [ ] Transfer with two products, receive one row only -> Partial Received, stock moves for that row only (P1, regression, writes).

## Knowledge updates
- README: transfer/replenish flow notes (row toggle before Receive, approve opens a prefilled transfer form, warehouse_id=12 is TaiPo).
- `page.screenshot()` in Aside times out on long CRM pages unless `type: 'jpeg'` and a longer timeout are used; save with `fs.writeFile` (the `path` option must stay inside the session dir).
- QA data left: transfers 308 and 310 (Received), replenish 155 (Approved), product test 2 +3 at TaiPo / -3 at Office; guest order TXN0126102700016 (Payment Rejected).

## Follow-up: stock take setup (user approved mapping the test account to one warehouse)
- Mapping lives in Inventory > Warehouses > Edit > Warehouse Users > Save Users (POST /inventory/update-warehouse-users). Mapped ghani (158) to TaiPo Warehouse: "Warehouse users saved.", mapped_user_ids [158].
- The panel never shows existing users: "error exist!" toast and an empty field, because get-warehouse-detail returns mapped_user_ids as a serialized PHP collection object. Save Users replaces the whole list, so saving from the panel can wipe existing users -> BUG-020 (SCRM-095). The previous TaiPo list is unknown for this reason.
- ghani was already mapped to Causeway Bay, IFC WH, IFC Warehouse, EXPO, HKTVMALL, HOME and B. Still, POST /stock-take/get-warehouse-assignees returns users [] for every warehouse, including Causeway Bay where jacky (116, Stock Take Staff + Admin roles) is mapped. The assignee list probably depends on the logged-in user's Stock Take role; ghani cannot edit its own staff record (Access Denied). SCRM-030 stays blocked (Q-008 updated).
- Staff Account > user edit has "Stock Take Staff" / "Stock Take Admin" roles and "Assigned Warehouses".
- The CRM UI switched to Simplified Chinese once mid-session without us changing it (shared account, likely the other tester); switched back with /switchLang?lang=en.
- Retest after the user gave ghani Stock Take Staff + Stock Take Admin: still users [] for every warehouse, also after log out / log in. Read-only check of mapped users: jacky (116) has Stock Take Staff + Admin and Causeway Bay in both his user record and Warehouse Users, yet is not listed either. Filed BUG-021 (critical), SCRM-030 recorded as fail, Q-008 closed.

## Round 3: appointments, loyalty redemption, promotions (18:20-18:45 HKT)
- Course enrollment (SCRM-063) skipped: still needs a new course (BUG-015 open); the on-sale courses have no enrolment path in the CRM.
- Appointments: every CRM appointment page is empty; all cmsapiv2.storeberry.ai/cmsapi/appointment/* calls return 403 code 2208 "page session expired", also after a fresh login -> BUG-022 (critical). The eShop "booking" menu (/appointment) works: resource 3 "Course", service Thai 30 min HKD 200, 2026-10-29 14:00 booked as a guest (no payment step), validation messages fine, overlapping slots (13:45/14:00/14:15) disappear afterwards. Reschedule/cancel (SCRM-060/061) cannot be done without the CRM; SCRM-062 seen only from the eShop side (not recorded). Risk: the "Add to Google Calendar" link has no time zone (dates=20261029T140000/...), so it shows the wrong time for non-HK calendars; copy "Google Canlendar".
- Loyalty (SCRM-066): new member MEMy001164526, 500 points; 100 points = $100, max $100/order (150 clamps to 100). Bank Transfer order TXN0126102700019 total 600 after -$300 basket and -$100 cash dollar; points 400. Void in CRM returned the 100 points.
- Promotions (SCRM-035/036): VIP888 on C applies 606 (-$20 each) + 605 (-$20 order), not 607 (20%) -> storeberry-compare Q-008. Free gift 631 offered only at net >= $800 and removed with the qualifying item. Stale add-on after removing an item -> storeberry-compare BUG-013.
- QA data: appointment 2026-10-29 14:00 (guest Siu Ming Wong), member MEMy001164526 (password not stored), order TXN0126102700019 (Canceled).

## BUG-015 retest (user request, ~18:55 HKT)
- Category (vue-treeselect) kept after switching tabs, both by clicking the option and by typing "Course" + Enter. Courses 3201 (English Class) and 3202 (Demo) saved with category Course and Hidden Product; not visible on the eShop. BUG-015 -> verified, SCRM-090 pass.
- The timetable picker hides timetables already linked to a course (English Class disappeared after 3201 used it); QA timetable 70 was never offered.
- Courses list Actions > Terminate Course runs with no confirmation (same pattern as BUG-003 for products). 3202 terminated; 3201 kept for SCRM-063.

## SCRM-063 enrolment (user approved, ~19:00 HKT)
- Hidden course 3201 redirects to the eShop home page, so the sale was done in Web POS (Storeberry HK, member MEMy001164526, Cash). With timetable English Class (capacity 0) checkout was refused with "該課程沒有足夠的容量。" (Traditional Chinese only, UI in English; seen once). Switched 3201 to Sat Horse Class (capacity 30, not shared): TXN1126102700005 Complete, enrolment 388, session 2026-10-31 15:00-16:00, day view 1 / 30, visible in the member's My Courses & Enrolment.
- The HKD 0 sale upgraded the member to Level 2 (+100 Upgrade Reward, Level 2 threshold is $0) and moved point expiry from 2026-11-26 to 2027-10-26.
- In the course edit page the timetable picker also lists names that look like terminated timetables (英語課程, Thai); there are active timetables with the same names, not investigated.
- QA data: course 3201 now on Sat Horse Class with 1 enrolment (31 Oct 15:00).
