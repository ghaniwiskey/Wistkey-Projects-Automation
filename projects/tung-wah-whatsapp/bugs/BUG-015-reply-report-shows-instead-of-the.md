---
id: BUG-015
title: "Reply report shows \"其它\" instead of the member's free-text answer"
severity: major
status: open
env: local
url: "http://localhost:3000/api/templates/cmvongu2t0005kjy3stn25txd/export"
updated: 2026-10-28T07:16:22.917Z
found: 2026-10-28T07:16:22.917Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-057]
frequency: always
---
## Summary
For a typed reply, the downloaded report puts the category "其它" (Other) in the reply-content column instead of the member's actual answer. The reply statistics page does show the answer.

## UI labels in English
- 下載報表: Download report
- 回覆統計: Reply statistics
- 回覆內容: Reply content

## Steps to reproduce
1. Send attendance_confirmation to the QA contact and reply by typing "maybe later"
2. Download 下載報表

## Expected
回覆內容 contains "maybe later".

## Actual
回覆內容 = "其它"; the 回覆統計 page shows "maybe later".

## Evidence
- Screenshot: ![25-report-other-not-text.png](../explorations/2026-10-28-core-journeys/25-report-other-not-text.png)
- Screenshot: ![20-free-text-reply-other.webp](../explorations/2026-10-28-core-journeys/20-free-text-reply-other.webp)

## Environment
- Base URL: http://localhost:3000/api/templates/cmvongu2t0005kjy3stn25txd/export
- Env: local

## History
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
