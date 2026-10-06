# MHA SPF: testing context

Knowledge base for testing this app. Keep it short, factual, and current; update it when tests reveal something new. Selectors live in tests/pages, not here.
Sources: the user manual `docs/user-manual.md` (CR12 onboarding, 21 Sep 2026; screenshots in `docs/images/`) and live checks on staging. Verified live so far: login, Dashboard header, role list, logout (2026-10-05); role switching, Asset Listing search/filter, Asset Details, Assignment list and the Relocate wizard up to the location step (2026-10-06, SPF-002..007); FAVE details/update result/assign stocktaker/export, Ad Hoc Setup/Create/Listing, Report > Asset Listing (Detailed) (2026-10-06, SPF-019..024). Other pages are from the manual only; confirm paths and locators on first visit.

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
| FAVE | `/Stocktake/Fave` -> `/Stocktake/FaveForm?stktakeFAVEId=<enc>` (Stocktake > FAVE) | Cost centres (#tbcostcenter, first row selected on load) + tabs Summary (approval panel VET IC > URO > UAO, Submit, Export), Details (Update Result, Import Working Result), Assignment (Assign Stocktaker) | FavePage, StocktakeFormPage; tables #tbsummary/#tbdetail/#tbassign, panes #summary_tab/#detail_tab/#assign_tab, dialogs #modal_result/#modal_assign |
| Ad Hoc Setup | `/Stocktake/Stocktake`, Create -> `/Stocktake/StocktakeCreate`, details `/Stocktake/StocktakeForm?stktakeId=<enc>` | Setups (ADST numbers), Cancel (#modal_cancel), Delete Asset(s) | AdHocSetupPage, AdHocCreatePage (Choose Asset #tbSearch, Review #tbList) |
| Ad Hoc Listing | `/Stocktake/StocktakeListing` -> `/Stocktake/StocktakeListingForm?stktakeId=<enc>` | Same tabs and dialogs as FAVE, no cost centres or condition | AdHocListingPage |
| Stocktake (other) | Stocktake > FAVE(HQ) (Agency Admin, HQ roles), Follow up | Not automated | |
| Reports | `/Report/...`: AssetSummary, Asset (Detailed), AssetAging, AssetRejection, AssetRetirement, AssetNew, AssetLoan, AssetMaintenance, StktakeFollowup | Excel exports | AssetReportPage (`/Report/Asset`, Export `#exportBtn`) |
| Settings | Settings > Cost Centre, Group, Email Template, Announcement, Master Setup | Admin config | |
| User | User > User Listing, Role Listing | Users, roles, periods | |

Common UI patterns: list pages with a pencil icon in the Actions column to open/edit; step wizards with Next and a Review step; Yes confirmation dialogs and success messages.

## Flows
- Login: `LoginPage.login(username)` then `BasePage.switchRole(label)`; the `loginAs(role)` fixture does both (tests/fixtures/pages.fixture.ts). Role switching reloads /IndexBk and changes the side menu (e.g. no User menu as Logistics Officer 1).

## Test data
- Accounts (no passwords): **SPF-A2216GA** = officer "Wong Pui Lai Annie", passwordless. Roles in the Role dropdown (2026-10-05): Agency Admin (default after login), Fixed Asset Liaison Officer, Logistics Officer 1, Stocktaker, Unit Approving Officer, Verification Team IC/2IC. Missing for approval chains: URO, HQ AO, HQ FALO, End User, and a second LOGS1/FALO user.
- Asset data comes from iLMS; record reusable UAT asset IDs per status (NEW, TRANSFER, PROGRESS, AVAILABLE, REJECTED, RETIRED) here once found.
  - **No fixed assets or officers in the tests** (user rule, 2026-10-06): data is found at runtime. Read-only tests (SPF-004/006/024) use the first AVAILABLE asset in Asset Listing / the first report row (fixture `availableAsset`, `AssetReportPage.firstRow`); SPF-007 the first asset in Relocate > Choose Asset. On 2026-10-06 that was 111000010977.
  - Assignment write tests (SPF-008..012, 018) share one asset per run (fixture `writableAsset`): the first asset in Assign > Choose Asset whose current LOGS1 is the test account, else the first one (2026-10-06: 111000010979). The specs cancel any SUBMITTED transaction on it before and after each test. SPF-018's "other FALO" is the first FALO in the Assignee list who is not the test account (`assignee: { except: OFFICER }`; 2026-10-06: Chia Shu Hui).
  - Registration tests take the first NEW asset in Asset Listing (Status NEW). SPF-013 and SPF-014 leave it AVAILABLE (one NEW asset each per run, cannot be undone in the UI); SPF-015 returns it to NEW. They skip when no NEW asset is left.
  - New Asset tests type descriptions starting "QA auto"; cleanup cancels OPEN reports matching it. Photo: `data/qa-asset.png`.
  - Locations are not fixed either (so the suite can move to another agency such as HTA): registration takes the first Group offered for the asset (the list holds only the asset's unit's groups), New Asset the first Cost Centre offered, and both search the unit's postal code taken from the Location tab of the first AVAILABLE asset (fixture `unitPostalCode`), picking the first address returned ("<postal> - <address>"; UAT: 819645 Airport Police Station).
  - FAVE: the repeatable tests take the first cost centre of the current FAVE's own table that is not APPROVED and not in `FAVE.approvalCostCentres` (2026-10-06: 332300 CID, since A&F and CAD are approved and the table is in code order); SPF-019 the first one listed. `FAVE.approvalCostCentres` is a permission list for irreversible approvals (empty for a new agency).
  - Still fixed on purpose: the account entries (username from .env, officer name, roles) in project.yaml / test-data ACCOUNTS: account config, redone per agency.
- As LOGS1 (2026-10-06): Asset Listing 2,737 assets, 87 NEW; Registration > Register lists 91 assets; Assignment list 342 transactions.
- Other accounts (user, 2026-10-06): any account in Agency Admin > User > User Listing may be used for tests (e.g. a real second FALO/LOGS1, another unit). Add it to project.yaml auth.accounts, tests/utils/test-data.ts ACCOUNTS and .env (SPF_<NAME>_USER); check first whether LoginBk accepts it without a password like SPF-A2216GA. Mind the one-session-per-account rule.
- More cost centres (user, 2026-10-06): the test account may be moved to or given another agency/unit. As Agency Admin: User > User Listing > pencil on SPF-A2216GA > Unit (multi-select) > Update (manual "[User Listing] How to update User Listing?"); like role changes, it applies after the next login. Use it when FAVE.costCentres / FAVE.approvalCostCentres run out (all APPROVED). Add units rather than replace 332600 APD: the asset, assignment and registration tests depend on APD data.
- FAVE: UAT FAVE FY26-2007 (created 02-Oct-2026) covers 332100 A&F, 332300 CID, 332370 CAD, 332600 APD; APD has 468 FAVE assets, all PENDING on 2026-10-06 (dashboard: 47,849 assets, 8 sighted). `FAVE.asset` 111000010977 is the FAVE test asset (SPF-020 sets it SIGHTED and back to PENDING; SPF-021 leaves stocktaker Wong Pui Lai Annie). APD stocktakers: Mohammad Shahrul Bin Ismail, Wong Pui Lai Annie. Tests open the first FAVE in the list, so a new FY FAVE is picked up automatically.
- Ad hoc: SPF-022/023 use the first asset in Choose Asset and, for the stocktaker, the first name in the Assign dropdown that is not the current one. Assets stay selectable for ad hoc and for assignment while in another ad hoc stocktake. Leftovers from 2026-10-06 exploration/runs: ADST00000011 (one-off, SUBMITTED), ADST00000013 (one-off, CREATED, cannot be cancelled); ADST00000012 cancelled. Each SPF-022 run adds one more one-off setup named "QA auto adhoc ...".
- Upload files go in `data/` (asset photos under 3 MB, FAVE Import Working Result template, Role Listing user import template).

## Write flows observed on UAT (2026-10-06)
- Relocate (LOGS1): "Relocation request #ASG... is created", auto-APPROVED, asset Location updated.
- Assign LOGS1 > FALO: "... is created and approved." Current FALO set.
- Assign FALO > LOGS1 (return): "... is created and pending approval.", Approver Role LOGS1; the same officer can Approve/Reject it as LOGS1. After approval Current LOGS1 = officer and Current FALO is cleared ("-"), also when the FALO and the LOGS1 are the same officer (retested 2026-10-06 with every step approved, SPF-010 asserts it). One earlier check (ASG00006278) kept the FALO; that asset had no LOGS1 owner before the return, a state the UI cannot recreate.
- Assign LOGS1 > LOGS1 (also "recall" to yourself): always pending, Approver Role "Unit Resource Officer", even when the asset is held by another FALO. After the URO approves a recall, Current FALO is cleared ("-") as the manual says, both from another FALO ("Chia Shu Hui", SPF-018) and from the test account's own FALO role (retested 2026-10-06, ASG00006332/ASG00006333).
- The test account got the **Unit Resource Officer** role on 2026-10-06 (Agency Admin > User > Role Listing > URO > Users > Add User). Role Listing changes apply after the next login. As URO the side menu has no Registration, Rejection or Print Tag. Remove it there if the team prefers (SPF-018 needs it).
- Cancel / Reject: modal with select2 Reason (Cancel: Others only, needs Remarks max 200, "Remarks is required"; Reject: Incorrect Assignee, Incorrect Location, Incorrect Location and Assignee, Others), then "Are you sure to ...?" Yes, then "Assignment has been cancelled./rejected." Ok.
- Registration Register: Locate & Assign (FALO optional, Group, Postal Code search, Block/Level/Room No/Remarks) > Sensitivity (default NO) > RFID Tag (YES default; NO sets Tag Type NA). Complete location: "Asset Registration completed."; empty Block/Level/Room/Remarks: "Asset Registration incomplete." (PROGRESS).
- Registration Reject: native select Reason (Incorrect Cost Centre, Others, Wrongly Capitalised): "Assets Rejected.". Rejection > Reinstate (reasons Others, Wrongly Assigned, Wrongly Rejected): "Reinstatement Completed"; status goes back to the one before rejection (NEW stays NEW, PROGRESS stays PROGRESS).
- New Asset report: Cost Centre*, Remarks*, Postal Code*, location Remarks*, photo* (.png/.jpg/.jpeg < 3 MB) > "New Asset #RNA... has been created." (OPEN). Close Item (Asset Pending Capitalisation, Item Belongs to Other Unit, Not an Asset, Others) shows "The reported new asset has been closed." with no confirmation; Cancel Item reasons: Mistaken as Asset, Others.

## Stocktake and reports observed on UAT (2026-10-06)
- Menus: LOGS1 and Agency Admin see Ad Hoc Setup/Listing; VET IC only FAVE; URO/UAO/FALO FAVE (+ Follow up); FAVE(HQ) only Agency Admin (and HQ roles). Opening a page the role has no menu for shows "Unauthorised access." or lands on the dashboard.
- FAVE Update Result (VET IC): SIGHTED + WORKING -> HTD Follow-up "No Further Action", FSSC Outcome "Working condition", FAVE Status CLOSED, Correct Location ticked, Location Status CLOSED; SIGHTED with no condition -> "To Dispose (FA5)"; HTD options for SIGHTED/WORKING: No Further Action, To Transfer to another Unit (STO). PENDING clears everything (Remarks counter keeps the old count, cosmetic). Message "The stocktake result is updated.". A single asset pre-loads its saved values.
- FAVE Assign Stocktaker: "User is required" when empty; "Please confirm if you would like to proceed with assigning a stocktaker to this FAVE." Yes -> "The stocktaker has been assigned.". No unassign.
- FAVE approval (user OK'd submitting on UAT, 2026-10-06; SPF-025/026): Submit asks "Please confirm that you want to submit this FAVE." with no pre-check (even with 468 PENDING) -> "Stocktake FAVE has been submitted.". VET IC Submit > URO Submit/Reject > UAO Approve/Reject > HQ AO. Reject dialog #modal_reject: Reason (Others = value OTHER, labelled correctly here) + Remarks; "Reason is required", "Remarks is required"; "Please confirm that you want to reject this FAVE." -> "Stocktake FAVE has been rejected."; a reject returns the FAVE one level down. Stage cards (#pnlStatus) keep their last status until that level acts again (e.g. VET IC still shows SUBMITTED after a URO reject). Cost centre row Status/Role = last action. There is no HQ AO role on SPF: UAO Approve is the last level ("Please confirm that you want to approve this FAVE." -> "Stocktake FAVE has been approved."). Approval is final: the UAO stage shows APPROVED, the cost centre row APPROVED / Unit Approving Officer, and VET IC, URO and UAO lose Submit/Approve/Reject, Update Result and Assign Stocktaker; Dashboard (Agency Admin) "Total Stocktake Report (Endorsed)" +1 (FY26-2007: 37 total, 0 endorsed before). User allowed two approvals: 332370 CAD (by hand) and 332100 A&F (SPF-027), both on 2026-10-06. The repeatable FAVE tests use the first non-approved cost centre of the FAVE (fixture faveTarget; returnFaveToVetIc leaves it with VET IC). Follow up (Close Item wizard) lists only assets flagged for follow-up during FAVE; none so far.
- BUG-003: after VET IC submits, VET IC still has Update Result (only Import is hidden) and saving works; UAO also has Update Result.
- FAVE Export: StocktakeFAVEReport_<yyyyMMddHHmmss>.xlsx. Report Asset Listing (Detailed) Export: AssetListingDetailedReport_<stamp>.xlsx, 27 columns (Asset ID ... Asset Status, Logs1, Falo, ... Asset Sensitivity Remarks), follows the on-screen filters. Its Status filter offers AVAILABLE, LOAN, MAINTENANCE, NEW, PROGRESS, TRANSFER only. As LOGS1 it lists 2,737 assets.
- Ad hoc Create: Start (Frequency One-Off/Periodic, default Periodic; Selection Manual/Random; Name*; Periodic: Recurrence Type*, Number of Recurrence (1), Start Date (tomorrow)) > Choose Asset > Review > End "Ad Hoc Stocktake No. ADST<n> has been created". Errors: "Stocktake Name is required", "Please tick at least one asset to process.". New setups are CREATED; a one-off becomes SUBMITTED once a result is recorded. Periodic + future start stays CREATED and can be cancelled ("Stocktake Ad Hoc has been cancelled."); one-off answers "Can't cancel one-off stocktake type." (BUG-002). The Cancel reason has an empty label (BUG-001; the option value is OTHER, then Remarks is required).
- Ad hoc Listing: Update Result (SIGHTED/NOT SIGHTED/PENDING + Remarks) -> "The stocktake has been updated." and the page reloads to Summary. Assign Stocktaker has no confirmation (the list offers all unit officers) -> "The stocktaker has been assigned.".

## Known quirks and waits
- Wizard steps that show a location (Relocate, Complete Register) load it by XHR AFTER the step opens and overwrite every field; anything typed earlier is lost. Wait for Building to have a value. Picking a postal code also fills Building/Address by XHR.
- The Assign step's Assignee list reloads by XHR when the Role changes; an already open select2 keeps the stale list. Wait for the officer to appear in the hidden <select> first.
- Postal Code is a server-side select2 search: type into `.select2-container--open .select2-search__field`.
- Results and confirmations are SweetAlert2 popups (`.swal2-popup`, buttons Yes / Ok).
- **Use LOGS1 (or another unit role) for asset searches, not Agency Admin**: as Agency Admin the listing holds ~48k assets and searching hangs (user tip, confirmed 2026-10-06).
- DataTables lists: filters apply only on **Search**; **Clear** reloads the whole page. A search first redraws the table empty, then again with data: wait for the `xhr.dt` event and then the next `draw.dt` (BasePage.reloadsTable), not just any draw.
- FAVE Details columns move with the approval state: an APPROVED cost centre has no checkbox column, so read cells by header text (FavePage.detailCell), never by position.
- FAVE / Ad Hoc Listing tables: typing in the keyword box also searches, so Search sends a second identical request; BasePage.reloadsTable waits until the table's last request (settings.jqXHR) is done. Row checkboxes are not a reliable selection signal (can show ticked on a fresh page while nothing is selected): go by the info counter "Showing 1 to 1 of 1 records1 row selected" (no space before the count). Update Result with nothing selected says "Please tick at least one asset to process."; with several selected it opens with default values.
- Assignment type radios (Assign / Relocate / Assign & Relocate) are hidden `btn-check` inputs; click their `label[for=...]` cards.
- In the Choose Asset step, ticking a row checkbox updates the "N asset(s) selected" counter, but the checkbox itself does not stay checked (the app tracks the selection). Assert the counter.
- After login the app may land on `/` (ReturnUrl) instead of `/IndexBk`; both show the Dashboard.
- Logging in or out through the UI ends the saved session. Other contexts still load pages but fail on the next server action (role switch). The `loginPage` fixture drops the saved session after such a test.
- The Role dropdown is select2: a visible `span[role=combobox]` (accessible name = current role) over a hidden `select[name="role-selection"]`. Pick roles by clicking the combobox, then the option. The header labels "Role:" and "Last Login" are hidden below 1400px width (d-xxl-block), so the project viewport is 1440x900.
- Dashboard numbers render in two passes: first small values (e.g. 488 Total Assets), then the full figures (47,898) once the cost-centre data loads (~1-2 s). Wait for the final values before asserting numbers.
- The Role dropdown is a combobox with a listbox of options; opening it and pressing Escape does not change the role.
- iLMS updates appear the next working day (0000H batch); FAVE triggers at 0000H of the Master Setup date; the sighting check runs daily at 11 pm. Do not expect same-day results from these.

