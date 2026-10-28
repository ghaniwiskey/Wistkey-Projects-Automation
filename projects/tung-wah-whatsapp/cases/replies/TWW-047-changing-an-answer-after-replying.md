---
id: TWW-047
title: "Changing an answer after replying"
feature: replies
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
The agreed rule for a second reply from the same member is applied.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)
- Tunnel up
- The +852 6524 8661 phone to reply

## Steps
1. Send attendance_confirmation to the QA contact
2. Reply **Yes**, then reply **No**
3. Open 回覆統計

## Expected
- The QA Tester row shows the answer the business wants to keep (first or latest, see question)
- The 數據統計 counts match the row

## Notes
Currently the first reply wins and later ones are ignored. Related: Q-007.
