---
id: TWW-066
title: "Create form checks WhatsApp template limits before submitting"
feature: templates
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
Invalid templates are caught with a clear Chinese message instead of a Twilio error or a Meta rejection.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Steps
1. Open 新建模板 (Meta unticked) and try each: a button title of 25 characters; a body of 1100 characters; the name of an existing template; a body with "{{}}"; two buttons both titled Yes; two buttons with the same ID; a button with an empty ID; a body starting or ending with a variable; a variable without example value while Meta is ticked

## Expected
- Each is rejected in the form with a Traditional Chinese message naming the rule (button ≤ 20 chars, body ≤ 1024 chars, unique name, no empty variable, unique button titles/IDs, no variable at start/end, example required)
- Nothing is created in Twilio

## Notes
Use the request-blocking trick or delete anything created. Currently limits pass and are only caught by Twilio (raw English errors) or by Meta (rejection).
Related: BUG-024 verified 2026-10-29 (dev fix af9a789), BUG-006 verified 2026-10-29 (dev fix af9a789).
