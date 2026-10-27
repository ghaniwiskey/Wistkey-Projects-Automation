# Storeberry Flower eShop (storeberry-compare)

Guest and member checks of the Storeberry Flower public eShop. CRM (staff) workflows: `projects/storeberry-crm/`. App behavior and quirks: `context.md`.

## Environments

- `staging` (default): https://storeberry-flower.stagingl10.storeberry.xyz/ (writes allowed within the permissions)
- `production`: https://storeberry-flower.mystoreberry.com/ (read-only; the published storefront the CRM's "Visit my online store" link opens)

Select with `$env:QA_ENV='staging'` or `$env:QA_ENV='production'`. The originally supplied https://www.mystoreberry.com/ is the CRM login, not the eShop; CRM tests and credentials are in `projects/storeberry-crm/`. Guest storefront checks need no login.

## Testing permissions

The storeberry-crm rules apply (`projects/storeberry-crm/README.md` > Testing permissions): staging only, our own QA data, eShop orders with Bank Transfer only (`fn-bank-transfer`), production read-only.

## Run

```powershell
$env:QA_ENV='staging'     # or production
.\qa test --project=storeberry-compare
```
