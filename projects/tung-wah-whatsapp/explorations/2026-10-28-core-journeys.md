---
project: tung-wah-whatsapp
env: local
charter: "Explore templates, contact upload, WhatsApp sending, replies, reports and user roles with crafted Excel files, API probes and the Twilio console to discover data, permission and messaging risks"
date: 2026-10-28
timebox: 90m
status: done
---

## Scope
- In scope: 消息模版 (list, create, sync, delete, question title), contact upload (追加/覆蓋, phone formats, invalid files), contacts page (search, delete, reset), variable mapping and WhatsApp send to +852 6524 8661, reply stats, report download, 用戶管理 (create, validation, roles, delete), API permissions for anonymous / editor / viewer.
- Out of scope: SMS and email (user: WhatsApp only), Meta template submission, logout/login UI (no admin password available), mobile viewport.

## Coverage notes
1. Tour as admin (already logged in): templates list, detail tabs, contacts, reply stats, users.
2. Add-user validation (required, email format, min password, duplicate email, spaces-only name). Note: every message is a native alert(); hook alert/confirm or they look like silent failures (two early "no error" findings were wrong and dropped).
3. Permissions from an isolated PowerShell session (own cookie jar): anonymous, QA editor, QA viewer against users/templates/contacts/export/send/upload/create APIs.
4. New-template dialog with the create request blocked in the page (no Twilio writes), then one approved real draft (no Meta) to test name rules, question title, edit, delete and sync.
5. Upload on the draft "testing" template: .txt, header-only, English headers, phone formats, duplicates, HTML in names, append vs overwrite; cleaned up after.
6. Send on attendance_confirmation to +852 6524 8661: once without mapping (Twilio sent "Hi David"), once mapped ("Hi QA Tester"), both Delivered then Read in Twilio.
7. User replied Yes / No / "maybe later?": Twilio received them but returned 404 from ngrok (ERR_NGROK_3200, endpoint offline), so the app shows 0 replies and status SENT. Blocked (environment); ngrok is not installed on this machine.
8. Report download (xlsx contents checked), role change to viewer, user delete, cleanup.

Heuristics: inputs and forms, roles and permissions (IDOR), data lifecycle, errors the UI swallows, content (language mix), accessibility quick pass.

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | Editor can read contacts/report and trigger send of another user's template | critical | bugs/BUG-001 |
| 2 | bug | Viewer role not enforced on create/upload/send; sees all templates | critical | bugs/BUG-002 |
| 3 | bug | Unmapped variable sent with Twilio sample value "Hi David" | major | bugs/BUG-003 |
| 4 | bug | Append upload duplicates the same phone (in-file / other formats) | major | bugs/BUG-004 |
| 5 | bug | User name of only spaces accepted | minor | bugs/BUG-005 |
| 6 | bug | Template name rule not enforced (Twilio accepted "QA Draft 測試") | minor | bugs/BUG-006 |
| 7 | bug | Upload summary hides dropped rows | minor | bugs/BUG-007 |
| 8 | bug | Spaces-only question title saved as "問題：" | minor | bugs/BUG-008 |
| 9 | bug | Simplified Chinese in user management / template form | trivial | bugs/BUG-009 |
| 10 | bug | Icon buttons and add-user fields without accessible names | minor | bugs/BUG-010 |
| 10b | bug | Reset contact still shows previous 發送時間 | trivial | bugs/BUG-011 |
| 11 | question | Buttons mandatory? | - | questions/Q-001 |
| 12 | question | Overwrite without confirmation | - | questions/Q-002 |
| 13 | question | Form kept after cancel | - | questions/Q-003 |
| 14 | question | Report centre name / question fallback | - | questions/Q-004 |
| 15 | question | Last admin self-delete/demote | - | questions/Q-005 |
| 16 | question | Per-button reply filters | - | questions/Q-006 |
| 17 | environment | ngrok tunnel offline: no replies or delivery statuses reach the app | - | README > Testing permissions |
| 18 | note | Status stays 已發送 while Twilio says Undelivered (Ghani, +62) or Read: cannot tell app vs tunnel until ngrok runs | - | cases/sending/TWW-039 |

## Test cases written
TWW-002 to TWW-045 (44 cases): users (002-009), security (010-014), templates (015-024), sending (025, 036-039), contacts (026-035), replies (040-042), reports (043-044), accessibility (045). Not automated (user asked for cases only).

