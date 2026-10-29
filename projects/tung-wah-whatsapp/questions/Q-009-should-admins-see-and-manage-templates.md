---
id: Q-009
title: "Should admins see and manage templates created by other admins?"
status: open
askedTo: "Ghani"
env: local
found: 2026-10-28T08:18:32.228Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-089]
bugs: []
updated: 2026-10-28T08:18:32.228Z
answered: ""
---
## Question
Templates are private to their creator even for ADMIN users: a second admin lists only its own templates and gets 404 on admin@tungwah.org's templates. If a staff member leaves, can another admin take over their campaigns? Should admins see all templates?

## Context
Checked 2026-10-28 with the QA admin account (TWW_QA_ADMIN_USER).

2026-10-29: the developer's fix commit af9a789 changed this: requireTemplateOwner lets every ADMIN read and change all templates (the QA admin now lists admin@tungwah.org's templates). Still needs a decision whether that is intended.

## Answer
Not answered yet.

## History
- 2026-10-28: asked from explorations/2026-10-28-core-journeys.md.
