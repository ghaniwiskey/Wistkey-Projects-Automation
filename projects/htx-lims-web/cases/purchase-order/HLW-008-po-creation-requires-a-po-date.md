---
id: HLW-008
title: "PO Creation requires a PO date"
feature: purchase-order
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
PO date required

Verify that PO Creation does not submit without a PO date.

## Data
- PO Number: QA-PO-<unique>

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Purchase Order > PO Creation
3. Fill the PO Number and PO Name, leave PO Date empty and click Submit

## Expected
- The message "PO date is required." is shown under PO Date
- No PO with that number appears in PO Management
