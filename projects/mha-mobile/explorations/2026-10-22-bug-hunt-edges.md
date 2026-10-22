---
project: mha-mobile
env: staging
charter: "Explore the MHA Mobile app (login, role switch, Search Asset, New Asset, FAVE stocktake, Assign, Settings) with invalid and boundary inputs, interruptions (back, rotate, kill, offline) and repeated taps to discover bugs the 24 scripted cases (MHM-001..024) do not reach"
date: 2026-10-22
timebox: 60m (ran ~70m, 09:35-10:45 WIB)
status: done
---

## Scope
- In scope: SPF UAT (agency SPF), phone account MHM_USER (Tan Jun Yong Shawn), roles Stocktaker / Logistics Officer 1 on 332140 and 332600. Android emulator Medium_Phone_API_36.1 (`-gpu swiftshader_indirect`), driven with adb (uiautomator dump, input, screencap). MHA web (web test account, VET IC / LOGS1 / Agency Admin) to set up FAVE assignments and check what the phone sent.
- Out of scope: approvals on MHA web, RFID scanner hardware, HTA, automation (no specs or page objects written).
- Known bugs not re-reported: BUG-001 (10-minute session), BUG-002 (Relocate "No Remarks"), BUG-004 (Registration remarks), BUG-005 (Switch Role cost centres, seen again), BUG-006 (scientific notation).

## Test scenarios
Exploratory scenarios written before the session; Result filled in while testing.

| ID | Area | Scenario (steps) | Looking for | Result |
|---|---|---|---|---|
| EX-01 | Login | LOGIN with an empty username | Clear message, no request, no crash | **Bug** BUG-017: nothing happens, no message |
| EX-02 | Login | Username = the NRIC in lower case | Accepted like upper case, or a clear refusal | Pass: accepted |
| EX-03 | Login | Username = the NRIC with a trailing space | Trimmed, or a clear refusal | Pass: trimmed, logged in |
| EX-04 | Login | Passwordless account with any text typed in Password | Defined behaviour | Question Q2: any password accepted |
| EX-05 | Login | Network off > LOGIN | Readable "no internet" message | **Bug** BUG-012: "Your username or password is incorrect" |
| EX-06 | Login | Tap LOGIN several times quickly | One session, one home screen | **Bug** BUG-009: 3 taps = LOGIN dead until app restart (2 taps OK) |
| EX-07 | Navigation | Android Back on home; reopen the app | No return to login while logged in | Pass: Back leaves the app, reopening resumes home |
| EX-08 | Navigation | Log out, then Android Back | Does not return to the logged-in home | Pass: leaves the app, reopens on login |
| EX-09 | Role switch | Pick a role and cost centre, close the panel without Confirm | Bar and tiles keep the old role | Pass |
| EX-10 | Role switch | Cost centre list after login | Only the role's units | Known BUG-005 (all agency units listed) |
| EX-11 | Platform | Rotate the phone on a half-filled form | Layout fits, data kept | N/A: app is locked to portrait; data kept |
| EX-12 | Search Asset | Search with an empty keyword | Message or full list | **Bug** BUG-018: no request, previous result stays |
| EX-13 | Search Asset | Keyword with special characters (`%`) | Literal, "no results" message | Pass (literal), but no message (BUG-018) |
| EX-14 | Search Asset | Partial Asset ID, serial no., EPC | Matches per the manual | Serial and EPC match; partial ID gives nothing (Q4) |
| EX-15 | Search Asset | Keyword with no match | "No record" message | **Bug** BUG-018: blank list |
| EX-16 | New Asset | Save with Remarks = spaces only | Rejected like empty | **Bug** BUG-014: accepted |
| EX-17 | New Asset | Postal code: letters, 7+ digits, a code with no address | Field limits, feedback | Pass: digits only, max 6, unpicked code blocked ("Please input location"); no "no address" hint |
| EX-18 | New Asset | Fill the form, press Back | Warning or data kept | **Bug** BUG-015: discarded silently |
| EX-19 | New Asset | Very long remarks, emoji | Limit or saved intact | Not run (saving needs a photo and web cleanup); location Remarks maxLength 200, Room 5000 |
| EX-20 | FAVE | Search inside a FAVE: no match, `%`, partial ID, lower case | Empty state, no crash | Pass: partial and case-insensitive matches; no match = blank, no message |
| EX-21 | FAVE | Edit an asset, Back without SAVE, reopen | Nothing saved | Pass |
| EX-22 | FAVE | Double tap SAVE and CONFIRM | One REVIEW entry | Pass: REVIEW 1 |
| EX-23 | FAVE | Online mode: network off, SAVE; then Submit | Message wording, data kept | **Bug** BUG-013: "No Network" + FAVE blank 0/0/0 (data kept); Submit hidden offline with no hint (known) |
| EX-24 | FAVE | Unsent item > log out > log in | Item kept or warning says lost | **Bug** BUG-010: sightings deleted |
| EX-25 | FAVE | Unsent item > switch cost centre and back | Item kept | Pass (no warning, item kept) |
| EX-26 | FAVE | Unsent item > force-stop > reopen | Item kept | Pass |
| EX-27 | FAVE | List "Pending: n" after Submit | Counters consistent | Pass: 466 -> 465 after reopening the list (stale only on the open list) |
| EX-28 | Assign | Complete with nothing filled | Validation | Pass: Complete hidden until an asset is selected |
| EX-29 | Assign | Add/remove assets; remove all in Edit Selection; Complete | Count right, no empty submit | **Bug** BUG-011: ASSIGN with 0 assets says "Submit success" (RELOCATE refuses) |
| EX-30 | Assign | Relocate with a postal code that has no address | Validation before Complete | **Bug** BUG-008: saved postal 000099 with the old address; found **BUG-007** (duplicate ASG numbers) while checking it |
| EX-31 | Settings | Connect, deny the location permission | Clear message | **Bug** BUG-016: Connect silent after "Don't allow" twice |
| EX-32 | Session | App in background 60 s, back via Recents / icon | Screen restored | Pass |

