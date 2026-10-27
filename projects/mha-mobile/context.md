# MHA Mobile: testing context

Core facts for testing the MHA mobile app; areas in `context/` (read the one you touch). What the phone's actions become on MHA web, and web quirks: `shared/mha-ats/`. Sources: live sessions on UAT (ARTEMIS, mobile-mcp, mobilewright runs), the MHA web user manual (mobile login rules), the CR12 mobile user manual (`context/manual.md`) and the app's APK strings. Stocktake data (FAVE numbers, counts, assignments) changes with the FY and with assignments: find it at runtime.

| Area file | Covers |
|---|---|
| `context/stocktake.md` | FAVE online and offline, results on MHA web, ad hoc on the phone, the reported "network error", stocktake test data |
| `context/assets.md` | Search Asset, New Asset, Asset Registration, Assign, Settings (scanner), login and logout edge cases, asset test data |
| `context/hta.md` | HTA runs (QA_ENV=staging-hta): accounts, roles, tiles, data quirks, bugs, session collisions |
| `context/manual.md` | What the CR12 mobile user manual says (production use) |

## Product
- Native Android app **com.iconsult.mhasgtwo**, app title "Asset Tracking System (ATS)", 2.0-dev build: the companion of the ATS web app (same backend and data), used to sight assets (FAVE and ad hoc stocktakes) and for unit tasks (registration, assign, new asset). Locked to portrait.
- Home tiles depend on the role (below). Settings is only the RFID scanner hookup (connect device, power range).
- Bottom bar: "officer name - role | cost centre" and a Switch control.
- Offline support: opening a FAVE asks "Will do stocktake by OFFLINE MODE?" (CONFIRM = offline, CANCEL = online). Sightings are stored locally (Room DB) and uploaded with Submit.
- Backend: https://mhauatapp.southeastasia.cloudapp.azure.com:8100 (UAT). The app logs every HTTP response to logcat as "Response Size: Size: N bytes" (OkHttp LoggingInterceptor), useful when investigating failures; a refused request (ended session, refused login) gets a 142-byte reply.

## Environment and accounts
- UAT only; MHA web URLs in project.yaml envs. The login screen's agency dropdown: SPF (default env), HTA (`context/hta.md`).
- `.env` only, never in the repo: `MHM_USER` (the mobile login = the account's full NRIC) and `MHM_PASS` (empty on UAT: passwordless), read with `mhmAccount()`; MHA web checks: `MHM_WEB_USER` / `MHM_WEB_PASS`, default the mha-spf account (`SPF_USER` / `SPF_PASS`), read with `webAccount()`; HTA: `MHM_HTA_USER` / `MHM_HTA_PASS` plus the mha-hta web account (`HTA_USER`).
- The SPF mobile account is TAN JUN YONG SHAWN (roles Agency Admin, UAO, URO, LOGS1, FALO, VET IC, Stocktaker); his MHA web login is HTX-A4805FB (same roles; UAT web password as the other test accounts). His LOGS1 and Stocktaker hold 332100, 332140, 332200, 332600. He is offered as FAVE stocktaker for 332600 on the web account's FAVE.
- The web test account (SPF_USER) is Wong Pui Lai Annie; its LOGS1 units are 332100, 332300, 332360, 332370, 332600 (not 332140: `context/assets.md` > Test data).
- **One session per account covers web and mobile**: a phone login ended the officer's web session. Do not use a test account in a browser (Aside's included) while tests run.

## Login, roles and home tiles
- Login: username = the MHM_USER value, password empty, the env's agency, LOGIN. The app always starts as Agency Admin | 332100 (HTA: `context/hta.md`), which has **no home tiles**: switch role first.
- Switch (bottom bar) > Select Role > role; same panel > Select Cost Center > Confirm. The bar then reads "... - Stocktaker | <cost centre>". Stocktake stays "Stocktake (0) / Nothing to show yet" until a cost centre is selected, then lists its FAVEs ("<code> - <name>", e.g. "332140 - PTD").
- Switch Role panel (**BUG-005**): Select Cost Center lists the cost centres of the role that was active when the home screen was shown, whatever role is picked or confirmed since; it changes only after leaving home (any tile) and coming back, or an app restart. After login (Agency Admin) it lists all agency cost centres, so e.g. LOGS1 can be confirmed on 332110, which it does not hold; the app accepts it (Register Asset 0, Select Asset empty). Tests read a role's units with `HomeScreen.costCentresOf(role)` (confirm the role, Settings and back, read).
- Tiles by role (MHA web > User > Role Listing > <role> > Functions > MOBILE): LOGS1 and FALO: Asset Registration, Assign, Search Asset, Stocktake, New Asset, Settings; URO: Assign, Search Asset, Stocktake, New Asset, Settings; VET IC: Search Asset, Stocktake, New Asset, Settings; Stocktaker: the same + Stocktake (Ad Hoc) (its MOBILE function must be on: `context/stocktake.md` > Ad hoc); Agency Admin: none. The order is not stable (URO once: New Asset, Assign, Stocktake, Search Asset, Settings): MHM-012 compares the tiles without order.
- `HomeScreen.switchTo` does nothing when the bar already shows the role and cost centre; `switchRole` confirms a role without opening the cost centre list.
- Back on home leaves the app; reopening it (icon or Recents) resumes the last screen with the typed text.

