---
id: TWW-052
title: "Upload and list 1000 contacts"
feature: contacts
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
A realistic member list uploads and stays usable.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-1000-rows.xlsx

## Steps
1. Upload the 1000-row file to a draft template with no contacts
2. Open 聯繫人 and search **Bulk 0999**
3. Remove the contacts (覆蓋 with a small file, then delete)

## Expected
- Upload finishes within 5 s with "成功導入 1000 個聯繫人"
- 聯繫人列表 (1000) renders within 3 s
- Search finds exactly Bulk 0999
- The template card shows 1000 聯絡人
