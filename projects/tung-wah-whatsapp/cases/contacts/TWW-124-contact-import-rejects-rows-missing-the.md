---
id: TWW-124
title: "Contact import rejects rows missing the required name"
feature: contacts
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Validate the required contact name

Verify that an Excel row without a name is not silently imported as an unnamed contact.

## Preconditions
- An admin account and an empty disposable draft template are available.

## Data
- A workbook with a valid phone but blank name, a second row with a valid phone but whitespace-only name, and a third complete valid row. Use distinct disposable test numbers; do not send messages.

## Steps
1. Log in with your admin account and open the empty draft template.
2. Upload the workbook in Append mode.
3. Read the import summary and skipped-row reasons.
4. Open Contacts and check the imported rows.

## Expected
- Rows with blank or whitespace-only names are rejected or skipped with a missing-name explanation.
- Only the complete valid row is imported; no unnamed contact appears.

## Notes
Source: attached requirements Saas Function 3d requires validation of name and mobile number. TWW-027 covers empty/non-Excel files and TWW-030 covers skipped rows, not this row-level missing-name condition. Code review of lib/excel.ts found a phone check but no name-required check. Likely validation gap, not runtime-confirmed or filed as a reproduced bug.
