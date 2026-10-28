---
id: BUG-008
title: "Question title of only spaces is saved and shows an empty \"問題：\" (Question:)"
severity: minor
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T06:37:46.526Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-023]
frequency: always
---
## Summary
If you save a question title made only of spaces ("   "), the app stores it. The template header then shows "問題：" ("Question:") with nothing after it, instead of 未設定問題標題 ("No question title set"). The question row in the report would also be blank.

## Steps to reproduce
1. Open a template that has a question title.
2. Click 編輯 (Edit), enter "   " (spaces only), and click 儲存 (Save).

## Expected
The title is cleared and the header shows 未設定問題標題 ("No question title set").

## Actual
The header shows "問題：" ("Question:") with nothing after it.

## Evidence
- Screenshot: ![10-blank-question-title.webp](../explorations/2026-10-28-core-journeys/10-blank-question-title.webp)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
