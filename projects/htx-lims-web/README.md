# HTX LIMS Web

HTX LIMS (Laboratory Inventory Management System for HTX) at https://htx.eastus.cloudapp.azure.com:5001/ (UAT, default env `staging`). Test IDs `HLW-NNN`. App behavior, quirks and test data go in `context.md` once there is something to write (docs/conventions.md > Knowledge files).

- The UAT server uses a self-signed certificate: project.yaml sets `ignoreHTTPSErrors: true`.
- Login: `/Identity/Account/Login` (Username, Password, Remember me). Log out from the user button at the top of the main area > Log Out.
- Menu: Dashboard; Operations (Inventory, Registration, Purchase Order, Check In / Out, Stock Take); Monitoring and reports (Gantry, Report); Administration (Master Data, System); My Account.

## Accounts

From `.env` only (`HLW_<ACCOUNT>_USER` / `HLW_<ACCOUNT>_PASS`):

| Account | Role in the app | Menu |
|---|---|---|
| ADMIN | Administrator | everything |
| USER1, USER2 | User | no Stock Take, Report, Master Data, System |

## Run

```powershell
.\qa test --project=htx-lims-web
```

## Testing permissions

- **Gantry flow (user, 2026-11-18):** the HTX API Swagger (/swagger, Basic auth HLW_SWAGGER_USER / HLW_SWAGGER_PASS) is for testing the gantry flow only: gantry reads through `POST /api/Gantry/authorizerfid` / `unauthorizerfid` are allowed. Move test items back to their room afterwards; do not acknowledge the alerts they raise without asking. Details: [context/gantry.md](context/gantry.md).
- **Web writes on UAT (user, 2026-11-18):** testing may create and change data, including irreversible steps (approve PO, For use / No return check-outs, stock takes, acknowledging alerts, printing tags on the Zebra printer, storage locations, users); undoing is not required (llowWrites: true). Still use QA-prefixed data and note what was left behind in the session file.
- Before this permission (kept for reference): ask the user what may be written on UAT (inventory records, registrations, purchase orders, check in/out, stock takes, alert acknowledgements, master data, users) and about rate or session limits, then write the answers here. Until then the env is read-only (`allowWrites: false`).
