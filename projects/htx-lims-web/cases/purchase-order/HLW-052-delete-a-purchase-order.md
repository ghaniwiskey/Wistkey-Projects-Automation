---
id: HLW-052
title: "Delete a purchase order"
feature: purchase-order
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
Delete in PO Management asks for confirmation and removes the PO.

## Preconditions
- A QA purchase order made for this test (create one with HLW-007)

## Steps
1. Log in to HTX LIMS web with the administrator account
2. Open Purchase Order > PO Management, search for the QA PO and click Delete
3. Cancel the confirmation, then click Delete again and confirm
4. Search for the PO Number

## Expected
- Delete asks for confirmation; Cancel keeps the PO
- After confirming, the PO is no longer listed
- Audit Trail has an entry for the deletion

## Notes
Coverage review 2026-11-19. Who may delete any PO is open (Q-001). Only delete QA POs.
