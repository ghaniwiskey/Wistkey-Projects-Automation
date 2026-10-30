# Attached report retest, 30 Oct 2026

- Build: 1cdd076. Scope: all seven bugs in attached tung-wah-bugs-report.html.
- Started app and ngrok, using https://murmuring-amused-diaper.ngrok-free.dev -> 127.0.0.1:3000.
- Login initially returned 500. With explicit user approval, added users.session_version integer NOT NULL DEFAULT 0 and regenerated Prisma (stopped server first to release Windows engine lock). No application source edits.
- PUBLIC_URL was unset. Started this app process with PUBLIC_URL pointing to our tunnel. Sender verified ONLINE and incoming webhook ours; unsigned public POST rejected with 403 before the one send.
- Verified BUG-013/034/035/036/041. Delivery/read used one real editor send to the permitted phone, real provider callbacks and Twilio read status. The phone also replied Yes after the read callback. Failure branch used a signed synthetic undelivered callback on only this disposable local contact; no extra send.
- BUG-038 partially fixed: shared access, sync, upload/reset/delete and send work; report export still 404. BUG-039 partially fixed: shared reads and no-write sync work; report export still 404 and viewer detail exposes write controls (checked writes return 403).
- New BUG-043: local-only template counted in totals/message records but absent from dashboard template-status table. Existing TWW-108 covers it; no duplicate case added.
- TWW-085 only partly covered: viewer PATCH/DELETE denied; editor question edit and stale-local-draft deletion succeeded. The single approved Twilio draft was deleted directly for TWW-106 first, so live editor-initiated Twilio deletion was NOT exercised. Omitted from executed-case results.
- Evidence: 2026-10-30-report-retest/*.png and retest-api-evidence.json (no credentials/cookies).
- Cleanup: temporary editor/viewer/admin deleted; draft absent in app and Twilio; sent QA contact/reply and upload metadata/file removed; three QA upload files removed. Original users/templates/contacts retained. QA admin browser session restored on ngrok.
- Manual run: runs/2026-10-30_1349_local_manual. No automation written or full suite run.
