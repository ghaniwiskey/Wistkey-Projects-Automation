# MHA Mobile: testing context

Knowledge base for testing the MHA mobile app: explored with mobile-mcp from Claude Code, automated with mobilewright (see "How testing runs"). Keep it short, factual and current; stocktake data (FAVE numbers, counts, assignments) changes with the FY and with assignments, so find it at runtime.
Sources: live ARTEMIS sessions on UAT 2026-10-08 (sessions 5741536c, 792d3ac9), the MHA user manual (mobile login rules), the CR12 mobile user manual (see "User manual" below) and the app's APK strings.

## Product
- Native Android app **com.iconsult.mhasgtwo**, app title "Asset Tracking System (ATS)", 2.0-dev build. It is the stocktaker companion of the ATS web app (same backend and data) and is used to sight assets (FAVE and ad-hoc stocktakes). Per the MHA user manual, the mobile login is the account's full NRIC.
- Home tiles: Search Asset, Stocktake, New Asset, Settings. Settings is only the RFID scanner hookup (connect device, power range). Search Asset is a plain asset search; offline it says "Please connect the internet to use search asset module".
- Bottom bar shows "officer name - role | cost centre" and a Switch control (login/role switching below).
- Offline support: opening a FAVE asks "Will do stocktake by OFFLINE MODE?" (CONFIRM = offline, CANCEL = online). Sightings are stored locally (Room DB) and uploaded with Submit. Offline mode is not tested yet; it is a prime suspect for the reported submit "network error".
- Backend: https://mhauatapp.southeastasia.cloudapp.azure.com:8100 (UAT). The app logs every HTTP response to logcat as "Response Size: Size: N bytes" (OkHttp LoggingInterceptor), useful when investigating failures.

## User manual (CR12, 21 Sep 2026)
"e-RFID ATS Mobile Application User Guide", file `CR12_Mobile Application User Manual_21_Sep_2026.docx` (14 MB, 81 screenshots; kept outside the repo, ask the user for it). The version table still says 1.0 / Aug 2023, but the file was last edited 2026-08-26. It describes production use (SPFONE login over the SPF intranet VPN, police smartphone, RFID scanner); UAT differs (passwordless login, emulator, no scanner).
- **Mobile roles**: UAO, URO, LOGS1, FALO, VET IC, STOCKTAKER. The home tiles depend on the role: the manual shows Asset Registration, New Asset, Assign, Stocktake, Stocktake Adhoc, Search Asset and Settings; as Agency Admin/Stocktaker we only saw Search Asset, Stocktake, New Asset and Settings.
- **Login**: SPFONE NRIC + password; the account locks after 3 failed attempts (prod). After login the app preloads the postal codes ("preparing the postal code"), then shows the dashboard; an SPF user gets the SPF logo. Switch (bottom) > pick role > Confirm.
- **Asset Registration** (LOGS1, FALO): lists the user's assets in status PROGRESS ("Complete Register"), one at a time. Postal code is required, plus at least one of Block/Level/Room/Remarks. Sensitive asset = photo upload disabled; otherwise up to 5 photos. Save.
- **Assign** (URO, LOGS1, FALO; same as web Asset Assignment): Select Asset (filters: Category, Location, Assignee (LOGS1), Assignee (FALO), search by Asset ID/Serial No/Desc; '+' adds, 'x' closes) > "Asset Selected" count + Edit Selection > transaction type Assign / Relocate / Assign & Relocate. Assign needs Role + Assignee; Relocate needs Group/NPC/Base + Postal code + one of Block/Level/Room No./Remarks. Complete. Approval happens on the web (Assignment menu > Approve/Reject).
  - Recall: as LOGS1, select the FALO's assets, Assign to role "Logistics Officer1" = yourself. Return: as FALO, Assign to role "Logistics Officer1" = the LOGS1. After web approval: Current Logs1 = that LOGS1, Current FALO = "-".
