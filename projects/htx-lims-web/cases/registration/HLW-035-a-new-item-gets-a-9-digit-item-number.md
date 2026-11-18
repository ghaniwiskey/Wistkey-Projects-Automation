---
id: HLW-035
title: "A new item gets a 9-digit item number from its category"
feature: registration
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Item number format

Verify that a newly registered item gets a 9-digit Item Number made of the category ID (3 digits) and a running number (6 digits).

## Data
- Item category: Chemical (category ID 003), item description: QA item <unique>, CAS number: 64-17-5

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Registration > Item Register and note the highest Item Number of a Chemical item in Inventory > Item Information
3. Register one Chemical item

## Expected
- The new Item Number has 9 digits and starts with 003
- Its last 6 digits are the next running number after the highest existing Chemical item
