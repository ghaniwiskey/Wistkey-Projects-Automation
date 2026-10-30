# Retry and skip-completed verification, 30 Oct 2026

- User asked to test whether sending again skips previously sent contacts. Cases: TWW-091 and TWW-126.
- Run: runs/2026-10-30_1503_local_manual. Method: source-handler integration, not a browser or live provider run. App commit 1cdd076; exact source SHA-256 values are in retry-skip/retry-skip-evidence.json.
- Actual application files executed: app/api/send/route.ts, lib/whatsapp.ts, app/api/contacts/[id]/route.ts. TypeScript was transpiled in memory without changing app source.
- In-memory adapters replaced auth, Prisma and Twilio; unexpected module dependencies and direct fetch were blocked. No .env credentials loaded, no actual DB connection, no network/provider calls and no app restart. Rate-limit delay was shortened only inside the isolated harness.
- Fixtures: two Pending contacts, plus one each already Sent, Delivered and Read. First send: two attempts, one success and one controlled API error. Second send: one request to the Failed contact only, then success and error-field cleanup. Third send: 400 沒有待發送的聯繫人 and zero requests.
- Actual reset handler then reset the first completed contact. Fourth send: exactly one request for that reset contact with a new mock message ID. Previously Sent/Delivered/Read fixture rows stayed identical throughout; already-completed records received no requests.
- All 10 assertions passed. The one initial harness adapter-map omission (relative ./db import) was corrected before executing scenario assertions; no app product failure occurred.
- No real WhatsApp messages, no database writes/deletes, and no changes to the retained sticker contact/reply/upload. All fixtures existed only in the Node process; cleanup was automatic on exit.
- Limit: database/ORM integration, browser UI/authentication, Twilio acceptance/delivery and concurrent in-flight sends were not tested. A future live test requires new explicit approval.
- Reproduce: node retry-skip/retry-skip-check.cjs <app-folder> <output-json> (requires the app’s existing TypeScript dependency).
