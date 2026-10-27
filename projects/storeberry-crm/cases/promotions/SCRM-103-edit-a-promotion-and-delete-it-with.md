---
id: SCRM-103
title: "Edit a QA promotion, then delete it with confirmation"
feature: promotions
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Promotion edits persist and delete removes only after confirmation.

## Preconditions
- None

## Data
- A minimum-spend promotion created at runtime as in SCRM-098 (X = 100, Y = 10, code `<unique>`)

## Steps
1. Open the promotion's edit (pencil) icon, change X to 700 and Y to 50, Save
2. Reopen the edit page -> Expect: X 700, Y 50; list details "above 700 can enjoy $50 discount"
3. Click the trash icon -> Expect: "Are you sure to delete this promotion rule?" with DELETE / CANCEL
4. Click CANCEL -> Expect: the promotion is still listed
5. Click the trash icon again and DELETE

## Expected
- The promotion is no longer listed and "All Promotions (n)" drops by 1
- Its code is refused on the eShop ("Promotion code is invalid, expired or exceed the usage limit")

## Notes
2026-10-27 manual: pass (promotion 661). Opening a deleted promotion's edit URL shows a bare "500 SERVER ERROR" page instead of a not-found message (risk, not filed).
