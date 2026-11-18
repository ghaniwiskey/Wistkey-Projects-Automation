---
id: HLW-026
title: "Stock Expiry Report lists items expiring within a number of days"
feature: reports
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Expiring stock

Verify that the Stock Expiry Report lists only items expiring within the chosen number of days.

## Preconditions
- At least one item with an expiry date in the next 30 days

## Data
- Expiring within (days): 30

## Steps
1. Log in to HTX LIMS web with the administrator account
2. Open Report > Stock Expiry Report, set Expiring within (days) to 30 and click Search

## Expected
- Every row has Days left of 30 or fewer (expired items show their status)
- Days left matches the expiry date counted from today
