---
id: Q-009
title: "Should admins see and manage templates created by other admins?"
status: closed
askedTo: "Ghani"
env: local
found: 2026-10-28T08:18:32.228Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-089]
bugs: []
updated: 2026-10-29T10:27:02.477Z
answered: 2026-10-29T10:27:02.276Z
---
## Question
Templates are private to their creator even for ADMIN users: a second admin lists only its own templates and gets 404 on admin@tungwah.org's templates. If a staff member leaves, can another admin take over their campaigns? Should admins see all templates?

## Context
Checked 2026-10-28 with the QA admin account (TWW_QA_ADMIN_USER).

2026-10-29: the developer's fix commit af9a789 changed this: requireTemplateOwner lets every ADMIN read and change all templates (the QA admin now lists admin@tungwah.org's templates). Still needs a decision whether that is intended.

## Answer
Yes (product owner, 2026-10-29): admins see and manage all templates. Intended roles: admin = everything incl. 用戶管理; editor = sync and create/edit/delete every template, no 用戶管理; viewer = sees every template and can sync, read-only. Admin part works since af9a789; editor and viewer gaps filed as BUG-038 and BUG-039. TWW-089 updated.

## History
- 2026-10-28: asked from explorations/2026-10-28-core-journeys.md.
- 2026-10-29: answer recorded; status open -> answered.
- 2026-10-29: status answered -> closed.
