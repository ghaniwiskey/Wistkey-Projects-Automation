---
id: HLW-043
title: "A loan due date in the past is refused"
feature: check-in-out
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Loan due date

Verify that a Loan check-out with a due date in the past is refused.

## Preconditions
- An item with status IN

## Data
- Due Date: yesterday

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Check Out, tick the item, set Purpose Loan and Due Date yesterday, click Check Out

## Expected
- The past date cannot be picked, or a message says the due date cannot be in the past
- The item stays IN
