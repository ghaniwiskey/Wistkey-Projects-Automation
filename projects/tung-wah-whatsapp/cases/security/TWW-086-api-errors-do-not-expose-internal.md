---
id: TWW-086
title: "API errors do not expose internal details"
feature: security
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Error responses are generic.

## Preconditions
- A QA editor created by the admin (delete afterwards)

## Steps
1. As the QA editor PATCH a template owned by someone else

## Expected
- 403/404 with a short message; no stack trace or Prisma error text

## Notes
Related: BUG-033 (open).
