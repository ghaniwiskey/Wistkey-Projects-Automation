---
id: SPF-033
title: "LOGS1 uploads a photo to an asset and deletes it"
feature: asset-listing
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
Asset details accept a photo (.png under 3 MB) in a free slot and the photo can be deleted again (max 5 photos per asset).

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) with Logistics Officer 1 active

## Data
- Asset `<asset>`: the first AVAILABLE asset in Asset Listing that is not sensitive and has a free photo slot (found at runtime)
- Photo: data/qa-asset.png

## Steps
1. Asset > Listing: open `<asset>`, click the photo pencil (Edit Picture)
2. Click Upload with no file
3. Pick an empty slot, choose the photo, Upload
4. Reload the asset
5. Open Edit Picture, select the new photo, Delete
6. Reload the asset

## Expected
- Step 2 shows "Picture file is required"
- Step 3 shows "Uploaded successfully"
- Step 4: the asset shows one more photo than before
- Step 5 shows "Deleted successfully" and step 6 shows the original number of photos

## Notes
Delete has no confirmation question (UX note in explorations/2026-10-06-uncovered-flows.md). Cleanup deletes any photo the test added.

Automated in tests/e2e/asset-listing/asset-photos.spec.ts.