## Coverage notes
Order: login screen (EX-01, 02, 07, 08), role switch (EX-09), Search Asset (EX-12..15), New Asset validation (EX-16..18, 11), offline and multi-tap login (EX-05, 06), web setup (assigned 111000010978, 111000011295, 111000011296 in FAVE FY26-2001 / 332600 to the officer), FAVE (EX-20..27), Settings (EX-31), Assign as LOGS1 (EX-28..30), login variants (EX-03, 04), background (EX-32).
Heuristics: inputs and forms (empty, whitespace, special characters, length, double submit), state and navigation (Back, kill, background, logout mid-flow), data lifecycle (unsent data, counters), errors and resilience (network off at each step), UI and content (typos, hints).
Evidence: screenshots in `2026-10-22-bug-hunt-edges/` (login screenshots have the username masked); logcat "Response Size" lines to see whether a tap sent a request.

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | Mobile transactions reuse ASG numbers of web transactions (ASG00006469/6470 exist twice) | major | [BUG-007](../bugs/BUG-007-transactions-made-on-the-mobile-app.md) |
| 2 | bug | Relocate saves a postal code with no matched address, keeping the old address | major | [BUG-008](../bugs/BUG-008-mobile-relocate-saves-a-postal-code.md) |
| 3 | bug | LOGIN dead after three quick taps until the app is killed | major | [BUG-009](../bugs/BUG-009-login-stops-working-after-three-quick.md) |
| 4 | bug | Logout deletes unsent FAVE sightings; the warning does not say so | major | [BUG-010](../bugs/BUG-010-logging-out-with-unsent-fave-sightings.md) |
| 5 | bug | ASSIGN with 0 assets toasts "Submit success" | minor | [BUG-011](../bugs/BUG-011-assign-with-no-asset-selected-says.md) |
| 6 | bug | Offline login says username or password is incorrect | minor | [BUG-012](../bugs/BUG-012-login-without-network-says-your.md) |
| 7 | bug | FAVE blank (0/0/0) after SAVE without network | minor | [BUG-013](../bugs/BUG-013-fave-goes-blank-select-verify-review-0.md) |
| 8 | bug | New Asset Remarks of spaces only accepted | minor | [BUG-014](../bugs/BUG-014-new-asset-accepts-remarks-made-of.md) |
| 9 | bug | New Asset form discarded on Back without warning | minor | [BUG-015](../bugs/BUG-015-new-asset-form-throws-away-everything.md) |
| 10 | bug | Settings Connect silent after location permission denied | minor | [BUG-016](../bugs/BUG-016-settings-connect-does-nothing-after-the.md) |
| 11 | bug | Empty-username LOGIN gives no feedback | minor | [BUG-017](../bugs/BUG-017-login-with-an-empty-username-gives-no.md) |
| 12 | bug | Search Asset: empty keyword keeps old result, no-match gives no message | minor | [BUG-018](../bugs/BUG-018-search-asset-gives-no-feedback-for-an.md) |
| 13 | bug | UI text: login warning typo, "1 Assets"/"0 Assets", "$10.000", hints, asterisks | trivial | [BUG-019](../bugs/BUG-019-ui-text-issues-on-the-mobile-app-login.md) |
| Q1 | question | 602000003903 (registered by MHM-013 on 19 Oct, room RN7H0) is PROGRESS again with no room, on web and phone. Was it reset by an asset interface run (assets show "Interfaced On 19-Oct-2026") or by hand? If by the interface, phone registrations get undone | - | - |
| Q2 | question | The passwordless UAT account logs in with any password typed. Expected on UAT only? | - | - |
| Q3 | question | The login screen announcement still shows "Scheduled Maintenance ... Monday, 25 March 2024" (UAT data). Should old announcements expire? | - | - |
| Q4 | question | Search Asset needs the full Asset ID (partial "6020000039" finds nothing) while the FAVE search matches partial IDs. Intended? | - | - |
| R1 | risk | With duplicate ASG numbers (BUG-007), links and approvals by transaction number may open the other agency unit's transaction; not checked | - | - |
| R2 | risk | One "access denied" reply (142 bytes) among parallel requests is enough to break the login state (BUG-009); other screens that fire parallel calls (FAVE open, Submit) may have the same weakness | - | - |

