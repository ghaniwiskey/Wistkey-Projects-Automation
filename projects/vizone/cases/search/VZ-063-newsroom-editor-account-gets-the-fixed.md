---
id: VZ-063
title: "Newsroom editor account gets the fixed search and feed-source results"
feature: search
priority: P2
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
The fixes work for a real CNCA/ENCA editor account, not only for admin.

## Preconditions
- A newsroom editor test account (e.g. a CNCA or ENCA editor; not available yet, ask the QA lead)

## Data
- Keywords: 財政, budget; feed-source filters (Live View, agency feed, press release)

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the admin test account (user name admin; get the password from the QA lead)
2. Search 財政 and budget and apply each feed-source filter; note the counts and times
3. Log out and log in with the newsroom editor test account
4. Repeat the same searches and filters

## Expected
- The budget speech item and every feed-source filter are available to the editor as they are to admin
- Editor searches show results within the same Q-001 target as admin

## Notes
Post-fix regression for the 28 Oct 2026 feedback (ENCA 3). All other web cases use admin. Blocked until an editor account exists.
