---
id: SCRM-136
title: "Stock take job times are shown in local (HKT) time everywhere"
feature: inventory
priority: P3
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Staff can compare job creation, snapshot and count times without converting time zones.

## Preconditions
- A stock take job created during the session (note the local time)

## Steps
1. Stock Take list: read Created At of the job
2. Job detail: read Created at in Job information
3. Job detail after Start Counting / Submit: read the Snapshot and Current Instock times

## Expected
- All three show the same local time base (HKT, UTC+8) as the rest of the CRM

## Notes
Found in explorations/2026-10-28-payment-recovery-fix-retests.md. Related UTC display bugs: BUG-006 (replenish), BUG-026 (promo code Staff Reserved At).
