---
id: TWW-048
title: "Reply is credited to the template it answers"
feature: replies
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
When one phone received two templates, each reply counts for the right template.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)
- Tunnel up
- Two approved templates

## Steps
1. Send template A, then template B to the QA contact
2. Reply to template A's message (quote it) with **Yes**
3. Open 回覆統計 of A and of B

## Expected
- The reply is counted under the template it answers (or the agreed rule from the question)

## Notes
Currently replies go to the most recently sent contact with that phone. Related: Q-007.
