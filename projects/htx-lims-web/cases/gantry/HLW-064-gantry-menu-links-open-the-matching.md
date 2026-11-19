---
id: HLW-064
title: "Gantry menu links open the matching pages"
feature: gantry
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
Each Gantry menu entry opens the page it names.

## Preconditions
- An administrator account

## Steps
1. Log in to HTX LIMS web as administrator
2. Open Gantry and click Gantry Log, Authorized Log, Unauthorized Log and Gantry Whitelist in turn
3. Open System > Gantry Setup

## Expected
- Each link opens the page with the same heading (Gantry Log, Authorized Log, Unauthorized Log, Gantry Whitelist)
- Gantry Whitelist lists the whitelisted chip codes, not the gantry setup
- System > Gantry Setup opens Gantry Setup

## Notes
Found 2026-11-19 after the deploy that moved Gantry Setup to System.
