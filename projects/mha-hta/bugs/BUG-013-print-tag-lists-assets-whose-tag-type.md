---
id: BUG-013
title: "Print Tag lists assets whose Tag Type is NA, although only ASSET or FILE tags can be reprinted"
severity: minor
status: wont-fix
env: staging
url: https://mhauatwebhta.southeastasia.cloudapp.azure.com/Asset/PrintTag
found: 2026-10-07
foundBy: "SPF-vs-HTA recheck (Aside)"
tests: []
frequency: always
---
## Summary
Step 2 (Choose Asset) of Asset > Print Tag lists every asset of the unit, including assets registered without a tag (Tag Type NA). The manual says the step lists only assets whose tag type is ASSET or FILE. Same defect as mha-spf BUG-004 (there closed as wont-fix: accepted behaviour).

## Steps to reproduce
1. Log in as the HTA test account, role Logistics Officer 1
2. Asset > Listing: open 803000000059 (registered with RFID Tag = No); Main Data shows Tag Type NA
3. Asset > Print Tag > Reprint RFID Tag > Next
4. Search 803000000059

## Expected
The asset is not offered (manual Print Tag, step 2: "the list of assets which the tag type is either ASSET or FILE").

## Actual
The asset is listed and can be selected for reprinting ("Showing 1 to 1 of 1 records"). Verified on HTA 2026-10-07; the Choose Asset total (1,495) equals the Asset Listing total.

## Evidence
- Verified by hand on HTA 2026-10-07 (asset 803000000059, Tag Type NA, listed in Print Tag)

## Environment
- Base URL: https://mhauatwebhta.southeastasia.cloudapp.azure.com/Asset/PrintTag
- Env: staging

## History
- 2026-10-07: filed from the SPF-vs-HTA recheck; served as wont-fix like mha-spf BUG-004 (accepted behaviour).
