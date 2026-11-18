---
id: Q-004
title: "Where is Stock Adjustment (dispose an item)?"
status: closed
askedTo: "user"
env: staging
found: 2026-11-18T03:32:23.403Z
foundBy: "explorations/2026-11-18-gantry-api.md"
tests: []
bugs: []
updated: 2026-11-18T08:15:53.841Z
answered: 2026-11-18T08:15:53.686Z
---
## Question
The workflow says items are disposed through Stock Adjustment (status DISPOSED) and that User Management grants a Stock Adjustment permission, but the web menu has no Stock Adjustment page, also for ADMIN (extra permissions: All). Where is it, or is it not built yet?

## Context
2026-11-18: item 001000007 (Box7) has status DISPOSED; menu checked as ADMIN and USER1.

## Answer
Found in the app (2026-11-18): Stock Take Detail of a completed stock take has a Stock-take adjustment section; not-located IN items can be set to NOT FOUND, OUT or DISPOSED with a reason (tested on 003000032 -> DISPOSED, audited as Stock adjustment). Covered by HLW-048.

## History
- 2026-11-18: asked from explorations/2026-11-18-gantry-api.md.
- 2026-11-18: answer recorded; status open -> answered.
- 2026-11-18: status answered -> closed.
