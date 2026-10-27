---
project: storeberry-crm
env: staging
charter: "Explore critical CRM flows (customer CRUD, order list/detail, product create/edit/terminate, promotions read-only) with QA-only data and boundary inputs to find high-impact defects."
date: 2026-10-27
timebox: 45m
status: done
---

## Scope
- In scope: staging CRM login, Customers (create, validate, edit, search, delete), Orders (list, detail, read-only), Products (create, price validation, edit, terminate), Promotions (read-only lookup of VIP888).
- Out of scope: production, real customer records, order status changes (approve/refund/cancel), emails to real addresses.
- eShop half of this session: `projects/storeberry-compare/explorations/2026-10-27-eshop-critical.md`.

## Coverage notes
- Login: wrong password shows "Password incorrect, 3 attempts remaining." (lockout exists; only one wrong attempt made). Correct login opens /get-start.
- Customers: empty Save -> "The First Name is required. The Language Perference is required." (Email error only appears after First Name passes: errors come in stages). Invalid email and mismatched password both reported. Created QA member MEMy001164524 (aside.qamvq1nfsl@example.com, opt-in No); list 321 -> 322, 500 "Register Reward" points. Edit: name, level 2 and mobile saved; letters in mobile rejected ("The Mobile must be a number." / "at least 6."). Birthday boundary: 05-15 saved; 13-45 and 02-30 silently saved as 10-27 (today) -> BUG-001. Duplicate email (uppercase variant) rejected: "The email is already registered." Delete with only the row ticked (18 other checked boxes are hidden column toggles) asked for confirmation and removed exactly that member (search -> 0).
- Orders: list 1,025 (last 12 months). 1 of 100 rows shows "Invalid date" in the paid-date column: an HKD 0.00 order fully paid by eGift -> BUG-002. 4 of 100 rows show negative available stock "(-1 / 0)" (data, noted as risk). Order detail of that order reconciled (eGift $200 covers the $200 item).
- Products: negatives typed into price fields are reset to 0; a HKD 0.00 Hidden product saved with no warning (product 3199) -> question (SCRM-057). Edited price to 1.00 (persisted), then terminated via Actions; this runs with no confirmation -> BUG-003. Active 88 -> 87, terminated 82 -> 83.
- Promotions: VIP888 maps to 3 promotions; #605 is a whole-order HKD 20 off with no minimum, so the eShop HKD 20 -> 0 total was correct.
- Order created from the eShop (TXN0126102700002, member MEMy001164525) checked here: Pending Payment, Bank Transfer HKD 400.00, 門市自取 荔枝角, items and remark match.

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | Impossible birthday (02-30, 13-45) silently saved as today's date | major | bugs/BUG-001-invalid-customer-birthday-is-silently.md |
| 2 | bug | Order list shows "Invalid date" paid date for an eGift-paid HKD 0 order | minor | bugs/BUG-002-order-list-shows-invalid-date-as-paid.md |
| 3 | bug | "Make product terminated in all platforms" has no confirmation | minor | bugs/BUG-003-bulk-make-product-terminated-in-all.md |
| 4 | bug | Copy/label errors: "Perference", "plaform", Original Price named "Cost" | trivial | bugs/BUG-004-crm-copy-and-label-errors-on-customer.md |
| 5 | question | Should a HKD 0.00 product be savable (free gifts) or rejected (SCRM-057)? | - | - |
| 6 | question | Points expiry: CRM-created member 2027-10-26 (1 year) vs eShop-registered member 2026-11-26 (1 month). Intended? | - | - |
| 7 | question | Initial Spending shows "0,00" (comma decimal) on Edit but "0" on Create. Locale bug? | - | - |
| 8 | risk | Customer form shows validation in stages (email error only after first name is filled) | - | - |
| 9 | risk | Orders show negative available stock (-1 / 0) | - | - |
| 10 | risk | Many sidebar links (Inventory, Customers, Loyalty...) have an empty accessible name | - | - |

## New test ideas
- [x] SCRM-071 Customer birthday rejects an impossible date (P2, regression, writes)
- [x] SCRM-072 Delete removes only the selected QA customer (P1, regression, writes)
- [x] SCRM-073 Add Customer validates email format and password confirmation (P2, regression)
- [x] SCRM-074 Order list paid date never shows Invalid date (P3, regression)

## Test data left on staging
- Member MEMy001164525 (aside.member.qamvq1nfsl@example.com) and order TXN0126102700002 (Pending Payment, Bank Transfer, HKD 400) placed with user approval. Not cancelled; ask before cancelling (it releases reserved stock).
- Terminated product 3199 ASIDE-CRM-QA-qamvq1nfsl (in the terminated list). Customer MEMy001164524 was deleted.

## Knowledge updates
- Customer list: hidden column-setting checkboxes are also `:checked`; count `input.item_checkbox` for selected rows.
- Customer form fields have accessible names (`*First Name`, `*Email`, `Birthday (MM-DD)`); Save/Back are links.
- Product list Actions menu terminates immediately (no confirm). The Original Price input is named "Cost" (use the second "Cost" textbox).
- Order list Details is a JS link without href; click it, it navigates to /orders/detail?id=<n>.
- Screenshot: `explorations/2026-10-27-crm-eshop-critical/01-birthday-02-30-saved-as-today.png`.
