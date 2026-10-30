# Vizone

RTHK Vizone: Vizrt **Viz One Studio** (web client, (c) 2019 Vizrt) at http://vizone-staging01.bh.rthkeng.hk/ (default env `staging`; `/` redirects to `/studio/`). Test IDs `VZ-NNN`. Newsroom editors (CNCA Chinese news, ENCA English news) use it as the media asset store behind the Vizone plugin in Adobe Premiere. App behavior and known user issues: `context.md`.

## Accounts

- Admin: `.env` VZ_ADMIN_USER / VZ_ADMIN_PASS, login domain "Internal accounts" (SYSTEM). Verified working 2026-10-30.

## Run

```powershell
.\qa test --project=vizone
```

## Testing permissions

- Not set yet, so the staging env is read-only (`allowWrites: false`): browse, search and preview only. Ask the user before creating, editing, transferring or deleting items, folders, files or macros, and record the answer here.
- Shared staging server with real-looking newsroom items: never use Delete Queue, Retention or Administration changes without explicit approval.

## Feedback retest

PLAN-001 (tag `feedback-fix`) re-checks every issue and recommended fix from the 28 Oct 2026 feedback report. Baseline: manual runs of 2026-10-30. Generic search/preview/login edge cases were archived (projects/vizone/archive/cases) as outside that scope.
