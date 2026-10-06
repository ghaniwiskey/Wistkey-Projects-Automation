# MHA SPF: testing context

Knowledge base for testing this app. Keep it short, factual, and current; update it when tests reveal something new. Selectors live in tests/pages, not here.
Sources: the user manual `docs/user-manual.md` (CR12 onboarding, 21 Sep 2026; screenshots in `docs/images/`) and live checks on staging. Verified live so far: login, Dashboard header, role list, logout (2026-10-05); role switching, Asset Listing search/filter, Asset Details, Assignment list and the Relocate wizard up to the location step (2026-10-06, SPF-002..007). Other pages are from the manual only; confirm paths and locators on first visit.

## Product
- **e-RFID Asset Tracking System (ATS)** for MHA agencies (SPF, HTA, ...). Digitalises the fixed-asset lifecycle: registration (exact Building/Level/Room location, ownership, RFID tag printing), assignment (ownership transfer, relocation), verification (annual FAVE stocktake, ad-hoc stocktake) and retirement/disposal. Web app plus a separate mobile app (stocktakers sight assets with RFID scanners).
- Data flows one-way from **iLMS** (daily file at 0000H, visible next working day): asset master records, new capitalisations, loans, vehicle maintenance (HOVR), retirement/disposal dates, cost-centre transfers. Tests cannot create iLMS assets; they depend on existing UAT data.
- Multi-agency onboarding (CR12): each agency (HTA, SPF) has its own database; the user selects the agency during onboarding/login. SPF shows the SPF logo on the dashboard.

### Roles (manual Table 3)
One login can hold several roles; the active role is switched with the **Role** dropdown at the top right (`docs/images/role-switching.png`). Access rights belong to the role, not the user. Suggested role slugs for `project.yaml > auth.accounts[].roles`:

| Slug | Role (as shown in the Role dropdown) | Short | Level |
|---|---|---|---|
| agency-admin | Agency Administrator ("Agency Admin") | Admin | SPF HQ; 2FA, needs a mobile number |
| hq-ao | HQ Approving Officer | HQ AO | SPF HQ |
| hq-falo | HQ Fixed Asset Liaison Officer | HQ FALO | SPF HQ |
| uao | Unit Approving Officer | UAO | Unit (Commander/Director) |
| uro | Unit Resource Officer | URO | Unit (Dept head) |
| logs1 | Logistics Officer 1 | LOGS1 | Unit |
| falo | Fixed Asset Liaison Officer | FALO | Unit |
| vet-ic | Verification Team IC (VET IC/2IC) | VET IC | Unit, FAVE only |
| stocktaker | Stocktaker | Stocktaker | Unit, FAVE only (mobile) |
| enduser | End User | Enduser | Unit |

Unit hierarchy: UAO > URO > LOGS1 > FALO > End User. In FAVE, VET IC leads the stocktakers. Roles can have validity periods (Role Listing > Periods); a role outside its period is unusable, a likely cause of "role missing" in tests.

### Asset statuses (manual Table 2)
| Stage | Status | Meaning |
|---|---|---|
| Registration | NEW | New in ATS, or transferred in from another HTD |
| Registration | TRANSFER | Moved from one SPF cost centre to another |
| Registration | PROGRESS | Partially registered; FALO must complete the location |
| Registration | REJECTED | Should not be capitalised (can be reinstated) |
| Assignment/Verification | AVAILABLE | Business as usual |
| Assignment/Verification | LOAN | STO loan |
| Assignment/Verification | MAINTENANCE | HOVR (vehicles) |
| Retirement | RETIRED | Retirement date set in iLMS |
| Retirement | DISPOSED | Disposal date reached |

### Critical flows, most important first
1. **Login and role switching**: agency selection (onboarding), username login or WOG SSO; dashboard header shows current role, officer name, last login; switch role from the Role dropdown; logout.
2. **Asset Listing and Asset Details**: search by Asset ID, Asset ID 2, Serial No., description; filters Cost Centre, Group/NPC/Base, Asset Category, Status; details tabs Main Data, Location, Ownership, Loan, Maintenance, Retirement; photo upload.
3. **Asset Registration** wizard: Register (7 steps, assets in NEW/TRANSFER), Complete Register (5 steps, PROGRESS), Reject (5 steps, NEW/TRANSFER/PROGRESS).
4. **Asset Assignment**: create Assign / Relocate (5 steps) or Assign & Relocate (6 steps); approve/reject/cancel SUBMITTED transactions; recall (as LOGS1) and return (as FALO).
5. **Stocktake FAVE**: assign stocktaker (VET IC), export, update results (VET IC, URO), Import Working Result (Excel), approval chain VET IC > URO > UAO (HQAO approves UAO), follow-up close items, FAVE(HQ) for HQAO/HQFALO.
6. **Stocktake Adhoc**: one-off or periodic (BI-ANNUALLY, MONTHLY, QUARTERLY, WEEKLY), manual or random asset selection, update results, assign stocktaker.
7. **New Asset**: report a potential asset (5 steps, photo mandatory), close (URO/LOGS1/FALO) or cancel with a reason.
8. **Rejection (reinstate)**, **Print Tag (reprint)**, **Retirement/Disposal (update disposal date)**.
9. **Reports**: Asset Listing (Detailed) export (excludes retired, disposed, uncapitalised), FAVE Stocktake Follow-up export.
10. **Admin**: Settings (Cost Centre, Group, Email Template, Announcement, Master Setup = FAVE trigger date) and User (User Listing, Role Listing: add/remove users, mass import, validity periods, access rights).

