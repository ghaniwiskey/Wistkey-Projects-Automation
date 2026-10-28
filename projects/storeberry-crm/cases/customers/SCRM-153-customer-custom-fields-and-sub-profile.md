---
id: SCRM-153
title: "Customer custom fields and sub-profile options appear on the customer form and are saved"
feature: customers
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Shop-specific customer data can be collected and stored.

## Preconditions
- Ask the user first: this is a settings change (README > Testing permissions).

## Data
- A QA custom field (text) and a QA sub-profile option

## Steps
1. Add the custom field and the sub-profile option
2. Edit a QA customer, fill them and save; reopen
3. Check the eShop registration/profile if the field is shown there

## Expected
- Values persist on the customer and show in the customer detail
- Cleanup: remove the QA field and option

## Notes
Feature with no cases before the 2026-10-29 feature-coverage review (menu/page found in the live staging app). Never tested.
