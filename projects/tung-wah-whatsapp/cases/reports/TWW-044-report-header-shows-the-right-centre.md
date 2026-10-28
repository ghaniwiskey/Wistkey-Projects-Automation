---
id: TWW-044
title: "Report header shows the right centre and question"
feature: reports
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Rows 1 and 3 of the report identify the centre and the question asked.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as admin, set a question title on a template
2. Download the report

## Expected
- Row 1 shows the centre that sends the messages
- Row 3 shows 問題：<question title>; without a title it shows the agreed fallback

## Notes
Row 1 is "東華三院屯門綜合服務中心" while the WhatsApp sender is "Jockey Club Tin Shui Wai Integrated Services Centre"; without a title row 3 shows the template name (see question).
Related: Q-004.
