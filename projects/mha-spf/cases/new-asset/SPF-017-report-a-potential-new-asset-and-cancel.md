---
id: SPF-017
title: "Report a potential new asset and cancel it"
feature: new-asset
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
The reporter can cancel an OPEN new-asset report with a reason.

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) with Logistics Officer 1 active

## Data
- Same report data as the close case
- Cancel reason: Mistaken as Asset

## Steps
1. Report a new asset as in the close case.
2. Open it from **Asset > New Asset**, click **Cancel Item**, pick **Mistaken as Asset**, **Submit** (confirm if asked).

## Expected
- A success message mentioning "cancelled" is shown.
- The list shows the request with status CANCELLED.

## Notes
Cleanup cancels any OPEN request whose description starts with "QA auto".

Automated in tests/e2e/new-asset/new-asset.spec.ts (page objects in tests/pages, cleanup fixtures in tests/fixtures/pages.fixture.ts).
