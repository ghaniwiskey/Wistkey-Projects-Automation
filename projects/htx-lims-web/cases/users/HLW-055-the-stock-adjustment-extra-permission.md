---
id: HLW-055
title: "The Stock adjustment extra permission lets a User adjust stock take results"
feature: users
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
A User with the extra permission Stock adjustment can adjust not-located items of a completed stock take; a User without it cannot.

## Preconditions
- A QA user with the User role (HLW-030)
- A completed stock take with a not-located QA item (HLW-047)

## Steps
1. Log in as the QA user and try to open the completed stock take's Stock Take Detail (Stock Take List by address /stocktakelist)
2. As administrator, Edit the QA user, tick Extra permissions > Stock adjustment and Save
3. After a minute, log in again as the QA user and open the same Stock Take Detail
4. Adjust the not-located QA item to NOT FOUND with a reason

## Expected
- Without the permission the user cannot reach or use the stock adjustment
- With the permission the adjustment is offered and the item becomes NOT FOUND
- User Management shows Stock adjustment under Extra permissions for the user
- Audit Trail records the adjustment under the QA user

## Notes
Coverage review 2026-11-19: Edit User has Extra permissions > Stock adjustment; no case covered it. HLW-048 covers the adjustment as administrator.
