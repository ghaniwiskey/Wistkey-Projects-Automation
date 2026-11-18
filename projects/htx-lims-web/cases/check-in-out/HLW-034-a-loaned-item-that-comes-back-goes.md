---
id: HLW-034
title: "A loaned item that comes back goes through pre check-in, count and check-in again"
feature: check-in-out
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Loan return

Verify that a returned loan item is pre checked in and counted on the handheld and checked in again, without a new tag, and ends IN and off the whitelist.

## Preconditions
- An item checked out on Loan
- The handheld app signed in

## Steps
1. On the handheld, pre check-in the returned item (scan its tag) and count it
2. Carry it through gantry 1a (or send the read through Swagger)
3. Log in to HTX LIMS web with a User account and check the item in at its storage location

## Expected
- After pre check-in the item's status is NOT CHECKED IN and it is listed under Tagged Not Checked In
- After check-in the status is IN and the item can be checked out again
- The item is no longer on the gantry whitelist
- No tag reprint was needed (same chip code)

## Notes
There is no Return purpose. Workflow 'A loaned item comes back'.
