---
id: SCRM-079
title: "Create, edit and delete a hidden category"
feature: categories
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Category CRUD works without exposing test data to shoppers.

## Data
- Name: ASIDE-QA-CAT-<unique>
- Show in Retail/Online: off

## Steps
1. Add Category with no name > Save
2. Enter the name, untick both Show in ... options > Save
3. Open it, rename and set parent General > Save, reopen
4. Tick only it in the list > Action > Delete the category > OK

## Expected
- "The Category name is required."
- "Create category successful..." and both platform bubbles off
- "Update successful"; name and parent persist
- Category no longer listed

## Notes
Verified 2026-10-27 (id 326).
