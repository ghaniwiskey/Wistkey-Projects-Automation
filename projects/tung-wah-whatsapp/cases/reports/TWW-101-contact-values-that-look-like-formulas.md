---
id: TWW-101
title: "Contact values that look like formulas are exported as plain text"
feature: reports
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Opening the reply report never runs formulas from uploaded data.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- The draft template testing

## Data
- Excel row: 姓名 =HYPERLINK("http://example.test","click"), 手提電話 +852 6524 8661, extra column 備註 =1+1 (typed as text)

## Steps
1. Upload the file to testing with 追加
2. Download the report and open it in Excel

## Expected
- The name cell shows the text =HYPERLINK(... and is not a link
- 備註 shows =1+1, not 2

## Notes
Upload only, no send. Delete the contact afterwards.
