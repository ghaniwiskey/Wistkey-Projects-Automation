---
id: HLW-037
title: "A registered item can be deleted only until its tag is printed"
feature: registration
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Delete before printing

Verify that a registered item can be deleted while its tag has not been printed, and cannot be deleted after printing.

## Preconditions
- A registered item without a printed tag
- A registered item with a printed tag

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Registration > Item Register
3. Delete the item without a printed tag
4. Try to delete the item with a printed tag

## Expected
- The unprinted item is deleted and leaves the list
- The printed item offers no delete, or the delete is refused with a message
