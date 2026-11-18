# HTX LIMS Mobile

Native Android handheld app of HTX LIMS: **com.htx.lims.dev** (0.1.0, Kotlin/Jetpack Compose, Chainway "rscja"
RFID SDK, `MainActivity`), on the Android emulator (AVD `Medium_Phone`) against UAT. Test IDs `HLM-NNN`.
`project.yaml` baseUrl is HTX LIMS web UAT (https://htx.eastus.cloudapp.azure.com:5001/, same backend and accounts),
for tests that set up or check data in the browser.

## The app

- Login "Welcome back": Username, Password, Sign in. Takes the HTX LIMS web accounts (ADMIN, USER1, USER2).
  After sign-in a "Data downloaded" dialog lists the Pre Check-in list (new + loan), storage locations and
  stocktake lists, then the Dashboard.
- Dashboard tiles: Pre Check-in, Check-in, Check-out, All Assets, Stocktake, Settings (RFID reader: "Connect
  reader", "Test RFID scan"; the emulator has no reader), Upload queue. Bottom bar: name, username, Logout.
- Offline-first: records wait in the Upload queue until the server accepts them.
- **Logout deletes all data on the device**, including records not uploaded yet. Tests log out only when the
  Upload queue is empty (`DashboardScreen.ensureLoggedOut`).
- Dev build extras: Upload queue > "QA simulation" > "QA: make next upload fail" (retry testing; not in
  release builds).
- Compose views have no resource-ids or accessibility labels: screen objects find elements by visible text and
  text fields by position (`tests/pages/mobile/app.screen.ts`).

## Speed

mobilewright's screen reads are slow on this app: every read (locator check) takes about 6 s and every tap about
12 s, because uiautomator waits for the UI to go idle and this app never does (seen 2026-11-18 on 0.1.0; cause
not found yet). So screen objects check many texts in one view-tree read (`AppScreen.expectTexts`,
`textsOnScreen`) instead of one assertion per element, and the test timeout is 6 minutes.
While mobilewright runs, `adb shell uiautomator dump` is killed (it holds UI automation), so plain adb reads
return stale files.

## Accounts

From `.env` only: the app logs in with the env's `mobileAccount` prefix (default `HLW_ADMIN` ->
`HLW_ADMIN_USER` / `HLW_ADMIN_PASS`, the htx-lims-web accounts).

## Run

Start the emulator first (Android Studio > Device Manager > Medium_Phone). Then, from the repo root:

```powershell
.\qa test -c projects/htx-lims-mobile/playwright.config.ts                     # every HLM test
.\qa test -c projects/htx-lims-mobile/playwright.config.ts --grep "HLM-001:"   # one test
.\qa auto -c projects/htx-lims-mobile/playwright.config.ts                     # with Test Manager's heal flow
```

Own config like mha-mobile (mobilewright's global setup starts mobilecli on port 13000, see
projects/mha-mobile/README.md > Setup notes); the root config skips this project. One automation tool on the
emulator at a time.

## Testing permissions

UAT writes are allowed (user, 2026-11-18, same as htx-lims-web): pre check-in, check-in, check-out, stocktake
uploads; undoing is not required. Use QA items (printed from htx-lims-web, "QA ..." descriptions) and note what
is left behind. Signing out only with an empty Upload queue.

## Driving the app without a reader (emulator)

- Data first: Dashboard > Update all data (or Refresh items on the screen), else a new tag is "not found in the
  downloaded items".
- Pre Check-in: type the 24-digit chip code under "Or enter EPC / Tag ID" > Add tag; each typed tag needs
  "Simulate verify read"; Next > Review items > "Simulate burst scan" (Burst scan alone counts nothing) > Upload
  pre check-in. The review also does the Count step (web Count Item). A returned loan shows as "Loan".
- Check-in: type the item number > Find item > Add to check-in > Simulate verify read; Location per item
  (default Airlock 1); Next > Simulate burst scan > Upload check-in.
- Check-out: enter the item number > Find item > Select type (Loan / For Use / No Return), due date (Loan) and remarks > Add to list > QA: simulate verify scan > Review check-out > Confirm check-out. A refused check-out is shown as a connection failure (BUG-001): delete it from the Upload queue.
- Offline: `adb shell svc wifi disable` + `svc data disable` (and `enable` afterwards); the queue keeps the records, Upload all sends them. "QA: make next upload fail" does not work for check-outs (BUG-005).
- Stocktake: Select stocktake > pick > OK > "QA: simulate located scan" (locates one item) or "QA: simulate auto
  scan" > Upload > Upload anyway when items are missing.
- Check-in on the handheld removes a returned loan from the gantry whitelist and is audited (the web Check In
  page does neither: htx-lims-web BUG-001, BUG-002).
