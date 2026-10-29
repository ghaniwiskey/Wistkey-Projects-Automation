# Tung Wah Whatsapp

東華三院訊息系統 ("Message Manager") at http://localhost:3000/ (default env `local`, Next.js dev server). Test IDs `TWW-NNN`. Admins and editors manage Twilio WhatsApp templates, upload Excel contact lists per template, send the template to every pending contact, and read replies (回覆統計) and the Excel reply report. App behavior: `context.md`.

## Accounts

- Admin `admin@tungwah.org` (role ADMIN). Password: `.env` TWW_ADMIN_USER / TWW_ADMIN_PASS (not set yet; the browser session was already logged in). Do not log out of the shared browser without it.
- QA admin (role ADMIN, kept at the user's request 2026-10-28): `.env` TWW_QA_ADMIN_USER / TWW_QA_ADMIN_PASS. Use it to log back in after logout tests. Since the 2026-10-29 fix it sees and manages admin@tungwah.org's templates too (Q-009).
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
- Replies need the Twilio webhook tunnel (set up 2026-10-28): ngrok account muhammad.a@wistkey.dev, static dev domain `murmuring-amused-diaper.ngrok-free.dev` -> http://127.0.0.1:3000 (the dev server listens on IPv4 only). Twilio sender +85256250410 incoming webhook = `https://murmuring-amused-diaper.ngrok-free.dev/api/webhook/whatsapp` (the developer points it at his own `authentic-tactless-pregame` domain while he works; on 2026-10-29 it had been switched back and replies failed with Twilio error 11200 / 404). **User rule (2026-10-29): right before every step that needs a reply from the phone,** check sender XEbcbde1515c9a13afb00df67f99e23970 (Senders API v2 `webhook.callback_url`) is ours and ONLINE (switch it back if not; the user approved this), the tunnel runs, and an unsigned POST to the public URL returns 403 Invalid signature. It flipped to the developer's domain again between two replies on 2026-10-29. Status callback stays empty (the app has no status handling, BUG-013).
  - ngrok: winget package Ngrok.Ngrok (`%LOCALAPPDATA%\Microsoft\WinGet\Packages\Ngrok.Ngrok_*\ngrok.exe`, authtoken in `%LOCALAPPDATA%\ngrok\ngrok.yml`). Windows Defender flags it as Trojan:Win32/Kepavll!rfn (known false positive); the user allowed it.
  - Start: `ngrok http --url=murmuring-amused-diaper.ngrok-free.dev http://127.0.0.1:3000` (keep the window open). Check: http://127.0.0.1:4040. Stop: `Stop-Process -Name ngrok`.
  - App: `pnpm dev` in `C:\Users\USER\Desktop\tung wah whatsapp` (pnpm not installed globally; `node node_modules\next\dist\bin\next dev` works). Agent-started processes must be detached (WMI Win32_Process Create), otherwise they die with the tool shell.
  - Offline tunnel = Twilio Debugger error 11200 (ERR_NGROK_3200 offline, ERR_NGROK_8012 app down): replies are lost, not retried. Treat as environment.