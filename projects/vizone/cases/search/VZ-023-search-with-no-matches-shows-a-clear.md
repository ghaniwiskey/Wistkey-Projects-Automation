---
id: VZ-023
title: "Search with no matches shows a clear empty result"
feature: search
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
A search that matches nothing tells the user so instead of showing an empty or loading page.

## Data
- Keyword: qa-nomatch-<unique>

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Search Items for qa-nomatch-<unique>

## Expected
- The page shows "No search results found" within 5 seconds
- The search box keeps the typed keyword
