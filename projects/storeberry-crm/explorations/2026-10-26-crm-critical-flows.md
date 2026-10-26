---
project: storeberry-crm
env: staging
charter: "Exercise a few critical Storeberry Flower CRM journeys on staging, using controlled temporary product data and read-only checks elsewhere, to find high-impact defects."
date: 2026-10-26
timebox: targeted
status: done
---

## Scope
- In scope: CRM sign-in, product create/update/terminate, last-12-month order status filtering, customer search.
- Out of scope: production CRM, editing customer records, order payment/refund/cancellation, checkout, and sending external messages.

## Coverage notes
- Root redirected to `/auth/login`; the sign-in form showed company, username/email, password, and LOGIN controls. The dedicated staging account reached the CRM Get Started workspace.
- Orders: default date range was Last 12 Months. The list first displayed a loading state, then 1,012 orders. Selecting Pending payment reduced the displayed count to 203; visible order status labels matched the selected filter. Counts are observations for 2026-10-26, not test constants. No orders were changed.
- Customers: the list loaded with 320 records and separate member and remark search fields. A unique no-match query returned a count of zero. No customer records were changed or retained in notes.
- Products: created one unique hidden physical product using the existing General category and HKD 1.00, confirmed the saved hidden setting and price, renamed it, then terminated it through “Make product terminated in all platforms.” Active count returned to 85 and terminated count rose to 84. The temporary product is not active. No order was created.
- No application defect was confirmed in this targeted pass. Customer details were intentionally excluded from notes and assertions.

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | risk | Order and customer screens contain personal details; automated checks should assert counts/statuses without including record data in reports. | - | - |
| 2 | risk | The order list has an asynchronous loading state; tests should wait on the list/count rather than use fixed delays. | - | - |

## New test ideas
- [x] SCRM-001: CRM login page loads with sign-in controls (P0, smoke).
- [x] SCRM-002: Create, update and terminate a hidden CRM product (P0, regression, writes, final; staging only; run/retry requires explicit approval).
- [x] SCRM-003: Pending payment filter shows matching CRM orders (P1, regression; read-only).
- [x] SCRM-004: CRM customer list loads with search controls and no-match behavior (P1, regression; read-only).
- [x] SCRM-005: Store admin signs in to Storeberry Flower CRM (P0, smoke; staging only).

## Knowledge updates
- CRM root redirects to `/auth/login`; a successful login opens `/get-start`.
- The category picker is a custom tree-select with an unlabeled textbox. General was available during exploration; select an existing option rather than typing free text.
- Product creation requires a category. A unique product persisted as Hidden Product after save/edit; the form describes this type as not viewable online but still purchasable. No order was created. Terminate it from the active product list to remove it from active products.
- Orders default to the last 12 months and may show “Please wait...” before the count is ready. Keep order counts dynamic.
- Customer search submits with Enter. Use a unique no-match query to verify zero results without inspecting customer data.
- Production CRM remains untested.
