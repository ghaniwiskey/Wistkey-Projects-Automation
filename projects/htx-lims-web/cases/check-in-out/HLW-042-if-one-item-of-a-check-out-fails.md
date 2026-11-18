---
id: HLW-042
title: "If one item of a check-out fails, nothing is saved"
feature: check-in-out
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
All or nothing

Verify that a check-out of several items where one item is refused saves none of them.

## Preconditions
- One valid IN item and one expired chemical with status IN

## Data
- Purpose: For use

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Check Out, tick both items and click Check Out

## Expected
- The check-out is refused with the reason for the expired item
- Both items stay IN
