---
id: HLW-024
title: "Chemical Usage lists chemicals first expiry first"
feature: inventory
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
First expiry, first use

Verify that Chemical Usage orders chemicals so the one that expires first is used first.

## Preconditions
- At least two chemicals of the same kind with different expiry dates

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Inventory > Chemical Usage
3. Search for a chemical name that has several batches

## Expected
- Use order 1, 2, 3 ... follows the expiry date from earliest to latest
- Each row shows CAS, classification, batch, production, expiry and delivery dates, room and item number