## Sessions
- **Phone: the session ends ~10 minutes after login** (BUG-001, wont-fix: accepted, do not re-report): the next request gets a 142-byte reply and the app drops to the login screen with no message; a sighting being saved is lost. A session the app restores at start-up that is older than that fails the same way. Tests log in fresh (fixture `mobileHome`); MHM-007 (manual) checks the expiry.
- MHA web: the session ends after ~15 minutes idle (login page on the next request). The dashboard (IndexBk) still renders from the login cookie after the server ended the session ("Last Login" of the day before), while Asset Listing / Ad Hoc Listing go to the login page. So the fixtures check the session on Asset/Asset (`WebBasePage.sessionAlive`), page objects throw `SessionEndedError` on a login redirect (`openPage`), and each test saves its cookies back (the login cookie .ATS_443 is renewed during a test).
- Open lead: a saved web session once ended ~47 minutes after login; Asset Listing as LOGS1 then showed the modal "Unauthorised access." over an empty table instead of the login page (MHM-009 failed in setup) and the next test's fixture logged in again. Cause unknown (session lifetime or another login of the account); a rerun passes.
- A raw SqlException on MHA web login ("Procedure or function 'spTokenIns' expects parameter '@RefreshTokenHash'...") came from a UAT deployment in progress (environment; fixed the same day).

## How testing runs
- **Exploring**: Claude Code drives the emulator through mobile-mcp (device id `Medium_Phone_API_36.1`, adb serial emulator-5554): element list, taps/typing, screenshots, `mobile_get_device_logs` (filter `process=com.iconsult.mhasgtwo`) and `mobile_list_crashes`. mobile-mcp has no secret handling, so type the login with adb straight from `.env` (`adb shell input text "$(grep ^MHM_USER= .env | cut -d= -f2 | tr -d '\r')"`), never through the chat. Network on/off for OFFLINE MODE: `adb shell svc wifi disable|enable` and `svc data disable|enable`; restore afterwards.
- **Automation**: fixed-step mobilewright tests (no AI) in `tests/e2e`, run with `.\qa mhm` (own config: README.md). mobilewright launches the app fresh before each test. A test can also check MHA web with Playwright's `page` next to the phone's `screen` (e.g. a FAVE submitted on mobile: the web account must see the same cost centre); the web half only reads, no VET IC Submit or approvals. Phone asserts use `expect` from @mobilewright/test, browser asserts `webExpect` (Playwright's): mobilewright's only knows phone locators.
- One tool on the emulator at a time (a leftover Appium UiAutomator2 server blocks the others: README.md > Setup notes).
- Tool choice (same Settings flow, Settings force-stopped before each run, warm averages): e2e (tester-army) fixed steps 8.2 s, maestro-runner devicelab 8.65 s, uiautomator2 10.65 s, mobilewright 14.6 s, Maestro CLI 19.7 s; mobilewright was chosen for fit, not speed (native on Windows, Playwright Test: Test Manager, reports, typecheck; the same engine as mobile-mcp; e2e needed WSL plus an adb relay).
- Before mobilewright the app was tested with ARTEMIS (`C:\Artemis Project\artemis`); its traces hold the first "network error" hunt.

## Emulator and automation quirks
- mobilecli reads the screen with `uiautomator dump`: with a Spinner dropdown open each read takes ~5 s and a locator tap ~10 s (two stable reads), so AppScreen picks options from one tree read and taps coordinates. Rapid back-to-back dumps of a busy UI restarted the emulator's system server once. `animations: 'off'` is set in the config.
- Android opens a Spinner dropdown scrolled to the selected row: `AppScreen.pick` scrolls down and then back up. A swipe meant to scroll a short dropdown dismissed it or hit Android's go-home gesture (app in the background): AppScreen does not swipe a dropdown whose rows all fit on screen. A spinner tap right after returning home (Switch Role panel still sliding in) can miss: AppScreen taps a dropdown once more when no options show.
- A slow emulator loses taps (Search, Complete) and mobilewright's clear can delete one character and fail ("Failed to clear element"): AssignScreen re-taps and retries. "ATS isn't responding" (ANR) was seen once during Search Asset.
- The emulator crashed in the NVIDIA OpenGL driver (qemu-system-x86_64 in nvoglv64.dll, Windows Application log); started with `-gpu swiftshader_indirect` (software rendering) it stays up. An emulator started from a tool shell dies with that shell: start it detached (`Invoke-CimMethod Win32_Process Create` with `emulator.exe -avd Medium_Phone_API_36.1`) or from Android Studio. Its /data was 94% full at the last check.
- mobilecli leaves its device server (app_process com.mobilenext.mobilecli.DeviceServer, 30-minute idle timeout) holding UI automation after a run; plain `adb shell uiautomator dump` then dies (exit 137) until it is stopped (`adb shell kill <pid>`).
- Plain adb: `input text` cannot type parentheses (use keyevents 162/163); hide the keyboard (`input keyevent 111`) before tapping bottom buttons (Search, Complete), which it covers; toasts are not in `uiautomator dump`: screenshot within ~1 s.
- MHA web times are SGT, an hour ahead of the emulator's WIB.

## Test data
- Found at runtime, nothing fixed in code. Remarks typed by tests start with "QA auto mobile" (`QA_PREFIX`).
- What the phone account holds (its roles, each role's cost centres) is read once per run and remembered (`tests/utils/role-cache.ts`, `reports/.cache`, scoped by `MHM_RUN_ID`).
- Sighting and submitting on UAT is safe to repeat (uploads results, no approval involved). Approvals belong to the web roles (VET IC / URO / UAO): do not go beyond Submit from the app.
- Per test: `context/stocktake.md` (MHM-005/011/017/018/019), `context/assets.md` (MHM-006/013/014/015/016/023), `context/hta.md`.
