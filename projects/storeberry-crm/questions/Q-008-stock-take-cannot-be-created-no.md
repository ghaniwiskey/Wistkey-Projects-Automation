---
id: Q-008
title: "Stock Take cannot be created: no assignees are mapped to any warehouse"
status: open
askedTo: "Product owner"
env: staging
found: 2026-10-27
foundBy: "explorations/2026-10-27-crm-eshop-critical.md"
tests: [SCRM-030]
bugs: [BUG-020]
updated: 2026-10-27T10:00:33.249Z
answered: ""
---
## Question
Is the empty assignee list a setup gap on staging (staff not mapped to warehouses) or a bug? Who should map a stock take user so stock take can be tested? Update 2026-10-27: warehouse mapping alone is not enough; does the Assignee list require the logged-in user to have a Stock Take Admin/Staff role, and can that be given to ghani?

## Context
Create Stock Take Job requires an Assignee. /stock-take/get-warehouse-assignees returns {"users":[]} for Office, Causeway Bay, TaiPo, TEST12 and test 1. Earlier jobs were assigned to "jacky". Changing staff mapping needs your OK under the testing rules.

## Answer
Not answered yet.

## History
- 2026-10-27: asked from explorations/2026-10-27-crm-eshop-critical.md.
- 2026-10-27: With the user's OK, mapped ghani (158) to TaiPo Warehouse via Warehouses > Edit > Warehouse Users > Save Users. Assignee list still empty for every warehouse: get-warehouse-assignees returns users [] even for Causeway Bay, where mapped_user_ids = [116, 152, 156, 158] and jacky (116) has the Stock Take Staff and Stock Take Admin roles with Causeway Bay assigned. jacky still created jobs there at ~17:00 HKT, so the list may depend on the viewer's own Stock Take role. ghani cannot edit its own staff record (Access Denied), so another admin must give ghani a Stock Take role. Found BUG-020 on the way.
