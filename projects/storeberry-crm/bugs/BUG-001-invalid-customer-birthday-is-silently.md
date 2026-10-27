---
id: BUG-001
title: "Invalid customer birthday is silently saved as today's date"
severity: major
status: open
env: staging
url: "https://www.stagingl10.storeberry.xyz/customers/edit?id=<QA member id>"
found: 2026-10-27
foundBy: "explorations/2026-10-27-crm-eshop-critical.md"
tests: [SCRM-071]
frequency: always
---
## Summary
On Edit Customers, an impossible birthday (13-45 or 02-30) is accepted without any validation message and stored as the current day (10-27 on 2026-10-27). A valid value (05-15) saves correctly. Birthday drives birthday promotions/points, so wrong data is silently created.

## Steps to reproduce
1. Sign in to the staging CRM and open a QA customer > Edit
2. Type 02-30 in Birthday (MM-DD) and press Escape to close the picker
3. Click Save
4. Reopen the customer Edit page

## Expected
Save is blocked with a birthday validation message, or the original birthday is kept.

## Actual
Save succeeds with no message; Birthday now shows 10-27 (today). Reproduced with 13-45 and 02-30; control value 05-15 saved as 05-15.

## Evidence
- Screenshot: ![birthday saved as today](../explorations/2026-10-27-crm-eshop-critical/01-birthday-02-30-saved-as-today.png)
- Same defect on eShop registration: storeberry-compare bugs (registration birthday).

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/customers/edit?id=<QA member id>
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-crm-eshop-critical.md in the Test Manager app.
