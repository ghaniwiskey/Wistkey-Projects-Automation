---
id: HLW-046
title: "Stock at or below minimum raises a Low stock alert"
feature: alerts
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Low and high stock

Verify that an item type whose stock is at or below its Min raises a Low stock alert, and at or above its Max a High stock alert.

## Preconditions
- An item type with Min and Max set in Master Data > Item Type

## Steps
1. Log in to HTX LIMS web with the administrator account
2. Compare Report > Stock Level Report with the Dashboard alerts

## Expected
- Every item type with Stock <= Min has a Low stock alert: "Stock for <type> is <n> item(s), at or below minimum <min>."
- Every item type with Stock >= Max has a High stock alert
