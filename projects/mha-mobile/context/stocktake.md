# MHA Mobile: stocktake (FAVE, ad hoc)

Core: `../context.md`. MHA web side of FAVE and ad hoc: `shared/mha-ats/context/stocktake.md`. What the manual says: `manual.md`.

## FAVE on the phone
- Stocktake lists the active cost centre's FAVEs with "Pending: n" (the whole cost centre's count; it updates when the list is reopened). Opening one asks "Will do stocktake by OFFLINE MODE?": CANCEL = online, CONFIRM = offline (below).
- Tabs SELECT / VERIFY / REVIEW. SELECT groups the assets by location ("<barcode> | Block X | Level Y" with an "N Assets" pill that expands the group) and shows the stocktaker only the FAVE assets assigned to them (web FAVE > Assignment > Assign Stocktaker). A web assignment shows on the phone at the next FAVE open; web VET IC resetting a result to PENDING puts the asset back in SELECT.
- Sighting: tap the asset row > StockTake Detail (Asset No., ID 2, serial, category, values; Location section below the fold) > toggle Sighted (and Correct Location; Asset Condition where relevant) > SAVE > confirm "Set this asset as sighted?" > the asset moves from SELECT to REVIEW; tab counts update (they briefly show 0/0/0 while saving). Turning Sighted on turns on Correct Location and sets Asset Condition WORKING.
- Not sighted: Sighted off, Asset Condition offers no values, no HTD Follow-up field; SAVE stores it without a question.
- Wrong location: Sighted on + Correct Location off shows Group / NPC / Base (the unit's groups), Postal Code (4 digits open "Select Address:-" as in New Asset; adb typing all 6 digits at once skipped the dialog and filled the address directly), Building / Address (read-only), Block / Level / Room No ("-" when empty) and "Remarks New Location" (optional).
- Phone remarks have no length limit; web keeps 200 characters (BUG-024). A sighting of an asset reassigned to another stocktaker on web meanwhile is accepted and recorded under the new stocktaker (BUG-022).
- Submit: REVIEW has a full-width dark-blue Submit button > centered loading card + toast "Submission Successful" > REVIEW resets to 0. Submitting an empty REVIEW is a silent no-op (no toast). Web shows nothing until REVIEW > Submit.
- Leaving: the FAVE Home button always asks "Are you sure you want to exit without uploading?", even with REVIEW 0; the exit arrow asks the same with unsent items. Logging out with unsent items asks "The stocktake data in the review is still not submitted, do you want to log out?", and YES deletes them (BUG-010).
- App messages seen or present in the APK: "Submission Successful", "Submission complete", "Submission Failed", "Network Error", "Please Switch ON the internet", "Please try again.".

## Results on MHA web
- SIGHTED + WORKING: Result & Condition "SIGHTED WORKING", HTD Follow-up "No Further Action", FSSC "Working condition", FAVE Status CLOSED, Location Status CLOSED, Correct Location ticked, the phone's remarks and the officer as Stocktaker (the app logs the payload as OKHTTP "entity", sightedMethod MANUAL).
- NOT SIGHTED: HTD "Not Found, for Investigation", FSSC "Under investigation", FAVE Status OPEN, Location Status CLOSED, remarks kept.
- Wrong location: SIGHTED WORKING, Correct Location unticked, Location Status OPEN (the Update Result dialog shows the New Asset Location section empty) and a RELOCATE by the stocktaker, Approver Role Logistics Officer 1, SUBMITTED, with the phone's group, postal code, room and remarks.

## Network and OFFLINE MODE
- Online mode, network dropped before SAVE: toast "No Network", the tabs show 0/0/0 until a tab is tapped with the network back; the sighting is kept (BUG-013). REVIEW hides Submit while offline, in online mode too.
- OFFLINE MODE: CONFIRM downloads the assets first ("All data assets has been downloaded"; ad hoc: "... and postal code ..."; CONTINUE / OK); with no network it gives "Error / Network Error". Sighting works without network (REVIEW 1), but REVIEW shows no Submit while offline and gives no hint; Submit appears once the network is back (redraw the tab) and the result reaches web unchanged (MHM-011). An offline sighting survives reopening the FAVE online.

## Ad hoc on the phone
- The Stocktake (Ad Hoc) tile shows only when the role's MOBILE function "Stocktake (Ad Hoc)" is on (MHA web > User > Role Listing > <role> > Functions > MOBILE, then Save Changes). It was off for Stocktaker on UAT (BUG-003); turning it on is a settings change, done with the user's go-ahead.
- The tile lists the ad hoc stocktakes of the active cost centre assigned to the officer, whoever created them ("Ad Hoc | Pending: n"). Opening one asks the OFFLINE MODE question and uses the FAVE screens (SELECT / VERIFY / REVIEW); the detail has only Sighted, Remarks and the photo; Not sighted saves without a question. Submit: "Submission Successful"; web Ad Hoc Listing > Details shows SIGHTED and Update Result the remarks.
- Its Home icon does nothing (BUG-025); the back arrow leaves without a warning; Logout deletes unsent results without a warning (BUG-020).
- Creating a one-off as the web test account (LOGS1): Ad Hoc Setup > Create > One-Off + Manual + name > Next > tick assets (its own LOGS1 assets, e.g. 332100 A&F; RETIRED ones are offered too) > Next > Submit ("Ad Hoc Stocktake No. ADST... has been created") > Ad Hoc Listing > the stocktake > Assignment > tick > Assign Stocktaker. The select2 stocktaker dropdown sometimes does not open from automation; setting the hidden select and triggering change works.
- MHA web Ad Hoc Listing > Assignment: the footer can read "Showing no records" while the table still shows "Loading...": `WebAdHocPage` waits for a row (MHM-019 once read it too early).

## Known issues and open leads
- **"Network error" after submitting a FAVE** (user report, not reproduced): four attempts (three full sight-and-submit cycles, one empty re-submit) all returned "Submission Successful"; logcat showed no socket/TLS/timeout failures and every request got a response, so it looks intermittent (network or server side). An offline sight-and-submit did not reproduce it either. If it recurs: screenshot the exact message + time; the wording tells the layer ("Network Error" / "Please Switch ON the internet" = connectivity, "Submission Failed" = server rejected); check the "Response Size" logcat lines and that the backend host is reachable.
- Open lead: the OFFLINE MODE sync path (download, sight offline, upload) is still the likely place for that error.

## Test data (found at runtime)
- MHM-005 (`faveTarget`; MHM-011, MHM-017 and MHM-018 use the same data): current FAVE on MHA web (VET IC), first cost centre not APPROVED that offers the mobile officer as stocktaker; there the first PENDING asset already assigned to the officer, else the first PENDING asset with no stocktaker, which the test assigns (no unassign; later runs reuse it). Teardown resets the result to PENDING. Skips when none fits: give the web account a unit where the mobile officer is a stocktaker.
- MHM-018 picks the first Group / NPC / Base and the asset's own postal code and address, with a new Room No; the relocation is rejected (Reason Others) in a `finally`, and `faveTarget` (which switches back to VET IC first) resets the result to PENDING.
- MHM-019 reuses the newest one-off "QA auto mobile adhoc ..." on MHA web (one-offs cannot be cancelled, so none is created per run): it (re)assigns its stocktaker, resets the result to PENDING, sights the asset on the phone and resets it again; it skips when there is none (create one with one asset of a unit where the mobile officer is Stocktaker, steps above). Currently ADST00000036 (asset 111000010977, 332600, created by the officer on web); HTA: `hta.md`.
