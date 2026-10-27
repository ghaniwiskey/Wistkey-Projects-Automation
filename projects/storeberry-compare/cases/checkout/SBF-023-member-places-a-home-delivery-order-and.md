---
id: SBF-023
title: "Member places a home-delivery order and staff deliver it"
feature: checkout
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Home delivery checkout applies the shipping method rules and the order can be packed and dispatched to Complete.

## Preconditions
- Logged-in QA member
- An in-stock product (e.g. product test 2)

## Data
- Delivery method 香港本地送貨; region/district/area chosen at runtime

## Steps
1. Add the product and open /checkout
2. Select JD while the total is below HKD 1,000 and read the message
3. Select 香港本地送貨, fill Region, District, Area and Address, Bank Transfer, tick 結帳前同意, Proceed
4. Upload a receipt; in the CRM accept it
5. Delivery > Pack All > Save > Dispatch > OK

## Expected
- JD shows "available for orders between $1000.00 ~ $3000.00 ... does not meet the requirement"
- The CRM order shows the delivery method, region, district, area and address
- After dispatch the order, payment and delivery status are Complete and Inventory History shows DELIVERED -1

## Notes
Verified manually 2026-10-27: TXN0126102700024 (HKD 700, shipping fee HKD 0).
