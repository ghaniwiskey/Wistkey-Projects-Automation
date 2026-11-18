---
id: HLW-023
title: "Find an item in Item Information"
feature: inventory
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Item search

Verify that Item Information finds an item by its item number and filters by type and status.

## Preconditions
- At least one item exists

## Data
- Item number: taken from the first row of the list

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Inventory > Item Information and note the first item's number, type and status
3. Search for that item number
4. Reset, then set Type to the item's type and Status to its status and search

## Expected
- The search for the number lists that item
- With the filters every listed item has the chosen type and status
- Details opens the item's details
