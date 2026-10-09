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

```
npm run test:mhm                                                    # every MHA Mobile test
npm run test:mhm -- --grep MHM-002                                  # one test
npm run test:auto -- -c projects/mha-mobile/playwright.config.ts    # with Test Manager's heal flow
```

The tests run with their own config, [playwright.config.ts](playwright.config.ts): mobilewright's global setup starts
its device pool and mobilecli, which web runs must not pay for, so the root config skips this project
(`playwright.runner: mobilewright` in project.yaml). `npm test`, `Run Tests.cmd` and `npm run test:auto` without `-c`
run the web projects only. Runs are still recorded in `runs/`, and `npm run report` opens the latest HTML report.

A test can also check its result in MHA web: mobilewright's `test` is Playwright Test's, so the browser `page` is
available next to the phone's `screen` (the web URL is in projects/mha-spf/project.yaml, the MHA web page objects in
projects/mha-spf/tests/pages). Assert the phone with `expect` from `@mobilewright/test` and the browser with
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

## Web target

None: `project.yaml` carries an `.invalid` placeholder URL so the project stays registered, and the web smoke spec
(`tests/e2e/smoke/home.spec.ts`, MHM-001) skips itself while it is set.

## Test accounts

In `.env` as `MHM_USER` / `MHM_PASS` (mobile login = the account's full NRIC; the UAT account is passwordless), read
with `mhmAccount()` from tests/utils/test-data.ts. Never in the workspace.

Testing details (login, role and cost-centre switching, the FAVE sighting and submit flow, submit findings, tool
benchmarks): [context.md](context.md).
