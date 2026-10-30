---
id: VZ-001
title: "Home page loads"
feature: smoke
priority: P0
tags: [smoke]
envs: [all]
automated: true
created: 2026-10-30
updated: 2026-10-30
---

## Goal
The app is up and its home page renders.

## Steps
1. Open the home page

## Expected
- The page responds without an HTTP error
- The page has a title and visible content

## Notes
Automated in tests/e2e/smoke/home.spec.ts (page object tests/pages/home.page.ts).
