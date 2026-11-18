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

Not set yet: ask the user what may be written on UAT (inventory records, registrations, purchase orders, check in/out, stock takes, alert acknowledgements, master data, users) and about rate or session limits, then write the answers here. Until then the env is read-only (`allowWrites: false`).
