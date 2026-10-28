# Tung Wah Whatsapp: how the app behaves

## Navigation
- `/templates` (消息模版): template cards (name, status 已通過/草稿, Twilio HX SID, body, contact and reply counts, buttons). 從 Twilio 同步 re-imports from Twilio; 新建模板 opens the create dialog.
- `/templates/<id>`: tabs 消息預覽 & 發送管理 and 回覆統計; buttons 聯繫人 (`/templates/<id>/contacts`), 下載報表, 刪除; question title with 編輯.
- `/users` (用戶管理): admin only (API returns 403 "無權限" to others).
- Not logged in: every page and API redirects (307) to `/login`.

## Feedback is via browser alert()/confirm()
Success and error messages are native dialogs ("上傳成功！", "郵箱已存在", "發送任務已啟動！", "沒有待發送的聯繫人", "請填寫模板名稱和內容", "請至少添加一個按鈕"). Playwright must handle `page.on('dialog')`, otherwise they are auto-dismissed and look like silent failures.

## Templates
- Create posts to `/api/twilio/templates/create` (creates Twilio content), then PATCHes the question title. Unticking 創建後立即提交 Meta 審核 changes the button to 創建模板 (no Meta submission).
- Variables `{{name}}` in the body are detected live and add a required example value per variable (Meta needs it).
- At most 3 quick-reply buttons (ID btn_0..). Currently at least one is required.
- Deleting a template in the app also deletes it in Twilio (sync does not bring it back).
- Only APPROVED templates can be sent ("只有審核通過的模板才能發送消息").
- Templates belong to their creator; a non-owner gets 404 on the template itself.

## Contacts and upload
- Excel .xlsx/.xls with 姓名 and 手提電話 (English Name/Phone also work). Every column is kept in customVars and offered for variable mapping; Tung Wah member columns (會員類別, 會員編號, ...) appear in reply stats and the report.
- Only the first sheet is read and headers must be in row 1 (Q-008). Blank rows are skipped. 1000 rows upload in under 1 s; the contacts page lists all rows (no paging).
- Phones are normalized to 852XXXXXXXX ("+852 6524 8661", "852-6524-8661", "(852) 65248661", "65248661" -> 85265248661). Very short or empty phones are dropped silently; "00852…", "….0", 9/10-digit and all-zero numbers are mangled or kept (BUG-014).
- 追加 skips a number only when the raw cell value equals an existing contact's; 覆蓋 replaces all contacts and replies without asking.
- Contact statuses: 待發送 PENDING, 已發送 SENT, 已讀 READ (set by a reply). 重置 sets one contact back to pending and deletes its reply (no confirmation); only sent contacts can receive replies; 全部重置 resets all. 刷新 only re-reads the database.
- Test files live in `data/` (copy to the session folder before uploading from Aside's browser).

## Sending and replies
- 變數映射配置: click an Excel column, + 插入, 儲存映射 (PATCH variable-mapping). The value is split on spaces and every word is looked up as a column (typed text is dropped); empty/unknown values are saved (BUG-017).
- Send POSTs `/api/send {templateId}` (returns totalContacts / totalMessages) and sends to every PENDING contact in the background, 1 message per second. Contacts with the same phone are merged into one message, values joined with "，" (BUG-004). A Twilio API error sets FAILED; a later Undelivered stays SENT (BUG-013). Double-click sends once.
- An unmapped variable is not blocked: Twilio uses the template sample value (attendance_confirmation sends "Hi David").
- Replies arrive through the Twilio webhook POST `/api/webhook/whatsapp` (tunnel: README). No Twilio signature check (BUG-012); GET with a wrong verify token returns 403 "驗證失敗" (Meta verification). The reply goes to the most recently sent contact with that phone (any template) and is stored for all contacts with that phone in the template; only the first reply counts (Q-007). Button title match (case-insensitive) or the button number -> that button, else 其它.
- 回覆統計: a count card per answer, filters 全部 / <one per received answer> / 其它 / 未回覆. A reply sets the contact to READ.
- No delivery/read receipts: sends set no status callback (BUG-013); deliveredAt/readAt stay empty.

## Report
`/api/templates/<id>/export` -> `reply_report_<id>.xlsx`: sheet 回覆紀錄 (rows 1-3: 東華三院屯門綜合服務中心, 服務使用者回覆電子訊息紀錄表, 問題：<question title or template name>; then member columns + 回覆內容, 回覆日期) and sheet 數據統計 (count per button, 其他, 未有回覆人數, sign-off block).

## Fixed data on localhost
Templates welcome_greetings and attendance_confirmation (APPROVED, admin), testing and templateName (DRAFT). Use "testing" for upload tests (send is disabled there) and attendance_confirmation (Yes/No buttons, {{first_name}}) for send/reply tests.

## Auth and sessions
NextAuth credentials (JWT), 30-day session token, not re-checked against the database and not revoked by 退出: role changes and user deletion do not affect existing sessions (BUG-019). No login throttling (accepted, BUG-018 wont-fix). Wrong password and unknown email both return 401. Server-side user validation: password >= 6, email format, role enum.

## Report notes
Free-text replies appear as 其它 in the report's 回覆內容 (BUG-015); same-phone contacts are separate rows.

## Template rules learned
- Content is always twilio/quick-reply, language zh_HK, no header/footer/media; AUTHENTICATION can never be approved (BUG-023).
- Statuses from Twilio approval: approved -> 已通過, pending -> 審核中, rejected -> 已拒絕; received/unsubmitted/paused/disabled -> 草稿 (BUG-022). Rejection reason only in Twilio (BUG-025). Utility review took > 40 min on 2026-10-28.
- Variable names like {{1}}, {{ first name }}, {{姓名}} are accepted; {{}} is rejected by Twilio; Meta rejects a variable at the start or end of the body.
- Delete (card trash or detail 刪除) shows an in-app alertdialog 確認刪除, removes contacts/replies and the Twilio content (Twilio 404 ignored). Sync never removes local templates (BUG-026).
- Server refuses /api/send for non-APPROVED templates (403).
- Login: /login (郵箱, 密碼, 登錄; labels unlinked, no autocomplete, placeholder admin@tungwah.org: accepted, BUG-031 wont-fix); wrong credentials -> 郵箱或密碼錯誤. After login always /templates (callbackUrl ignored, BUG-030); external callbackUrl not followed. 退出 has no confirmation.
- Roles in the UI: editors and viewers get the same UI (BUG-002); the nav hides 用戶管理 for them but /users still renders (BUG-032). Ownership is checked on template detail/edit/delete (500 with internal error detail instead of 403; accepted, BUG-033 wont-fix) but not on contacts, export, send, reset or the Twilio delete in the delete route (BUG-001, BUG-029).
