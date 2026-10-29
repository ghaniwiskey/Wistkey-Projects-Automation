---
id: TWW-113
title: "Turning 是否需要回覆 off and on keeps replies"
feature: templates
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
The requires-reply switch only changes what is shown, never loses replies.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- A template with at least one recorded reply

## Steps
1. On the template page turn 是否需要回覆 off
2. Check the tabs, the reply report and 儀表板 回覆率
3. Have a reply arrive while it is off (signed simulated reply or the test phone)
4. Turn it back on and open 回覆統計

## Expected
- Off: 回覆統計 is hidden and the template is left out of 回覆率
- On again: all replies, including the one from step 3, are shown

## Notes
Added in dev fix af9a789. From the code the webhook does not check requiresReply, so replies are still recorded while it is off. Viewers must not be able to change the switch.