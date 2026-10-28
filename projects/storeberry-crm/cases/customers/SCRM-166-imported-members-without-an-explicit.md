---
id: SCRM-166
title: "Imported members without an explicit marketing consent are not opted in"
feature: customers
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Imports do not subscribe people to marketing without consent.

## Data
- Import file: one new QA member with the opt-in column empty, one with No

## Steps
1. Import the file
2. Open both members and the Mailchimp/marketing audience if connected

## Expected
- Both members are opted out of marketing (no default Yes)
- Cleanup: delete both members

## Notes
Critical flow inside a feature first covered on 2026-10-29 (feature-coverage review follow-up). Never tested. Related: Q-003 (opt-in default on registration), SCRM-157.
