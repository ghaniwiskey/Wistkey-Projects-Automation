# MHA HTA

e-RFID Asset Tracking System (ATS) for MHA/HTA fixed assets. UAT: https://mhauatwebhta.southeastasia.cloudapp.azure.com/ (never production).

Copied from `mha-spf` on 2026-10-07 (same app, separate HTA database). Left out: the assignment recall test (SPF-018) and the tests that need the FALO role, which HTA does not have (SPF-009/010/011/028 assign to or return from FALO, SPF-041 FALO closes a follow-up item). Test IDs keep the SPF numbers (HTA-008 = SPF-008), so the gaps are those tests. Differences from SPF: see context.md > HTA vs SPF.

## Run

```powershell
C:\Users\USER\.aside\runtime\node\node.exe node_modules/playwright/cli.js test --project=mha-hta
```

Or the Test Manager (`npm run tm`, http://127.0.0.1:7358) > MHA HTA > Playwright.

## Layout

| Path | What |
|---|---|
| `context.md` | Testing knowledge base: roles, asset statuses, business rules, page map, quirks, open questions |
| `docs/user-manual.md`, `docs/images/` | User manual (CR12 onboarding, 21 Sep 2026), the source for context.md |
| `cases/` | Test cases (`HTA-NNN`) |
| `tests/pages` | `LoginPage`, `BasePage` (header: Role dropdown, officer, Logout, side menu), `DashboardPage`, asset pages (listing, details, assignment, registration, rejection, new asset), stocktake pages (`FavePage`, `AdHocSetupPage`, `AdHocCreatePage`, `AdHocListingPage` on `StocktakeFormPage`), `AssetReportPage`, `ReportPage` (other table reports), `PrintTagPage`, `RetirementPage`, `GroupPage` (Settings > Group), Agency Admin pages `UserListingPage`, `RoleListingPage` (user-admin.page.ts), `AnnouncementPage`, `CostCentrePage`, `EmailTemplatePage` (settings-admin.page.ts) |
| `tests/fixtures/pages.fixture.ts` | Page-object fixtures, the `role` option (`test.use({ role: 'logs1' })`), `loginAs(role)`, runtime test data (`availableAsset`, `writableAsset`, `unitPostalCode`, `faveTarget`, `officer`, `qaUser`) and `otherSession` (a second, logged-out browser context) |
| `tests/utils/test-data.ts` | Role slug -> dropdown label map, `testAccount()` (login from .env) |
| `tests/e2e` | Specs; titles start with the case ID |
| `data/` | Upload files (asset photos < 3 MB, FAVE import template, user import template) |
| `runs/` | Run history |

## Accounts

The test account comes from the root `.env` only (template: `.env.example`):

```
HTA_USER=<login ID>
HTA_PASS=            # empty for a passwordless UAT account
```

Nothing about the account is fixed in the code or in project.yaml. The tests read the officer name from the page header (fixture `officer`) and the roles from the header Role dropdown; a test that needs a role the account does not have is skipped with a message. To use another account, change `.env`. On UAT `/Account/LoginBk` accepts the passwordless account with an empty password. Switch roles with `test.use({ role: 'logs1' })` or `basePage.switchRole('Logistics Officer 1')`.

