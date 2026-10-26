---
id: SCRM-023
title: "Inventory search locates stock by SKU or barcode"
feature: inventory
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A CRM user can locate a product or variant in inventory using its SKU or barcode.

## Preconditions
- An active inventory item with a SKU or barcode is available.

## Data
- SKU or barcode of an existing staging item; do not include personal data.

## Steps
1. Sign in to the staging CRM and open Inventory.
2. Select an existing product variant and note its SKU or barcode privately.
3. Search by that exact SKU or barcode.

## Expected
- The matching product or variant appears in the results.
- The row shows the corresponding inventory quantities and platform status.

## Notes
Read-only. Do not change inventory.
