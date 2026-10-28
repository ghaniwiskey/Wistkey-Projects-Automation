---
id: SCRM-156
title: "Remark templates can be created and used on an order remark"
feature: orders
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Staff save time with reusable remarks.

## Data
- QA template text with a unique suffix

## Steps
1. Remark Template > Add: name, paragraph and a custom field > Save
2. Apply it on an unpaid QA order remark and save

## Expected
- The template text (with the custom field) is inserted and saved on the order
- Cleanup: delete the template, void the order

## Notes
Feature with no cases before the 2026-10-29 feature-coverage review (menu/page found in the live staging app). Never tested.
