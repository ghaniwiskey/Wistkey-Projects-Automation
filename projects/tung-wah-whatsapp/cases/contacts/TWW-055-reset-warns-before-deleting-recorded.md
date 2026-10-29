---
id: TWW-055
title: "Reset warns before deleting recorded replies"
feature: contacts
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
Staff cannot wipe member answers by accident.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)
- A contact with a recorded reply

## Steps
1. Open 聯繫人 of a template with a replied contact
2. Click 重置 on that contact
3. Click 全部重置 and read the confirmation

## Expected
- Both actions warn that the reply will be deleted (or keep the reply)
- Cancel keeps contacts and replies unchanged

## Notes
Related: BUG-016 verified 2026-10-29 (dev fix af9a789).
