# Sticker reply test, 30 Oct 2026

- Case TWW-117; manual run runs/2026-10-30_1421_local_manual.
- User approved one send to +852 6524 8661 and explicitly requested keeping test data. No cleanup or resend authorized or performed.
- Before send: sender ONLINE, callback our murmuring-amused-diaper.ngrok-free.dev URL; local tunnel maps to 127.0.0.1:3000; unsigned public webhook POST returned 403.
- attendance_confirmation was empty. Uploaded one fresh QA Tester contact (cmvun88f7009ic826bzhcdrlg, upload cmvun88f4009hc826dexydkdf) and sent once. Outbound MM87e30cad368d2330546d4520ed3d4847 delivered at 07:21:13Z.
- Received MM6c0ad16542ce8963e6e803afca0712db at 07:22:58Z: one image/webp media attachment, empty Body; public webhook returned 200. The media type is consistent with a WhatsApp sticker; no media bitmap was downloaded.
- App records buttonId=other, buttonTitle=其它, empty body. Reply stats count once but label only Other. Excel report has 回覆紀錄!K6=其它, 數據統計!I3=1 under 其他.
- Test data remains on attendance_confirmation for user inspection, including contact, upload and reply. No approved template content or original records changed.
- No second send/reproduction attempted.
- Filed BUG-046 (minor, frequency once) for the missing media label; TWW-117 fail recorded with screenshot.
- At task start, user-set wont-fix statuses for BUG-009/037/043/045 were detected and respected; linked cases and retest lists synchronized without rerunning or rewriting historic outcomes.

## Expected behavior clarification

The user confirmed generic Other for sticker/image replies is expected. BUG-046 closed as wont-fix and TWW-117/TWW-095 expectations corrected. The incoming media was counted once and exported as Other. The initial fail is historical expectation mismatch, not an outstanding product defect. No extra send, cleanup or re-execution.
