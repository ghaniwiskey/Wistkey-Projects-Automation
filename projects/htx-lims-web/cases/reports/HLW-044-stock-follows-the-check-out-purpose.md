---
id: HLW-044
title: "Stock follows the check-out purpose"
feature: reports
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Stock by purpose

Verify that the stock of an item type stays the same after a Loan check-out and goes down by 1 after For use or No return.

## Preconditions
- Three IN items of the same item type

## Steps
1. Log in to HTX LIMS web with the administrator account and note the item type's Stock in Report > Stock Level Report
2. Check out one item on Loan and note the Stock
3. Check out one item For use and note the Stock
4. Check out one item No return and note the Stock

## Expected
- After Loan the Stock is unchanged (In lab -1, On loan +1)
- After For use the Stock is 1 lower
- After No return the Stock is 1 lower again
- Stock always equals In lab + On loan
