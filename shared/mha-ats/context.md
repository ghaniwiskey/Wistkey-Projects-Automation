# MHA ATS web: shared testing context

Facts that hold on every agency's ATS web app (SPF, HTA). Agency specifics (env, account, differences): `projects/mha-spf/context.md`, `projects/mha-hta/context.md`. Rules, behavior, quirks and test data per area: `context/<area>.md` (read the one you touch). Sources: the CR12 user manual (`docs/user-manual/`) and live checks on SPF and HTA UAT. Selectors live in `pages/`, not here.

| Area file | Covers |
|---|---|
| `context/assignment-registration.md` | Assignment (assign, relocate, recall, return, approve), Registration, Rejection/reinstate, New Asset |
| `context/stocktake.md` | FAVE (results, stocktakers, approval, import, incorrect location), FAVE(HQ), Follow up, Ad hoc |
| `context/maintenance-reports.md` | Asset Details (photos, edit), Print Tag, Retirement/Disposal, reports and exports |
| `context/admin-settings.md` | Settings (Group, Announcement, Cost Centre, Email Template, Master Setup), User Listing, Role Listing |

## Product
- **e-RFID Asset Tracking System (ATS)** for MHA agencies. Fixed-asset lifecycle: registration (Building/Level/Room location, ownership, RFID tag printing), assignment (ownership transfer, relocation), verification (annual FAVE stocktake, ad-hoc stocktake), retirement/disposal. Web app plus a mobile app (stocktakers sight assets with RFID scanners; `projects/mha-mobile`).
- Data flows one-way from **iLMS** (daily file at 0000H, visible next working day): asset records, capitalisations, loans, vehicle maintenance (HOVR), retirement/disposal dates, cost-centre transfers. Tests cannot create iLMS assets; they depend on existing UAT data.
- Multi-agency (CR12): one application, each agency (SPF, HTA) has its own database and UAT site.

### Roles (manual Table 3)
One login can hold several roles; the active role is switched with the **Role** dropdown (top right). Access rights belong to the role. Slugs map to dropdown labels in each project's `tests/utils/test-data.ts`.

| Slug | Role | Level |
|---|---|---|
| agency-admin | Agency Administrator ("Agency Admin") | HQ; 2FA, needs a mobile number |
| hq-ao / hq-falo | HQ Approving Officer / HQ Fixed Asset Liaison Officer | HQ (SPF only) |
| uao | Unit Approving Officer | Unit (Commander/Director) |
| uro | Unit Resource Officer | Unit (Dept head) |
| logs1 | Logistics Officer 1 | Unit |
| falo | Fixed Asset Liaison Officer | Unit (SPF only) |
| vet-ic | Verification Team IC (VET IC/2IC) | Unit, FAVE only |
| stocktaker | Stocktaker | Unit, FAVE only (mobile) |
| enduser | End User | Unit (SPF only) |

Unit hierarchy: UAO > URO > LOGS1 > FALO > End User. In FAVE, VET IC leads the stocktakers. Roles can have validity periods (Role Listing > Periods); a role outside its period is unusable, a likely cause of "role missing". Role Listing and unit changes apply after the next login.

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
1. Login and role switching: username login or WOG SSO; header shows role, officer, last login; logout.
2. Asset Listing and Details: search (Asset ID, Asset ID 2, Serial No., description), filters (Cost Centre, Group/NPC/Base, Category, Status); tabs Main Data, Location, Ownership, Loan, Maintenance, Retirement, Status; photos.
3. Registration wizard: Register (NEW/TRANSFER), Complete Register (PROGRESS), Reject.
4. Assignment: Assign / Relocate / Assign & Relocate; approve/reject/cancel SUBMITTED transactions; recall (LOGS1), return (FALO).
5. FAVE: assign stocktaker, export, update results, Import Working Result, approval VET IC > URO > UAO, follow-up close items, FAVE(HQ).
6. Ad hoc stocktake: one-off or periodic, manual or random selection, update results, assign stocktaker.
7. New Asset: report a potential asset (photo mandatory), close or cancel with a reason.
8. Rejection (reinstate), Print Tag (reprint), Retirement/Disposal (disposal date).
9. Reports: Excel exports (Asset Listing (Detailed) excludes retired, disposed, uncapitalised).
10. Admin: Settings (Cost Centre, Group, Email Template, Announcement, Master Setup = FAVE trigger date), User (User Listing, Role Listing: users, mass import, periods, access rights).

