# MHA HTA: testing context

The ATS web app is shared with SPF: product, roles, page map, quirks, and the rules, behavior and test data per area are in `shared/mha-ats/context.md` and `shared/mha-ats/context/` (written from SPF UAT unless marked HTA; the HTA test with the same number is HTA-NNN). This file holds what differs on HTA. HTA has its own bugs (`projects/mha-hta/bugs/`); "mha-spf BUG-n" in shared notes means the SPF bug.

## Environment and account
- UAT: https://mhauatwebhta.southeastasia.cloudapp.azure.com/ (project.yaml). Same LoginBk page and passwordless test login. The manual's URLs (uat-ats.hta.gov.sg) are intranet only and are not used.
- Account: `.env` only (`HTA_USER`, `HTA_PASS` empty = passwordless). It holds all six HTA roles.
- FAVE numbers `FAVE FY26-9001`: agency code 90. Cost centres 338xxx (8 on UAT).
- The login footer warning starts "HTA-WARNING : This is a Singapore Police Force computer system.".

## Differences from SPF
- Roles (User > Role Listing): only Agency Admin, Logistics Officer 1, Stocktaker, Unit Approving Officer, Unit Resource Officer, Verification Team IC/2IC. **No FALO**, HQ AO, HQ FALO or End User.
- The Assign step's Role dropdown offers only "Logistics Officer 1 (LOGS1)"; the Assignee (FALO) filter in Choose Asset is empty. The Ownership tab still shows "Current FALO" ("-").
- So no FALO tests: assign/return/recall via FALO (SPF-009/010/011/018/028) and FALO closing follow-up items (SPF-041) have no HTA copy. Follow up close by URO/UAO is not covered yet.
- Role tests (HTA-045/047/048) use Stocktaker instead of End User.
- User Listing has user delete (manual: HTA only): user form > Delete > "Are you sure to delete this user?" Yes/Cancel > "User has been deleted." > back to User Listing. Covered by HTA-055 (deletes its own user); HTA-044 still leaves its user INACTIVE like SPF-044.
- UAT data: many assets carry a Group / NPC / Base of another cost centre (e.g. 338000 assets in "CCS - EMSB"). Relocate offers only the groups of the asset's cost centre, so the group is not prefilled and Submit says "Group/NPC/Base selection cannot be empty."; HTA's AssignmentCreatePage then picks the first offered group (`fillsEmptyLocationGroup`).
- Assign Stocktaker (ad hoc) lists every unit user, but Submit refuses some: "User <name> has the role Verification Team IC/2IC which cannot be a stocktaker." (`StocktakeFormPage.assignAcceptedStocktaker` skips them).
- FAVE asset IDs are read from each row's "Asset ID:" label (HTA `FavePage.assetIdByLabel`; shared `context/stocktake.md` > Quirks).
- FAVE Import Working Result saves SIGHTED / WORKING like Update Result (HTA-036). Results imported before the mha-spf BUG-007 fix still read "Sighted" (mixed case; some on the first non-approved cost centre) and Update Result opens them with no Sighted Result.

## HTA bugs vs mha-spf bugs
Every mha-spf bug also occurs on HTA except the first part of mha-spf BUG-007 (the import cleared the result on SPF only). Same symptom, so do not file it twice (HTA = mha-spf): BUG-001 = 012 (cost centre description search), 002 = 001 (ad hoc Cancel reason), 003 = 006 (FAVE Import Template), 004 = 011 (role period dates), 005 = 016 (random Max Group exceeded), 007 = 014 (Remarks counter / 250), 008 = 013 (blank EXPIRED row), 009 = 005 (disposal date prefill), 010 = 015 ("ealier"), 011 = 002 (one-off cancel), 012 = 003 (update after submit), 013 = 004 (Print Tag lists NA assets), 014 = 008 (group Description cut), 015 = 009 (locked result after relocation). HTA only: BUG-006 (Ad Hoc Listing of a random setup shows other assets / a wrong Summary count when drawn assets carry a group of another cost centre). Statuses: `.\qa bugs mha-hta`.
