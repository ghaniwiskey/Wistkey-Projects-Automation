---
id: SBF-046
title: "Receipt upload refuses unsupported or oversized files with a clear message"
feature: account
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Customers are told when their receipt file cannot be used instead of a silent failure.

## Preconditions
- An unpaid Bank Transfer order of a QA member

## Data
- Files made at runtime: .txt, .pdf, 0-byte .jpg, 20 MB .jpg

## Steps
1. My Orders > the order > Upload Receipt: upload each file and Submit

## Expected
- Unsupported or broken files are refused with a message naming the allowed types/size
- A PDF is either accepted and viewable by staff in the CRM, or refused with a message
- The order stays Pending Payment after a refused file
- Cleanup: void the order

## Notes
Gap from the 2026-10-29 critical-flow review, second pass (no existing case found by search). Never tested.