## Data left on UAT
- 111000011297 (332600): relocated twice from the phone (ASG00006469 to postal 000099, ASG00006470 back to 819645). Location is correct again, but its location Remarks now read "No Remarks" (BUG-002; the earlier remarks were not recorded).
- FAVE FY26-2001 / 332600: 111000010978, 111000011295, 111000011296 assigned to Tan Jun Yong Shawn as stocktaker; all still PENDING (111000011295 was submitted SIGHTED, then reset to PENDING on web). MHM-005 can reuse them.
- Location permission flags of the app on the emulator were reset after EX-31.

## New test ideas
- [ ] Mobile transaction numbers are unique (relocate on the phone, search its ASG number on web: exactly one record). P1, @regression @assignment (BUG-007)
- [ ] Relocate refuses a postal code that was not picked from the address list. P1, @regression @assignment (BUG-008)
- [ ] Rapid repeated LOGIN taps log in once. P2, @regression @auth (BUG-009)
- [ ] Unsent FAVE sightings survive logout/login (or the warning names the loss). P1, @regression @stocktake (BUG-010)
- [ ] ASSIGN with all assets removed in Edit Selection is refused. P2, @regression @assignment (BUG-011)
- [ ] Offline login shows a connectivity message. P2, @regression @auth @offline (BUG-012)
- [ ] FAVE SAVE without network keeps the tab counts. P2, @regression @stocktake @offline (BUG-013)
- [ ] New Asset field validation: whitespace Remarks, postal code limits, unpicked address. P3, @regression @new-asset (BUG-014)
- [ ] Unsent FAVE sightings survive force-stop and cost centre switch (passes today; guards the Room DB path). P2, @regression @stocktake

## Knowledge updates
- context.md: exploration notes for 2026-10-22 (parallel taps, network-off behaviour per screen, Assign Complete rules, duplicate ASG numbers and listing order, web idle timeout, Settings permission).
- Driving the emulator without mobile-mcp: `adb shell uiautomator dump` + `input tap/text` + `screencap` works (each dump ~1 s). Hide the keyboard (`input keyevent 111`) before tapping buttons at the bottom (Search, Complete); the keyboard covers them and the tap is lost silently. Toasts are not in the view tree: take a screenshot within ~1 s of the tap.
- Never print or screenshot the login field with the NRIC; mask it (the session notes' screenshots are masked).
