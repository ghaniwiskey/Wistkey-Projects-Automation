---
id: SCRM-159
title: "Facebook posts and live rooms list, filter and create orders from comments"
feature: social
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Social-selling orders from Facebook reach the CRM.

## Preconditions
- A connected test Facebook page (user provides); Ask the user first before publishing or sending anything to a real social account (irreversible, public).

## Data
- Date filters: Today, This week

## Steps
1. Open Facebook Posts and Live Rooms and filter
2. Create a live room with a QA product (if a test page is connected) and simulate a comment order

## Expected
- Lists filter correctly; a comment order creates a CRM order for the commenter

## Notes
Feature with no cases before the 2026-10-29 feature-coverage review (menu/page found in the live staging app). Never tested. Blocked until a test Facebook page is connected.
