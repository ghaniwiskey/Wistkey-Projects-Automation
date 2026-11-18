---
id: HLW-028
title: "Add a storage location"
feature: master-data
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Storage Location

Verify that an administrator can add a storage location and use it in item lists and reports.

## Data
- Location Code: QA<unique>
- Location Description: QA room <unique>

## Steps
1. Log in to HTX LIMS web with the administrator account
2. Open Master Data > Storage Location and click Add Storage Location
3. Enter the code and description and save

## Expected
- The location is listed with its code and description
- It can be picked as Location in Report > Stock Level Report and as Storage Location in Check Out

## Notes
There is no Delete on this page: a QA location stays. Confirm before running.
