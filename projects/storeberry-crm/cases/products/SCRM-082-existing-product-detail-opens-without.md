---
id: SCRM-082
title: "Existing product detail opens without an error message"
feature: products
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Opening a product in the CRM shows no error and add-on templates load.

## Data
- Any existing active product, picked from the list at runtime

## Steps
1. Open Products and click an existing product
2. Wait 2 seconds on the Product Details tab
3. Open Add-On Products > Import From Template

## Expected
- No error toast appears (e.g. "undefined: Unexpected Error")
- The template picker lists templates or says none exist, with no "Cannot Fetch Templates" error

## Notes
Read-only. Linked bug: storeberry-crm BUG-005 (add-on template API 500).
