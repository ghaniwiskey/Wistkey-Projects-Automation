---
id: SCRM-116
title: "A unit sold in Web POS is no longer available to the eShop when both sell from the same warehouse"
feature: inventory
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
In-store and online sales share one stock count, so the last unit cannot be sold twice.

## Preconditions
- A store whose POS warehouse also serves Online Shop, found at runtime (Physical Stores POS > View, Add Transfer Order warehouse labels); skip with a clear note if no warehouse is shared
- A product with available = 1 in that warehouse

## Data
- Tender: Cash only (POS); Bank Transfer only (eShop)

## Steps
1. Web POS: sell 1 unit to a QA member (Cash)
2. eShop: open the product page and try to add 1 unit, then open /checkout
3. CRM: read the product row in Inventory and Inventory History

## Expected
- Step 1: completed POS order
- Step 2: the product is shown as sold out / Add To Cart is refused, or checkout flags it and will not place the order
- Step 3: Available 0 for the warehouse and a history row for the POS sale
- Cleanup: refund the POS sale (SCRM-086) so the unit comes back

## Notes
Gap from the 2026-10-28 coverage review. On 2026-10-27 Storeberry HK sold from TEST12 and Online Shop from TaiPo/Office/IFC/半島倉, so the shared-warehouse precondition may need a store mapping; ask before changing store or warehouse settings (project rule).
