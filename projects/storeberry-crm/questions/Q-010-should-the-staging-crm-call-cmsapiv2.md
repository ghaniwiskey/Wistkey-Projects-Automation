---
id: Q-010
title: "Should the staging CRM call cmsapiv2.storeberry.ai for add-on templates?"
status: open
askedTo: "Product owner"
env: staging
found: 2026-10-27
foundBy: "explorations/2026-10-27-crm-eshop-critical.md"
tests: []
bugs: [BUG-005, BUG-022]
updated: 2026-10-27T10:45:09.565Z
answered: ""
---
## Question
Is cmsapiv2.storeberry.ai the intended CMS API host for staging, or should staging use a staging host?

## Context
Every product detail page calls GET https://cmsapiv2.storeberry.ai/cmsapi/addon-products/templates/product/<id> (HTTP 500, BUG-005). The host is not a staging domain, so staging may be pointing at a shared or production service.

## Answer
Not answered yet.

## History
- 2026-10-27: asked from explorations/2026-10-27-crm-eshop-critical.md.
- 2026-10-27: Appointments also call cmsapiv2.storeberry.ai and get 403 code 2208 on staging (BUG-022).
