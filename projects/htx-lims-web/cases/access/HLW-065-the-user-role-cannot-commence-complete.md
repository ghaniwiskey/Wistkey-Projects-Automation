---
id: HLW-065
title: "The User role cannot commence, complete or abort a stock take by address"
feature: access
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
Stock takes are administrator-only: a User who opens /stocktakedetail/<number> by address cannot change its state.

## Preconditions
- A QA stock take in Draft for a future period (HLW-018)
- A User account without extra permissions

## Steps
1. Log in to HTX LIMS web with a User account
2. Open /stocktakedetail/<QA stock take number> by address
3. Click Abort and confirm

## Expected
- The page shows "You're Not Authorized!" or Commence / Complete / Abort are not offered
- The stock take keeps its status (Stock Take List as administrator)

## Notes
Found 2026-11-19 (HLW-061 session): USER1 aborted ST00000018.
