# MHA HTA: testing context

Knowledge base for testing this app. Keep it short, factual and current; no dated counts or record IDs (tests find data at runtime). Selectors live in tests/pages, not here.
Sources: the user manual `docs/user-manual.md` (CR12 onboarding, 21 Sep 2026; screenshots in `docs/images/`). Copied from `projects/mha-spf/context.md` on 2026-10-07: the behaviour notes below were observed on **SPF UAT** unless marked HTA; it is the same application, so most apply, but confirm on HTA and update as HTA runs show differences. Bug numbers are mha-spf bugs (`projects/mha-spf/bugs/`); HTA has none filed yet.

## HTA vs SPF (checked on HTA UAT, 2026-10-07)
- URL https://mhauatwebhta.southeastasia.cloudapp.azure.com/ (SPF: mhauatweb...). Same LoginBk page and passwordless test login.
- Roles (User > Role Listing): only Agency Admin, Logistics Officer 1, Stocktaker, Unit Approving Officer, Unit Resource Officer, Verification Team IC/2IC. **No FALO**, HQ AO, HQ FALO or End User.
- Assign step Role dropdown offers only "Logistics Officer 1 (LOGS1)"; the Assignee (FALO) filter in Choose Asset is empty. The Ownership tab still shows "Current FALO" ("-").
- So no FALO tests: assign/return/recall via FALO (SPF-009/010/011/018/028) and FALO closing follow-up items (SPF-041) were not copied. Follow up close by URO/UAO is not covered yet.
- Role tests (HTA-045/047/048) use Stocktaker instead of End User.
- FAVE numbers `FAVE FY26-9001`: agency code 90 (SPF 20). Cost centres 338xxx (8 on UAT).
- User Listing has user delete (manual: HTA only): user form > Delete > "Are you sure to delete this user?" Yes/Cancel > "User has been deleted." > back to User Listing. Covered by HTA-055 (deletes its own user).
- The login footer warning starts "HTA-WARNING : This is a Singapore Police Force computer system.".
- UAT data: many assets carry a Group / NPC / Base of another cost centre (e.g. 338000 assets in "CCS - EMSB"). Relocate offers only the groups of the asset's cost centre, so the group is not prefilled and Submit says "Group/NPC/Base selection cannot be empty."; the page object then picks the first offered group.
- Assign Stocktaker (ad hoc) lists every unit user, but Submit refuses some: "User <name> has the role Verification Team IC/2IC which cannot be a stocktaker.".
- FAVE Import Working Result works on HTA (broken on SPF, mha-spf BUG-007); an imported result reads "Sighted" (mixed case), a manual one "SIGHTED".
- HTA bugs (2026-10-07): BUG-001 cost centre description search, BUG-002 ad hoc Cancel reason, BUG-003 FAVE Import Template, BUG-004 role period dates, BUG-005 random Max Group exceeded (= mha-spf BUG-012/001/006/011/016); BUG-007 Remarks counter /250, BUG-008 blank EXPIRED row after a role removal, BUG-009 wrong disposal prefill (accepted; = mha-spf BUG-014/013/005); BUG-010 "ealier" typo (= mha-spf BUG-015); BUG-006 (HTA only so far) Ad Hoc Listing of a random setup shows other assets / a wrong Summary count when drawn assets carry a group of another cost centre.
- SPF-vs-HTA rechecks 2026-10-07: mha-spf BUG-007 does not occur on HTA (FAVE Import Working Result sets Sighted/Working); not yet checked on HTA: mha-spf BUG-002 (one-off cancel), 003 (update after submit), 004 (Print Tag NA), 008 (group description cut), 009 (result locked after approved relocation).

## Product
- **e-RFID Asset Tracking System (ATS)** for MHA agencies (SPF, HTA, ...). Fixed-asset lifecycle: registration (Building/Level/Room location, ownership, RFID tag printing), assignment (ownership transfer, relocation), verification (annual FAVE stocktake, ad-hoc stocktake), retirement/disposal. Web app plus a mobile app (stocktakers sight assets with RFID scanners).
- Data flows one-way from **iLMS** (daily file at 0000H, visible next working day): asset records, capitalisations, loans, vehicle maintenance (HOVR), retirement/disposal dates, cost-centre transfers. Tests cannot create iLMS assets; they depend on existing UAT data.
- Multi-agency (CR12): each agency (HTA, SPF) has its own database.

