---
id: SBF-064
title: "An ended promotion's landing page no longer gives the discount"
feature: promotions
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Customers cannot get a deal after it has ended, even from an old link.

## Preconditions
- A QA promotion with a landing page we create, ending 1 hour ahead (SCRM-098 flow)

## Steps
1. Open the landing page and add a product while the promotion is live
2. After the end hour reload the page and the checkout

## Expected
- After the end the page says the promotion ended (or 404s) and the checkout total has no discount
- Cleanup: delete the QA promotion, empty the cart

## Notes
Critical flow inside a feature first covered on 2026-10-29 (feature-coverage review follow-up). Never tested. Related: SBF-060, SBF-056.
