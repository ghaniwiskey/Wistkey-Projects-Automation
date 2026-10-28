# Tung Wah Whatsapp

東華三院訊息系統 ("Message Manager") at http://localhost:3000/ (default env `local`, Next.js dev server). Test IDs `TWW-NNN`. Admins and editors manage Twilio WhatsApp templates, upload Excel contact lists per template, send the template to every pending contact, and read replies (回覆統計) and the Excel reply report. App behavior: `context.md`.

## Accounts

- Admin `admin@tungwah.org` (role ADMIN). Password: `.env` TWW_ADMIN_USER / TWW_ADMIN_PASS (not set yet; the browser session was already logged in). Do not log out of the shared browser without it.
- Roles: 管理員 ADMIN, 編輯者 EDITOR, 查看者 VIEWER. Create QA users per test (`qa-<role>-<unique>@example.test`) and delete them afterwards.
- Twilio: the "My First Twilio Account" console is logged in in the user's browser. Use it only to verify messages (Monitor > Logs > Messaging, Debugger). WhatsApp sender +85256250410 (Jockey Club Tin Shui Wai Integrated Services Centre).

## Run

```powershell
.\qa test --project=tung-wah-whatsapp
```

## Testing permissions

- Test WhatsApp only; skip SMS and email (user, 2026-10-28).
- WhatsApp sends: only to +852 6524 8661 (user's test phone). Twilio delivers only to HK numbers. Ask the user when a test needs a reply from that phone.
- Twilio templates: creating a draft template in Twilio (no Meta submission) and deleting it via the app needs the user's approval per run (approved once on 2026-10-28). Never submit to Meta (創建後立即提交 Meta 審核) without explicit approval: it cannot be undone.
- Local app data (QA users, contacts on the draft template "testing") may be created and must be cleaned up. Never delete or demote admin@tungwah.org.
- Replies and delivery statuses need the Twilio webhook tunnel: ngrok `authentic-tactless-pregame.ngrok-free.dev` -> localhost:3000 (`ngrok http --url=authentic-tactless-pregame.ngrok-free.dev 3000`, run by the developer whose ngrok account owns the domain; ngrok is not installed on this machine). When it is offline Twilio logs error 11200 / ERR_NGROK_3200 and reply/status tests are blocked (environment).