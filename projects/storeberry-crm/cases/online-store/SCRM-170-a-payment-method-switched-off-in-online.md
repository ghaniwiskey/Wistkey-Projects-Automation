---
id: SCRM-170
title: "A payment method switched off in Online Store settings cannot be used at checkout"
feature: online-store
priority: P1
tags: [regression, writes, security]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Customers can only pay with methods the shop has enabled.

## Preconditions
- Ask the user first: settings change on the shared staging shop (README > Testing permissions).
- Only Bank Transfer may be used for orders; do not enable card or wallet gateways

## Data
- Method to switch off: Bank Transfer (fn-bank-transfer) briefly, then back on

## Steps
1. Open checkout in one tab
2. Switch off Bank Transfer in the CRM
3. Reload checkout; then Proceed in the old tab with Bank Transfer still selected

## Expected
- After reload Bank Transfer is not offered
- The old tab is refused; no order is created with the disabled method
- Cleanup: switch Bank Transfer back on and confirm checkout offers it

## Notes
Critical flow inside a feature first covered on 2026-10-29 (feature-coverage review follow-up). Never tested.
