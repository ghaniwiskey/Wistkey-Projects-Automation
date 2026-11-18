---
id: HLM-003
title: "Pre check-in a printed item by tag ID on the handheld"
feature: pre-check-in
priority: P0
tags: [smoke, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Pre check-in

Verify that a registered item with a printed tag can be pre checked-in on the handheld and then shows as NOT CHECKED IN on the web.

## Preconditions
- A registered item whose tag is printed and that is not pre checked-in yet

## Data
- The item's 24-digit chip code

## Steps
1. On the handheld Dashboard tap Update all data, then Pre Check-in
2. Enter the chip code under Or enter EPC / Tag ID and tap Add tag
3. Verify the tag (scan it, or Simulate verify read on a device without a reader), tap Next · Review items
4. Count the items (Burst scan or Simulate burst scan) and tap Upload pre check-in
5. On the web open Check In / Out > Tagged Not Checked In and Count Item

## Expected
- The card shows the item number, type, category and New item
- Upload shows "Pre check-in uploaded - All 1 tag(s) were pre checked-in."
- The web lists the item under Tagged Not Checked In and Count Item with status NOT CHECKED IN
- Audit Trail: "Handheld register ... PUT /api/Raid/mobile/singleregister"

## Notes
Executed 2026-11-18 on the emulator (QA simulation buttons, no reader) with 001000031, 002000017, 003000025, 003000032: pass. Upload is refused until every item is counted ("Count all items first").
