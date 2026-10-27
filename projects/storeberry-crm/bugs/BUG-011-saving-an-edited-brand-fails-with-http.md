---
id: BUG-011
title: "Saving an edited brand fails with HTTP 500 (\"error exist!\")"
severity: major
status: verified
env: staging
url: "https://www.stagingl10.storeberry.xyz/brands/edit?id=24"
updated: 2026-10-27T09:08:00.453Z
found: 2026-10-27
foundBy: "explorations/2026-10-27-crm-eshop-critical.md"
tests: [SCRM-080]
frequency: always
---
## Summary
Creating a brand works, but any save on the brand edit page fails. POST /brands/edit returns HTTP 500 {"message":"Server Error"} and the page shows the toast "error exist!". Nothing is saved. Seen on a QA brand without a logo (name change, then short description change).

## Steps to reproduce
1. Brands > Add Brand: name ASIDE-QA-BRAND-<unique>, short description, Save ("Create brand successful")
2. Open the new brand (brands/edit?id=<id>)
3. Change the name or the short description and click Save

## Expected
"Update successful" and the new values persist.

## Actual
Toast "error exist!"; network 500 Server Error; values unchanged. Reproduced twice on brand 24 (deleted afterwards). Request body fields: _token, brand, upload_detail, upload_logo_detail.

## Evidence
- Screenshot: ![brand edit 500](../explorations/2026-10-27-crm-eshop-critical/09-brand-edit-500.png)
- Not tried on a brand with a logo (to avoid changing real brands).

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/brands/edit?id=24
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-crm-eshop-critical.md in the Test Manager app.
- 2026-10-27: status open -> verified.
- 2026-10-27: status verified -> fixed.
- 2026-10-27: status fixed -> verified.
- 2026-10-27: SCRM-080 note updated: must pass.
