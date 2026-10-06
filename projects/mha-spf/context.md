# MHA SPF: testing context

Knowledge base for testing this app. Keep it short, factual and current; no dated counts or record IDs (tests find data at runtime). Selectors live in tests/pages, not here.
Sources: the user manual `docs/user-manual.md` (CR12 onboarding, 21 Sep 2026; screenshots in `docs/images/`) and live checks on UAT (2026-10-05/06, SPF-001..042; `explorations/`). Pages marked "manual only" below are not verified live: confirm paths and locators on first visit.

## Product
- **e-RFID Asset Tracking System (ATS)** for MHA agencies (SPF, HTA, ...). Fixed-asset lifecycle: registration (Building/Level/Room location, ownership, RFID tag printing), assignment (ownership transfer, relocation), verification (annual FAVE stocktake, ad-hoc stocktake), retirement/disposal. Web app plus a mobile app (stocktakers sight assets with RFID scanners).
- Data flows one-way from **iLMS** (daily file at 0000H, visible next working day): asset records, capitalisations, loans, vehicle maintenance (HOVR), retirement/disposal dates, cost-centre transfers. Tests cannot create iLMS assets; they depend on existing UAT data.
- Multi-agency (CR12): each agency (HTA, SPF) has its own database.

### Roles (manual Table 3)
One login can hold several roles; the active role is switched with the **Role** dropdown (top right). Access rights belong to the role. Slugs map to dropdown labels in `tests/utils/test-data.ts`.

| Slug | Role | Level |
|---|---|---|
| agency-admin | Agency Administrator ("Agency Admin") | SPF HQ; 2FA, needs a mobile number |
| hq-ao / hq-falo | HQ Approving Officer / HQ Fixed Asset Liaison Officer | SPF HQ |
| uao | Unit Approving Officer | Unit (Commander/Director) |
| uro | Unit Resource Officer | Unit (Dept head) |
| logs1 | Logistics Officer 1 | Unit |
| falo | Fixed Asset Liaison Officer | Unit |
| vet-ic | Verification Team IC (VET IC/2IC) | Unit, FAVE only |
| stocktaker | Stocktaker | Unit, FAVE only (mobile) |
| enduser | End User | Unit |

Unit hierarchy: UAO > URO > LOGS1 > FALO > End User. In FAVE, VET IC leads the stocktakers. Roles can have validity periods (Role Listing > Periods); a role outside its period is unusable, a likely cause of "role missing". Role Listing and unit changes apply after the next login.

### Asset statuses (manual Table 2)
| Stage | Status | Meaning |
|---|---|---|
| Registration | NEW | New in ATS, or transferred in from another HTD |
| Registration | TRANSFER | Moved from one SPF cost centre to another |
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
- FAVE number `FAVE FYaa-bbcc` (SPF code 20, running number per FY). Master Setup triggers FAVE at 0000H of the chosen date.
- FAVE Update Result: Sighted Result and HTD Follow-up mandatory; HTD auto-mapped from Sighted Result + Condition; SIGHTED + incorrect location shows New Location. Import defaults to Sighted / Working; template header A1 `LMSAssetID`.
- Limits: reject/reinstate "Others" 250 chars; reprint and New Asset close/cancel "Others" 200; Group Short 25, Long 100, Description 200. Photos: max 5, .png/.jpg/.jpeg, < 3 MB, one default.
- User delete exists only for HTA. Role access rights are view-only in the UI.

### Email triggers (side effects of write tests)
Registration reminders (1st and 15th); partial registration assigned to a FALO; Complete Register notifies LOGS1; LOGS1>LOGS1 and FALO>FALO assignments email the approver (again on approval); New Asset report emails all LOGS1 and VET IC; FAVE submit/approve/reject along the chain; FAVE 100% sighting check daily 11 pm. Dashboard Inbox: "Action Items" (To:) and "Informative" (cc:).

## Environments and access
- UAT: https://mhauatweb.southeastasia.cloudapp.azure.com/ (project.yaml). Other URLs in the manual need the SPF intranet VPN and are not used. Never test production. UAT writes can send real emails.
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
| FAVE(HQ) | Stocktake menu | Not automated (no HQ role on the account) |
| Reports | `/Report/...` (AssetSummary, Asset, AssetAging, AssetRejection, AssetRetirement, AssetNew, AssetLoan, AssetMaintenance, StktakeFollowup) | AssetReportPage (`/Report/Asset`), ReportPage + TABLE_REPORTS (Export `#exportBtn`) |
| Settings > Group | `/Setting/Location`, `/Setting/LocationForm[?locId=]` | GroupPage (LOGS1 sees only Group) |
| Settings (rest), User | Agency Admin | Manual only, not automated |

