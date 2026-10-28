---
id: BUG-008
title: "Question title of only spaces is saved and shows an empty \"問題：\" (Question:)"
severity: minor
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T09:08:46.326Z
found: 2026-10-28T06:37:46.526Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-023]
frequency: always
---
## Summary
A question title made only of spaces is saved, so the header shows an empty "問題：" ("Question:") instead of the "not set" text.

## Steps to reproduce
1. Open a template that has a question title.
2. Click 編輯 (Edit), enter "   " (spaces only), and click 儲存 (Save).

## Expected
The title is cleared and the header shows 未設定問題標題 ("No question title set").

## Actual
The header shows "問題：" ("Question:") with nothing after it. The question row in the report would also be blank.

## Evidence
- Screenshot: ![10-blank-question-title.webp](../explorations/2026-10-28-core-journeys/10-blank-question-title.webp)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
