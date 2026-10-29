---
id: Q-011
title: "When a template is deleted in Twilio, should sync also delete its recorded replies without warning?"
status: open
askedTo: "Ghani"
env: local
found: 2026-10-29T09:32:42.087Z
foundBy: "BUG retest 2026-10-29"
tests: [TWW-104]
bugs: []
updated: 2026-10-29T09:32:42.738Z
answered: ""
---
## Question
Since the BUG-026 fix, 從 Twilio 同步 deletes every local template whose Twilio content no longer exists, together with its contacts, uploads and recorded replies, without asking. Is losing the reply history intended, or should the template be kept (e.g. marked deleted) or the user warned first?

## Context
Code: app/api/twilio/templates/route.ts deletes buttonResponse, contact, contactUpload and messageTemplate for stale SIDs. Note the Twilio list call uses limit 100, so with more than 100 Twilio templates the rest would look deleted too. Retest 2026-10-29: qa_perm_<n> deleted in Twilio -> removed from the app by the next sync.

## Answer
Not answered yet.

## History
- 2026-10-29: asked from BUG retest 2026-10-29.