### Email triggers (side effects of write tests)
Registration reminders (1st and 15th); partial registration assigned to a FALO; Complete Register notifies LOGS1; LOGS1>LOGS1 and FALO>FALO assignments email the approver (again on approval); New Asset report emails all LOGS1 and VET IC; FAVE submit/approve/reject along the chain; FAVE 100% sighting check daily 11 pm. Dashboard Inbox: "Action Items" (To:) and "Informative" (cc:).

## Access
- UAT only (URLs in each project.yaml); the manual's intranet URLs are not used. Never test production. UAT writes can send real emails.
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
| FAVE(HQ) | `/Stocktake/FaveHQ` -> `/Stocktake/FaveHQForm?stktakeFAVEId=<enc>` | FaveHqPage (`#tbcostcenter` filtered in the browser, `#tboverview`, `#tbsummary`, `#tbdetail`) |
| Reports | `/Report/...` (AssetSummary, Asset, AssetAging, AssetRejection, AssetRetirement, AssetNew, AssetLoan, AssetMaintenance, StktakeFollowup) | AssetReportPage (`/Report/Asset`), ReportPage + TABLE_REPORTS (Export `#exportBtn`) |
| Settings > Group | `/Setting/Location`, `/Setting/LocationForm[?locId=]` | GroupPage (LOGS1 sees only Group) |
| User Listing | `/User/User`, `/User/UserForm[?userId=]` | UserListingPage (Agency Admin; `#tblist` one row per user and role, `#user_form`) |
| Role Listing | `/User/Role`, `/User/RoleForm?roleId=` | RoleListingPage (tabs Functions, Users(n) `#tbuser` + `#modal_user`, Periods `#tbperiod` + `#modal_period`) |
| Settings > Announcement | `/Setting/Announcement`, `/Setting/AnnouncementForm[?announceId=]` | AnnouncementPage (Create opens a new tab) |
| Settings > Cost Centre | `/Setting/CostCenter`, `/Setting/CostCenterForm?costCenterId=` | CostCentrePage |
| Settings > Email Template | `/Setting/EmailTemplate`, `/Setting/EmailTemplateForm?tempId=` | EmailTemplatePage |
| Settings > Master Setup | `/Setting/MasterSetup` | Not automated (Update sets the yearly FAVE trigger) |

Menus by role: LOGS1 and Agency Admin see Ad Hoc Setup/Listing; VET IC only FAVE; URO/UAO/FALO FAVE (+ Follow up); FAVE(HQ) only Agency Admin and HQ roles; URO has no Registration, Rejection or Print Tag. A page without a menu entry for the role shows "Unauthorised access." or lands on the dashboard.

## Test data (every area; area files add their own)
- Found at runtime (user rule). Account from `.env` only (variable names: agency file); officer name from the header (fixture `officer`), roles from the Role dropdown (missing role = test skipped).
- Read-only asset tests: first AVAILABLE asset (fixture `availableAsset`) or first report row.
- Name prefixes for cleanup: New Asset descriptions "QA auto", groups "QA auto g<time>", users "QA auto user". Upload files in each project's `data/` (photo `qa-asset.png`); FAVE import files are built with `writeXlsx` (@shared/utils/xlsx).
- Test IDs in the area files are mha-spf's; the HTA test with the same number is HTA-NNN (HTA has no FALO tests).

## Known quirks and waits (every page)
- **A GET of /Account/LoginBk ends the browser's session** (even a fetch). Logging in in Aside's browser also ends the tests' saved session; if the role is already active, the fixture only notices on the next page load (login page). Stay logged out in Aside during runs.
- Inside a test, `browser.newContext()` reuses the test's saved login unless given an empty `storageState` (fixture `otherSession` does this).
- **Search assets as LOGS1 (or another unit role), not Agency Admin**: ~48k assets, searching hangs.
- Results and confirmations are SweetAlert2 popups (`.swal2-popup`, Yes / Ok).
- Role dropdown: select2 `span[role=combobox]` (name = current role) over hidden `select[name="role-selection"]`; click it, then the option (Escape changes nothing). Header labels "Role:" / "Last Login" hide below 1400px (d-xxl), so the viewport is 1440x900.
- DataTables: filters apply only on **Search**; **Clear** reloads the page. A search redraws empty, then with data: wait for `xhr.dt`, then the next `draw.dt` (BasePage.reloadsTable). In FAVE / Ad Hoc tables typing also searches, so Search sends a second request; reloadsTable waits for the last one (settings.jqXHR). There, go by the info counter ("...records1 row selected", no space), not the checkboxes. Nothing selected: "Please tick at least one asset to process."
- Dashboard numbers render twice (small first, full figures after ~1-2 s): wait for the final values.
- iLMS updates appear the next working day; FAVE triggers at 0000H of the Master Setup date; the sighting check runs at 11 pm. No same-day results.
