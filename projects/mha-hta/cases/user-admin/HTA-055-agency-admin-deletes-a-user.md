---
id: HTA-055
title: "Agency Admin deletes a user, who disappears from the lists and can no longer log in"
feature: user-admin
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-07
updated: 2026-10-07
---

## Goal
User delete (manual > "How to delete user in User Listing? (Admin and HTA only)"): Agency Admin removes a user for good; a Cancel on the confirmation keeps it.

## Preconditions
- Logged in as the test account (`HTA_USER` in .env) with Agency Admin active

## Data
- A new user made by the test: Web Login ID `QA-AUTO-<unique>`, Name `QA auto user <unique>`, the first unit offered, Status ACTIVE
- Role Stocktaker (so the user could log in before the delete)

## Steps
1. User > User Listing > Create the user; User > Role Listing > Stocktaker > Users > Add User, add it
2. User Listing: open the user, click **Delete**, answer **Cancel**
3. Click **Delete** again, answer **Yes**
4. Search the Web Login ID in User Listing
5. Role Listing > Stocktaker > Users
6. In another browser session, log in with the Web Login ID (empty password)

## Expected
- Step 1: "User has been successfully created." and "User assign into role have been successfully updated."
- Step 2: the question "Are you sure to delete this user?" (Yes / Cancel); after Cancel the form stays open and User Listing still lists the user
- Step 3: "User has been deleted." and the app returns to User Listing
- Step 4: no rows for the login ID
- Step 5: the user is not in the Users tab
- Step 6: "Invalid username/password."

## Notes
HTA only: mha-spf has no Delete button. Checked by hand on HTA UAT 2026-10-07 (deleted a leftover HTA-044 user: question, "User has been deleted.", back to /User/User, search shows no records). If the test stops before step 3, cleanup removes the role and deletes the user.

Automated in tests/e2e/user-admin/users.spec.ts.
