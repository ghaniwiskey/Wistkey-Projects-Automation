---
id: BUG-008
title: "Stock Take Detail labels the stock take number as Title"
severity: trivial
status: open
env: staging
url: "https://htx.eastus.cloudapp.azure.com:5001/stocktakelist"
updated: 2026-11-18T04:14:57.625Z
found: 2026-11-18T04:14:57.625Z
foundBy: "explorations/2026-11-18-web-testing.md"
tests: [HLW-018]
frequency: always
---
## Summary
Stock Take Detail shows 'Title : ST00000014' and then 'Title : QA ST 625531': the first label should be the stock take number.

## Steps to reproduce
1. Stock Take > Stock Take List > Show on any stock take

## Expected
'Stock Take No : ST00000014' and 'Title : <title>'.

## Actual
Both lines are labelled 'Title :'.

## Evidence
- 

## Environment
- Base URL: https://htx.eastus.cloudapp.azure.com:5001/stocktakelist
- Env: staging

## History
- 2026-11-18: filed from explorations/2026-11-18-web-testing.md in the Test Manager app.
