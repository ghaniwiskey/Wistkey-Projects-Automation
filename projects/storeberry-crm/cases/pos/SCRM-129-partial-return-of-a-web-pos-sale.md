---
id: SCRM-129
title: "Partial return of a Web POS sale refunds the item and puts it back in stock"
feature: pos
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
In-store returns are reflected in money, points and stock.

## Preconditions
- A completed Web POS cash sale of 2 items for a QA member (SCRM-085)

## Data
- Cash only

## Steps
1. Order detail > Exchange / Partial Return: return 1 item, no new item, finish
2. Read the order, member Point History and Inventory for the store warehouse

## Expected
- Refund amount = returned item net price; linked return order created
- Points earned on the returned item taken back
- Store warehouse stock +1 for that item

## Notes
Idea from explorations/2026-10-27-pos-order-lifecycle.md.
