---
id: HLW-012
title: "Item Register checks required fields"
feature: registration
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Required fields

Verify that Register does not save an item while required fields are empty.

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Registration > Item Register
3. Click Register without filling anything

## Expected
- Each required field (marked *) shows a validation message
- The count of registered items not checked in yet does not change
