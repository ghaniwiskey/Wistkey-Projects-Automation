---
id: BUG-042
title: "Add-user dialog logs a console warning and points screen readers to a description that does not exist"
severity: trivial
status: open
env: local
url: "http://localhost:3000/users"
updated: 2026-10-29T12:19:38.318Z
found: 2026-10-29T12:19:38.318Z
foundBy: "Console sweep 2026-10-29"
tests: [TWW-116]
frequency: always
---
## Summary
Opening the 添加用戶 dialog logs a React warning in the console, and the dialog's aria-describedby points to an element that does not exist.

## Steps to reproduce
1. Log in as an admin and open the browser console (F12 > Console).
2. Open 用戶管理 (User management) at http://localhost:3000/users.
3. Click 添加用戶 (Add user).

## Expected
The dialog opens with no console warning; it either has a short description (DialogDescription) or no aria-describedby.

## Actual
Console warning: "Missing `Description` or `aria-describedby={undefined}` for {DialogContent}." The dialog (title 添加新用戶) has aria-describedby="radix-_r_2_", but no element with that id exists. Our run (2026-10-29): logged twice per visit to /users with the dialog opened; no other warnings or errors as admin on the other pages. Cause: app/(dashboard)/users/users-client.tsx uses <DialogContent> without <DialogDescription>; it is the only Dialog in the app without one. Related: BUG-010 (wont-fix, accessible names).

## Evidence
- Playwright console sweep 2026-10-29 (admin, editor, viewer)
- Screenshot of the 添加用戶 dialog in the manual run

## Environment
- Base URL: http://localhost:3000/users
- Env: local

## History
- 2026-10-29: filed from Console sweep 2026-10-29 in the Test Manager app.
