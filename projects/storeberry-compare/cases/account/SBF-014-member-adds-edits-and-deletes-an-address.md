---
id: SBF-014
title: "Member adds, edits and deletes an address"
feature: account
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Address book CRUD works.

## Data
- Hong Kong, 住宅送貨, QA address text

## Steps
1. My Address Book > Add New, choose Hong Kong and a shipping method, leave Phone/Address empty > Add
2. Fill all required fields > Add
3. Edit it, change the address > Save Change
4. Delete it > OK

## Expected
- Empty required fields are blocked ("Please fill out this field.")
- Address listed after Add
- Edited text shown after reload
- "Are you sure you want to remove this address?" then no QA address remains

## Notes
Verified 2026-10-27.
