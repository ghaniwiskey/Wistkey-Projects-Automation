---
id: HLW-011
title: "Register several units at once"
feature: registration
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Number of units

Verify that registering an item with Number of units 3 creates three items with the same details and their own item numbers.

## Data
- Item description: QA multi <unique>
- Number of units: 3

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Registration > Item Register
3. Fill the required fields with Number of units 3 and click Register

## Expected
- Registered items not checked in yet lists 3 new items with the description
- Each has a different Item Number, all with Status NOT PRE CHECK IN
