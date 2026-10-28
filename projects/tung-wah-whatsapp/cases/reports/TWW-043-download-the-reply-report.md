---
id: TWW-043
title: "Download the reply report"
feature: reports
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
下載報表 produces the Excel reply report.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as admin, open a template with at least one contact
2. Click 下載報表

## Expected
- A file reply_report_<templateId>.xlsx downloads
- Sheet 回覆紀錄 has the header rows and columns 會員類別 … 回覆內容 回覆日期 with one row per contact, including Excel columns such as 會員編號
- Sheet 數據統計 shows counts per button, 其他, 未有回覆人數 and the 製表人/核對人/審批人 block
