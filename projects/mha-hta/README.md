# MHA HTA

e-RFID Asset Tracking System (ATS) for MHA/HTA fixed assets. UAT: https://mhauatwebhta.southeastasia.cloudapp.azure.com/ (never production). Same application as `mha-spf` (separate HTA database): page objects, knowledge and the user manual are shared in `shared/mha-ats/`. Test IDs keep the SPF numbers (HTA-008 = SPF-008); the gaps are the FALO tests, since HTA has no FALO role (`context.md`).

## Run

```powershell
.\qa test --project=mha-hta                     # or the Test Manager (npm run tm) > MHA HTA > Playwright
.\qa test --project=mha-hta --grep "HTA-001:"
```

HTA-027 (`@final`) approves a FAVE cost centre for good: ask the user before each run, otherwise exclude it (`--grep-invert '@final'`).

## Layout

| Path | What |
|---|---|
| `context.md` | What differs on HTA (roles, data, user delete, bug cross-reference). App knowledge: `shared/mha-ats/context.md` + `context/<area>.md` |
| `shared/mha-ats/pages` | Page objects, shared with mha-spf (list: `projects/mha-spf/README.md`) |
| `tests/pages` | HTA overrides of shared page objects: `FavePage` (asset IDs by label), `AssignmentCreatePage` (fills an empty location group) |
| `cases/` | Test cases (`HTA-NNN`) |
| `tests/fixtures/pages.fixture.ts` | Page-object fixtures, the `role` option (`test.use({ role: 'logs1' })`), `loginAs(role)`, runtime test data (`availableAsset`, `writableAsset`, `unitPostalCode`, `faveTarget`, `faveRelocateTarget`, `officer`, `qaUser`) and `otherSession` |
| `tests/utils/test-data.ts` | Role slug -> dropdown label map, `testAccount()` (login from .env) |
| `tests/e2e` | Specs; titles start with the case ID |
| `data/` | Upload files (asset photo `qa-asset.png`) |

## Accounts

The test account comes from the root `.env` only (template: `.env.example`):

```
HTA_USER=<login ID>
HTA_PASS=            # empty for a passwordless UAT account
```

Nothing about the account is fixed in the code or in project.yaml. The tests read the officer name from the page header (fixture `officer`) and the roles from the header Role dropdown; a test that needs a role the account does not have is skipped with a message. On UAT `/Account/LoginBk` accepts the passwordless account with an empty password. Switch roles with `test.use({ role: 'logs1' })` or `basePage.switchRole('Logistics Officer 1')`.