### Roles (manual Table 3)
One login can hold several roles; the active role is switched with the **Role** dropdown (top right). Access rights belong to the role. Slugs map to dropdown labels in `tests/utils/test-data.ts`.

| Slug | Role | Level |
|---|---|---|
| agency-admin | Agency Administrator ("Agency Admin") | HQ; 2FA, needs a mobile number |
| uao | Unit Approving Officer | Unit (Commander/Director) |
| uro | Unit Resource Officer | Unit (Dept head) |
| logs1 | Logistics Officer 1 | Unit |
| vet-ic | Verification Team IC (VET IC/2IC) | Unit, FAVE only |
| stocktaker | Stocktaker | Unit, FAVE only (mobile) |

HTA has no FALO, HQ AO, HQ FALO or End User (they exist on SPF). Unit hierarchy: UAO > URO > LOGS1. In FAVE, VET IC leads the stocktakers. Roles can have validity periods (Role Listing > Periods); a role outside its period is unusable, a likely cause of "role missing". Role Listing and unit changes apply after the next login.

### Asset statuses (manual Table 2)
| Stage | Status | Meaning |
|---|---|---|
| Registration | NEW | New in ATS, or transferred in from another HTD |
| Registration | TRANSFER | Moved from one cost centre to another |
| Registration | PROGRESS | Partially registered; FALO must complete the location |
| Registration | REJECTED | Should not be capitalised (can be reinstated) |
| Assignment/Verification | AVAILABLE | Business as usual |
| Assignment/Verification | LOAN / MAINTENANCE | STO loan / HOVR (vehicles) |
| Retirement | RETIRED / DISPOSED | Retirement date set in iLMS / disposal date reached |

### Critical flows, most important first
1. **Login and role switching**: username login or WOG SSO; header shows role, officer, last login; logout.
2. **Asset Listing and Details**: search (Asset ID, Asset ID 2, Serial No., description), filters (Cost Centre, Group/NPC/Base, Category, Status); tabs Main Data, Location, Ownership, Loan, Maintenance, Retirement, Status; photos.
3. **Registration** wizard: Register (NEW/TRANSFER), Complete Register (PROGRESS), Reject.
4. **Assignment**: Assign / Relocate / Assign & Relocate; approve/reject/cancel SUBMITTED transactions; recall (LOGS1), return (FALO).
5. **FAVE**: assign stocktaker, export, update results, Import Working Result, approval VET IC > URO > UAO, follow-up close items, FAVE(HQ).
6. **Ad hoc stocktake**: one-off or periodic, manual or random selection, update results, assign stocktaker.
7. **New Asset**: report a potential asset (photo mandatory), close or cancel with a reason.
8. **Rejection (reinstate)**, **Print Tag (reprint)**, **Retirement/Disposal (disposal date)**.
9. **Reports**: Excel exports (Asset Listing (Detailed) excludes retired, disposed, uncapitalised).
10. **Admin**: Settings (Cost Centre, Group, Email Template, Announcement, Master Setup = FAVE trigger date), User (User Listing, Role Listing: users, mass import, periods, access rights).

