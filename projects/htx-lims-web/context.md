# HTX LIMS Web: how the app behaves

## Item lifecycle (the critical flow)

Each item (one RFID tag per unit) moves through these states; the pages and cases for each step:

| Step | Where | Item status after | Cases |
|---|---|---|---|
| 1. Purchase order | Purchase Order > PO Creation, PO Management (Approve, Edit, Delete) | - | HLW-007..009 |
| 2. Register | Registration > Item Register (category, type, description, Number of units = one item per unit; optional PO, lot, expiry, CoA PDF) | NOT PRE CHECK IN | HLW-010..012 |
| 3. Print RFID tag | Registration > Asset Tag Printing (printer, label size; print new / reprint) -> Check In / Out > Printed | NOT PRE CHECK IN, tag printed | HLW-013 |
| 4. Pre check-in | handheld app (htx-lims-mobile, Pre Check-in "Store · tag new items") -> Check In / Out > Tagged Not Checked In | NOT CHECKED IN | mobile |
| 5. Check in | Check In / Out > Check In (web, per row) or the app's Check-in | IN | HLW-014 |
| 6. Check out | Check In / Out > Check Out: tick items, Purpose Loan (Due Date required; may pass the exit gantry) / For use / No return, optional new Storage Location, Remarks | OUT | HLW-015..017 |
| 7. Gantry | RFID gantries (Gantry Setup: IP, location, Exit Gantry flag). Authorized Log / Unauthorized Log / Gantry Log; Gantry Whitelist items pass | - | HLW-021, 022 |
| 8. Alerts | Dashboard "Alerts requiring acknowledgement": Unauthorized removal, Expiring, Expired, Low stock (stock <= item type Min). Acknowledge; Report > Alert History | - | HLW-020 |
| 9. Stock take | Stock Take > Create Stock Take (search by location/type, move items to Selected, title, proposed dates) -> Stock Take List (Draft, In Progress, Completed, Aborted; Show, Edit); scanned on the handheld | - | HLW-018, 019 |
| 10. Reports | Stock Level (Low flag), Received & Utilised, Transactions, Expiry (within N days), Check In Out, Loan Out, Stock Take Progress, Stock Take, Alert History, Audit Trail | - | HLW-019, 023..027 |

Master Data (Item Category: 4 built-in categories Asset, Chemical, Consumable, Fixed Asset with Min. check-out unit; Item Type with Min/Max stock; Storage Location) and System > User Management (roles Administrator, User; "Extra permissions") feed the lists above (HLW-028..030). Inventory > Chemical Usage orders chemicals first expiry, first use (HLW-024).

## Roles

- **Administrator**: everything.
- **User**: Dashboard, Inventory, Registration, Purchase Order, Check In / Out, Gantry > Gantry Log, My Account. Other pages opened by URL show "You're Not Authorized! Your account does not have access to this page." (HLW-005, 006). The User role still sees Approve / Edit / Delete on every PO (Q-001).

## UI behavior

- Blazor Server with Radzen components: pages render the heading first and show "Loading..." while the data loads (a few seconds); wait for the grid or the form, not for network idle (the SignalR connection stays open).
- Grids: Search / Reset / Refresh, "1 - 10 Total N" paging, column filter menus (Contains, Equal...), Export and Columns on reports.
- Radzen dropdowns are textboxes with placeholder "Please select ..."; the options open as a list below (e.g. Check Out Purpose: Loan, For use, No return).
- Log out: the unnamed user button at the top of the main area opens a panel (name, Role, Account, Log Out).
- The UAT certificate is self-signed (project.yaml `ignoreHTTPSErrors`).

## Test data

Shared UAT data (items, POs, stock takes, open alerts) is used by others: tests find records at runtime and create their own with a `QA` prefix. There is no Delete on Storage Location, and acknowledging alerts is permanent.
