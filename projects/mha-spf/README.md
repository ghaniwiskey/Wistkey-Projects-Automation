# MHA SPF

e-RFID Asset Tracking System (ATS) for MHA/SPF fixed assets. UAT: https://mhauatweb.southeastasia.cloudapp.azure.com/ (never production).
Ported on 2026-10-05 from `projects/web-automation/projects/mha-spf` (Aside + e2e) to this Playwright POM layout.

## Run

```powershell
C:\Users\USER\.aside\runtime\node\node.exe node_modules/playwright/cli.js test --project=mha-spf
```

Or the Test Manager (`npm run tm`, http://127.0.0.1:7358) > MHA SPF > Playwright.

## Layout

| Path | What |
|---|---|
| `context.md` | Testing knowledge base: roles, asset statuses, business rules, page map, quirks, open questions |
| `docs/user-manual.md`, `docs/images/` | User manual (CR12 onboarding, 21 Sep 2026), the source for context.md |
| `cases/` | Test cases (`SPF-NNN`) |
| `tests/pages` | `LoginPage`, `BasePage` (header: Role dropdown, officer, Logout, side menu), `DashboardPage`, asset pages (listing, details, assignment, registration, rejection, new asset), stocktake pages (`FavePage`, `AdHocSetupPage`, `AdHocCreatePage`, `AdHocListingPage` on `StocktakeFormPage`), `AssetReportPage`, `ReportPage` (other table reports), `PrintTagPage`, `RetirementPage`, `GroupPage` (Settings > Group) |
| `tests/fixtures/pages.fixture.ts` | Page-object fixtures plus `loginAs(role)` (replaces the old `flows/login.md`) |
| `tests/utils/test-data.ts` | Role slug -> dropdown label map, `testAccount()` (login from .env) |
| `tests/e2e` | Specs; titles start with the case ID |
| `data/` | Upload files (asset photos < 3 MB, FAVE import template, user import template) |
| `runs/` | Run history, including the first agentic run carried over from web-automation |

## Accounts

The test account comes from the root `.env` only (template: `.env.example`):

```
SPF_USER=<login ID>
SPF_PASS=            # empty for a passwordless UAT account
```

Nothing about the account is fixed in the code or in project.yaml. The tests read the officer name from the page header (fixture `officer`) and the roles from the header Role dropdown; a test that needs a role the account does not have is skipped with a message. To use another account or agency (e.g. HTA), change `.env`. On UAT `/Account/LoginBk` accepts the passwordless account with an empty password. Switch roles with `test.use({ role: 'logs1' })` or `basePage.switchRole('Logistics Officer 1')`.

## Not carried over

- `e2e.config.ts`, `e2e.bench.config.ts`, `benchmarks/goals.e2e.ts` and the `2026-10-05_1350_staging_e2e-cli` run: agentic e2e-framework benchmarks (asset listing details, Assign & Relocate wizard up to the location step). This repo is Playwright-only; the goals are good candidates for SPF-002/003 specs.
- `flows/login.md`: replaced by `LoginPage` + the `loginAs` fixture.
