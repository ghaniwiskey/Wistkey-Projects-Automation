# MHA Mobile: assets, assign, scanner, login edge cases

Core: `../context.md`. MHA web side (approval rules, registration, new asset): `shared/mha-ats/context/assignment-registration.md`. What the manual says: `manual.md`.

## Search Asset
- Searches the active cost centre only: another unit's asset gives an empty list and no message. Full IDs only (a partial Asset ID finds nothing; serial no. and EPC work, though the hint omits serial). An empty keyword sends nothing and keeps the old result; no match shows a blank list (BUG-018). Offline: "Please connect the internet to use search asset module".
- The detail matches MHA web Asset Details in other formats: "$26145.0" vs "$26,145.00", category "1KZ0" vs "1KZ0 / ...", group "APD" vs "Airport Police Division (APD)". Amounts of $10 million and more show in scientific notation (BUG-006, e.g. "$1.36449E8"; `hta.md`).

## New Asset (any unit role)
- Asset Condition*, Remarks*, postal code* (the "Select Address:-" list opens after the 4th digit and lists every address containing those digits; then "Your Selected Address is" > OK), location Remarks*, photo* (Upload Image = Android photo picker, newest first, Done). Age and value fields are numeric; the postal code takes digits only, max 6.
- Validation toasts in this order: condition ("Please select asset condition"), asset remarks, postal code, location ("Please input location", also for a postal code not picked from the list), photo ("Please upload photo", also when the picked image is a tiny 85-byte PNG: dropped silently). Remarks of spaces pass (BUG-014); Back discards the form (BUG-015).
- Save returns home; web gets an OPEN RNA request with every field and the photo (cost centre = the active one). Web Cancel Item cleans up.

## Asset Registration (LOGS1, FALO)
- "Register Asset (n)" lists the active cost centre's PROGRESS assets (no search). The form pre-fills Group/NPC/Base, postal code, building, address, block, level and room but NOT the location remarks (hint "(Optional)"), and Save clears them (BUG-004, wont-fix: accepted, do not re-report; retype them to keep the original).
- Save checks the postal code ("Please input postal code"), then "Please input block or level or room or remark"; the photo is optional. Changing the postal code: the address dialog lists matches from the 4th digit and narrows as you type; an unmatched postal code is saved with the old address (BUG-021). Offline Save toasts "Network Error" and closes the form (BUG-023).
- Upload Image first asks for the camera permission ("Only this time"), returns to the form, then opens the photo picker on the next tap.
- Save: dialog "Success / Registration Success" > OK, and the asset leaves the list. Web: AVAILABLE, new room, photo as default photo, Updated By the officer, Current LOGS1/FALO stay "-". The web test account's Complete Register did not list the asset. Completing cannot be undone.
- Open lead: a registered asset turned PROGRESS again with no room, on web and phone (602000003903 after MHM-013, registered again since; Q1 in `explorations/2026-10-22-bug-hunt-edges.md`).

## Assign (URO, LOGS1, FALO)
- Select Asset lists every asset of the active cost centre, for FALO too, as on web (Assignee filters, keyword, "+" per result; "+" toggles); it forgets the keyword when reopened. The Assignee (LOGS1) filter finds the officer's own assets (tests use it). Complete appears only once an asset is selected. Several assets make one ASG transaction.
- RELOCATE pre-fills postal code, building, address, block, level and room, but Remarks always holds the text "No Remarks" and Complete saves it as the asset's location remarks (BUG-002; retype or clear it). With 2 or more assets nothing is pre-filled except Remarks "No Remarks". Relocate takes any 6-digit postal code and keeps the old building/address (BUG-008); the address dialog for 8196 opened only after 6 digits there.
- ASSIGN: Role Logistics Officer 1 / Fixed Asset Liaison Officer / End User, then User (web spelling, e.g. "Tan Jun Yong Shawn"). Offered to LOGS1 and to FALO (so a FALO can return to LOGS1 on the phone; web FALO only offers FALO / End User).
- ASSIGN & RELOCATE: Role/User plus the Relocate fields ("No Remarks" again, BUG-002); an empty postal code gives "Please input postal code". After this long form the screen stays scrolled down when it resets: Asset Selected and Select Asset are off-screen (not in the view tree), so AssignScreen checks the reset by the "Select a transaction type" prompt and scrolls up before Select Asset.
- Every Complete toasts "Submit success" and resets the form; MHA web decides: RELOCATE by the officer, Approver Role "-", APPROVED; ASSIGN & RELOCATE by the officer, APPROVED, new FALO and location; LOGS1 > FALO APPROVED at once (Approver Role "-"); FALO > LOGS1 SUBMITTED for Logistics Officer 1 (the web LOGS1 of the unit can approve); LOGS1 > LOGS1 (recall) SUBMITTED for Unit Resource Officer. After approval the FALO is cleared ("-"), except when the asset had no LOGS1 before: then the LOGS1 is set and the FALO kept. Ownership history rows of approved transactions show the approver as Created By.
- With all assets removed in Edit Selection, RELOCATE says "Please select an asset" but ASSIGN toasts "Submit success" (BUG-011).
- Duplicate ASG numbers (BUG-007, wont-fix: accepted, do not re-report): phone transactions can get numbers already given to web transactions. Web Assignment lists by transaction number (Agency Admin and LOGS1 listings start sorted by it), so new phone transactions sit far down the list: search by Asset ID and open the specific record's view link (each duplicate opens its own record) rather than assuming an ASG number is unique.

## Settings (RFID scanner)
- Connect asks for the location permission; after "Don't allow" twice Connect does nothing (BUG-016). Reset with `adb shell pm clear-permission-flags com.iconsult.mhasgtwo android.permission.ACCESS_FINE_LOCATION user-set user-fixed` (and the same for ACCESS_COARSE_LOCATION).

## Login and logout edge cases
- A lower-case NRIC and a trailing space are accepted; any password works for the passwordless UAT account. Empty username: LOGIN does nothing (BUG-017). Offline: "Login failed / Your username or password is incorrect" (BUG-012).
- Three quick LOGIN taps fire three logins; one is refused (142 bytes) and LOGIN stays dead until a force-stop (BUG-009); two taps worked.
- Logout has no confirmation unless REVIEW holds unsent sightings (then see `stocktake.md` > Leaving, BUG-010); a force-stop or a cost centre switch keeps unsent sightings.

## Test data (found at runtime)
- MHM-006 (read-only): first AVAILABLE asset of MHA web Asset Listing (LOGS1) whose cost centre the phone offers.
- Registration (MHM-013/023): the tests try the officer's LOGS1 cost centres in order until one lists PROGRESS assets (on UAT only 332140 had any). The web test account's LOGS1 does not cover 332140, so they read MHA web as Agency Admin with `WebAssetPage.openAnyAsset`: as Agency Admin the listing's first page covers ~48k assets, and a Search sent after it loaded froze the page for minutes, while a Search sent right after the page opens answered in ~3 s. MHM-013 uses one PROGRESS asset up per run (completing cannot be undone). MHM-023 skips when none of the first three PROGRESS assets has location remarks on web.
- Assign (MHM-014/015/016): cost centre of `phoneAsset(LOGS1)`, asset = the phone's first Select Asset result for Assignee (LOGS1) = the officer; skips when none. MHM-014 leaves a FALO on it, MHM-016 recalls it (URO approval on web), MHM-015 assigns it to the officer as FALO and returns it (LOGS1 approval), so it ends with no FALO. A failed run can leave a SUBMITTED transaction that hides the asset from Select Asset: approve, reject or cancel it on web.
