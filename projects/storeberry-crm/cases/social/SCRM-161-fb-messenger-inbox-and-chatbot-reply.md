---
id: SCRM-161
title: "FB Messenger inbox and chatbot reply with the configured template"
feature: social
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Customer messages are answered and staff see the conversation.

## Preconditions
- A connected test Facebook page; Ask the user first before publishing or sending anything to a real social account (irreversible, public). Ask the user first: this is a settings change (README > Testing permissions).

## Data
- A QA message template

## Steps
1. Create a template; set the chatbot setting (David - Chatbot)
2. Send a message from a test Facebook user
3. Open the inbox

## Expected
- The chatbot answers with the template; the conversation shows in the inbox with filters working

## Notes
Feature with no cases before the 2026-10-29 feature-coverage review (menu/page found in the live staging app). Never tested. Blocked until a test Facebook page is connected.
