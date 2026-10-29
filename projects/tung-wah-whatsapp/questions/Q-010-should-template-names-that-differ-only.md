---
id: Q-010
title: "Should template names that differ only in letter case count as duplicates (and must names be lowercase)?"
status: open
askedTo: "Ghani"
env: local
found: 2026-10-29T09:32:41.938Z
foundBy: "BUG retest 2026-10-29"
tests: [TWW-103]
bugs: []
updated: 2026-10-29T09:32:42.541Z
answered: ""
---
## Question
The create form now rejects an existing name (BUG-024), but "Attendance_Confirmation" was accepted next to attendance_confirmation and created in Twilio. WhatsApp template names are usually lowercase. Should the app reject case-only duplicates, or force lowercase names?

## Context
2026-10-29, QA admin, POST /api/twilio/templates/create with friendlyName Attendance_Confirmation -> 200 (Twilio draft created, deleted right after). The name rule is ^[A-Za-z0-9_]+$ and the duplicate check is an exact match.

## Answer
Not answered yet.

## History
- 2026-10-29: asked from BUG retest 2026-10-29.
