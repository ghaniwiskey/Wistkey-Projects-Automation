---
id: TWW-111
title: "Dashboard message records filter, search and page correctly"
feature: dashboard
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-29
updated: 2026-10-30
---

## Goal
消息記錄 shows the right contacts for each filter, search and page.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- More than 50 contacts across two templates, with sent, failed and pending statuses (e.g. data/contacts-1000-rows.xlsx on a draft template, no send)

## Steps
1. Open 儀表板 > 消息記錄
2. Filter by one template, then by each 狀態
3. Search a name, then part of a phone number
4. Go to page 2 and back

## Expected
- 共 N 筆 matches the filtered count; each page shows up to 50 rows
- Failed rows show the error 代碼 and 備註
- Filters and search can be combined and cleared

## Notes
Code: app/api/dashboard/messages/route.ts (PAGE_SIZE 50). BUG-040, closed as wont-fix (accepted behavior): rows created in the same upload can repeat across pages and one can be on no page (2026-10-29: Bulk 0499 on pages 10 and 11, Bulk 0999 on none), so repeats and gaps between pages are not checked here. Search needs the phone without spaces ("852 9000 0123" finds nothing).
