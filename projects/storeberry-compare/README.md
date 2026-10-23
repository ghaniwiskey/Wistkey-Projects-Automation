# Storeberry Flower comparison

This project is the test workspace for comparing the Storeberry Flower storefront on staging and production. It was scaffolded with the home-page smoke case; comparison journeys and login automation are not set up yet.

## Environments

- `staging` (default): `https://storeberry-flower.stagingl10.storeberry.xyz/`
- `production`: `https://www.mystoreberry.com/`

Both environments are configured as read-only (`allowWrites: false`) to avoid changing customer or production data. Select one with `QA_ENV=staging` or `QA_ENV=production`. Staging is the default.

## Test account

Both sites use the same Storeberry Flower account. Configure it only in your ignored local `.env` file using the `SBF_COMPANY`, `SBF_USERNAME`, and `SBF_PASSWORD` variables shown in `.env.example`. Never commit the real values. The project metadata contains only the environment variable names.

The login flow has not yet been explored or automated. Next setup step is to inspect the login and key storefront journeys on both environments, then design the comparison cases and selectors.

## Run

```powershell
$env:QA_ENV='staging'     # or production
& 'C:\Users\USER\.aside\runtime\node\node.exe' node_modules/playwright/cli.js test --project=storeberry-compare
```
