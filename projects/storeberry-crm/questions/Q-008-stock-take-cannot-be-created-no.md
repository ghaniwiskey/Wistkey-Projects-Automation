---
id: Q-008
title: "Stock Take cannot be created: no assignees are mapped to any warehouse"
status: open
askedTo: "Product owner"
env: staging
found: 2026-10-27
foundBy: "explorations/2026-10-27-crm-eshop-critical.md"
tests: [SCRM-030]
bugs: []
answered: ""
---
## Question
Is the empty assignee list a setup gap on staging (staff not mapped to warehouses) or a bug? Who should map a stock take user so stock take can be tested?

## Context
Create Stock Take Job requires an Assignee. /stock-take/get-warehouse-assignees returns {"users":[]} for Office, Causeway Bay, TaiPo, TEST12 and test 1. Earlier jobs were assigned to "jacky". Changing staff mapping needs your OK under the testing rules.

## Answer
Not answered yet.

## History
- 2026-10-27: asked from explorations/2026-10-27-crm-eshop-critical.md.
