---
id: BUG-001
title: "Mobile app logs the user out 10 minutes after login and loses the sighting being saved"
severity: major
status: open
env: staging
url: https://mhauatapp.southeastasia.cloudapp.azure.com:8100 (mobile API)
found: 2026-10-16
foundBy: "mobile exploration 2026-10-16"
tests: [MHM-007]
frequency: always
---
## Summary
About 10 minutes after login, the next request of the app is refused (142-byte response) and the app jumps to the login screen with no message. The app does not refresh the session. A sighting saved at that moment is lost: after logging in again REVIEW is 0 and MHA web still shows PENDING.

## Steps to reproduce
1. Log in on the app (UAT, agency SPF), Switch to Stocktaker and a cost centre that has a FAVE asset assigned to you
2. Open Stocktake > the FAVE > CANCEL (online), open the asset, turn on Sighted, type remarks
3. About 10 minutes after the login, tap SAVE > CONFIRM (any other server action does the same)
4. Log in again and open the same FAVE

## Expected
The session stays valid while the user works (refreshed in the background), or the app warns that the session ended and keeps the sighting for upload after the next login.

## Actual
Step 3: the app shows the login screen at once, no message. Step 4: REVIEW 0, the asset is back in SELECT, and MHA web Details still shows PENDING: the sighting is gone. A session the app restores at start-up that is older than 10 minutes is refused the same way at the first action.

## Evidence
- logcat (com.iconsult.mhasgtwo, "Response Size" lines): login 09:26:05 -> refused 09:37:13 (save of asset 111000010978, payload logged by OKHTTP "entity", reply 142 bytes, MainActivity restarted); login 09:38:27 -> refused 09:48:32 (142 bytes, MainActivity restarted)
- Same symptom on 2026-10-08 (context.md: app returned to the login screen after SAVE + CONFIRM) and on 2026-10-15 (a restored session refused when opening an asset)

## Environment
- Base URL: https://mhauatapp.southeastasia.cloudapp.azure.com:8100 (mobile API)
- Env: staging

## History
- 2026-10-16: filed from mobile exploration 2026-10-16 in the Test Manager app.
