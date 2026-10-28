---
id: SBF-019
title: "Guest checkout with a plus-addressed email is refused without placing an order"
feature: checkout
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-28
---

## Goal
A plus-addressed email (name+tag@example.com) is refused at guest checkout (accepted behavior, BUG-012 wont-fix) and no order is created.

## Preconditions
- A non-quota product in the guest cart (e.g. NAKAJIMA cake)

## Data
- Guest email name+<unique>@example.com
- Shipping 門市自取, first pickup store, Bank Transfer

## Steps
1. Open /checkout as a guest and fill First Name, Last Name, Contact Number
2. Enter a plus-addressed email (name+tag@example.com) in Your Details
3. Choose 門市自取, a pickup store and an address, Bank Transfer, tick 結帳前同意
4. Click Proceed to checkout

## Expected
- The dialog "Please fill all required info" appears and the page stays on /checkout
- No order is created (no thank-you page or order number)

## Notes
BUG-012, closed as wont-fix (2026-10-28): refusing plus-addressed emails with the generic dialog is accepted behavior, so this case now expects the refusal. Use dotted unique emails for other guest orders. Bank Transfer only.
