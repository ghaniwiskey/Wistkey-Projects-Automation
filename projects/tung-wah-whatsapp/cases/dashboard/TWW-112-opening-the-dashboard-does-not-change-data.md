---
id: TWW-112
title: "Opening the dashboard does not change or delete data"
feature: dashboard
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-29
updated: 2026-10-30
---

## Goal
Just viewing 儀表板 does not change templates, contacts or replies, for any role.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- A template with contacts and replies; a QA viewer (created per test, deleted afterwards)

## Steps
1. Note templates, contacts and reply counts
2. Open 儀表板 as admin, then as the QA viewer
3. Compare with step 1

## Expected
- Nothing changed; a viewer's visit writes nothing
- Status updates from Twilio are the only changes, and no template or reply is removed

## Notes
The dashboard starts a Twilio sync on load. Admin/editor sync may remove records missing in Twilio (TWW-069/TWW-104), so this case still checks those side effects. Viewer sync itself preserved the stale local fixture in TWW-106 during runs/2026-10-30_1349_local_manual. Broad BUG-039 was superseded; do not expect this case to fail on the old viewer-write behavior. The complete dashboard no-mutation case has not been rerun here.
