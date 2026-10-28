---
id: SCRM-158
title: "Online Store template edit is reflected on the eShop"
feature: online-store
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Staff can change the storefront content and see it live.

## Preconditions
- Ask the user first: this is a settings change (README > Testing permissions). The storefront is shared with other testers.

## Data
- A small, reversible change (e.g. a banner text) chosen with the user

## Steps
1. Online Store > My Templates > Edit; make the change and save/publish
2. Open the eShop home page

## Expected
- The change shows on the eShop; nothing else on the page breaks
- Cleanup: revert the change

## Notes
Feature with no cases before the 2026-10-29 feature-coverage review (menu/page found in the live staging app). Never tested.
