---
id: HLW-004
title: "Log out ends the session"
feature: auth
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Log out

Verify that Log Out ends the session so protected pages need a new login.

## Preconditions
- A User account

## Steps
1. Log in to HTX LIMS web with a User account
2. Click the user button at the top of the page and click Log Out
3. Open the Check In page by its address (/checkin)

## Expected
- After Log Out the public home page with the Login link is shown
- /checkin shows the login page instead of the Check In list
