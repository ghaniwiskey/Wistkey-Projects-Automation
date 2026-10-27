# MHA Mobile: HTA (QA_ENV=staging-hta)

Same app with agency HTA on the login screen: `$env:QA_ENV='staging-hta'; .\qa mhm`. Core: `../context.md`. HTA web: `projects/mha-hta/context.md`.

## Accounts and agency
- The app shows SPF again after a restart, a logout or a refused login: `LoginScreen` picks the env's agency before each login. LOGIN taps while the agency dropdown is open can leave LOGIN dead until a restart (BUG-009).
- Phone account: Web Login ID HTA-QAMOBILE, name "Test QA Mobile", Mobile Login ID in `.env` (`MHM_HTA_USER`), the same 8 units and 6 roles as Test QA. It was created in HTA web > User > User Listing > Create with the user's go-ahead; roles are added per role (Role Listing > role > Users > Add User). A user's Mobile Login ID is a field of its own (Test QA's differs from its web ID). The same NRIC is also Wong Pui Lai Annie's SPF mobile login: with agency SPF it logs in as her.
- Web checks: https://mhauatwebhta.southeastasia.cloudapp.azure.com/ with the mha-hta account (`HTA_USER`, login HTA-A4606XZ, "Test QA": Agency Admin, LOGS1, Stocktaker, UAO, URO, VET IC on 8 units). VET IC has no Asset > Listing there; opening it shows the popup "Unauthorised access." (the session check closes it).

## Roles, cost centres, tiles
- Roles: Agency Admin, UAO, URO, LOGS1, VET IC, Stocktaker (no FALO: MHM-014/015/016/022 skip). Cost centres 338000, 338001, 338002, 338200, 338202, 338203, 338205, 338206; the app starts as Agency Admin | 338000.
- Tiles: Agency Admin all 7 (incl. Stocktake (Ad Hoc)); LOGS1 6; URO 5; UAO and VET IC 4; Stocktaker 5. Stocktaker's MOBILE function Stocktake (Ad Hoc) had to be ticked and saved (with the user's go-ahead): a tick is lost without Save Changes in Role Listing.
- FAVE numbers "FAVE FY26-9001" (agency code 90; SPF 20): MHM-004 checks the env's code (`FAVE_AGENCY_CODE`).

## Data quirks
- Registration: PROGRESS assets can come without Group/NPC/Base ("Select Location"; Save only toasts "Please select location"); picking a group makes the app open "Select Address:-" for the form's postal code, so the address is picked again. `RegistrationScreen.ensureGroup` does both.
- Addresses: assets keep their own address text ("501 Old Choa Chu Kang Road", building "HTA", 698928) while "Select Address:-" lists "501 OLD CHOA CHU KANG ROAD HOME TEAM ACADEMY (BLK 1) SINGAPORE 698928" and 23 more rows of that postal code (163 rows for "6989"). `AppScreen.pickAddressRow` picks the asset's address when a row reads exactly like it, else the first row of its postal code; it reads the rows from the view tree (a text locator with a pattern did not match them).

## Bugs seen on HTA
- BUG-002 (MHM-009), BUG-011 and BUG-012 reproduce, and BUG-009 (above). BUG-004 shows too (MHM-023; wont-fix: accepted, MHM-023 checks the empty Remarks hint). BUG-005 cannot show with this account: it holds the same 8 cost centres in every role (MHM-024 skips). BUG-006 (amounts in scientific notation) was found here: asset 101000000323 shows Acquisition Value "$1.36449E8" (web $136,449,000.00).

## Sessions
- One session per account: a login to HTA web with the test account (HTA-A4606XZ) during a run ends the run's web session (MHM-005 and MHM-006 failed with SessionEndedError that way), and Aside's browser logged in as that account ended it twice mid-test (MHM-008/009 retries). With the browser closed, a session stayed alive through phone role switches and Settings trips. Do not use that account in a browser while the tests run.

## Test data
- MHM-019 on HTA: currently the one-off ADST00000013 "QA auto mobile adhoc hta" (asset 801000000150, CLS).
