---
project: storeberry-crm
env: staging
charter: "Retest BUG-010: Edit this order on a pending Office order with a shipping store and customer remark, and reconcile warehouse stock."
date: 2026-10-28
timebox: 15m
status: done
---

## Scope
- In scope: SCRM-077 / BUG-010 retest (Edit this order, reduce a line, Bank Transfer, replacement order), customer view, inventory.
- Out of scope: paid-order edits (SCRM-120/121), codes and points on edits (SCRM-122/123).

## Coverage notes
- eShop (member MEMy001164526): test product EN 1 large-red x2, Shipping Store Storeberry KN (with Online Shop the line said SOLD OUT although Add To Cart accepted it, same root as storeberry-compare BUG-017), 門市自取, customer remark, Bank Transfer -> TXN0126102700027 (id 11014): Online Shop, Shipping Store Storeberry KN, Warehouse Office, HKD 323.00.
- Inventory (product row) after the order: Available 75, Pre-order 1, Office 20, TaiPo 34.
- Edit this order > Use order creation date: POS in `iframe.webpos-iframe` preselects **TaiPo Warehouse** and shows "test product CN 1". Qty 2 -> 1, Total, Bank Transfer, CHECK OUT, OK -> TXN0126102700027A HKD 161.50. Payment step still shows "Balance due $ -161.50" before a tender and a blank Custom1 tile.
- 027A: Warehouse TaiPo, no Shipping Store, customer remark twice (CRM and eShop), "test product CN 1" (CRM and eShop My Orders), line "Pre-order Qty: 1". Internal remark "原訂單 Original order: TXN0126102700027" correct. 027 Canceled.
- Stock after edit: Available 76, Pre-order 2, Office 22, TaiPo 33. After voiding 027A: Available 77, Pre-order 1, TaiPo 34.

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug (retest) | BUG-010 still open, all symptoms; the moved line becomes a pre-order | major | bugs/BUG-010-editing-an-order-silently-changes-its.md |

## New test ideas
- Already written: SCRM-120 to SCRM-127 (order edit gaps). No new scenario found beyond BUG-010.

## Knowledge updates
- QA data: TXN0126102700027 Canceled (edited), TXN0126102700027A Canceled (voided).
