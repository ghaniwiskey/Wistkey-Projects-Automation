---
id: TWW-099
title: "The uploaded file name cannot write outside the uploads folder"
feature: contacts
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
A crafted file name cannot place files elsewhere on the server.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- Access to the app folder to check files
- The draft template testing

## Data
- A valid contact file from projects/tung-wah-whatsapp/data sent with the file name ../../qa-traversal-<unique>.xlsx

## Steps
1. In the browser console, POST /api/upload as FormData with templateId = <testing id>, mode = append and the file with the crafted name
2. Look for qa-traversal-<unique>.xlsx in the app folder and the folder above it

## Expected
- The upload is rejected, or the file is stored inside uploads/ with a safe name
- No file appears outside uploads/

## Notes
From the code: the file is saved to join(process.cwd(), 'uploads', Date.now() + '_' + file.name). Delete any created file and the uploaded contacts afterwards.
