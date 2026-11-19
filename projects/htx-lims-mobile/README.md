# HTX LIMS Mobile

> **No new automation (user, 2026-11-18):** do not add specs, screen objects or other automation for this app. Test it by hand on the emulator and record manual runs (test cases are still written). The existing specs stay and are run or fixed only when asked. Reason: htx-lims-mobile README > Why the phone tests are slow.

Native Android handheld app of HTX LIMS: **com.htx.lims.dev** (0.1.0, Kotlin/Jetpack Compose, Chainway "rscja"
RFID SDK, `MainActivity`), on the Android emulator (AVD `Medium_Phone`) against UAT. Test IDs `HLM-NNN`.
`project.yaml` baseUrl is HTX LIMS web UAT (https://htx.eastus.cloudapp.azure.com:5001/, same backend and accounts),
for tests that set up or check data in the browser.

App behavior, how to drive it without a reader (typed tags, QA simulation buttons, emulators), and why the phone tests are slow: [context.md](context.md).

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

