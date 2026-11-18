---
id: HLW-014
title: "Check in an item that is out"
feature: check-in-out
priority: P0
tags: [smoke, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Check In

Verify that an item with status OUT can be checked in on the web and becomes IN.

## Preconditions
- At least one item with status OUT in Check In / Out > Check In

## Data
- Item: the first OUT item in the Check In list

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Check In / Out > Check In and note the first item's Item Number
3. Click Check In on its row and confirm

## Expected
- A success message is shown and the item leaves the Check In list
- Inventory > Item Information shows the item with Status IN
- The item appears in Check In / Out > Check Out under Checked-In Items

## Notes
Clean-up: check the item out again with the same purpose it had (Check In Out Report shows it).
