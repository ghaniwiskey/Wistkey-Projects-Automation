# MHA Mobile: testing context

Knowledge base for testing the MHA mobile app with ARTEMIS. Keep it short, factual and current; stocktake data (FAVE numbers, counts, assignments) changes with the FY and with assignments, so find it at runtime. Playwright is not used for this app yet (no web base URL).
Sources: live ARTEMIS sessions on UAT 2026-10-08 (sessions 5741536c, 792d3ac9), the MHA user manual (mobile login rules) and the app's APK strings.

## Product
- Native Android app **com.iconsult.mhasgtwo**, app title "Asset Tracking System (ATS)", 2.0-dev build. It is the stocktaker companion of the ATS web app (same backend and data) and is used to sight assets (FAVE and ad-hoc stocktakes). Per the MHA user manual, the mobile login is the account's full NRIC.
- Home tiles: Search Asset, Stocktake, New Asset, Settings. Settings is only the RFID scanner hookup (connect device, power range). Search Asset is a plain asset search; offline it says "Please connect the internet to use search asset module".
- Bottom bar shows "officer name - role | cost centre" and a Switch control (login/role switching below).
- Offline support: opening a FAVE asks "Will do stocktake by OFFLINE MODE?" (CONFIRM = offline, CANCEL = online). Sightings are stored locally (Room DB) and uploaded with Submit. Offline mode is not tested yet; it is a prime suspect for the reported submit "network error".
- Backend: https://mhauatapp.southeastasia.cloudapp.azure.com:8100 (UAT). The app logs every HTTP response to logcat as "Response Size: Size: N bytes" (OkHttp LoggingInterceptor), useful when investigating failures.

## Environment and access
- UAT only; agency dropdown on the login screen is SPF (HTA also exists).
- Test account comes from `.env` only: `MHM_USER` (the mobile login, a full NRIC) and `MHM_PASS` (empty on UAT: passwordless). Never in the repo.

## Login and role switching (verified 2026-10-08)
1. Login screen: username = MHM_USER value, password empty, agency SPF, LOGIN.
2. The account lands as Agency Admin. Tap Switch (bottom bar) > Select Role > Stocktaker; same panel > Select Cost Center > pick the needed one (2026-10-08 session used 332140) > Confirm. The bottom bar then reads "... - Stocktaker | <cost centre>".
3. Stocktake: the list stays "Stocktake (0) / Nothing to show yet" until a cost centre is selected (step 2). Cost centre 332140 listed FAVE FY26-2006 and FAVE FY26-2007 ("332140 - PTD"; find at runtime).
4. Anywhere on a FAVE with unsent items, the exit arrow warns "Are you sure you want to exit without uploading?".

## FAVE sighting and submit (verified 2026-10-08)
- Open the FAVE > "Will do stocktake by OFFLINE MODE?" > CANCEL for online.
- FAVE detail has tabs SELECT / VERIFY / REVIEW. SELECT groups the assets by location ("<barcode> | Block X | Level Y" with an "N Assets" pill that expands the group).
- Sighting: tap the asset row > StockTake Detail (Asset No., ID 2, serial, category, values; Location section below the fold) > toggle Sighted (and Correct Location; Asset Condition where relevant) > SAVE > confirm "Set this asset as sighted?" > the asset moves from SELECT to REVIEW; tab counts update (they briefly show 0/0/0 while saving).
- Submit: the REVIEW tab has a full-width dark-blue Submit button > centered loading card + toast "Submission Successful" > REVIEW resets to 0. Submitting an empty REVIEW is a silent no-op (no toast).
- App messages seen or present in the APK: "Submission Successful", "Submission complete", "Submission Failed", "Network Error", "Please Switch ON the internet", "Please try again."; logging out with unsent items asks "The stocktake data in the review is still not submitted, do you want to log out?".

## Known issues and open leads
- **"Network error" after submitting a FAVE (user report, NOT reproduced 2026-10-08)**: four attempts (three complete sight-and-submit cycles and one empty re-submit) all returned "Submission Successful"; logcat showed no socket/TLS/timeout failures and every request got a response, so it looks intermittent (network or server side). If it recurs: screenshot the exact message + time; the wording tells the layer ("Network Error" / "Please Switch ON the internet" = connectivity, "Submission Failed" = server rejected); check the "Response Size" logcat lines and reachability of the backend host.
- **Anomaly, seen once**: after SAVE + CONFIRM the app returned to the login screen by itself (clean self-relaunch of MainActivity, no crash line; attempt #4, 13:38:45). If it happens, log in again and re-select role + cost centre.
- **Open lead: OFFLINE MODE**. Sight offline, then submit/upload; this sync path is untested and a likely place for the reported error.

## How testing runs (ARTEMIS)
- Runner: ARTEMIS at `C:\Artemis Project\artemis` on the Android emulator (currently emulator-5554). Console `uv run python -m artemis ui` (http://localhost:8000); tasks `uv run python -m artemis run "<goal>" --profile pro -s emulator-5554 -n "<name>"`.
- Traces, per-step screenshots and video: `C:\Artemis Project\artemis\traces\<session-id>\`; the agent's notes (`notes\task_plan.md`, `notes\repro_log.md`) hold the plan and findings. The 2026-10-08 "network error" hunt: session 5741536c-186f-48a0-bc8e-f290009e54de.
- Pro mode on the DeepSeek key needs local patches in the ARTEMIS checkout (structured output via json_mode + schema injection for OpenAI-compatible providers; provider-aware summarizer/judge defaults). Known quirk: DeepSeek can reject a sequence after dropped tool calls ("assistant message with tool_calls must be followed by tool messages") and pause the run; check the trace, then resume or restart.
- Keep Playwright-only files (specs, automated cases) out unless the app gets a web target.

## Test data notes
- Cost centre 332140 carries FAVE FY26-2006/FY26-2007 at the time of writing; numbers change per FY, so pick from the list at runtime. Assets sighted during the session: 111000020059 and 111000020058 (329560 / Block P / Level 3) and 401000040993 (088762 / Block D / B4).
- Sighting + submitting on UAT is safe to repeat (uploads results, no approval involved). Approvals belong to the web roles (VET IC / URO / UAO); do not go beyond Submit from the app.
