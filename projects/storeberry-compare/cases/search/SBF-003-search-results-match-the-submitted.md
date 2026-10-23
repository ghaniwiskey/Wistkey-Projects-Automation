---
id: SBF-003
title: "Search results match the submitted product name"
feature: search
priority: P1
tags: [smoke]
envs: [all]
automated: false
created: 2026-10-23
updated: 2026-10-23
---

## Goal
A shopper can find a known product using its name.

## Data
- Product currently listed on the storefront: Disable Test

## Steps
1. Open the storefront home page
2. Search for Disable Test
3. Review the search results

## Expected
- The results page identifies the query Disable Test
- Each returned product matches the query, including Disable Test when it is listed

## Notes
Staging result set did not match this query; see BUG-001.
