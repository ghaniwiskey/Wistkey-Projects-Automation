---
id: BUG-046
title: "Sticker replies appear only as Other without a sticker or media label"
severity: minor
status: wont-fix
env: local
url: "https://murmuring-amused-diaper.ngrok-free.dev/templates/cmvongu2t0005kjy3stn25txd"
updated: 2026-10-30T07:33:50.911Z
found: 2026-10-30T07:25:59.929Z
foundBy: "runs/2026-10-30_1421_local_manual"
tests: []
frequency: once
---
## Summary
A sticker-style media reply is counted, but the reply statistics and Excel report do not identify it as a sticker or image. Staff see only a generic Other answer and cannot tell what type of reply the member sent.

## Steps to reproduce
1. Starting state: an approved template has been sent to a contact who has not replied yet.
2. Log in with your admin account and open that template.
3. On the receiving phone, reply with a WhatsApp sticker without text or a caption.
4. Open 回覆統計 (Reply statistics) and inspect the contact answer.
5. Click 下載報表 (Download report) and inspect the answer cell.

## Expected
Count the reply once and identify it as a sticker or non-text media answer in both the reply view and report.

## Actual
Observed once: Twilio received one inbound image/webp attachment with an empty Body. The public webhook returned 200 and the app counted one reply. Reply statistics and Excel cell 回覆紀錄!K6 show only 其它 (Other); 數據統計!I3 counts 1 under 其他. The per-reply context contains only messageSid, empty body and sender, not a media-type label. The sticker is not identified in either view.

## Evidence
- Screenshot: ![generic Other sticker reply](../explorations/2026-10-30-sticker-reply/sticker-reply-ui.png)
- Sanitized webhook and response evidence: [JSON](../explorations/2026-10-30-sticker-reply/media-evidence.json)
- Inbound MM6c0ad16542ce8963e6e803afca0712db: NumMedia=1, MediaContentType0=image/webp, Body empty; webhook 200. Sent only one approved template to the designated test phone; no repeat send performed.
- Downloaded sticker-reply-report.xlsx: 回覆紀錄!K6=其它 and 數據統計!I3=1.

## Environment
- Base URL: https://murmuring-amused-diaper.ngrok-free.dev/templates/cmvongu2t0005kjy3stn25txd
- Env: local

## History
- 2026-10-30: filed from runs/2026-10-30_1421_local_manual in the Test Manager app.
- 2026-10-30: status open -> wont-fix; User confirmed generic Other for sticker/image replies is expected. Updated TWW-117 and media case TWW-095 to accept Other while requiring one recorded reply. Retained the observed run history and test data; no resend performed..
