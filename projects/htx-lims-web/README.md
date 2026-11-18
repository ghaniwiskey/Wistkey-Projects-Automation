# HTX LIMS Web

HTX LIMS Web at https://htx-lims-web.invalid/ (default env `staging`). Test IDs `HLW-NNN`. **The base URL is a placeholder** (`.invalid`): set the real one in project.yaml before running. App behavior, quirks and test data go in `context.md` once there is something to write (docs/conventions.md > Knowledge files).

## Run

```powershell
.\qa test --project=htx-lims-web
```

## Testing permissions

Not set yet: ask the user what may be written on which env (records, orders, payments, messages to people) and about rate or session limits, then write the answers here.
