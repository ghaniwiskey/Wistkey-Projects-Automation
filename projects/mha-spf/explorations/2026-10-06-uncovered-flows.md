---
project: mha-spf
env: staging
charter: "Explore the critical flows with no tests yet (Print Tag, Retirement/Disposal, asset photos and sensitivity, Settings > Group, FAVE Import Working Result, the other reports) as LOGS1 and VET IC to find bugs and pick testable flows"
date: 2026-10-06
timebox: 45m
status: done
---

## Scope
- In scope: Asset > Print Tag, Asset > Retirement/Disposal, Asset Details (Edit Picture, Edit asset), Settings > Group (LOGS1 has it), Stocktake > FAVE Details > Import Working Result (VET IC), Report pages (Summary, Aging, Rejection, Retirement, New Asset, Loan, Maintenance, Follow up). Account SPF-A2216GA as Logistics Officer 1 and Verification Team IC/2IC.
- Out of scope: Agency Admin settings that affect every UAT user (Announcement, Master Setup = FAVE trigger, Email Template), User/Role Listing changes, past disposal dates (irreversible), real tag printing (no Zebra printer).

## Coverage notes
1. Print Tag: Start > Choose Asset > Review > Reason > End. Next with no asset; Reason empty / OTHER without remarks / 205 typed characters; Submit with no printer. Data: Tag Type NA assets registered by SPF-013/014 (heuristic: data from other flows).
2. Retirement/Disposal: list (2,661 RETIRED/DISPOSED; Status filter DISPOSED, RETIRED), Update dialog: empty submit, future date (12/31/2027), reopen, clear. Heuristic: CRUD round trip, reopen after save.
3. Asset details: Edit Picture: Upload with no file, upload data/qa-asset.png, delete. Edit asset (Tag Type, Asset Sensitivity, Sensitivity Remarks): Sensitivity Yes, then Edit Picture, then back to No. Heuristic: business rule from the manual.
4. Settings > Group: empty submit, create with a 250-character description, search, update, delete. Heuristic: field limits, CRUD.
5. FAVE Import Working Result (CID, 332300): Import Template, import of a self-built file (LMSAssetID + one asset; as text and as a number), result check, filter Result = SIGHTED, full reload. Heuristic: compare with the manual.
6. Report pages: each loads with Export (#exportBtn); Follow up needs a FAVE.

Everything changed was put back: disposal date of 301000000362 cleared, photo deleted from 111000010978, its sensitivity back to No (remarks "No" became "-"), test group deleted, FAVE asset 111000011358 back to PENDING. Print Tag left nothing (0 reprinted).

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | Print Tag lists Tag Type NA assets (manual: ASSET or FILE only) | minor | bugs/BUG-004-print-tag-lists-assets-whose-tag-type.md |
| 2 | bug | Disposal date dialog pre-fills a wrong date (31-Dec-2027 -> 07/12/2029); resubmitting saves it | major | bugs/BUG-005-retirement-disposal-the-update-dialog.md |
| 3 | bug | FAVE Import Template downloads the "Page Not Found" page | minor | bugs/BUG-006-fave-import-template-downloads-a-page.md |
| 4 | bug | FAVE Import Working Result clears the result instead of Sighted / Working | major | bugs/BUG-007-fave-import-working-result-clears-the.md |
| 5 | bug | Group Description silently cut to 200 characters (no maxlength, no message) | trivial | bugs/BUG-008-settings-group-description-is-cut-to.md |
| 6 | question | Photo Delete removes the photo at once, with no "Are you sure?" (Group delete asks). Intended? | - | - |
| 7 | question | The only photo of an asset is not marked as default (Default Photo? unticked, data-def False). Should the first photo become the default? | - | - |
| 8 | question | Edit asset (Tag Type / Sensitivity) saves without any message. Intended? | - | - |
| 9 | question | An empty disposal date can be submitted ("Updating done"), which clears a saved date. Is clearing allowed, and does an iLMS date win afterwards? | - | - |
| 10 | risk | Group delete was only tried on an unused group. Deleting a group that assets use is not tested (would damage UAT data) | - | - |
| 11 | risk | Print Tag Reason: after an empty submit, picking OTHER keeps "Reason is required" visible until the next submit (cosmetic) | - | - |

## New test ideas
- [x] SPF-028 Assign & Relocate in one transaction (P0, writes)
- [x] SPF-029 Reprint without a printer lists the asset as failed (P1, writes)
- [x] SPF-030 Print Tag reason validation (P2)
- [x] SPF-031 Future disposal date keeps RETIRED, can be cleared (P1, writes)
- [x] SPF-032 Disposal dialog shows the saved date (P2, BUG-005)
- [x] SPF-033 Upload and delete an asset photo (P1, writes)
- [x] SPF-034 Sensitive asset cannot get photos (P1, writes)
- [x] SPF-035 Group create / edit / delete (P1, writes)
- [x] SPF-036 FAVE Import Working Result (P1, writes, BUG-007)
- [x] SPF-037 FAVE Import Template (P2, BUG-006)
- [x] SPF-038 The other unit reports export to Excel (P1)
- [x] (dropped 2026-10-07: BUG-004 closed as wont-fix) Print Tag offers only ASSET/FILE assets (BUG-004): needs a Tag Type NA asset found at runtime (e.g. from the Asset Listing (Detailed) export if it has the tag type)
- [ ] Photo rules: 6th photo refused, > 3 MB and .gif refused, Default Photo switch (P2)
- [ ] Agency Admin read-only tour of Settings and User/Role Listing (P2)

## Knowledge updates
- context.md: page map rows for Print Tag, Retirement/Disposal, Edit Picture / Edit asset, Settings > Group, FAVE Import; write flows observed; FAVE template URL.
- Selectors: Print Tag reason select `#printTagReason` (name Reason), remarks `textarea[name=ReasonRemarks]`, End step `#summary_header`, `#summary`, `#summary_fail`, failed table `#tbfail`. Retirement `#tblist`, dialog `#modal_update` with flatpickr `input[name=DisposalOn]` (dateFormat m/d/Y, readonly). Asset details: `label[data-bs-target="#modal_upload"]` (Edit Picture: slots `.tns-item`, `input[name=Image]`), `label[data-bs-target="#modal_update"]` (Edit asset: `select[name=TagType]`, `input[name=IsSensitive]`, `textarea[name=SensitiveRemarks]`). Group: list `#tblist`, Create link to /Setting/LocationForm, fields `select[name=CostCenterId]`, `#locCode`, `#locName`, `input[name=LocDesc]`, submit button "Update" (also on create). FAVE import: `#btnImportResult`, dialog `#modal_import`, dropzone hidden `input.dz-hidden-input`, preview `#tbimport`, `[data-modal-action=import]`, template `#btnTemplate` (data-url /Templates/StocktakeFAVEWorkTemplate.zip).
