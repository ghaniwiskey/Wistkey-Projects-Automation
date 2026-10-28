---
id: Q-007
title: "Which reply counts when a member answers twice or got several templates?"
status: open
askedTo: "Ghani"
env: local
found: 2026-10-28T06:57:21.536Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-047, TWW-048]
bugs: []
updated: 2026-10-28T06:57:21.536Z
answered: ""
---
## Question
The webhook records only the first reply per phone and template (later replies are ignored as duplicates) and attributes a reply to the most recently sent contact with that phone across all templates. Should a later answer (e.g. Yes then No) replace the first one? And should a reply to an older template's message count for the newer template?

## Context
Read from app/api/webhook/whatsapp/route.ts (findFirst orderBy sentAt desc; recordResponseForAllContacts returns 0 for duplicates). On 2026-10-28 the user replied Yes to "Hi David" and No to "Hi QA Tester" (same template) before the tunnel was up.

## Answer
Not answered yet.

## History
- 2026-10-28: asked from explorations/2026-10-28-core-journeys.md.
