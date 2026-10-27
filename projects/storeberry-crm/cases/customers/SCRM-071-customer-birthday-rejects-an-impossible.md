---
id: SCRM-071
title: "Customer birthday rejects an impossible date"
feature: customers
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
An impossible MM-DD birthday is never saved on a customer.

## Preconditions
- A QA customer created for this test (email @example.com, opt-in No)

## Data
- Birthday: 02-30, then 13-45; control 05-15

## Steps
1. Open the QA customer > Edit
2. Type 02-30 in Birthday (MM-DD), close the picker and Save
3. Reopen Edit and read Birthday
4. Repeat with 13-45, then with 05-15

## Expected
- 02-30 and 13-45 are rejected with a validation message, or the previous birthday is kept
- Birthday never becomes today's date unless typed
- 05-15 saves and shows 05-15 after reopening

## Notes
Linked bug: storeberry-crm invalid birthday saved as today (2026-10-27).
