---
id: VZ-061
title: "New long ingest gets a playable proxy within the target time"
feature: media
priority: P2
tags: [regression, writes, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
With the proxy workflow, new material becomes usable quickly, including 1-2 hour programs.

## Preconditions
- Proxy workflow is live
- An ingest of a 1 hour test recording or file can be triggered on staging (approval needed per run)

## Data
- A 1 hour test recording or file named qa-proxy- plus the date and time (e.g. qa-proxy-20261030-1500)

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the admin test account (user name admin; get the password from the QA lead)
2. Note the time the ingest ends
3. Open the new item and its Files tab, refreshing until Video LR and Audio LR files appear
4. Press Play, then jump to the last minute and play

## Expected
- Video LR and Audio LR proxy files appear within the Q-001 target after the ingest ends
- The proxy plays with picture and sound at the start and in the last minute

## Notes
Post-fix regression for the 28 Oct 2026 feedback (proxy workflow remediation, ENCA 1). Creates a real item: ask before every run; run in the same ingest session as VZ-013, VZ-017, VZ-042 and VZ-052.
