# HTX LIMS Mobile: how the app behaves and how to drive it

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

## Automated critical flows

`tests/e2e/flows/item-lifecycle.spec.ts` drives the web (browser `page`, `LimsWebPage`) and the handheld (emulator
`screen`, `tests/pages/mobile/workflow.screen.ts`) together:

- HLM-011 (~10 min): register + print on the web (printer "test") -> handheld pre check-in -> handheld check-in -> IN.
- HLM-012 (~14 min): handheld loan check-out -> whitelisted -> handheld pre check-in + check-in -> IN, off the whitelist.

Needs the emulator, the dev build's QA simulation buttons and Zebra Browser Print running on this PC (the web
printer list comes from it: http://127.0.0.1:9100; the config turns off Chromium's local network access checks so
the test browser can reach it). Pre Check-in / Check-in "Refresh items" shows an "Items downloaded" dialog.
mobilewright's `scrollIntoViewIfNeeded()` misjudges visibility in this app: screens tap first and swipe only when
the element is missing.

## Speed

mobilewright's screen reads are slow on this app: every read (locator check) takes about 6 s and every tap about
12 s, because uiautomator waits for the UI to go idle and this app never does (seen 2026-11-18 on 0.1.0; cause
not found yet). So screen objects check many texts in one view-tree read (`AppScreen.expectTexts`,
`textsOnScreen`) instead of one assertion per element, and the test timeout is 6 minutes.
While mobilewright runs, `adb shell uiautomator dump` is killed (it holds UI automation), so plain adb reads
return stale files.

## Driving the app without a reader (emulator)

- Emulators on this PC: Aside tests on AVD **Medium_Phone** (usually emulator-5554); the user works on **Medium_Tablet** (emulator-5556). Always target the phone (`adb -s emulator-5554` or `ANDROID_SERIAL`) and never touch the tablet.

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

## Why the phone tests are slow

| Action | HTX app | Android Settings |
|---|---|---|
| mobilewright screen read (viewTree / isVisible), also `mobilecli dump ui` | 5.9-6.0 s | 0.3 s |
| tap by text (read + tap) | 11.8 s | |
| tap by coordinates, Back | 0.0 s | 0.0 s |
| plain `adb shell uiautomator dump` | 2.0 s | 2.1 s |

The HTX app renders 0 frames while idle, so it is not a redraw loop; mobilecli's on-device agent waits ~6 s before it
returns the tree of this Compose app (cause not found). Reads are the cost, taps are free.
