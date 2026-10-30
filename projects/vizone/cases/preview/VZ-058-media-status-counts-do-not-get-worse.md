---
id: VZ-058
title: "Media status counts do not get worse after the upgrade"
feature: preview
priority: P1
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
The upgrade does not leave items Failed, Empty or stuck Importing.

## Preconditions
- The Media Server / NAS upgrade has been done

## Data
- Baseline 2026-10-30 (196 items): Online 181, Empty 10, Failed 3, Importing 2

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the admin test account (user name admin; get the password from the QA lead)
2. Open Search > Items and the Asset media status facet
3. Note the count for each status

## Expected
- Failed, Empty and Importing are each no higher than the baseline
- Online is at least 181 (plus any items added since)

## Notes
Post-fix regression for the 28 Oct 2026 feedback (System Performance remediation). Baseline: manual runs of 2026-10-30. New test items change the totals: compare per status.
