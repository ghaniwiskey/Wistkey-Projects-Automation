---
id: VZ-029
title: "Item without a proxy shows Missing proxy instead of a broken player"
feature: preview
priority: P2
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
An item whose proxy was never made tells the user clearly.

## Preconditions
- A video item with Asset media status Failed and no Proxy file exists

## Data
- Item: first Failed video item, picked when you run the test

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the admin test account (user name admin; get the password from the QA lead)
2. Open Search > Items, Asset media status facet, select Failed
3. Open the first result that has a duration

## Expected
- The player area shows "Missing proxy"
- The Overview still shows Duration, Start TC and Format
- The Files tab lists only Highres files

## Notes
Seen on test221109 bb2 p02 v0001 on 2026-10-30.
