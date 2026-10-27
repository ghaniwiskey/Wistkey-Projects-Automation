# MHA Mobile

Native Android app under test: **com.iconsult.mhasgtwo** ("Asset Tracking System (ATS)", 2.0-dev) on the Android
emulator, against UAT.

- **Exploring** (finding bugs, learning the screens): Claude Code drives the emulator through **mobile-mcp**, on the
  Claude subscription. The login is typed with adb straight from `.env`, so the NRIC never passes through the chat.
- **Automation**: fixed-step **mobilewright** tests (Playwright Test with `device` and `screen` fixtures, no AI in the
  tests) in `tests/e2e`, page objects in `tests/pages`. A test links to its case by the title prefix (`MHM-002: ...`).

This project also holds the test management data: cases (`cases/`, `MHM-NNN`), bugs (`bugs/`), plans (`plans/`) and
run records (`runs/`).

## Running the tests

Start the emulator first (Android Studio > Device Manager). Then, from the repo root:

```powershell
.\qa mhm                                              # every MHA Mobile test
.\qa mhm --grep "MHM-002:"                            # one test
$env:QA_ENV='staging-hta'; .\qa mhm                   # HTA (agency HTA, HTA web, MHM_HTA_USER + HTA_USER)
.\qa auto -c projects/mha-mobile/playwright.config.ts # with Test Manager's heal flow
```

npm equivalents: `npm run test:mhm [-- args]`, `npm run test:auto -- -c <that config>`.

The tests run with their own config, [playwright.config.ts](playwright.config.ts): mobilewright's global setup starts
its device pool and mobilecli, which web runs must not pay for, so the root config skips this project
(`playwright.runner: mobilewright` in project.yaml). `npm test`, `Run Tests.cmd` and `npm run test:auto` without `-c`
run the web projects only. Runs are still recorded in `runs/`, and `npm run report` opens the latest HTML report.

A test can also check its result in MHA web: mobilewright's `test` is Playwright Test's, so the browser `page` is
available next to the phone's `screen` (the web URL is in projects/mha-spf/project.yaml; MHA web page objects and knowledge
are in shared/mha-ats/). Assert the phone with `expect` from `@mobilewright/test` and the browser with
Playwright's (`import { expect as webExpect } from '@playwright/test'`): mobilewright's `expect` only knows phone
locators.

## Setup notes (this machine)

- mobilewright 0.0.64 requires `@playwright/test` **1.63.0 exactly**; package.json pins it so only one Playwright copy
  is installed. Upgrade them together.
- mobilecli, mobilewright's device server, listens on **13000** instead of its default 12000, which is inside a port
  range Windows reserves for Hyper-V/WSL here (`netsh int ipv4 show excludedportrange protocol=tcp`). Override with
  `MHM_MOBILECLI_PORT`.
- mobile-mcp 1.0.8 runs mobilecli 1.0.17 and mobilewright 0.0.64 runs 1.0.18, so switching between them restarts the
  shared mobilecli daemon (a few seconds, harmless).
- One automation tool on the emulator at a time (mobile-mcp, mobilewright, Maestro). A leftover Appium UiAutomator2
  server from `maestro-runner --driver uiautomator2` holds Android's UI automation:
  `adb shell am force-stop io.appium.uiautomator2.server.test` and `adb shell am force-stop io.appium.uiautomator2.server`.

## Web target and suite layout

`project.yaml` baseUrl is **MHA web UAT** (same backend as the app). Tests use the browser `page` to set up data and
to check what the phone sent; MHM-001 checks that MHA web is up.

| Path | What |
|---|---|
| `tests/pages/mobile/` | Screen objects on mobilewright's `screen`: `LoginScreen`, `HomeScreen` (bottom bar, Switch Role panel, tiles), `StocktakeListScreen` / `FaveScreen` / `StocktakeDetailScreen` (stocktake.screen.ts, online and offline; not sighted, wrong location with the new-location fields), `SearchAssetScreen`, `AssignScreen` (Relocate; Assign to a role/user, Select Asset by Assignee (LOGS1)), `NewAssetScreen` (address dialog, photo picker), `RegistrationScreen` (Register Asset list and form, photo with the camera-permission prompt); base `AppScreen` (resource-id locators, dialogs, dropdown picks) |
| `tests/pages/web/` | Slim MHA web page objects (`WebLoginPage`, `WebFavePage`, `WebAssetPage`, `WebAssignmentPage` (list, newest of an asset, approve, reject, new location), `WebNewAssetPage`, `WebAdHocPage` (one-off lookup, stocktaker, PENDING) on `WebBasePage` (`useRole` for a second web role)), adapted from mha-spf because projects do not import from each other |
| `tests/fixtures/pages.fixture.ts` | Extends `@mobilewright/test`: screen and page objects, `mobileHome` (fresh mobile login), `mobileOfficer`, `webRole` option (`test.use({ webRole: 'vet-ic' })`, saved web session; vet-ic, logs1, uro), `faveTarget` (FAVE asset for the officer, reset to PENDING afterwards), `phoneAsset(role)` (web asset in a cost centre the phone offers), `network` (adb Wi-Fi/data, always back on), `galleryPhoto` (pushes `data/qa-photo.png`). Exports `expect` (phone) and `webExpect` (Playwright, browser locators) |
| `tests/utils/device.ts` | adb helpers mobilewright lacks: `setNetwork`, `pushGalleryPhoto` |
| `tests/e2e/` | auth (MHM-002/003), role (MHM-004/012/024), stocktake (MHM-005/011/017/018/019), asset (MHM-006), assignment (MHM-008/009/014/015/016/022), registration (MHM-013/023), new-asset (MHM-010), smoke (MHM-001). MHM-007 is manual |

Phone locators: `screen.getByTestId('<resource-id>')` (the app has no accessibility labels). Never `fill()` the login:
mobilewright puts the typed text in the step title, so `LoginScreen` types it through the driver.

## Test accounts

In `.env` only: `MHM_USER` / `MHM_PASS` (mobile login = the account's full NRIC; the UAT account is passwordless),
read with `mhmAccount()`; MHA web: `MHM_WEB_USER` / `MHM_WEB_PASS`, defaulting to the mha-spf account
(`SPF_USER` / `SPF_PASS`), read with `webAccount()` (tests/utils/test-data.ts). The web account needs VET IC
(MHM-005), LOGS1 (MHM-006) and URO (MHM-016); tests skip with a message when a role is missing. Never in the workspace.

Testing details: [context.md](context.md) (app, accounts, login and roles, sessions, emulator quirks, test data) and
[context/](context/) (stocktake, assets, hta, manual).
