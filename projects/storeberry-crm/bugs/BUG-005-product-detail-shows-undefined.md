---
id: BUG-005
title: "Product detail shows \"undefined: Unexpected Error\" because the add-on template API returns 500"
severity: major
status: open
env: staging
url: "https://www.stagingl10.storeberry.xyz/products/edit?id=3197"
found: 2026-10-27
foundBy: "explorations/2026-10-27-crm-eshop-critical.md"
tests: []
frequency: always
---
## Summary
Opening any existing product in the CRM shows a red toast "undefined: Unexpected Error" about 0.5 s after load. On load the page calls GET https://cmsapiv2.storeberry.ai/cmsapi/addon-products/templates/product/<id>, which returns HTTP 500 {"code":9999,"message":"Unexpected Error"}. The list endpoint GET addon-products/templates also returns 500, so Add-On Products > Import From Template cannot load templates ("Cannot Fetch Templates" toast, modal says "Records Not Found"). The global nodeCmsAxios error handler prints `${data.statusCode}: ${data.message}`, but the API returns `code`, not `statusCode`, so the toast reads "undefined".

## Steps to reproduce
1. Sign in to the staging CRM and open Products
2. Open any existing product (seen on 3191, 3193, 3194, 3197, 3198)
3. Wait about 1 second and look at the bottom-right corner
4. Open the Add-On Products tab and click Import From Template

## Expected
The product page loads with no error and add-on templates load; if the service is down, a clear specific message is shown instead of "undefined".

## Actual
Toast "undefined: Unexpected Error" on every product detail page (5 of 5 checked). Import From Template shows "Cannot Fetch Templates" and the modal says "Records Not Found". Network: HTTP 500 from cmsapiv2.storeberry.ai/cmsapi/addon-products/templates/product/<id> and /addon-products/templates. Add Product (/products/create) does not call this API and shows no toast.

## Evidence
- Screenshot: ![product detail error](../explorations/2026-10-27-crm-eshop-critical/02-product-detail-unexpected-error.png)
- Response body: {"code":9999,"message":"Unexpected Error"}
- Handler (inline script on the page): alertify.error(`${error.response.data.statusCode}: ${error.response.data.message}`)
- Question: the staging CRM calls cmsapiv2.storeberry.ai (not a staging host). Confirm this is the intended CMS API for staging.

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/products/edit?id=3197
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-crm-eshop-critical.md in the Test Manager app.
