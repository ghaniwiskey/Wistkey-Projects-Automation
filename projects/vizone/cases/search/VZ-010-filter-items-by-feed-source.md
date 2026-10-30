---
id: VZ-010
title: "Filter items by feed source"
feature: search
priority: P2
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Editors can narrow the item list to one feed source (e.g. agency feed, Live View, press release).

## Preconditions
- Items with the Feed classification exist

## Data
- Facet value: Feed (or the feed source values the newsroom uses, see Q-002)

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the admin test account (user name admin; get the password from the QA lead)
2. Open Search > Items
3. Open the Classification facet (Show All if needed) and select Feed

## Expected
- The results count drops and every result shows the classification Feed
- Clearing the facet brings back the full count

## Notes
From the user feedback report 28 Oct 2026 (ENCA 3 "no automated folder filtering by feed source"); see context.md > Known user issues. Feed-source values (Live View, agency feeds, press releases) are not visible as facets on staging yet: Q-002.
