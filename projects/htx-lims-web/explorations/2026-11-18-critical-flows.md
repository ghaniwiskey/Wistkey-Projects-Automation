# Exploration 2026-11-18: critical flows of HTX LIMS web

- **Charter:** Tour every HTX LIMS web page as Administrator and User to map the critical flows and turn them into test cases.
- **Env:** staging (UAT, https://htx.eastus.cloudapp.azure.com:5001/), read-only (`allowWrites: false`).
- **Accounts:** ADMIN (Administrator), USER1 (User); USER2 login only.
- **Tester:** Aside. About 25 minutes.

## Coverage

All 38 pages of the menu opened as ADMIN (Dashboard; Inventory: Chemical Usage, Item Information; Registration: Item Register, Asset Tag Printing; Purchase Order: PO Creation, PO Management; Check In / Out: Printed, Tagged Not Checked In, Count Item, Check In, Check Out; Stock Take: Create, List; Gantry: Log, Authorized, Unauthorized, Whitelist, Setup; Report: 10 reports, Alert History, Audit Trail; Master Data: Item Category, Item Type, Storage Location; System: User Management; My Account). As USER1: the menu and 13 pages by address. Nothing was submitted, approved, acknowledged, printed or deleted.

The item lifecycle and page map went to [context.md](../context.md).

## Findings

| # | Type | Finding | Link |
|---|---|---|---|
| 1 | question | The User role sees Approve, Edit and Delete on every PO (also the administrator's), and Approve shows on POs that are already APPROVED | [Q-001](../questions/Q-001-may-the-user-role-approve-and-delete.md) |
| 2 | ok | User-role pages outside its menu are blocked by URL ("You're Not Authorized!") | HLW-006 |

## Cases written

HLW-002..HLW-030 (29): auth (002-004), access (005-006), purchase-order (007-009), registration (010-012), tag-printing (013), check-in-out (014-017), stocktake (018-019), alerts (020-022), inventory (023-024), reports (025-027), master-data (028-029), users (030). Executed by hand: HLW-002, HLW-005, HLW-006 (all pass).

## QA data left behind

None.
