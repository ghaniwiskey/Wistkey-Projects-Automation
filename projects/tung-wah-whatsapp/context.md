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
- Phones are normalized to 852XXXXXXXX ("+852 6524 8661", "65248661" -> 85265248661). Rows with invalid/empty phone are dropped.
- 追加 skips a number only when the raw cell value equals an existing contact's; 覆蓋 replaces all contacts and replies without asking.
- Contact statuses: 待發送 PENDING, 已發送 SENT, 已讀 READ (set by a reply). 重置 sets one contact back to pending and deletes its reply (no confirmation); only sent contacts can receive replies; 全部重置 resets all. 刷新 only re-reads the database.
- Test files live in `data/` (copy to the session folder before uploading from Aside's browser).

## Sending and replies
- 變數映射配置: click an Excel column, + 插入, 儲存映射 (PATCH variable-mapping). Send POSTs `/api/send {templateId}` and sends to every PENDING contact.
- An unmapped variable is not blocked: Twilio uses the template sample value (attendance_confirmation sends "Hi David").
- Replies arrive through the Twilio webhook POST `/api/webhook/whatsapp` (tunnel: README). No Twilio signature check (BUG-012); GET with a wrong verify token returns 403 "驗證失敗" (Meta verification). The reply goes to the most recently sent contact with that phone (any template) and is stored for all contacts with that phone in the template; only the first reply counts (Q-007). Button title match (case-insensitive) or the button number -> that button, else 其它.
- 回覆統計: a count card per answer, filters 全部 / <one per received answer> / 其它 / 未回覆. A reply sets the contact to READ.
- No delivery/read receipts: sends set no status callback (BUG-013); deliveredAt/readAt stay empty.

## Report
`/api/templates/<id>/export` -> `reply_report_<id>.xlsx`: sheet 回覆紀錄 (rows 1-3: 東華三院屯門綜合服務中心, 服務使用者回覆電子訊息紀錄表, 問題：<question title or template name>; then member columns + 回覆內容, 回覆日期) and sheet 數據統計 (count per button, 其他, 未有回覆人數, sign-off block).

## Fixed data on localhost
Templates welcome_greetings and attendance_confirmation (APPROVED, admin), testing and templateName (DRAFT). Use "testing" for upload tests (send is disabled there) and attendance_confirmation (Yes/No buttons, {{first_name}}) for send/reply tests.