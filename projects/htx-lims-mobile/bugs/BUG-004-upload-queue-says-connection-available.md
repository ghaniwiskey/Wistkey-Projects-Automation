---
id: BUG-004
title: "Upload queue says Connection available while the device is offline"
severity: minor
status: open
env: staging
url: "app: Upload queue"
updated: 2026-11-18T08:35:26.767Z
found: 2026-11-18T08:34:54.341Z
foundBy: "explorations/2026-11-18-handheld.md"
tests: [HLM-008]
frequency: always
---
## Summary
With Wi-Fi and mobile data off (no active network, ping fails) the Upload queue still shows 'Connection available'.

## Steps to reproduce
1. Emulator: adb shell svc wifi disable; svc data disable
2. Handheld: open Upload queue

## Expected
The screen shows that there is no connection.

## Actual
'Connection available' (checked twice, also after re-opening the screen); uploads then fail as expected.

## Evidence
- 

## Environment
- Base URL: app: Upload queue
- Env: staging

## History
- 2026-11-18: filed from explorations/2026-11-18-handheld.md in the Test Manager app.
- 2026-11-19: still reproduces after the 19/11 deploy; the failed record also says 'Count failed on the server' although the device was offline (run 2026-11-19_1415_staging_manual).
