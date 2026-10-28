# {{name}}

{{name}} at {{baseUrl}} (default env `{{env}}`). Test IDs `{{prefix}}-NNN`. App behavior, quirks and test data go in `context.md` once there is something to write (docs/conventions.md > Knowledge files).

## Run

```powershell
.\qa test --project={{slug}}
```

## Testing permissions

Not set yet: ask the user what may be written on which env (records, orders, payments, messages to people) and about rate or session limits, then write the answers here.
