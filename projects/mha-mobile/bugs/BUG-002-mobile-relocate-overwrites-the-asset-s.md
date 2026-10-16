---
id: BUG-002
title: "Mobile Relocate overwrites the asset's location remarks with \"No Remarks\""
severity: major
status: open
env: staging
url: "Mobile app Assign > Relocate; checked on https://mhauatweb.southeastasia.cloudapp.azure.com/Asset/Asset (Asset Details > Location)"
found: 2026-10-16
foundBy: "mobile exploration 2026-10-16"
tests: [MHM-009]
frequency: always
---
## Summary
The Relocate (and Assign & Relocate) form pre-fills the asset's postal code, building, block, level and room, but not its location remarks: the Remarks box always holds the text "No Remarks" (real text, not a hint). Completing the relocation saves that text as the asset's location remarks, so the real remarks are lost unless the user retypes them.

## Steps to reproduce
1. MHA web: note an asset's Location > Remarks (UAT 2026-10-16: 111000011299, cost centre 332600, Remarks "Armoury")
2. Mobile app, role Logistics Officer 1 | 332600: Assign > Select Asset > search 111000011299 > + > close; transaction type RELOCATE
3. Change only Room (NA -> QA2); leave Remarks as shown ("No Remarks"); tap Complete
4. MHA web: open the asset > Location

## Expected
Remarks pre-fills the asset's current location remarks ("Armoury"), like the other location fields; a relocation that does not touch remarks keeps them.

## Actual
Step 2: Remarks shows "No Remarks" (deleting a character leaves "No Remark", so it is real text). Step 3: "Submit success", transaction RELOCATE auto-APPROVED. Step 4: Room No QA2 and Remarks "No Remarks": "Armoury" is gone. Same on 704000000347 (Remarks became "No Remarks"). Clearing the box saves empty remarks ("-"); typing them keeps them.

## Evidence
- Transactions ASG00006394 (704000000347) and the next RELOCATE of 111000011299 by Tan Jun Yong Shawn, 16-Oct-2026 ~11:45-11:51 SGT; both assets restored from the phone afterwards (111000011299 Remarks "Armoury" retyped; 704000000347 original remarks unknown, now empty)

## Environment
- Base URL: Mobile app: Assign > Relocate (checked on MHA web Asset Details > Location)
- Env: staging

## History
- 2026-10-16: filed from mobile exploration 2026-10-16 in the Test Manager app.
- 2026-10-16: linked to MHM-009 (automated, expected to fail while open).