### Business rules worth testing
- Assignment approval: LOGS1 > LOGS1 needs URO approval; LOGS1 > FALO auto-approved; FALO > FALO needs LOGS1; FALO > LOGS1 needs LOGS1; LOGS1 taking back from FALO/Enduser and FALO taking back from Enduser are auto-approved; relocation is auto-approved. Assets in an ongoing transaction are not selectable. Owner can Cancel a SUBMITTED transaction (status CANCELLED).
- Assignee role options: as FALO pick FALO or ENDUSER; as LOGS1 pick LOGS1, FALO or ENDUSER. Empty assignee during registration = assigned to yourself.
- Registration location: Group/NPC/Base and Postal code mandatory; complete registration needs at least one of Block/Level/Room No./Remarks; all four empty = partial registration, status PROGRESS.
- Asset Sensitivity = YES disables photo upload. Tag printing YES needs RFID Tag Type ASSET or FILE; NO sets NA.
- Retirement: disposal date only for RETIRED assets; past date = DISPOSED immediately, future date = DISPOSED on that date; an iLMS disposal date overrides it.
- FAVE number format `FAVE FYaa-bbcc` (SPF agency code 20, running number resets each FY), e.g. FAVE FY23-2001. Master Setup triggers FAVE at 0000H of the chosen date, so it must be set before that day.
- FAVE Update Result: Sighted Result and HTD Follow-up mandatory; HTD Follow-up auto-mapped from Sighted Result + Asset Condition; SIGHTED + incorrect location shows a New Location field. Import Working Result defaults to Sighted / Working; template header A1 `LMSAssetID`.
- Field limits: reject and reinstate reason "Others" max 250 chars; reprint and New Asset close/cancel "Others" max 200; Group Name (Short) 25, Name (Long) 100, Description 200. Photos: max 5 per asset, .png/.jpg/.jpeg, under 3 MB, one default.
- Select-all checkbox in the ASSET header; no per-page selection in registration (FAVE assignment has select current page / all / deselect).
- User delete exists only for HTA, not SPF. Role access rights are view-only in the UI (changed in the backend).

### Email triggers (side effects of write tests)
Registration reminders (1st and 15th to LOGS1/FALO, cc UAO/URO); partial registration assigned to a FALO; Complete Register notifies LOGS1; LOGS1>LOGS1 and FALO>FALO assignments email the approver, and again on approval; New Asset report emails all LOGS1 and VET IC; FAVE submit/approve/reject emails along the chain; FAVE 100% sighting check daily at 11 pm. Dashboard Inbox: "Action Items" (user in To:) and "Informative" (user in cc:).

## Environments and access
- staging (UAT): https://mhauatweb.southeastasia.cloudapp.azure.com/ (project.yaml). The manual lists other URLs (SPF PROD https://ats.intranet.spf.gov.sg/Account/Login, SPF UAT https://ats.intranet.spf.uat/Account/Login, HTA PROD https://ats.hta.gov.sg/Account/Login, HTA UAT https://uat-ats.hta.gov.sg/Account/Login); they need the SPF intranet VPN and are not used here. Never test production.
- Login screen (manual): "Asset Tracking System (ATS)" card with **User name**, **Password**, **Login** and **WOG SSO** buttons, plus **User Guides**; an Announcement banner (header/footer) may show maintenance notices, e.g. weekly downtime Friday 2 pm to 5 pm. Test account SPF-A2216GA has no password.
- Tag printing needs a Zebra ZT411R printer with Browser Print; tests must answer No to tag printing (or expect the "not printed" list) since no printer is attached.
- UAT writes can send real emails to configured recipients.

## Page map
From the manual's menu (`docs/images/app-overview.png`); URL paths and locators to be filled in on first exploration.

