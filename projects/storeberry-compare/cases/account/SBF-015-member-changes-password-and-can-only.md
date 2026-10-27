---
id: SBF-015
title: "Member changes password and can only log in with the new one"
feature: account
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Password change is validated and takes effect.

## Data
- New password: <unique>, 6+ chars

## Steps
1. Change Password with a wrong current password
2. Correct current, mismatched new passwords
3. New password "12"
4. Valid change
5. Logout, open My Orders, log in with the old then the new password

## Expected
- "Your current password is incorrect!"
- "The New Password confirmation does not match."
- "The New Password must be at least 6 characters."
- "Update successful"
- After logout My Orders redirects to /login; old password fails; new password shows "Login successful !"

## Notes
Verified 2026-10-27.
