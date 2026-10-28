---
id: TWW-013
title: "Editor cannot send messages from another user's template"
feature: security
priority: P0
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Only the owner (or an admin) can trigger a WhatsApp send for a template.

## Steps
1. As admin, have a template with contacts that are all already sent (so nothing can go out)
2. Log in as a QA editor
3. Call the send endpoint with the admin template's ID

## Expected
- The request is refused with 403/404 before any contact check
- No message is queued

## Notes
Use only templates without pending contacts, otherwise a real WhatsApp message goes out.
Related: BUG-001 (open).
