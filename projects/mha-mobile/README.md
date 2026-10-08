# MHA Mobile

Native Android app under test: **com.iconsult.mhasgtwo** (2.0-dev), tested via **ARTEMIS**, the autonomous
Android agent on this machine (`C:\Artemis Project\artemis`), driving the Android emulator.

This project holds the test management data for that testing: cases (`cases/`, `MHM-NNN`), bugs (`bugs/`),
plans (`plans/`) and run records (`runs/`).

## Web target

None yet: `project.yaml` carries an `.invalid` placeholder URL so the project stays registered; the
template smoke spec (`tests/e2e/smoke/home.spec.ts`) skips itself until a real URL is set (env edit or
`MHM_BASE_URL` override). It becomes a normal test when a web/mobile-web environment exists.

## Test accounts

Not wired yet. When the app's test account is known it goes in `.env`, never in the workspace.
