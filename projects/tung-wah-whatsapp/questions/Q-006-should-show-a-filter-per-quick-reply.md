---
id: Q-006
title: "Should 回覆統計 show a filter per quick-reply button?"
status: closed
askedTo: "Ghani"
env: local
found: 2026-10-28T06:37:47.585Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-042]
bugs: []
updated: 2026-10-28T06:57:21.659Z
answered: 2026-10-28T06:57:21.659Z
---
## Question
For attendance_confirmation (Yes/No) the filters are only 全部 / 其它 / 未回覆, while the report counts 回覆內容1：Yes and 回覆內容2：No. Should Yes/No filters appear, and only once replies exist?

## Context
No replies reached the app on 2026-10-28 (ngrok offline), so this could not be checked with data.

## Answer
Observed 2026-10-28 with the tunnel up: chips are built from replies received (after one Yes reply the filters were 全部, Yes, 其它, 未回覆). TWW-042 updated to expect a chip per answer that has replies.

## History
- 2026-10-28: asked from explorations/2026-10-28-core-journeys.md.
- 2026-10-28: answer recorded; status open -> closed.
