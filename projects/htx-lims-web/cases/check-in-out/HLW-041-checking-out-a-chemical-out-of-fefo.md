---
id: HLW-041
title: "Checking out a chemical out of FEFO order shows a warning"
feature: check-in-out
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
FEFO: order

Verify that checking out a batch of a chemical while an earlier-expiring batch is still in stock shows a FEFO warning but allows the check-out.

## Preconditions
- Two IN batches of the same chemical with different expiry dates

## Data
- Purpose: For use

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Inventory > Chemical Usage and note which batch is Use order 1
3. Open Check Out, tick the later-expiring batch and check it out For use

## Expected
- A warning says an earlier-expiring batch should be used first
- After confirming, the item is checked out (status OUT)
