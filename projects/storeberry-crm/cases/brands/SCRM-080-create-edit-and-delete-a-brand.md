---
id: SCRM-080
title: "Create, edit and delete a brand"
feature: brands
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Brand CRUD works.

## Data
- Name: ASIDE-QA-BRAND-<unique>

## Steps
1. Add Brand: name + short description > Save
2. Open the brand, change the name > Save, reopen
3. Tick only it > Action > Delete the brand > OK

## Expected
- "Create brand successful..."
- "Update successful"-type message and the new name persists
- Brand no longer listed

## Notes
Edit currently fails with HTTP 500 (2026-10-27).
