---
id: HLW-027
title: "Audit Trail records user actions"
feature: reports
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Audit Trail

Verify that the Audit Trail records a login and a change with user, workstation IP, action, target and time.

## Steps
1. Log in to HTX LIMS web with the administrator account
2. Open Report > Audit Trail and filter User by the administrator's username

## Expected
- The latest entries include this login with the current time
- Each row shows Time, User, Workstation IP, Action, Target and Details
