---
id: TWW-049
title: "Common phone formats are normalized on upload"
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
- Leading/trailing spaces are trimmed
- Accepted behavior (BUG-014, wont-fix), not checked as failures: "0085265248661" becomes 852085265248661, "85265248661.0" becomes 852652486610, "652486612" stays as is, "00000000" becomes 8520000000

## Notes
BUG-014, closed as wont-fix (2026-10-28): the expected result above checks the accepted behavior.
