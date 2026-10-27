# MHA ATS web: asset details, print tag, retirement, reports

Core: `../context.md`. Manual: `../docs/user-manual/03-asset-listing-registration.md` (listing), `05-asset-rejection-tag-retirement-new.md`, `08-reports.md`.

## Rules
- Retirement: disposal date only for RETIRED; past date = DISPOSED at once, future date = DISPOSED on that date; an iLMS date overrides it.
- Limits: reprint "Others" 200 chars. Photos: max 5, .png/.jpg/.jpeg, < 3 MB, one default.

## Observed behavior (UAT)
- Print Tag: Choose Asset also lists Tag Type NA assets (accepted: mha-spf BUG-004 closed as wont-fix). Reason defaults to WEAR & TEAR (Defaced, Faulty Tag, LOST, OTHER, Printing Error, WEAR & TEAR); OTHER needs Remarks (max 200). Without Zebra Browser Print: error popup, End step "0 Asset has their RFID Tag reprinted." with the asset under "failed to print". Nothing is reprinted.
- Retirement/Disposal: Update dialog saves with "Updating done"; future date keeps RETIRED and shows dd-Mon-yyyy; empty submit clears the date. Reopening pre-fills a different date than the saved one (accepted: mha-spf BUG-005 closed as wont-fix): always set the date before resubmitting. Never use a past date (disposes at once).
- Edit Picture: no file -> "Picture file is required"; "Uploaded successfully" (dialog stays open; reload to see it); Delete has no confirmation, "Deleted successfully". Photo slots `img[data-def]`.
- Edit asset: Tag Type (ASSET, FILE, NA), Sensitivity (Yes) + Remarks (read-only while unticked). Saves with no message. Sensitivity Yes hides Upload; unticking clears the remarks.
- Exports: FAVE `StocktakeFAVEReport_<yyyyMMddHHmmss>.xlsx`; Asset Listing (Detailed) `AssetListingDetailedReport_<stamp>.xlsx` (27 columns, follows on-screen filters; Status filter AVAILABLE, LOAN, MAINTENANCE, NEW, PROGRESS, TRANSFER only). All table reports export .xlsx.
