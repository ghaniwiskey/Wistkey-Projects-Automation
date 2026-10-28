---
id: SBF-061
title: "Brand page lists only that brand's products"
feature: catalog
priority: P2
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Shopping by brand works.

## Preconditions
- A brand link found at runtime on the home page (/brand/<name>)

## Steps
1. Open the brand page
2. Open a few products

## Expected
- Every product belongs to the brand (compare with CRM Brands product count, SCRM-043)

## Notes
Feature with no cases before the 2026-10-29 feature-coverage review (menu/page found in the live staging app). Never tested.
