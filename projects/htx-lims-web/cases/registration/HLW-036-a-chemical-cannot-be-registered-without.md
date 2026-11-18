---
id: HLW-036
title: "A chemical cannot be registered without a CAS number"
feature: registration
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
CAS number required

Verify that Item Register refuses a Chemical item without a CAS number.

## Data
- Item category: Chemical

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Registration > Item Register, pick category Chemical, fill item type and description, leave CAS number empty
3. Click Register

## Expected
- A message says the CAS number is required
- No item is added to Registered items not checked in yet