### Business rules
- Assignment approval: LOGS1 > LOGS1 needs URO; LOGS1 > FALO auto-approved; FALO > FALO and FALO > LOGS1 need LOGS1; LOGS1 taking back from FALO/Enduser and FALO from Enduser auto-approved; relocation auto-approved. Assets in an ongoing transaction are not selectable. The owner can Cancel a SUBMITTED transaction (CANCELLED).
- Assignee roles: as FALO pick FALO or ENDUSER; as LOGS1 pick LOGS1, FALO or ENDUSER. Empty assignee during registration = yourself.
- Registration location: Group/NPC/Base and Postal code mandatory; complete needs at least one of Block/Level/Room No./Remarks; all four empty = PROGRESS.
- Asset Sensitivity = YES disables photo upload. Tag printing YES needs Tag Type ASSET or FILE; NO sets NA.
- Retirement: disposal date only for RETIRED; past date = DISPOSED at once, future date = DISPOSED on that date; an iLMS date overrides it.
- FAVE number `FAVE FYaa-bbcc` (agency code: HTA 90, SPF 20; running number per FY). Master Setup triggers FAVE at 0000H of the chosen date.
- FAVE Update Result: Sighted Result and HTD Follow-up mandatory; HTD auto-mapped from Sighted Result + Condition; SIGHTED + incorrect location shows New Location. Import defaults to Sighted / Working; template header A1 `LMSAssetID`.
- Limits: reject/reinstate "Others" 250 chars; reprint and New Asset close/cancel "Others" 200; Group Short 25, Long 100, Description 200. Photos: max 5, .png/.jpg/.jpeg, < 3 MB, one default.
- User delete exists only for HTA. Role access rights are view-only in the UI.

### Email triggers (side effects of write tests)
Registration reminders (1st and 15th); partial registration assigned to a FALO; Complete Register notifies LOGS1; LOGS1>LOGS1 and FALO>FALO assignments email the approver (again on approval); New Asset report emails all LOGS1 and VET IC; FAVE submit/approve/reject along the chain; FAVE 100% sighting check daily 11 pm. Dashboard Inbox: "Action Items" (To:) and "Informative" (cc:).

## Environments and access
- UAT: https://mhauatwebhta.southeastasia.cloudapp.azure.com/ (project.yaml). The manual's URLs (uat-ats.hta.gov.sg) are intranet only and are not used. Never test production. UAT writes can send real emails.
- Announcement banner may show maintenance notices (weekly downtime Friday 2 pm to 5 pm).
- No Zebra printer (ZT411R + Browser Print) is attached: tag printing must be answered No, or expect the "failed to print" list.
- **One session per account**: a newer login of the same account ends older sessions; pages still load but the next server action (role switch) lands on /Account/Login. The role fixture re-logs in; the `loginPage` fixture drops the saved session after login/logout tests. Don't log in with the test account in another browser during a run.

