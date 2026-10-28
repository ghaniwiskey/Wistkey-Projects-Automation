---
id: SBF-051
title: "A shopper can complete checkout with the keyboard only and every field has a label"
feature: checkout
priority: P2
tags: [regression, writes, a11y]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Customers using keyboards or screen readers can buy.

## Preconditions
- Logged-in QA member, cart with one non-quota product

## Data
- Bank Transfer (fn-bank-transfer), store pickup

## Steps
1. Close the popups with Escape/Tab+Enter
2. Tab through checkout, fill every field, choose Bank Transfer, tick the agreement and Proceed

## Expected
- Focus is always visible, never trapped, and follows the visual order
- Every input, radio and checkbox has an accessible name (getByLabel/getByRole find it)
- The order is placed; cleanup: void it

## Notes
Gap from the 2026-10-29 critical-flow review, third pass (no existing case found by search). Never tested.