Menus by role: LOGS1 and Agency Admin see Ad Hoc Setup/Listing; VET IC only FAVE; URO/UAO/FALO FAVE (+ Follow up); FAVE(HQ) only Agency Admin and HQ roles; URO has no Registration, Rejection or Print Tag. A page without a menu entry for the role shows "Unauthorised access." or lands on the dashboard.

## Test data (found at runtime, user rule)
- Account: `.env` only (`SPF_USER`, `SPF_PASS` empty = passwordless; README > Accounts). Officer name from the header (fixture `officer`), roles from the Role dropdown (missing role = test skipped). The UAT account lacks HQ AO, HQ FALO and End User, and there is no second LOGS1/FALO user. URO was added for SPF-018.
- Read-only asset tests: first AVAILABLE asset (fixture `availableAsset`) or first report row. Assignment writes share one asset per run (fixture `writableAsset`: first asset whose LOGS1 is the test account), cancelling SUBMITTED transactions before and after. The "other FALO" is the first one in the Assignee list that is not the test account.
- Registration: first NEW asset. SPF-013/014 use one up per run (cannot be undone); SPF-015 returns it to NEW. They skip when none is left.
- Locations: first Group / Cost Centre offered; postal code from the first AVAILABLE asset (fixture `unitPostalCode`), first address returned. Works for another agency (HTA).
- FAVE: tests open the first FAVE in the list (new FY picked up automatically); fixture `faveTarget` = first non-APPROVED cost centre + its first asset, returned to VET IC first. SPF-027 (@final) approves a cost centre for good but never the last one; ask the user before running it. When cost centres run out, give the account another unit (Agency Admin > User > User Listing > pencil > Unit; add, keep the current one since asset tests use its data). Other User Listing accounts may be used (check LoginBk accepts them; mind one session per account).
- FAVE relocation (SPF-039): first non-approved cost centre with a PENDING asset whose Assignee (LOGS1) is the test account (Details filters), fixture `faveRelocateTarget`. Each run uses one asset up (result locked after approval, BUG-009); skips when none is left.
- Follow up (SPF-041): first item in the Follow up list (FALO). Closing cannot be undone, so each run uses one item up; skips when the list is empty.
- Ad hoc: first asset in Choose Asset; stocktaker = first other name in the Assign list. Each SPF-022 run leaves a one-off setup "QA auto adhoc ..." (one-offs cannot be cancelled, BUG-002).
- Name prefixes for cleanup: New Asset descriptions "QA auto", groups "QA auto g<time>". Upload files in `data/` (photo `qa-asset.png`); FAVE import files are built with `writeXlsx` (@shared/utils/xlsx).

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
- FAVE Update Result (VET IC): SIGHTED + WORKING -> HTD "No Further Action", FSSC "Working condition", FAVE Status CLOSED, Location Status CLOSED; SIGHTED, no condition -> "To Dispose (FA5)". SIGHTED + NOT IN USE/OBSOLETE -> only "To Dispose (FA5)" (FSSC "Asset is obsolete, pending demolishment / return to SLA [For L&B only]"); SIGHTED + NOT WORKING -> only "To Repair" (FSSC "Working condition", BUG-010); WORKING also offers "To Transfer to another Unit (STO)" (FSSC "Pending STO transfer"). NOT SIGHTED -> "Not Found, for Investigation" (FSSC "Under investigation"), FAVE Status OPEN, Correct Location disabled; also "Asset Physically Disposed (To Dispose - D2)" ("Asset has been physically disposed") and "Cannot be found after investigation" ("Cannot be found after investigation, FA record to be disposed"). The HTD options are rebuilt a moment after a change: read them with a retry. PENDING clears everything. "The stocktake result is updated."; a single asset pre-loads its values.
- FAVE Assign Stocktaker: "User is required"; confirm "...assigning a stocktaker to this FAVE." -> "The stocktaker has been assigned.". No unassign.
- FAVE approval: Submit "Please confirm that you want to submit this FAVE." (no pre-check) -> "Stocktake FAVE has been submitted.". VET IC Submit > URO Submit/Reject > UAO Approve/Reject (last level; no HQ AO on SPF). Reject `#modal_reject`: Reason (Others = OTHER) + Remarks, both required; "Stocktake FAVE has been rejected." returns it one level down. Stage cards (#pnlStatus) keep their last status until that level acts again. Approve: "Stocktake FAVE has been approved."; final: row APPROVED / Unit Approving Officer, no more Submit/Update Result/Assign; Dashboard "Total Stocktake Report (Endorsed)" +1.
- BUG-003: after VET IC submits, VET IC (and UAO) can still Update Result.
- FAVE incorrect location (SPF-039): SIGHTED + Correct Location unticked -> Location Status OPEN and a "New Asset Location" section (Group `#subLocList`, Postal Code, Building/Address by XHR, Block max 10, Level max 3, Room No max 5, Remarks max 200). Submit checks in order: "Group / NPC / Base selection cannot be empty.", "Asset location cannot be empty." (postal code), "You must enter at least one field of Block / Level / Room No / Location Remarks.". Saving raises a RELOCATE assignment (Created By the VET IC officer, Approver Role Logistics Officer 1, SUBMITTED, not auto-approved). LOGS1 Approve ("Assignment has been approved") moves the asset. Afterwards the FAVE row keeps the old location and Location Status OPEN; the result is locked: Correct Location gives "Can't set the location correctly because it has already been approved.", PENDING says updated but changes nothing (BUG-009).
- FAVE Import Working Result (before submitting): Dropzone (`input.dz-hidden-input` on <body>), preview `#tbimport` -> "The import record(s) have been successful.", but the result stays empty (BUG-007). Import Template link gives "Page Not Found" (BUG-006).
- Follow up (FALO/URO/UAO): Close Item wizard Start > Choose Asset > Review > End. Lists OPEN items of approved FAVEs (UAT: FAVE FY24-2001, cost centre 332300, about 220). Ticking moves the row out of the list; Next with none: "Please tick at least one asset to process."; Submit (no reason, no confirmation) -> "Stocktake Follow-up Close" / "1 Asset has been closed." and the item is gone.
- Ad hoc Create: Start (One-Off/Periodic, default Periodic; Manual/Random; Name*; Periodic: Recurrence Type*, Number of Recurrence, Start Date = tomorrow) > Choose Asset > Review > "Ad Hoc Stocktake No. ADST<n> has been created". Errors "Stocktake Name is required", "Please tick at least one asset to process.". CREATED; a one-off becomes SUBMITTED once a result is recorded. Periodic + future start can be cancelled ("Stocktake Ad Hoc has been cancelled."); one-off: "Can't cancel one-off stocktake type." (BUG-002). Cancel reason label empty (BUG-001; value OTHER, Remarks required). Assets stay selectable while in another ad hoc stocktake.
- Ad hoc Listing: Update Result (SIGHTED/NOT SIGHTED/PENDING + Remarks) -> "The stocktake has been updated." (reloads to Summary). Assign Stocktaker, no confirmation -> "The stocktaker has been assigned.".

### Asset maintenance, settings, reports
- Print Tag: Choose Asset also lists Tag Type NA assets (BUG-004). Reason defaults to WEAR & TEAR (Defaced, Faulty Tag, LOST, OTHER, Printing Error, WEAR & TEAR); OTHER needs Remarks (max 200). Without Zebra Browser Print: error popup, End step "0 Asset has their RFID Tag reprinted." with the asset under "failed to print". Nothing is reprinted.
- Retirement/Disposal: Update dialog saves with "Updating done"; future date keeps RETIRED and shows dd-Mon-yyyy; empty submit clears the date. Reopening pre-fills a wrong date (BUG-005): always set the date before resubmitting. Never use a past date (disposes at once).
- Edit Picture: no file -> "Picture file is required"; "Uploaded successfully" (dialog stays open; reload to see it); Delete has no confirmation, "Deleted successfully". Photo slots `img[data-def]`.
- Edit asset: Tag Type (ASSET, FILE, NA), Sensitivity (Yes) + Remarks (read-only while unticked). Saves with no message. Sensitivity Yes hides Upload; unticking clears the remarks.
- Settings > Group: the Create form button says "Update"; "Cost Center/Code/Name is required"; "Group has been successfully created./updated."; Delete "Are you sure? You won't be able to revert this!" (Yes, delete it!) -> "Group has been successfully deleted". Description has no limit and is cut to 200 (BUG-008).
- Exports: FAVE `StocktakeFAVEReport_<yyyyMMddHHmmss>.xlsx`; Asset Listing (Detailed) `AssetListingDetailedReport_<stamp>.xlsx` (27 columns, follows on-screen filters; Status filter AVAILABLE, LOAN, MAINTENANCE, NEW, PROGRESS, TRANSFER only). All table reports export .xlsx.

## Known quirks and waits
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
