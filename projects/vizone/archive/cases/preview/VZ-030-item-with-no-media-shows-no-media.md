---
id: VZ-030
title: "Item with no media shows No media"
feature: preview
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Placeholder and empty items show a clear message instead of a player.

## Preconditions
- An item with Asset media status Empty exists

## Data
- Item: first Empty item, found at runtime

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Open Search > Items, Asset media status facet, select Empty
3. Open the first result

## Expected
- The player area shows "No media"
- No video player controls are shown
