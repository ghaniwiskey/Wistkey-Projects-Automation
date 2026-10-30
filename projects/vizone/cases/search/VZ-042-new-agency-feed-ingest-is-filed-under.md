---
id: VZ-042
title: "New agency feed ingest is filed under its feed source automatically"
feature: search
priority: P2
tags: [regression, writes, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Incoming material is categorised by feed source (Live View, agency feeds, press releases) without manual filing.

## Preconditions
- Automatic feed-source categorisation is live (see Q-002 for the field it uses)
- An agency feed ingest can be triggered on staging (needs the user's approval)

## Data
- One clip from each feed source: Live View, an agency feed, a press release

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Note the time and let one clip arrive from each feed source
3. Open Search > Items, sort by Creation date and open each new clip
4. Filter Items by each feed-source value

## Expected
- Each new clip shows its feed source (e.g. Live View) in the Overview or Metadata
- Filtering by a feed source lists only clips from that source, including the new one

## Notes
Fix verification for the 28 Oct 2026 feedback report, recommended remediation: automatic asset categorisation by feed source (ENCA 3). See context.md > Known user issues. Ingest creates real items: ask before every run.
