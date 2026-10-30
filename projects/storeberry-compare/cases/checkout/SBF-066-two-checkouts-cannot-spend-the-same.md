---
id: SBF-066
title: "Two checkouts cannot spend the same loyalty points twice"
feature: checkout
priority: P0
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Concurrent cash dollar redemption

Verify that two prepared checkouts for the same member cannot redeem more points in total than the member owns.

## Preconditions
- A QA member has a known points balance and can redeem cash dollars.
- Two independent browser sessions are available.
- Available products and the current redemption limits allow a redemption in each checkout that is affordable alone but exceeds the points balance when combined.

## Data
- Member balance B and redemption R read from the current rules: R is allowed for each basket, R is no greater than B, and 2 × R is greater than B.
- Bank Transfer and store pickup only.

## Steps
1. Log in to the eShop as the same QA member in both independent sessions.
2. Note the member points balance and prepare two eligible checkout pages. Apply redemption R to each.
3. Submit both prepared checkouts without waiting for the first to finish.
4. Open the resulting orders in the CRM and compare their cash dollar discounts with the member point history and balance.
5. Void every order created by this test and reread the point history and balance.

## Expected
- The total points spent across the orders does not exceed the starting balance B, and the member balance never becomes negative.
- A redemption that is no longer affordable is rejected or requires the shopper to review a corrected checkout before an order is placed.
- Each cash dollar discount on an accepted order is backed by exactly one matching points deduction; the same points are not counted toward both orders.
- Voiding the test orders returns only the points actually deducted, once per redemption.

## Notes
Proposed coverage gap, not executed and not a confirmed defect. Duplicate check: SBF-054 covers single-checkout limits and insufficient points; SCRM-066 covers a normal redemption. Neither exercises two prepared redemptions against the same balance. SBF-028/BUG-023 accepts stock overselling, not double spending loyalty points. Each run must have explicit approval for both checkout attempts and cleanup; no unattended retries.
