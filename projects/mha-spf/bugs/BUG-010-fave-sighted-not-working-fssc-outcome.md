---
id: BUG-010
title: "FAVE Update Result: SIGHTED + NOT WORKING (To Repair) shows FSSC Outcome \"Working condition\""
severity: minor
status: open
env: staging
url: https://mhauatweb.southeastasia.cloudapp.azure.com/Stocktake/Fave
found: 2026-10-06
foundBy: explorations/2026-10-06-fave-follow-up.md
tests: [SPF-042]
frequency: always
---
## Summary
In the FAVE Update Result dialog, Sighted Result SIGHTED with Asset Condition NOT WORKING maps HTD Follow-up to "To Repair" (the only option), but FSSC Outcome is filled with "Working condition", the outcome of SIGHTED + WORKING. Every other combination gets its own outcome.

## Steps to reproduce
1. Log in as SPF-A2216GA, role Verification Team IC/2IC, Stocktake > FAVE > FAVE FY26-2007, cost centre 332600 APD, Details
2. Tick any PENDING asset (e.g. 111000010977), Update Result
3. Sighted Result SIGHTED, Asset Condition NOT WORKING

## Expected
FSSC Outcome describes an asset to be repaired (the manual says the mapping follows the FSSC guideline; the exact text is not in the manual).

## Actual
HTD Follow-up "To Repair", FSSC Outcome "Working condition". Same when starting from PENDING and when picking "To Repair" again. Reproduced twice.

## Evidence
Other mappings seen in the same dialog: SIGHTED+WORKING > No Further Action / "Working condition"; SIGHTED+NOT IN USE/OBSOLETE > To Dispose (FA5) / "Asset is obsolete, pending demolishment / return to SLA [For L&B only]"; To Transfer to another Unit (STO) > "Pending STO transfer"; NOT SIGHTED > Not Found, for Investigation / "Under investigation".

## Environment
- Base URL: https://mhauatweb.southeastasia.cloudapp.azure.com/Stocktake/Fave
- Env: staging

## History
- 2026-10-06: filed from explorations/2026-10-06-fave-follow-up.md.