- **Search Asset**: by serial no., EPC, Asset No, Asset ID or Asset ID 2, or Scan with the RFID scanner; asset details > Locate Asset (needs Bluetooth + connected scanner; the meter fills within 1-2 m).
- **New Asset** (report a possible fixed asset missing from ATS): Cost Centre, Description, Remarks and a photo are required. Save.
- **Stocktake (FAVE)**: flow Agency Admin generates > VET IC assigns + exports (web) > Stocktaker sights (mobile) > VET IC verifies > URO reviews > UAO endorses > HQ AO approves; LOGS1 closes follow-ups (Stocktake Follow up module). UAO/URO/LOGS1/FALO/VET IC can open it read-only in practice. FAVE number = `FAVE FYaa-bbcc` (aa = FY, bb = agency code, SPF = 20, cc = running number reset each FY).
  - Offline: CONFIRM downloads all assets first (download dialog > CONTINUE); sight without signal; Submit needs a connection again.
  - SELECT = assets for manual sighting; VERIFY = assets the RFID scanner detected (trigger once to start, once to stop); REVIEW = saved sightings, Submit sends them to VET IC and clears the tab. Verified assets leave SELECT/VERIFY. Search by Asset ID / description / Asset ID 2, plus filters; the row dropdown shows Asset ID, ID 2, description.
  - Detail fields: Sighted Result, Correct Location, Remarks, Asset Condition, HTD Follow-up; FSSC Outcome and FAVE Status are derived from Asset Condition + follow-up. Sighted + incorrect location shows the new-location fields: type >= 4 characters of a postal code > pick from the dialog > building name and address fill in.
- **Unit follow-up > FSSC outcome** (manual tables; Open = goes to Stocktake Follow up):
  - Sighted: No Further Action / To Repair > (a) Working Condition, Closed. To Dispose (D2) / To Retire (D2) > (e) in FAL but obsolete or not working, Open (all except Cat 1 & 2). To Dispose/Retire (FA5) > (d) obsolete, pending demolishment / return to SLA, Closed (Cat 1 & 2 only). To Transfer (STO) > (b) Pending STO transfer, Closed. On Loan / Under Maintenance > (c) with vendor / on loan, Closed (all except Cat 1 & 2).
  - Not sighted: Pending Physical Disposal > (g), Open (all except Cat 1 & 2). Asset Physically Disposed > (f), Open. To Raise STO > (b) Pending STO transfer, Closed. Not Found, for Investigation > (h) under investigation, Open. Cannot be found after investigation > (i) FA record to be disposed, Open.
- **Stocktake Adhoc** (role Stocktaker): pick an adhoc list > CONFIRM = offline download (a blue box on the list = downloaded) / CANCEL = online > asset > Sighted / Not sighted radio > Save > REVIEW > Submit.
- **Settings**: Connect > pick the scanner by MAC address (first pairing PIN 329560); power 5-30 dBm; connected shows grey "Connected" and a red "Disconnect" button.

## Environment and access
- UAT only; agency dropdown on the login screen is SPF (HTA also exists).
- Test account comes from `.env` only: `MHM_USER` (the mobile login, a full NRIC) and `MHM_PASS` (empty on UAT: passwordless). Never in the repo.

## Login and role switching (verified 2026-10-08)
1. Login screen: username = MHM_USER value, password empty, agency SPF, LOGIN.
2. The account lands as Agency Admin. Tap Switch (bottom bar) > Select Role > Stocktaker; same panel > Select Cost Center > pick the needed one (2026-10-08 session used 332140) > Confirm. The bottom bar then reads "... - Stocktaker | <cost centre>".
3. Stocktake: the list stays "Stocktake (0) / Nothing to show yet" until a cost centre is selected (step 2). Cost centre 332140 listed FAVE FY26-2006 and FAVE FY26-2007 ("332140 - PTD"; find at runtime).
4. Anywhere on a FAVE with unsent items, the exit arrow warns "Are you sure you want to exit without uploading?".

