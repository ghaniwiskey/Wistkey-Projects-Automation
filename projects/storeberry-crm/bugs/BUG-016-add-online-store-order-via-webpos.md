---
id: BUG-016
title: "Add Online Store Order via WebPOS cannot save shipping: /webpos/check-shipping returns 500 (\"Oops... error exist!\")"
severity: critical
status: verified
env: staging
url: "https://www.stagingl10.storeberry.xyz/webpos?store_id=1&version=beta"
updated: 2026-10-28T04:55:09.259Z
found: 2026-10-27T09:05:39.119Z
foundBy: "explorations/2026-10-27-fulfilment-stock.md"
tests: [SCRM-092]
frequency: always (4/4)
---
## Summary
Staff cannot create online orders from the CRM. Add Online Store Order via WebPOS requires shipping before Total, but every shipping Submit calls POST /webpos/check-shipping which returns HTTP 500 {"message":"Server Error"}; the POS shows "Oops... error exist!". Seen with 門市自取 (3x) and Testing (1x).

## Steps to reproduce
1. Orders > Add Order > Add Online Store Order via WebPOS
2. Select member MEMy001164525 and add product test 2
3. Click Shipping, choose 門市自取, enter address "Aside QA test address - do not ship", select 荔枝角, Submit
4. Close the error and click Total

## Expected
Shipping is saved and the order can be checked out.

## Actual
"Oops... error exist!" (check-shipping HTTP 500 Server Error). Total then says "Please input and confirm Shipping information first." so no online order can be created.

## Evidence
- Screenshot: ![check-shipping 500](../explorations/2026-10-27-fulfilment-stock/03-add-order-check-shipping-500.png)
- Request body: shipping_method_id 88, store_id 1, country_iso HK, selections {"175":"荔枝角"}

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/webpos?store_id=1&version=beta
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-fulfilment-stock.md in the Test Manager app.
- 2026-10-28: status open -> verified.
- 2026-10-28: Case SCRM-092 notes updated: expected to pass (bug set to verified by the user)..
- 2026-10-28: Retest passed: SCRM-092 in runs/2026-10-28_1155_staging_manual.
