# MHA SPF

e-RFID Asset Tracking System (ATS) for MHA/SPF fixed assets. UAT: https://mhauatweb.southeastasia.cloudapp.azure.com/ (never production). Same application as `mha-hta` (HTA database): page objects, knowledge and the user manual are shared in `shared/mha-ats/`.

## Run

```powershell
.\qa test --project=mha-spf                     # or the Test Manager (npm run tm) > MHA SPF > Playwright
.\qa test --project=mha-spf --grep "SPF-001:"
```

## Testing permissions

UAT only, never production; UAT writes can send real emails (`shared/mha-ats/context.md` > Email triggers).
- FAVE submit and approve on UAT are allowed (user rule). SPF-027 (`@final`) approves a cost centre for good: ask the user before each run, otherwise exclude it (`--grep-invert '@final'`).
- When non-approved cost centres run out, the test account may get another unit (keep 332600 APD: asset tests use its data); other User Listing accounts may be used (`shared/mha-ats/context/stocktake.md` > Test data).
- One session per account: never log in with the test account (Aside's browser included) while a run is going.

## Layout

| Path | What |
|---|---|
| `context.md` | SPF specifics (env, account, SPF-only tests). App knowledge: `shared/mha-ats/context.md` + `context/<area>.md` |
| `shared/mha-ats/pages` | Page objects, shared with mha-hta: `BasePage` (header: Role dropdown, officer, Logout, side menu, DataTables waits), `LoginPage`, `DashboardPage`, asset pages (listing, details, assignment, registration, rejection, new asset), stocktake pages (`FavePage`, `AdHocSetupPage`, `AdHocCreatePage`, `AdHocListingPage` on `StocktakeFormPage`, `FollowUpPage`, `FaveHqPage`), `AssetReportPage`, `ReportPage`, `PrintTagPage`, `RetirementPage`, `GroupPage`, Agency Admin pages (`UserListingPage`, `RoleListingPage`, `AnnouncementPage`, `CostCentrePage`, `EmailTemplatePage`) |
| `shared/mha-ats/docs/user-manual/` | CR12 web user manual (21 Sep 2026), one file per module |
| `cases/` | Test cases (`SPF-NNN`) |
| `tests/fixtures/pages.fixture.ts` | Page-object fixtures, the `role` option (`test.use({ role: 'logs1' })`), `loginAs(role)`, runtime test data (`availableAsset`, `writableAsset`, `unitPostalCode`, `faveTarget`, `faveRelocateTarget`, `officer`, `qaUser`) and `otherSession` (a second, logged-out browser context) |
| `tests/utils/test-data.ts` | Role slug -> dropdown label map, `testAccount()` (login from .env) |
| `tests/e2e` | Specs; titles start with the case ID |
| `data/` | Upload files (asset photo `qa-asset.png`) |

## Accounts

The test account comes from the root `.env` only (template: `.env.example`):

```
SPF_USER=<login ID>
SPF_PASS=            # empty for a passwordless UAT account
```

Nothing about the account is fixed in the code or in project.yaml. The tests read the officer name from the page header (fixture `officer`) and the roles from the header Role dropdown; a test that needs a role the account does not have is skipped with a message. On UAT `/Account/LoginBk` accepts the passwordless account with an empty password. Switch roles with `test.use({ role: 'logs1' })` or `basePage.switchRole('Logistics Officer 1')`.
