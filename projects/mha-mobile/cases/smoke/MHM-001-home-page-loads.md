---
id: MHM-001
title: "Home page loads"
feature: smoke
priority: P0
tags: [smoke]
envs: [all]
automated: true
created: 2026-10-08
updated: 2026-10-16
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
Since 2026-10-16 the project's base URL is MHA web UAT (the web side the mobile tests set up and check), so this checks that MHA web is up before the cross-checks; it lands on the login page. The spec still skips itself if the URL is ever an .invalid placeholder.
