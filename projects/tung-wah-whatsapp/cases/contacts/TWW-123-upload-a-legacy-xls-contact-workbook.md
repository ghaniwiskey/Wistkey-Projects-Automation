---
id: TWW-123
title: "Upload a legacy xls contact workbook"
feature: contacts
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Import the legacy Excel format

Verify that a genuine .xls workbook imports the same contact fields as an equivalent .xlsx workbook.

## Preconditions
- An admin account and two empty disposable draft templates are available.

## Data
- A genuine Excel 97–2003 .xls file and an equivalent .xlsx file, each with one row containing a name, phone, member ID and member type. Renaming an .xlsx file is not sufficient.

## Steps
1. Log in with your admin account and open the first empty draft template.
2. Upload the .xls workbook in Append mode.
3. Open Contacts and inspect the imported name, phone, member ID and member type.
4. Upload the equivalent .xlsx workbook to the second empty draft and compare the imported fields.

## Expected
- Both formats import one contact with matching field values.
- The .xls file is accepted as an Excel workbook and not rejected due to its format.

## Notes
Source: attached requirements Saas Function 3a explicitly lists xlsx/xls. TWW-026 recorded .xlsx upload; no dedicated genuine .xls execution was found. Parser uses XLSX.read, but format support is not considered tested merely from library support. Use existing disposable local drafts; no send needed.
