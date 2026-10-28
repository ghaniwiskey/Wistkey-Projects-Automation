---
id: SCRM-149
title: "Supplier list, detail and its purchase orders"
feature: suppliers
priority: P2
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Staff can look up a supplier and the purchase orders placed with it.

## Preconditions
- A supplier with at least one purchase order, found at runtime

## Steps
1. Open Suppliers, sort and use Column Setting
2. Open Detail and Purchase Orders for the supplier

## Expected
- Detail shows the supplier data; Purchase Orders lists only that supplier's POs (compare with SCRM-025/026)
- Column Setting changes persist after reload

## Notes
Feature with no cases before the 2026-10-29 feature-coverage review (menu/page found in the live staging app). Never tested. Creating/editing suppliers: check whether the page offers it and add a case if so.