## Knowledge and data
- README (accounts, testing permissions, ngrok) and context.md (behavior, alerts, upload rules, report) written; test Excel files in data/.
- QA data left on the env: contact "QA Tester" (85265248661, status SENT, mapping first_name -> 姓名) on attendance_confirmation; 2 outbound + 3 inbound WhatsApp messages in Twilio. QA users, the QA draft template (also deleted in Twilio) and test contacts on "testing" were removed.
- Evidence in this folder: screenshots 02-17 (11, 15, 16, 17 are text cards of API responses / native dialogs) and 11-editor-api-probe.txt.
- Manual run: runs/2026-10-28_1340_local_manual (41 cases: 22 pass, 16 fail, 3 blocked). Not executed: TWW-008 (risk of locking out admin), TWW-011 UI part, TWW-042 (no replies reached the app).

## Follow-up: ngrok tunnel
- Installed ngrok (winget), user allowed the Defender detection, added the user's authtoken, started the static domain murmuring-amused-diaper.ngrok-free.dev -> 127.0.0.1:3000 and pointed the Twilio sender webhook to it via the Senders API (the console form demanded a public 'Profile about'). Restarted the stopped dev server (no code changes). Details: README > Testing permissions.
- Retest run 2026-10-28_1358_local_manual: TWW-040 and TWW-042 pass; TWW-039 fail (BUG-013, no receipts); new TWW-046 fail (BUG-012, unsigned webhook). New cases TWW-047/048 and Q-007 from reading the webhook handler. Q-006 closed by observation.
- Evidence: 18-reply-recorded-via-ngrok.webp, 19-unsigned-webhook-accepted.png.
- Free-text retest 2026-10-28_1403_local_manual: QA Tester reset and resent (14:02), 'maybe later' recorded under 其它; TWW-041 pass (20-free-text-reply-other.webp). QA Tester now holds that reply.

## Round 3: areas not covered before
- Covered: more phone formats, blank rows, title row, two sheets, 1000 rows; mapping edge cases (+ send/mapping code read-only); send merge, invalid number, double-click; 全部重置; report with replies; 404s; keyboard in dialogs; login throttling, server validation, sessions after role change/deletion.
- New bugs: BUG-014 (phone normalization), BUG-015 (report shows 其它), BUG-016 (reset deletes replies), BUG-017 (mapping validation), BUG-018 (no login throttling), BUG-019 (sessions survive deletion/role change), BUG-020 (template modal keyboard), BUG-021 (404s). BUG-004 impact corrected (one merged message). Q-008 (export format).
- Cases TWW-049..063; run 2026-10-28_1416_local_manual.
- QA data left: contact QA Tester on attendance_confirmation is PENDING after 全部重置 (its reply was deleted); next send there messages +852 6524 8661. QA users deleted; draft 'testing' has no contacts. Messages sent this round: 'Hi QA Twin A，QA Twin B' (+85265248661) and 'Hi QA Invalid' (+8520000000, undelivered).

## Round 4: templates (user approved Meta submission)
- Submitted to Meta: qa_event_reminder_357859 (2 variables, 3 buttons, UTILITY, still 審核中), qa_var_edges_357859 (rejected: variables at start/end, deleted), qa_auth_357859 (AUTHENTICATION, submission failed, deleted). Drafts for limits/formats created and deleted; the draft duplicate 'attendance_confirmation' (HX94e1...) deleted, approved original untouched. qa_format and qa_body_long deleted (the latter first in Twilio to test sync).
- Bugs BUG-022, BUG-023, BUG-024, BUG-025, BUG-026, BUG-027, BUG-028; cases TWW-064..076; run 2026-10-28_1506_local_manual. TWW-075 (send approved 2-variable template) waits for Meta.
- QA data left: qa_event_reminder_357859 (pending, contact QA Tester PENDING, mapping set). Delete it after TWW-075.

## Round 5: login, logout and roles
- User allowed logging out of admin@tungwah.org. A QA admin was created first (kept at the user's request; credentials only in .env). Temporary QA editor/viewer users and a disposable draft (qa_owner_test_357859) were deleted afterwards.
- New bugs BUG-029 (critical: any user deletes Twilio templates), BUG-030, BUG-031, BUG-032, BUG-033; BUG-001, BUG-002, BUG-019 extended; Q-009. Cases TWW-077..089; run 2026-10-28_1518_local_manual.
- QA data: the QA Tester contact on attendance_confirmation was deleted by the editor test. The browser is logged in as the QA admin; admin@tungwah.org must log in again.
