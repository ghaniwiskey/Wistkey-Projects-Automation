---
id: BUG-015
title: "Reply report shows \"其它\" (Other) instead of the member's typed answer"
severity: major
status: open
env: local
url: "http://localhost:3000/api/templates/cmvongu2t0005kjy3stn25txd/export"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T07:16:22.917Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-057]
frequency: always
---
## Summary
When a member types a reply (instead of tapping a quick-reply button), the 回覆紀錄 (Reply records) sheet of the downloaded report puts the category 其它 (Other) in the 回覆內容 (Reply content) column, not the text the member typed. Staff cannot read the answer from the report, although the page shows it.

## Steps to reproduce
1. Send attendance_confirmation to the QA contact and reply by typing "maybe later".
2. Click 下載報表 (Download report).

## Expected
回覆內容 (Reply content) contains "maybe later".

## Actual
回覆內容 (Reply content) is "其它" (Other). The 回覆統計 (Reply statistics) page shows "maybe later".

## Evidence
- Screenshot: ![25-report-other-not-text.png](../explorations/2026-10-28-core-journeys/25-report-other-not-text.png)
- Screenshot: ![20-free-text-reply-other.webp](../explorations/2026-10-28-core-journeys/20-free-text-reply-other.webp)

## Environment
- Base URL: http://localhost:3000/api/templates/cmvongu2t0005kjy3stn25txd/export
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
