---
id: HLW-007
title: "Create a purchase order"
feature: purchase-order
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
PO Creation

Verify that a user can create a purchase order and find it in PO Management.

## Preconditions
- At least one PO location and item type exist in the PO Creation lists

## Data
- PO Number and PO Name: QA-PO-<unique>
- Supplier: QA Supplier
- PO Date: today, Delivery Date: today + 7 days

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Purchase Order > PO Creation
3. Fill PO Number, PO Name, Address, Supplier, Department, Team In Charge, Contact Person, Contact Number
4. Pick a PO Location and an Item Type, set PO Date and Delivery Date
5. Click Submit
6. Open Purchase Order > PO Management and search for the PO Number

## Expected
- A success message is shown after Submit
- PO Management lists the PO with its PO Number, PO Name and status
- The Manager column shows the user who created it

## Notes
What the new PO's status is (pending vs approved) is not known yet: note it.
