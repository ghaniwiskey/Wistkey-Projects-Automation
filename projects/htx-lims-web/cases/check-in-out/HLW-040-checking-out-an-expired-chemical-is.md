---
id: HLW-040
title: "Checking out an expired chemical is refused"
feature: check-in-out
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
FEFO: expired

Verify that Check Out refuses a chemical or consumable that is past its expiry date and saves nothing.

## Preconditions
- A chemical with status IN that is past its expiry date

## Data
- Purpose: For use

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Check In / Out > Check Out, tick the expired chemical, set Purpose For use and click Check Out

## Expected
- A message says the item is expired and cannot be checked out
- The item stays IN
