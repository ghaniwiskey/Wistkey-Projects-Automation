---
id: TWW-086
title: "Editing another user's template through the API is refused"
feature: security
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
A user cannot change a template they do not own. The status code and error body are not checked (BUG-033 accepted as wont-fix).

## Preconditions
- A QA editor created by the admin (delete afterwards)

## Steps
1. As the QA editor PATCH a template owned by someone else

## Expected
- The request fails (not 2xx)
- The template's question title is unchanged for its owner

## Notes
A 500 with Prisma detail instead of 403/404 is accepted behavior: BUG-033, closed as wont-fix (2026-10-28). Do not re-report.
