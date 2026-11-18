---
id: HLW-009
title: "Approve a purchase order"
feature: purchase-order
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
PO approval

Verify that a PO waiting for approval can be approved in PO Management and its status changes.

## Preconditions
- A PO that is not approved yet (create one first)

## Steps
1. Log in to HTX LIMS web with the administrator account
2. Open Purchase Order > PO Management and search for the PO
3. Click Approve on its row and confirm

## Expected
- The PO Status changes to APPROVED
- Audit Trail has an entry for the approval with the user and time

## Notes
Who may approve is open: Q-001 (the User role sees Approve and Delete on every PO).
