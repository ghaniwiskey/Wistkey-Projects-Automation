---
id: SPF-030
title: "Print Tag reason is required and Others needs remarks of at most 200 characters"
feature: print-tag
priority: P2
tags: [regression]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
The Reason step of Print Tag validates the reason and the Others remarks before anything is sent to the printer.

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) with Logistics Officer 1 active

## Data
- Asset: the first asset in Print Tag > Choose Asset (found at runtime)

## Steps
1. Asset > Print Tag, Next, tick the first asset, Next, Next
2. Pick **Select Reason** (empty) and Submit
3. Pick **OTHER** and Submit with empty Remarks
4. Type 205 characters into Remarks

## Expected
- The reason defaults to WEAR & TEAR; the options include Defaced, Faulty Tag, LOST, OTHER, Printing Error, WEAR & TEAR
- Step 2 shows "Reason is required" and stays on the Reason step
- OTHER shows a Remarks field; step 3 shows "Remarks is required"
- Remarks stops at 200 characters and the counter shows "200 / 200"

## Notes
Read-only: nothing is submitted with a valid reason.

Automated in tests/e2e/print-tag/print-tag.spec.ts.
