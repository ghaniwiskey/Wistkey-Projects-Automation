---
id: SBF-006
title: "New member registers and can log in"
feature: account
priority: P0
tags: [smoke, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Shoppers can create an account and sign in.

## Data
- Email: aside.member.<unique>@example.com
- Marketing: No

## Steps
1. Open /register
2. Fill First Name, Last Name, unique email, mobile, password twice, choose marketing No, agree to the policy
3. Click Register
4. Log in on /login with the same email and password

## Expected
- "Thank you for your registration. Please check your e-mail to complete registration process." is shown and /login opens
- Login shows "Login successful !" and My Account is available
- The member appears in the CRM customer list with the entered name and Opt-in No
