# MHA ATS web (shared)

The e-RFID Asset Tracking System web app: one application, one database per agency (SPF, HTA). Shared by `projects/mha-spf` and `projects/mha-hta` (page objects, knowledge, manual) and read by `projects/mha-mobile` for its MHA web checks (it keeps its own slim web page objects in `projects/mha-mobile/tests/pages/web`).

| Path | What |
|---|---|
| `pages/` | Page objects of both web suites: `base.page.ts` (header, Role dropdown, side menu, DataTables waits) and one file per area. Agency differences are protected flags with SPF behavior by default; HTA switches them on in `projects/mha-hta/tests/pages` (`FavePage.assetIdByLabel`, `AssignmentCreatePage.fillsEmptyLocationGroup`) |
| `context.md` | Core knowledge: product, roles, statuses, email side effects, page map, menus, common test data, quirks on every page |
| `context/<area>.md` | Rules, observed behavior, quirks and test data per area: `assignment-registration`, `stocktake`, `maintenance-reports`, `admin-settings` |
| `docs/user-manual/` | CR12 web user manual (21 Sep 2026), one file per module; `docs/images/` screenshots |

Per agency (env, account, differences): `projects/mha-spf/context.md`, `projects/mha-hta/context.md`. Bugs stay per project, so shared notes name the project (mha-spf BUG-016).

A change in `pages/` affects both suites: typecheck, then run the affected tests in both projects (`.\qa test --project=mha-spf --project=mha-hta --grep "SPF-0NN:|HTA-0NN:"`).
