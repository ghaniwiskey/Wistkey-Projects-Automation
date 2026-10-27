---
id: SCRM-131
title: "\"Assign one code per member on registration\" gives each new member exactly one code"
feature: promotions
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Welcome codes are handed out once per new member.

## Preconditions
- A QA Multiple Promotion Code promotion with the option ticked and Generated codes in stock

## Steps
1. Register a new eShop member with a unique email
2. Log in again (no second code expected)
3. Open the promotion code list

## Expected
- Exactly one code shows the new Member ID and Member Reserved At
- Stock drops by one; logging in again does not assign another
- The member can apply the code at checkout

## Notes
Idea from explorations/2026-10-28-promo-code-orders.md. Members cannot see codes on My Promotion Codes yet (storeberry-compare BUG-019).
