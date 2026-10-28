---
id: SBF-052
title: "Guest checkout works in Safari (WebKit) and Firefox"
feature: checkout
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Customers on iPhone/Mac Safari and Firefox can buy, not only Chrome users.

## Preconditions
- Playwright browsers webkit and firefox

## Data
- A non-quota product found at runtime (e.g. NAKAJIMA cake)
- Dotted unique guest email
- Bank Transfer (fn-bank-transfer), store pickup

## Steps
1. Run the SBF-016 guest flow in WebKit
2. Run it in Firefox

## Expected
- Both place an order; date pickers, popups and the receipt upload work
- Cleanup: void the orders

## Notes
Gap from the 2026-10-29 critical-flow review, third pass (no existing case found by search). Never tested.
