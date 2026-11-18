---
id: HLM-004
title: "Check in pre checked-in items on the handheld with a location per item"
feature: check-in
priority: P0
tags: [smoke, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Handheld check-in

Verify that pre checked-in items are checked in on the handheld at the chosen storage location and become IN.

## Preconditions
- Items with status NOT CHECKED IN

## Data
- Locations: Airlock 1 (default) and Chemistry for one item

## Steps
1. On the handheld tap Check-in and Refresh items
2. For each item enter its number, tap Find item, then Add to check-in
3. Verify each item (scan or Simulate verify read) and change one item's Location to Chemistry
4. Tap Next · Review items, count (Burst scan) and Upload check-in

## Expected
- "Checked in - <n> item(s) checked in."
- On the web each item is IN at its chosen location (Item Information)
- Audit Trail: "Handheld check-in ... Location: <code>" per item

## Notes
Executed 2026-11-18 (001000031, 002000017 Airlock 1; 003000025, 003000032 Chemistry): pass. The audit text says "2 tag(s)" for one tag.