## FAVE sighting and submit (verified 2026-10-08)
- Open the FAVE > "Will do stocktake by OFFLINE MODE?" > CANCEL for online.
- FAVE detail has tabs SELECT / VERIFY / REVIEW. SELECT groups the assets by location ("<barcode> | Block X | Level Y" with an "N Assets" pill that expands the group).
- Sighting: tap the asset row > StockTake Detail (Asset No., ID 2, serial, category, values; Location section below the fold) > toggle Sighted (and Correct Location; Asset Condition where relevant) > SAVE > confirm "Set this asset as sighted?" > the asset moves from SELECT to REVIEW; tab counts update (they briefly show 0/0/0 while saving).
- Submit: the REVIEW tab has a full-width dark-blue Submit button > centered loading card + toast "Submission Successful" > REVIEW resets to 0. Submitting an empty REVIEW is a silent no-op (no toast).
- App messages seen or present in the APK: "Submission Successful", "Submission complete", "Submission Failed", "Network Error", "Please Switch ON the internet", "Please try again."; logging out with unsent items asks "The stocktake data in the review is still not submitted, do you want to log out?".

## Observed 2026-10-16 (exploration + MHM-002..006)
- Accounts: the `.env` mobile account is TAN JUN YONG SHAWN (roles Agency Admin, UAO, URO, LOGS1, FALO, VET IC, Stocktaker). After login the app always starts as Agency Admin | 332100, which has **no home tiles**; switch role first. The web test account (SPF_USER) is Wong Pui Lai Annie; Tan Jun Yong Shawn is offered as FAVE stocktaker for 332600 on the web account's FAVE.
- **Session ends ~10 minutes after login (BUG-001)**: the next request gets a 142-byte reply and the app drops to the login screen with no message; a sighting being saved is lost. A session the app restores at start-up that is older than that fails the same way. Tests log in fresh (fixture `mobileHome`).
- The stocktaker sees in SELECT only the FAVE assets assigned to them (web FAVE > Assignment > Assign Stocktaker); "Pending: n" on the Stocktake list is the whole cost centre's. A web assignment shows on the phone at the next FAVE open. Web VET IC resetting a result to PENDING puts the asset back in the phone's SELECT.
- Sighting -> web: SIGHTED + WORKING from the phone gives on MHA web Result & Condition "SIGHTED WORKING", HTD Follow-up "No Further Action", FSSC "Working condition", FAVE Status CLOSED, Location Status CLOSED, Correct Location ticked, the phone's remarks and the officer as Stocktaker (payload logged by the app as OKHTTP "entity", sightedMethod MANUAL). Web shows nothing until REVIEW > Submit.
- Turning Sighted on turns on Correct Location and sets Asset Condition WORKING. The FAVE Home button always asks "Are you sure you want to exit without uploading?", even with REVIEW 0.
- Switch Role panel: Select Cost Center does not reliably follow the role picked in the panel (seen: the active role's list, the role's own units, or all 37 agency cost centres); a role can be confirmed with a cost centre where it has no data (Stocktake "(0)"). Open lead, not filed.
- Search Asset only finds assets of the active cost centre; another unit's asset gives an empty list and no message. Its detail matches MHA web Asset Details in other formats: "$26145.0" vs "$26,145.00", category "1KZ0" vs "1KZ0 / ...", group "APD" vs "Airport Police Division (APD)".
- Automation timing: mobilecli reads the screen with `uiautomator dump`; with a Spinner dropdown open each read takes ~5 s and a locator tap ~10 s (two stable reads). AppScreen picks options from one tree read and taps coordinates; rapid back-to-back dumps of a busy UI restarted the emulator's system server once. `animations: 'off'` is set in the config.
- MHA web login failed on 2026-10-15/16 morning with a raw SqlException shown to the user ("Procedure or function 'spTokenIns' expects parameter '@RefreshTokenHash'..."), a UAT deployment in progress; fixed the same day.