| Area | Menu path | Purpose | Stable locators |
|---|---|---|---|
| Login | `/Account/LoginBk?ReturnUrl=%2F` (base URL redirects here) | Username login, WOG SSO; no agency selection step on staging | `h1` "Asset Tracking System (ATS)"; `input[placeholder="User name"]`, `input[placeholder="Password"]`; buttons "Login", "WOG SSO"; link "User Guides"; footer text starts "SPF -- WARNING" |
| Dashboard | `/IndexBk` (after login) | Inbox Action Items / Informative, tabs Summary, Asset Overview, Asset Registration Aging Overview, FAVE Stocktake Overview; "All Cost Centre" filter | `h1` "Dashboard"; header: text "Role:" + combobox (current role name), officer name, "Last Login dd-Mon-yyyy HH:mm", link "Logout"; side menu items Dashboard (link), Asset, Stocktake, Report, Settings, User (expandable) |
| Asset Listing | `/Asset/Asset` (Asset > Listing) | Search/filter assets, details, photos | AssetListingPage; DataTables `#tblist` (data `?handler=GetList`), info `#tblist_info`; select2 filters CostCenterId, locList, AssetCatId, Status |
| Asset Details | `/Asset/AssetForm?assetId=<encrypted>` | Header + tabs Main Data, Location, Ownership, Loan, Maintenance, Retirement, Status | AssetDetailsPage; label/value div pairs; tabs are `role=tab` |
| Asset Registration | `/Asset/Registration` (Asset > Registration) | Register / Complete Register / Reject wizard (steps Start, Asset, Review, Locate & Assign, Asset Sensitivity, RFID Tag, End) | not automated yet |
| Asset Assignment | `/Asset/Assignment`, Create -> `/Asset/AssignmentCreate` | Transactions, Create, Approve/Reject/Cancel | AssignmentPage, AssignmentCreatePage; KTStepper; review `#tbreview`; location panel `#pnlMove` |
| Asset Rejection | Asset > Rejection | Reinstate wizard | |
| Print Tag | Asset > Print Tag | Reprint RFID tag wizard | |
| Retirement/Disposal | Asset > Retirement/Disposal | Update disposal date | |
| New Asset | Asset > New Asset | Report / close / cancel potential assets | |
| Stocktake | Stocktake > FAVE, FAVE(HQ), Follow up, Adhoc Setup, Adhoc Listing | FAVE and ad-hoc stocktakes | |
| Reports | Report > Asset Listing (Detailed), Stocktake Follow up | Excel exports | |
| Settings | Settings > Cost Centre, Group, Email Template, Announcement, Master Setup | Admin config | |
| User | User > User Listing, Role Listing | Users, roles, periods | |

Common UI patterns: list pages with a pencil icon in the Actions column to open/edit; step wizards with Next and a Review step; Yes confirmation dialogs and success messages.

## Flows
- Login: `LoginPage.login(username)` then `BasePage.switchRole(label)`; the `loginAs(role)` fixture does both (tests/fixtures/pages.fixture.ts). Role switching reloads /IndexBk and changes the side menu (e.g. no User menu as Logistics Officer 1).

## Test data
- Accounts (no passwords): **SPF-A2216GA** = officer "Wong Pui Lai Annie", passwordless. Roles in the Role dropdown (2026-10-05): Agency Admin (default after login), Fixed Asset Liaison Officer, Logistics Officer 1, Stocktaker, Unit Approving Officer, Verification Team IC/2IC. Missing for approval chains: URO, HQ AO, HQ FALO, End User, and a second LOGS1/FALO user.
- Asset data comes from iLMS; record reusable UAT asset IDs per status (NEW, TRANSFER, PROGRESS, AVAILABLE, REJECTED, RETIRED) here once found.
  - AVAILABLE: `111000010978` (VRV air con, 332600 APD, Group APD, postal 819645, no LOGS1/FALO owner). Used by SPF-004/006/007 (`ASSETS.available` in tests/utils/test-data.ts).
- As LOGS1 (2026-10-06): Asset Listing 2,737 assets, 87 NEW; Registration > Register lists 91 assets; Assignment list 342 transactions.
- Upload files go in `data/` (asset photos under 3 MB, FAVE Import Working Result template, Role Listing user import template).

## Known quirks and waits
- **Use LOGS1 (or another unit role) for asset searches, not Agency Admin**: as Agency Admin the listing holds ~48k assets and searching hangs (user tip, confirmed 2026-10-06).
- DataTables lists: filters apply only on **Search**; **Clear** reloads the whole page. A search first redraws the table empty, then again with data: wait for the `xhr.dt` event and then the next `draw.dt` (BasePage.reloadsTable), not just any draw.
- Assignment type radios (Assign / Relocate / Assign & Relocate) are hidden `btn-check` inputs; click their `label[for=...]` cards.
- In the Choose Asset step, ticking a row checkbox updates the "N asset(s) selected" counter, but the checkbox itself does not stay checked (the app tracks the selection). Assert the counter.
- After login the app may land on `/` (ReturnUrl) instead of `/IndexBk`; both show the Dashboard.
- Logging in or out through the UI ends the saved session. Other contexts still load pages but fail on the next server action (role switch). The `loginPage` fixture drops the saved session after such a test.
- The Role dropdown is select2: a visible `span[role=combobox]` (accessible name = current role) over a hidden `select[name="role-selection"]`. Pick roles by clicking the combobox, then the option. The header labels "Role:" and "Last Login" are hidden below 1400px width (d-xxl-block), so the project viewport is 1440x900.
- Dashboard numbers render in two passes: first small values (e.g. 488 Total Assets), then the full figures (47,898) once the cost-centre data loads (~1-2 s). Wait for the final values before asserting numbers.
- The Role dropdown is a combobox with a listbox of options; opening it and pressing Escape does not change the role.
- iLMS updates appear the next working day (0000H batch); FAVE triggers at 0000H of the Master Setup date; the sighting check runs daily at 11 pm. Do not expect same-day results from these.

