---
id: HLW-058
title: "Register a chemical with Certificate of Analysis, SDS file and photo"
feature: registration
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
The files attached at registration are saved with the item and can be opened later.

## Data
- Category: Chemical, CAS number 64-17-5, lot QA-LOT-<unique>, production / delivery / expiry dates
- CoA and SDS: small QA PDF files; Photo: a PNG under 2048 KB
- SDS link, SDS issue date, License required with a license agency

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Registration > Item Register, pick Chemical and fill the required fields and the SDS and license fields
3. Attach the CoA PDF, the SDS PDF and the photo and click Register
4. Open the item in Inventory > Item Information > Details

## Expected
- The item is registered
- Details shows the photo and lets you open the CoA and SDS PDFs with the content uploaded
- SDS link, SDS issue date and license details are shown as entered
- A photo over 2048 KB or a non-PDF CoA is refused with a message

## Notes
Coverage review 2026-11-19: the Chemical form has CoA (PDF), Photo, SDS link / issue date / file and License required / agency; no case covered uploads or the SDS and license fields.
