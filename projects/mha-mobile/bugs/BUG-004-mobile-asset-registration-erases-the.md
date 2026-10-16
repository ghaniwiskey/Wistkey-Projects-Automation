---
id: BUG-004
title: "Mobile Asset Registration erases the asset's location remarks (Remarks not pre-filled)"
severity: major
status: open
env: staging
url: Mobile app Asset Registration (Register Asset); checked on https://mhauatweb.southeastasia.cloudapp.azure.com/Asset/Asset (Asset Details > Location)
found: 2026-10-16
foundBy: "mobile exploration 2026-10-16"
tests: [MHM-023]
frequency: always
---
## Summary
The Register Asset form pre-fills the PROGRESS asset's Group/NPC/Base, postal code, building, address, block, level and room, but not its location remarks: Remarks shows only the "(Optional)" hint. Saving clears the remarks the asset already had. MHA web's Complete Register loads every location field, remarks included. Same family as BUG-002 (Relocate saves "No Remarks").

## Steps to reproduce
1. MHA web: asset 111000011323 (332600 APD, status PROGRESS) has Location > Remarks "Terminal 2 Police Post (Carpark 2M)", Level 2, Room NA
2. Mobile app, Logistics Officer 1 | 332600: Asset Registration > Register Asset (1) > 111000011323
3. Form shows postal code 819645, building, address, Block NA, Level 2, Room NA; Remarks empty with hint "(Optional)"
4. Change Room to QR6, add one photo (Upload Image), leave Remarks as shown, Save
5. MHA web: open the asset > Location

## Expected
Remarks pre-fills "Terminal 2 Police Post (Carpark 2M)" like the other location fields (and like web Complete Register), and registering keeps it unless the user changes it.

## Actual
Step 4: "Success / Registration Success", Register Asset (0). Step 5: status AVAILABLE, Room No QR6, photo uploaded, but Remarks "-": the remarks are gone. (Restored the same day with a phone relocation: Room NA, remarks retyped.)

## Evidence
- Asset 111000011323, registered from the phone by Tan Jun Yong Shawn on 16-Oct-2026 ~16:15 (emulator time, WIB)

## Environment
- Base URL: Mobile app Asset Registration (Register Asset); checked on https://mhauatweb.southeastasia.cloudapp.azure.com/Asset/Asset (Asset Details > Location)
- Env: staging

## History
- 2026-10-16: filed from mobile exploration 2026-10-16 in the Test Manager app.
- 2026-10-16: linked to MHM-023 (automated, expected to fail while open); MHM-013 retypes the remarks.