## Known issues and open leads
- **"Network error" after submitting a FAVE (user report, NOT reproduced 2026-10-08)**: four attempts (three complete sight-and-submit cycles and one empty re-submit) all returned "Submission Successful"; logcat showed no socket/TLS/timeout failures and every request got a response, so it looks intermittent (network or server side). If it recurs: screenshot the exact message + time; the wording tells the layer ("Network Error" / "Please Switch ON the internet" = connectivity, "Submission Failed" = server rejected); check the "Response Size" logcat lines and reachability of the backend host.
- **Return to the login screen after SAVE + CONFIRM** (2026-10-08 attempt #4): explained on 2026-10-16 as the 10-minute session end, BUG-001.
- **Open lead: OFFLINE MODE**. Sight offline, then submit/upload; this sync path is untested and a likely place for the reported error.

## How testing runs
- **Exploring**: Claude Code drives the emulator through mobile-mcp (device id `Medium_Phone_API_36.1`, adb serial emulator-5554): element list, taps/typing, screenshots, `mobile_get_device_logs` (filter `process=com.iconsult.mhasgtwo`) and `mobile_list_crashes`. mobile-mcp has no secret handling, so type the login with adb straight from `.env` (`adb shell input text "$(grep ^MHM_USER= .env | cut -d= -f2 | tr -d '\r')"`), never through the chat. Network on/off for OFFLINE MODE: `adb shell svc wifi disable|enable` and `svc data disable|enable`; restore afterwards.
- **Automation**: fixed-step mobilewright tests (no AI) in `tests/e2e`, run with `npm run test:mhm` (projects/mha-mobile/playwright.config.ts; README.md has the details and setup notes). mobilewright launches the app fresh before each test. A test can also check MHA web with Playwright's `page` next to the phone's `screen` (e.g. a FAVE submitted on mobile: the web account must see the same cost centre; the web half only reads, no VET IC Submit or approvals). Phone asserts use `expect` from @mobilewright/test, browser asserts Playwright's `expect` (mobilewright's only knows phone locators).
- One tool on the emulator at a time. A leftover Appium UiAutomator2 server (from `maestro-runner --driver uiautomator2`) holds Android's UI automation and breaks the others: force-stop `io.appium.uiautomator2.server.test` and `io.appium.uiautomator2.server`.
- Tool benchmark, 2026-10-09 (the same Settings flow, Settings force-stopped before each run, warm averages): e2e (tester-army) fixed steps 8.2 s, maestro-runner devicelab 8.65 s, uiautomator2 10.65 s, mobilewright 14.6 s, Maestro CLI 19.7 s. mobilewright was chosen for fit, not speed: native on Windows, Playwright Test (Test Manager, reports, typecheck), the same engine as mobile-mcp. e2e needed WSL plus an adb relay.
- History: until 2026-10-09 the app was tested with ARTEMIS (`C:\Artemis Project\artemis`); the 2026-10-08 "network error" hunt is in `traces\5741536c-186f-48a0-bc8e-f290009e54de\` there.

## Test data notes
- Found at runtime, nothing fixed in code. MHM-005 (`faveTarget`): current FAVE on MHA web (VET IC), first cost centre not APPROVED that offers the mobile officer as stocktaker; there the first PENDING asset already assigned to the officer, else the first PENDING asset with no stocktaker, which the test assigns (no unassign; later runs reuse it). Teardown resets the result to PENDING. Skips when none fits: give the web account a unit where the mobile officer is a stocktaker.
- MHM-006: first AVAILABLE asset of MHA web Asset Listing (LOGS1) whose cost centre the phone offers; read-only.
- Sighting + submitting on UAT is safe to repeat (uploads results, no approval involved). Approvals belong to the web roles (VET IC / URO / UAO); do not go beyond Submit from the app.
- Remarks typed by tests start with "QA auto mobile".