## Page map
| Area | Path | Page object / notes |
|---|---|---|
| Login | `/Account/LoginBk?ReturnUrl=%2F` (base URL redirects here) | LoginPage; no agency step on UAT |
| Dashboard | `/IndexBk` (or `/` after login) | DashboardPage; tabs Summary, Asset Overview, Registration Aging, FAVE Overview |
| Asset Listing / Details | `/Asset/Asset`, `/Asset/AssetForm?assetId=<enc>` | AssetListingPage (`#tblist`), AssetDetailsPage (Edit Picture `#modal_upload`, Edit `#modal_update`) |
| Registration | `/Asset/Registration` | RegistrationPage (Start, Asset, Review, Locate & Assign, Sensitivity, RFID Tag, End) |
| Rejection | Asset > Rejection | RejectionPage (reinstate) |
| Assignment | `/Asset/Assignment`, `/Asset/AssignmentCreate` | AssignmentPage, AssignmentCreatePage, AssignmentFormPage (KTStepper, `#tbreview`, `#pnlMove`) |
| Print Tag | `/Asset/PrintTag` | PrintTagPage |
| Retirement/Disposal | `/Asset/Retirement` | RetirementPage (`#modal_update`, flatpickr DisposalOn m/d/Y, read-only) |
| New Asset | Asset > New Asset | NewAssetListPage, NewAssetCreatePage, NewAssetFormPage |
| FAVE | `/Stocktake/Fave` -> `/Stocktake/FaveForm?stktakeFAVEId=<enc>` | FavePage on StocktakeFormPage; `#tbcostcenter` (first row selected on load), `#tbsummary/#tbdetail/#tbassign`, `#modal_result/#modal_assign/#modal_import/#modal_reject` |
| Ad Hoc Setup / Listing | `/Stocktake/Stocktake`, `/Stocktake/StocktakeCreate`, `/Stocktake/StocktakeListing` | AdHocSetupPage, AdHocCreatePage, AdHocListingPage |
| Follow up | `/Stocktake/Followup` | FollowUpPage (Close Item wizard: `#tblist`, `#tbreview`, End h2 + `#summary`) |
| FAVE(HQ) | /Stocktake/FaveHQ -> /Stocktake/FaveHQForm?stktakeFAVEId=<enc> | FaveHqPage (#tbcostcenter filtered in the browser, #tboverview, #tbsummary, #tbdetail) |
| Reports | `/Report/...` (AssetSummary, Asset, AssetAging, AssetRejection, AssetRetirement, AssetNew, AssetLoan, AssetMaintenance, StktakeFollowup) | AssetReportPage (`/Report/Asset`), ReportPage + TABLE_REPORTS (Export `#exportBtn`) |
| Settings > Group | `/Setting/Location`, `/Setting/LocationForm[?locId=]` | GroupPage (LOGS1 sees only Group) |
| User Listing | `/User/User`, `/User/UserForm[?userId=]` | UserListingPage (Agency Admin; `#tblist` one row per user and role, `#user_form`) |
| Role Listing | `/User/Role`, `/User/RoleForm?roleId=` | RoleListingPage (tabs Functions, Users(n) `#tbuser` + `#modal_user`, Periods `#tbperiod` + `#modal_period`) |
| Settings > Announcement | `/Setting/Announcement`, `/Setting/AnnouncementForm[?announceId=]` | AnnouncementPage (Create opens a new tab) |
| Settings > Cost Centre | `/Setting/CostCenter`, `/Setting/CostCenterForm?costCenterId=` | CostCentrePage |
| Settings > Email Template | `/Setting/EmailTemplate`, `/Setting/EmailTemplateForm?tempId=` | EmailTemplatePage |
| Settings > Master Setup | `/Setting/MasterSetup` | Not automated (Update sets the yearly FAVE trigger) |

Menus by role: LOGS1 and Agency Admin see Ad Hoc Setup/Listing; VET IC only FAVE; URO/UAO/FALO FAVE (+ Follow up); FAVE(HQ) only Agency Admin and HQ roles; URO has no Registration, Rejection or Print Tag. A page without a menu entry for the role shows "Unauthorised access." or lands on the dashboard.

## Test data (found at runtime, user rule)
- Account: `.env` only (`HTA_USER`, `HTA_PASS` empty = passwordless; README > Accounts). Officer name from the header (fixture `officer`), roles from the Role dropdown (missing role = test skipped). The HTA UAT test account holds all six HTA roles.
- Read-only asset tests: first AVAILABLE asset (fixture `availableAsset`) or first report row. Assignment writes share one asset per run (fixture `writableAsset`: first asset whose LOGS1 is the test account), cancelling SUBMITTED transactions before and after. The "other FALO" is the first one in the Assignee list that is not the test account.
- Registration: first NEW asset. HTA-013/014 use one up per run (cannot be undone); HTA-015 returns it to NEW. They skip when none is left.
- Locations: first Group / Cost Centre offered; postal code from the first AVAILABLE asset (fixture `unitPostalCode`), first address returned. Works for another agency (HTA).
- FAVE: tests open the first FAVE in the list (new FY picked up automatically); fixture `faveTarget` = first non-APPROVED cost centre + its first asset, returned to VET IC first. HTA-027 (@final) approves a cost centre for good but never the last one; ask the user before running it. When cost centres run out, give the account another unit (Agency Admin > User > User Listing > pencil > Unit; add, keep the current one since asset tests use its data). Other User Listing accounts may be used (check LoginBk accepts them; mind one session per account).
- FAVE relocation (HTA-039): first non-approved cost centre with a PENDING asset whose Assignee (LOGS1) is the test account (Details filters), fixture `faveRelocateTarget`. Each run uses one asset up (result locked after approval; accepted, mha-spf BUG-009 wont-fix); skips when none is left.
- Ad hoc: first asset in Choose Asset; stocktaker = first other name in the Assign list. HTA-053 creates a periodic Random setup (Status AVAILABLE, Max Asset 3; skipped when the unit has 3 or fewer AVAILABLE assets) that the cleanup cancels. Each HTA-022 run leaves a one-off setup "QA auto adhoc ..." (one-offs cannot be cancelled; accepted, mha-spf BUG-002 closed as wont-fix).
- User admin (HTA-044..046): kept like mha-spf (no user delete), so HTA-044 creates one user per run (`QA-AUTO-<TIME>`, name "QA auto user <time>", first unit offered) and leaves it INACTIVE; HTA-045/046 reuse the first "QA auto user" User Listing finds (fixture `qaUser`, set ACTIVE first; created when none). Role tests use Stocktaker (fewest rights on HTA, which has no End User). New users log in in a second browser context (fixture `otherSession`), so the test account's session survives.
- Admin settings (HTA-049/050/052) edit records found at runtime and restore them: the first HEADER announcement that has ended (skip when none; announcements cannot be deleted), the first cost centre (Building), the first email template (Remarks only, never Subject/Content).
- Name prefixes for cleanup: New Asset descriptions "QA auto", groups "QA auto g<time>", users "QA auto user". Upload files in `data/` (photo `qa-asset.png`); FAVE import files are built with `writeXlsx` (@shared/utils/xlsx).

## Observed behaviour (UAT)
### Assignment and registration
- Relocate: "Relocation request #ASG... is created", auto-APPROVED, location updated. Assign LOGS1 > FALO: "... is created and approved." Assign & Relocate: "Asset Assignment and Relocation request #ASG... is created and approved." (ownership and location change).
- FALO > LOGS1 (return): "... is created and pending approval.", Approver Role LOGS1 (same officer can approve). After approval Current LOGS1 = officer, Current FALO cleared ("-").
- LOGS1 > LOGS1 (recall): always pending, Approver Role "Unit Resource Officer". After URO approval Current FALO is cleared.
- Cancel / Reject: select2 Reason (Cancel: Others only, Remarks max 200, "Remarks is required"; Reject: Incorrect Assignee, Incorrect Location, Incorrect Location and Assignee, Others) > "Are you sure to ...?" Yes > "Assignment has been cancelled./rejected.".
- Register: Locate & Assign (FALO optional, Group, Postal Code, Block/Level/Room/Remarks) > Sensitivity (default NO) > RFID Tag (YES default). "Asset Registration completed." / "Asset Registration incomplete." (PROGRESS).
- Reject (native select: Incorrect Cost Centre, Others, Wrongly Capitalised): "Assets Rejected.". Reinstate (Others, Wrongly Assigned, Wrongly Rejected): "Reinstatement Completed"; status returns to the one before rejection.
- New Asset: Cost Centre*, Remarks*, Postal Code*, location Remarks*, photo* > "New Asset #RNA... has been created." (OPEN). Close Item (Asset Pending Capitalisation, Item Belongs to Other Unit, Not an Asset, Others): "The reported new asset has been closed." (no confirmation). Cancel Item: Mistaken as Asset, Others.

### Stocktake
- FAVE Update Result (VET IC): SIGHTED + WORKING -> HTD "No Further Action", FSSC "Working condition", FAVE Status CLOSED, Location Status CLOSED; SIGHTED, no condition -> "To Dispose (FA5)". SIGHTED + NOT IN USE/OBSOLETE -> only "To Dispose (FA5)" (FSSC "Asset is obsolete, pending demolishment / return to SLA [For L&B only]"); SIGHTED + NOT WORKING -> only "To Repair" (FSSC "Working condition", intended); WORKING also offers "To Transfer to another Unit (STO)" (FSSC "Pending STO transfer"). NOT SIGHTED -> "Not Found, for Investigation" (FSSC "Under investigation"), FAVE Status OPEN, Correct Location disabled; also "Asset Physically Disposed (To Dispose - D2)" ("Asset has been physically disposed") and "Cannot be found after investigation" ("Cannot be found after investigation, FA record to be disposed"). The HTD options are rebuilt a moment after a change: read them with a retry. PENDING clears everything. "The stocktake result is updated."; a single asset pre-loads its values.
- FAVE Assign Stocktaker: "User is required"; confirm "...assigning a stocktaker to this FAVE." -> "The stocktaker has been assigned.". No unassign.
- FAVE approval: Submit "Please confirm that you want to submit this FAVE." (no pre-check) -> "Stocktake FAVE has been submitted.". VET IC Submit > URO Submit/Reject > UAO Approve/Reject (last level; no HQ AO on HTA or SPF). Reject `#modal_reject`: Reason (Others = OTHER) + Remarks, both required; "Stocktake FAVE has been rejected." returns it one level down. Stage cards (#pnlStatus) keep their last status until that level acts again. Approve: "Stocktake FAVE has been approved."; final: row APPROVED / Unit Approving Officer, no more Submit/Update Result/Assign; Dashboard "Total Stocktake Report (Endorsed)" +1.
- After VET IC submits, VET IC (and UAO) can still Update Result (accepted: mha-spf BUG-003 closed as wont-fix).
- FAVE incorrect location (HTA-039): SIGHTED + Correct Location unticked -> Location Status OPEN and a "New Asset Location" section (Group `#subLocList`, Postal Code, Building/Address by XHR, Block max 10, Level max 3, Room No max 5, Remarks max 200). Submit checks in order: "Group / NPC / Base selection cannot be empty.", "Asset location cannot be empty." (postal code), "You must enter at least one field of Block / Level / Room No / Location Remarks.". Saving raises a RELOCATE assignment (Created By the VET IC officer, Approver Role Logistics Officer 1, SUBMITTED, not auto-approved). LOGS1 Approve ("Assignment has been approved") moves the asset. Afterwards the FAVE row keeps the old location and Location Status OPEN; the result is locked: Correct Location gives "Can't set the location correctly because it has already been approved.", PENDING says updated but changes nothing (accepted: mha-spf BUG-009 closed as wont-fix).
- FAVE Import Working Result (before submitting): Dropzone (`input.dz-hidden-input` on <body>), preview `#tbimport` -> "The import record(s) have been successful.", but the result stays empty (mha-spf BUG-007). Import Template link gives "Page Not Found" (mha-spf BUG-006).
- FAVE(HQ) (Agency Admin): read-only view of the FAVE over all agency cost centres (37 on UAT). The cost centre search filters in the browser and selects the first row it shows (clicking a selected row does nothing). Tabs Overview (FSSC legends a..i: Cost, NBV, Count of FA, open follow-up items; non-PENDING results only), Summary (approval stages + results), Details (Search/Clear only). Overview Export = selected cost centre (StktakeFAVEReport_<stamp>.xlsx: sheets A. Stocktake Report with a Legend column like "a. Sighted - Working condition", B. Assets not in FAL, C. Stocktake (For Endorsement) with blank Ministry/Unit/dates); the Export above the cost centre table = whole FAVE (costCenterId=0, about 3 MB). Dashboard "FAVE Follow Up Status" shows 0 items although Follow up lists the FY24 items (probably current FY only).
- Follow up (FALO/URO/UAO): Close Item wizard Start > Choose Asset > Review > End. Lists OPEN items of approved FAVEs (UAT: FAVE FY24-2001, cost centre 332300, about 220). Ticking moves the row out of the list; Next with none: "Please tick at least one asset to process."; Submit (no reason, no confirmation) -> "Stocktake Follow-up Close" / "1 Asset has been closed." and the item is gone.
- Ad hoc Create: Start (One-Off/Periodic, default Periodic; Manual/Random; Name*; Periodic: Recurrence Type*, Number of Recurrence, Start Date = tomorrow) > Choose Asset > Review > "Ad Hoc Stocktake No. ADST<n> has been created". Errors "Stocktake Name is required", "Please tick at least one asset to process.". CREATED; a one-off becomes SUBMITTED once a result is recorded. Periodic + future start can be cancelled ("Stocktake Ad Hoc has been cancelled."); one-off: "Can't cancel one-off stocktake type." (accepted: mha-spf BUG-002 closed as wont-fix). Cancel reason label empty (mha-spf BUG-001; value OTHER, Remarks required). Assets stay selectable while in another ad hoc stocktake.
- Ad hoc Random (HTA-053/054): Choose Asset has no table, only filters (Asset Category, Assignee LOGS1/FALO, Group / NPC / Base, Status: multi-select select2), Max Asset, Max Group / NPC / Base (empty = no limit) and a Search that draws the assets on the server (GET `StocktakeCreate?handler=GetList...maxLoc=`, slow: a few seconds) and fills Total Number of Assets / Total Group / NPC / Base (`#totalAsset`, `#totalLocation`; reset to 0 on Search). Each Search draws again. Next before a Search or after an empty one: "Please click Search button to ensure there is asset(s) based on filter(s) selected."; no match: "No asset found in randomized locations: <groups>". Without a Status filter RETIRED/DISPOSED assets are drawn too. Review lists the drawn assets (no delete column); the setup details show Asset Selection RANDOM and Max Asset / Max Group. Max Group is exceeded now and then by an asset with no Group / NPC / Base counted as an extra group (mha-spf BUG-016).
- Ad hoc Listing: Update Result (SIGHTED/NOT SIGHTED/PENDING + Remarks) -> "The stocktake has been updated." (reloads to Summary). Assign Stocktaker, no confirmation -> "The stocktaker has been assigned.".

### Asset maintenance, settings, reports
- Print Tag: Choose Asset also lists Tag Type NA assets (accepted: mha-spf BUG-004 closed as wont-fix). Reason defaults to WEAR & TEAR (Defaced, Faulty Tag, LOST, OTHER, Printing Error, WEAR & TEAR); OTHER needs Remarks (max 200). Without Zebra Browser Print: error popup, End step "0 Asset has their RFID Tag reprinted." with the asset under "failed to print". Nothing is reprinted.
- Retirement/Disposal: Update dialog saves with "Updating done"; future date keeps RETIRED and shows dd-Mon-yyyy; empty submit clears the date. Reopening pre-fills a different date than the saved one (accepted: mha-spf BUG-005 closed as wont-fix): always set the date before resubmitting. Never use a past date (disposes at once).
- Edit Picture: no file -> "Picture file is required"; "Uploaded successfully" (dialog stays open; reload to see it); Delete has no confirmation, "Deleted successfully". Photo slots `img[data-def]`.
- Edit asset: Tag Type (ASSET, FILE, NA), Sensitivity (Yes) + Remarks (read-only while unticked). Saves with no message. Sensitivity Yes hides Upload; unticking clears the remarks.
- Settings > Group: the Create form button says "Update"; "Cost Center/Code/Name is required"; "Group has been successfully created./updated."; Delete "Are you sure? You won't be able to revert this!" (Yes, delete it!) -> "Group has been successfully deleted". Description has no limit and is cut to 200 (mha-spf BUG-008).
- Exports: FAVE `StocktakeFAVEReport_<yyyyMMddHHmmss>.xlsx`; Asset Listing (Detailed) `AssetListingDetailedReport_<stamp>.xlsx` (27 columns, follows on-screen filters; Status filter AVAILABLE, LOAN, MAINTENANCE, NEW, PROGRESS, TRANSFER only). All table reports export .xlsx.

### Admin (Agency Admin)
- User Listing: one row per user and mapped role (a user without a role has one row, Role Mapped empty). Create with an empty form: "Web Login ID or Mobile Login ID is required.", "Unit is required.", "Name is required.", "Status is required.". Create -> "User has been successfully created." (back to the list); Update -> "User has been successfully updated." (stays on the form). Duplicate Web Login ID: "Login ID already exist!". INACTIVE user login: "Invalid username/password.". A new user can log in (LoginBk, empty password) as soon as it has a role; the role shows in the header.
- Role Listing > Users: Add User (dialog filters while typing, tick, Submit) -> "User assign into role have been successfully updated."; trash (no confirmation) -> "<Role> role has been removed from User <name>."; the user form then keeps a blank EXPIRED role row (mha-spf BUG-013).
- Role Listing > Periods: "Start date is required.", "End date is required.", "The start date must be ealier than the end date" (mha-spf BUG-015). Dates are dd/mm/yyyy in the dialog but read as mm/dd/yyyy by the server: day > 12 gives "SqlDateTime overflow...", day <= 12 is saved swapped (mha-spf BUG-011). Delete (no confirmation): "Period <start> to <end> has been successfully deleted.". A role without a valid period is unusable.
- Announcement: "Content is required", "Start Date is required", "End Date is required"; "Announcement has been updated." (stays on the form). HEADER = banner at the top of the login page while today is within its dates (not shown on the Dashboard); FOOTER = text under the login card (the SPF warning, until 2033). No delete.
- Cost Centre: code read-only; "Name is required"; "Cost Center has been successfully updated." (stays on the form). Keyword search matches code and name, not the description (mha-spf BUG-012).
- Email Template: "Subject is required"; "Email template has been saved."; Remarks is an internal note (max 200, counter shows / 250, mha-spf BUG-014).
- Master Setup: Agency Name (read-only) and "Stocktake FAVE Start (MMDD-00:00)" (e.g. 0917). Not touched by tests.

## Known quirks and waits
- **A GET of /Account/LoginBk ends the browser's session** (even a fetch). Logging in in Aside's browser also ends the tests' saved session; if the role is already active, the fixture only notices on the next page load (login page). Stay logged out in Aside during runs.
- Inside a test, `browser.newContext()` reuses the test's saved login unless given an empty `storageState` (fixture `otherSession` does this).
- Flatpickr dialogs (Role period, Announcement): picking the start date opens the end date's calendar, and a refused Submit refocuses the date field and reopens it; it covers the dialog buttons. Page objects close the calendars before clicking.
- **Search assets as LOGS1 (or another unit role), not Agency Admin**: ~48k assets, searching hangs.
- Results and confirmations are SweetAlert2 popups (`.swal2-popup`, Yes / Ok).
- Role dropdown: select2 `span[role=combobox]` (name = current role) over hidden `select[name="role-selection"]`; click it, then the option (Escape changes nothing). Header labels "Role:" / "Last Login" hide below 1400px (d-xxl), so the viewport is 1440x900.
- Wizard location steps (Relocate, Complete Register) load the location by XHR AFTER the step opens and overwrite every field: wait for Building to have a value. Picking a postal code also fills Building/Address by XHR. Postal Code is a server-side select2 search (type into `.select2-container--open .select2-search__field`).
- The Assignee list reloads by XHR when Role changes; an open select2 keeps the stale list. Wait for the officer in the hidden <select>.
- Assignment type radios are hidden `btn-check` inputs: click their `label[for=...]`.
- Choose Asset: ticking a row updates "N asset(s) selected" but the checkbox does not stay checked. Assert the counter.
- DataTables: filters apply only on **Search**; **Clear** reloads the page. A search redraws empty, then with data: wait for `xhr.dt`, then the next `draw.dt` (BasePage.reloadsTable). In FAVE / Ad Hoc tables typing also searches, so Search sends a second request; reloadsTable waits for the last one (settings.jqXHR). There, go by the info counter ("...records1 row selected", no space), not the checkboxes. Nothing selected: "Please tick at least one asset to process."
- FAVE Details columns shift with approval state (no checkbox column once APPROVED): read cells by header text (FavePage.detailCell).
- Dashboard numbers render twice (small first, full figures after ~1-2 s): wait for the final values.
- iLMS updates appear the next working day; FAVE triggers at 0000H of the Master Setup date; the sighting check runs at 11 pm. No same-day results.
