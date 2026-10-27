# MHA ATS web: assignment, registration, rejection, new asset

Core: `../context.md`. Manual: `../docs/user-manual/03-asset-listing-registration.md`, `04-asset-assignment.md`, `05-asset-rejection-tag-retirement-new.md`.

## Rules
- Assignment approval: LOGS1 > LOGS1 needs URO; LOGS1 > FALO auto-approved; FALO > FALO and FALO > LOGS1 need LOGS1; LOGS1 taking back from FALO/Enduser and FALO from Enduser auto-approved; relocation auto-approved. Assets in an ongoing transaction are not selectable. The owner can Cancel a SUBMITTED transaction (CANCELLED).
- Assignee roles: as FALO pick FALO or ENDUSER; as LOGS1 pick LOGS1, FALO or ENDUSER (HTA: LOGS1 only). Empty assignee during registration = yourself.
- Registration location: Group/NPC/Base and Postal code mandatory; complete needs at least one of Block/Level/Room No./Remarks; all four empty = PROGRESS.
- Asset Sensitivity = YES disables photo upload. Tag printing YES needs Tag Type ASSET or FILE; NO sets NA.
- Limits: reject/reinstate "Others" 250 chars; New Asset close/cancel "Others" 200.

## Observed behavior (UAT)
- Relocate: "Relocation request #ASG... is created", auto-APPROVED, location updated. Assign LOGS1 > FALO: "... is created and approved." Assign & Relocate: "Asset Assignment and Relocation request #ASG... is created and approved." (ownership and location change).
- FALO > LOGS1 (return): "... is created and pending approval.", Approver Role LOGS1 (same officer can approve). After approval Current LOGS1 = officer, Current FALO cleared ("-").
- LOGS1 > LOGS1 (recall): always pending, Approver Role "Unit Resource Officer". After URO approval Current FALO is cleared.
- Cancel / Reject: select2 Reason (Cancel: Others only, Remarks max 200, "Remarks is required"; Reject: Incorrect Assignee, Incorrect Location, Incorrect Location and Assignee, Others) > "Are you sure to ...?" Yes > "Assignment has been cancelled./rejected.".
- Register: Locate & Assign (FALO optional, Group, Postal Code, Block/Level/Room/Remarks) > Sensitivity (default NO) > RFID Tag (YES default). "Asset Registration completed." / "Asset Registration incomplete." (PROGRESS).
- Reject (native select: Incorrect Cost Centre, Others, Wrongly Capitalised): "Assets Rejected.". Reinstate (Others, Wrongly Assigned, Wrongly Rejected): "Reinstatement Completed"; status returns to the one before rejection.
- New Asset: Cost Centre*, Remarks*, Postal Code*, location Remarks*, photo* > "New Asset #RNA... has been created." (OPEN). Close Item (Asset Pending Capitalisation, Item Belongs to Other Unit, Not an Asset, Others): "The reported new asset has been closed." (no confirmation). Cancel Item: Mistaken as Asset, Others.

## Quirks and waits
- Wizard location steps (Relocate, Complete Register) load the location by XHR AFTER the step opens and overwrite every field: wait for Building to have a value. Picking a postal code also fills Building/Address by XHR. Postal Code is a server-side select2 search (type into `.select2-container--open .select2-search__field`).
- The Assignee list reloads by XHR when Role changes; an open select2 keeps the stale list. Wait for the officer in the hidden <select>.
- Assignment type radios are hidden `btn-check` inputs: click their `label[for=...]`.
- Choose Asset: ticking a row updates "N asset(s) selected" but the checkbox does not stay checked. Assert the counter.
- HTA: assets whose group belongs to another cost centre open the location step with an empty Group / NPC / Base (`AssignmentCreatePage.fillsEmptyLocationGroup`, `projects/mha-hta/context.md`).

## Test data (found at runtime)
- Assignment writes share one asset per run (fixture `writableAsset`: first asset whose LOGS1 is the test account), cancelling SUBMITTED transactions before and after. The "other FALO" is the first one in the Assignee list that is not the test account.
- Registration: first NEW asset. SPF-013/014 use one up per run (cannot be undone); SPF-015 returns it to NEW. They skip when none is left.
- Locations: first Group / Cost Centre offered; postal code from the first AVAILABLE asset (fixture `unitPostalCode`), first address returned. Works for every agency.
