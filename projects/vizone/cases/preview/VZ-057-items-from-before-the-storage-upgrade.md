---
id: VZ-057
title: "Items from before the storage upgrade still preview"
feature: preview
priority: P1
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Moving media to the new NAS keeps old items playable.

## Preconditions
- The Media Server / NAS upgrade has been done

## Data
- Items: one 2022 Feed item, the 2023 budget speech item, one 2026 item, one audio item

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the admin test account (user name admin; get the password from the QA lead)
2. Open each item from Search > Items (sort by Creation date to find the old ones)
3. Press Play on each and open its Files tab

## Expected
- Every item plays with picture (video) and sound within 3 seconds
- The Files tab shows the new storage location for the proxy and no file is listed as missing

## Notes
Post-fix regression for the 28 Oct 2026 feedback (System Performance remediation: NAS migration). Baseline: manual runs of 2026-10-30.
