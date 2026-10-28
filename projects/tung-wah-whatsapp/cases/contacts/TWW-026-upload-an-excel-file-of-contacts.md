---
id: TWW-026
title: "Upload an Excel file of contacts"
feature: contacts
priority: P0
tags: [smoke, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Contacts with 姓名 and 手提電話 columns are imported into a template.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-valid-hk.xlsx

## Steps
1. Log in as admin and open a template with no contacts
2. Choose the contacts file, keep 追加, click 上傳並解析
3. Open 聯繫人
4. Delete the uploaded contacts (cleanup)

## Expected
- Alert "上傳成功！"; the header shows 1 聯繫人
- The contact shows name, phone 85265248661, status 待發送 and every Excel column (會員編號, 會員類別) as a tag
- The Excel column names appear as buttons under 變數映射配置
