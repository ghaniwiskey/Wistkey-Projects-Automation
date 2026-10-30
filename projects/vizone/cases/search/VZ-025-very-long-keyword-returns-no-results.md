---
id: VZ-025
title: "Very long keyword returns no results without an error"
feature: search
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
A 300 character keyword does not crash or hang the search.

## Data
- Keyword: the letter a repeated 300 times

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Search Items for the 300 character keyword

## Expected
- The page shows "No search results found" within 5 seconds and no error message
