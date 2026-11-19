---
id: HLW-051
title: "Edit a purchase order"
feature: purchase-order
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
Edit PO in PO Management saves changed PO details and keeps the PO number.

## Preconditions
- A QA purchase order (create one with HLW-007)

## Data
- New PO Name: QA-PO-edit-<unique>
- New Delivery Date: today + 14 days

## Steps
1. Log in to HTX LIMS web with the administrator account
2. Open Purchase Order > PO Management, search for the QA PO and click Edit
3. Change PO Name, Supplier and Delivery Date, fill Manager and Officer if empty, and click Submit
4. Search for the PO again and open Edit

## Expected
- A success message is shown
- PO Management lists the PO with the new PO Name, same PO Number and status
- Edit shows the saved Supplier and Delivery Date
- Audit Trail has an entry for the change

## Notes
Coverage review 2026-11-19: the Edit PO dialog marks Manager and Officer as required, and they were empty on QAPO521908 (created through PO Creation): note whether an existing PO can be saved without picking them.
