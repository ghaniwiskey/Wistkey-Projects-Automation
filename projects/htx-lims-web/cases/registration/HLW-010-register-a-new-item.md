---
id: HLW-010
title: "Register a new item"
feature: registration
priority: P0
tags: [smoke, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Item Register

Verify that a user can register a new item and it appears in the list of registered items not checked in yet.

## Preconditions
- Item categories and item types exist (Master Data)

## Data
- Item category: Consumable (e.g.), first item type of that category
- Item description: QA item <unique>
- Number of units: 1
- Serial number: QA-SN-<unique>

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Registration > Item Register
3. Pick the item category and item type, fill Item description, Number of units and Serial number
4. Click Register

## Expected
- A success message is shown and the form is cleared
- Registered items not checked in yet lists the item with a new Item Number, the description, category, item type and serial
- Its Status is NOT PRE CHECK IN and Tag printed is empty
