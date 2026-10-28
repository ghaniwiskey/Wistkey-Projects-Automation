---
id: SCRM-154
title: "Customer List Management imports a member list from a file and reports bad rows"
feature: customers
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Staff can bulk-import members without corrupting data.

## Preconditions
- The template downloaded from Create Template

## Data
- File with 2 valid new QA members, 1 duplicate email, 1 invalid email

## Steps
1. Customer List Management > New Member List > Select file > Upload file > OK
2. Search the customers

## Expected
- The 2 valid members are created with the file data; the bad rows are refused with a reason
- Cleanup: delete the imported QA members (SCRM-072)

## Notes
Feature with no cases before the 2026-10-29 feature-coverage review (menu/page found in the live staging app). Never tested.
