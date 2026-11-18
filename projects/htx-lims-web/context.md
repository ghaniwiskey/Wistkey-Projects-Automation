# HTX LIMS Web: how the app behaves

## Item lifecycle (the critical flow)

Source: the user's workflow document "HTX LIMS Workflow" (2026-11-18). Gantry details and the API: [context/gantry.md](context/gantry.md).

Each item (one RFID tag per unit) moves through these states; the pages and cases for each step:

| Step | Where | Item status after | Cases |
|---|---|---|---|
| 1. Purchase order | Purchase Order > PO Creation, PO Management (Approve, Edit, Delete) | - | HLW-007..009 |
| 2. Register | Registration > Item Register (category, type, description, Number of units = one item per unit; optional PO, lot, expiry, CoA PDF) | NOT PRE CHECK IN | HLW-010..012 |
| 3. Print RFID tag | Registration > Asset Tag Printing (printer, label size; print new / reprint) -> Check In / Out > Printed | NOT PRE CHECK IN, tag printed | HLW-013 |
| 4. Stick the tag on the item | physical: Paper (box tag) 73x20 for cartons/consumables, Metal 50x15 for assets, Anti-Liquid 46x40 for chemicals (By category picks these), Jewelry and 60x25 by hand | | HLW-038 |
| 5. Pre check-in | handheld (PUT api/raid/mobile/singleregister); can complete empty fields (lot, expiry, CAS) -> Check In / Out > Tagged Not Checked In | NOT CHECKED IN | mobile |
| 6. Count | handheld (PUT api/raid/mobile/countitem) at the receiving point -> Check In / Out > Count Item; from now on gantries record the item | NOT CHECKED IN | mobile |
| 7. In through gantry 1a | gantry: logged NOT CHECKED IN, location Airlock 1, no alert | NOT CHECKED IN | HLW-032 |
| 8. Check in | Check In / Out > Check In (web) or the app (mobile/singlecheckin, location code required); no PO needed. Counted in stock, expiry alerts apply | IN | HLW-014 |
| 9. Moves between rooms | inner gantries 1b, 2a, 2b, 3a set the location, never the status | IN | HLW-031 |
| 10. Check out | Check In / Out > Check Out (or PUT api/raid/mobile/checkout): Loan (due date required, not in the past; Loan record; whitelisted; stock unchanged), For use (not whitelisted; stock down), No return (whitelisted; stock down). FEFO for chemicals/consumables: expired refused, other order only warns. One failing item = nothing saved | OUT | HLW-015..017, 033, 040..044 |
| 11. Exit gantry 1a / 3b | whitelisted (Loan, No return) pass with no alert; anything else (For use, IN without check-out) = Unauthorized removal alert with a sound + Unauthorized Log | OUT / IN | HLW-021, 022 |
| 12. Loan comes back | pre check-in, count, gantry 1a, check in again (no new tag, no Return purpose); leaves the whitelist | IN | HLW-034 |
| Alerts | Dashboard "Alerts requiring acknowledgement" (checked every minute): Unauthorized removal, Expiring (IN, within 30 days), Expired, Low / High stock (item type stock <= Min / >= Max). Acknowledge records who and when; Report > Alert History | - | HLW-020, 045, 046 |
| 9. Stock take | Stock Take > Create Stock Take (search by location/type, move items to Selected, title, proposed dates) -> Stock Take List (Draft, In Progress, Completed, Aborted; Show, Edit); scanned on the handheld | - | HLW-018, 019 |
| 10. Reports | Stock Level (Low flag), Received & Utilised, Transactions, Expiry (within N days), Check In Out, Loan Out, Stock Take Progress, Stock Take, Alert History, Audit Trail | - | HLW-019, 023..027 |

Statuses: NOT PRE CHECK IN (registered, steps 2-4), NOT CHECKED IN (5-7), IN (8), OUT (10), DISPOSED (Stock Adjustment, out of stock and tracking; no Stock Adjustment page in the menu: Q-004). Stock per item type = IN + OUT on Loan. Item Number = category ID (3 digits) + running number (6), e.g. 003000002 (HLW-035); printing gives a 24-digit chip code, a reprint a new one (old tag dead, HLW-039); an item can be deleted only until its tag is printed (HLW-037). CAS number is required for chemicals (HLW-036).

