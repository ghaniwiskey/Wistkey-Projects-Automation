---
id: BUG-004
title: "CRM copy and label errors on customer and product screens"
severity: trivial
status: open
env: staging
url: "https://www.stagingl10.storeberry.xyz/customers/create"
found: 2026-10-27
foundBy: "explorations/2026-10-27-crm-eshop-critical.md"
tests: []
frequency: always
---
## Summary
Several text/label defects seen in core CRM forms.

## Steps to reproduce
1. Open Customers > Add Customer: label reads "* Language Perference" (also on Edit and in the error "The Language Perference is required.")
2. Open Products > select a product > Actions: four items read "plaform" ("Terminate in retail plaform", etc.)
3. Open Products > Add Product: the Original Price input has accessible name and placeholder "Cost", same as the real Cost field
4. Customer Edit: mobile error reads "The Mobile must be at least 6." (no unit)

## Expected
"Language Preference", "platform", Original Price labelled "Original Price", "at least 6 digits".

## Actual
As listed in the steps.

## Evidence
- Observed 2026-10-27 on staging.

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/customers/create
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-crm-eshop-critical.md in the Test Manager app.
