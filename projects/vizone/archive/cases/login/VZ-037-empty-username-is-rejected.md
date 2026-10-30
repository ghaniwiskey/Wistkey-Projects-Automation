---
id: VZ-037
title: "Empty username is rejected"
feature: login
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Submitting the login form with no username shows a message.

## Data
- User name and password empty

## Steps
1. Open the Studio login page
2. Press Log In without typing anything

## Expected
- The message "Empty username" is shown and the page stays on the login form
