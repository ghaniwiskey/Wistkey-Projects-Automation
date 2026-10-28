---
id: TWW-049
title: "Invalid or oddly formatted phone numbers are rejected or normalized correctly"
feature: contacts
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Only valid mobile numbers are imported, in the 852XXXXXXXX format.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-phone-formats-2.xlsx

## Steps
1. Open the draft template "testing" with no contacts
2. Upload the phone-formats-2 file
3. Open 聯繫人, then delete the contacts (cleanup)

## Expected
- "852-6524-8661" and "(852) 65248661" become 85265248661
- "0085265248661" becomes 85265248661
- "85265248661.0" becomes 85265248661
- "652486612" (9 digits), "00000000" and "12345" are rejected and reported in the summary
- Leading/trailing spaces are trimmed

## Notes
Related: BUG-014 (open).