Master Data (Item Category: 4 built-in categories Asset, Chemical, Consumable, Fixed Asset with Min. check-out unit; Item Type with Min/Max stock; Storage Location) and System > User Management (roles Administrator, User; "Extra permissions") feed the lists above (HLW-028..030). Inventory > Chemical Usage orders chemicals first expiry, first use (HLW-024).

## Roles

- **Administrator**: everything.
- **User**: Dashboard, Inventory, Registration, Purchase Order, Check In / Out, Gantry > Gantry Log, My Account. Other pages opened by URL show "You're Not Authorized! Your account does not have access to this page." (HLW-005, 006). The User role still sees Approve / Edit / Delete on every PO (Q-001).

## Behavior seen in testing

- PO Creation: a new PO is APPROVED at once (no approval step). PO Location is its own list (00001 Location 1, 00002 HTX Store Room, 00003 Lab Room), not the storage locations.
- Item Register: success message "<n> item(s) registered with Item Number <first> – <last>"; unprinted items show Edit + Delete (Delete with no confirmation, BUG-003), printed ones Edit only. Chemicals also require lot, production / delivery / expiry date and CAS number; consumables lot and the three dates.
- Item category IDs: Asset 1, Consumable 2, Chemical 3, Fixed Asset 4 (the item number prefix).
- Check Out: confirmation dialog "Check out <n> item(s) - purpose: <p>?"; success "Checked out <n> item(s) - Loan, loan no <n>, due <date>: <numbers>". Expired items are refused before the confirmation ("These items are expired and cannot be checked out: ..."). Past due dates are disabled in the picker. The selection is lost on search or page change.
- Web Check In lists OUT items and checks one in at once: "Successfully Manual Check-In Selected Item", no confirmation, no location (Q-006); it leaves the item whitelisted (BUG-001) and writes no audit entry (BUG-002).
- Item Type: Min. stock defaults to 1, and a type with 0 items would then raise a Low stock alert: leave Min empty for QA types.
- Create Stock Take: pick the Storage Location, Search, tick items, Move to Selected, then tick them again under Selected Items (BUG-007). An item already in a stock take with an overlapping period is refused ("Can't submit item that already exists on the same period"), so QA stock takes use a future period. Show > Commence / Complete / Abort; completing unscanned items marks them NOT FOUND (stock adjustment), so abort QA stock takes.
- Add User: pick Role in its dropdown even when it shows User, or Save does nothing (BUG-006). Password: 6+ characters with upper, lower, digit and symbol.
- Dashboard Acknowledge currently does nothing (BUG-005). Asset Tag Printing on UAT: use printer "test" (user). Print: "<n> tag(s) sent to the printer: <numbers>."; each print issues a chip code (Audit "Tag code issued"); a reprint issues a new one, the old code no longer resolves (GET /api/Item/byencodedrfid -> 404; GET /api/Item/{id}/encodedtaghistory). The tag type used is not shown anywhere in the web.
- Audit Trail: logins (API logins show as "Login Handheld"), failed logins, item registered / number assigned / deleted, check-outs (no workstation IP), stock adjustments, handheld stock take scans.

## UI behavior

- Blazor Server with Radzen components: pages render the heading first and show "Loading..." while the data loads (a few seconds); wait for the grid or the form, not for network idle (the SignalR connection stays open).
- Grids: Search / Reset / Refresh, "1 - 10 Total N" paging, column filter menus (Contains, Equal...), Export and Columns on reports.
- Radzen dropdowns are textboxes with placeholder "Please select ..."; the options open as a list below (e.g. Check Out Purpose: Loan, For use, No return).
- Date fields are read-only BootstrapBlazor pickers: click the field (sometimes twice) until a `.popover.show` calendar opens, use Next Month / Prev Month, click the day (`table.date-table span.cell`). Typing is not possible.
- Multi-selects (PO Location, Item Type on PO Creation) show "Select items ..." and open a checkbox list.
- Text typed with Playwright `fill()` on PO Creation was only taken after the field lost focus: check the saved values, not only the success message.
- Log out: the unnamed user button at the top of the main area opens a panel (name, Role, Account, Log Out).
- The UAT certificate is self-signed (project.yaml `ignoreHTTPSErrors`).

## Test data

Shared UAT data (items, POs, stock takes, open alerts) is used by others: tests find records at runtime and create their own with a `QA` prefix. Storage locations, item types, users and unprinted items have Delete; acknowledging alerts is permanent. The user allows irreversible test steps on UAT (README > Testing permissions).
