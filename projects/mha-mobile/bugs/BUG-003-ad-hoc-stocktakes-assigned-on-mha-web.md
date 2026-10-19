---
id: BUG-003
title: "Ad hoc stocktakes assigned on MHA web never reach the mobile app (no Stocktake Adhoc tile, Stocktake lists FAVEs only)"
severity: major
status: verified
env: staging
url: Mobile app home / Stocktake; set up on https://mhauatweb.southeastasia.cloudapp.azure.com/Stocktake/StocktakeListing
found: 2026-10-16
foundBy: "mobile exploration 2026-10-16"
tests: [MHM-019]
frequency: always
---
## Summary
The CR12 mobile user manual describes a Stocktake Adhoc module for the Stocktaker (pick an ad hoc list, online or offline, Sighted / Not sighted, Save, REVIEW, Submit), and the app contains it (screen stocktake_adhoc, API MStktake/GetAdhocStocktake). On UAT no role gets a Stocktake Adhoc tile, and an ad hoc stocktake whose asset is assigned to the stocktaker on MHA web does not appear in the Stocktake list either, so ad hoc stocktakes cannot be done on the phone.

## Steps to reproduce
1. MHA web as LOGS1 (Wong Pui Lai Annie): Ad Hoc Setup > Create: One-Off, Manual, name "QA auto mobile adhoc explore", asset 111000021100 (332600 APD) > Submit: "Ad Hoc Stocktake No. ADST00000034 has been created"
2. Ad Hoc Listing > ADST00000034 > Assignment: tick the asset > Assign Stocktaker = Tan Jun Yong Shawn > "The stocktaker has been assigned."
3. Mobile app (Tan Jun Yong Shawn): Switch > Stocktaker | 332600 > look at the home tiles, tap Stocktake
4. Repeat as Logistics Officer 1 and Verification Team IC/2IC | 332600; also tried with the older one-off ADST00000028 (asset 111000010979 assigned to the officer, result reset to PENDING)

## Expected
The stocktaker can open ADST00000034 on the phone (a Stocktake Adhoc tile as in the manual, or the ad hoc stocktake in the Stocktake list), sight the asset and submit it.

## Actual
Home tiles as Stocktaker: Search Asset, Stocktake, New Asset, Settings (no Stocktake Adhoc; no role shows it). Stocktake "(2)" lists only FAVE FY26-2006 and FAVE FY26-2007 (type "Fave"); no ad hoc stocktake for Stocktaker, LOGS1 or VET IC. If the tile is meant to be switched on per role or agency, the setting is missing on UAT.

## Evidence
- Ad hoc stocktakes ADST00000034 (created 16-Oct-2026) and ADST00000028, both with Tan Jun Yong Shawn as Ad Hoc Stocktaker
- APK 2.0-dev strings: main_menu_stocktake_adhoc, MStktake/GetAdhocStocktake, StockTakeAdhocAssetLocListFragment

## Environment
- Base URL: Mobile app home / Stocktake; set up on https://mhauatweb.southeastasia.cloudapp.azure.com/Stocktake/StocktakeListing
- Env: staging

## Resolution
Not an app defect: on UAT the Stocktaker role's MOBILE function **Stocktake (Ad Hoc)** was unticked (MHA web > User > Role Listing > STOCKTAKER > Functions > MOBILE; ticked were Search Asset, Stocktake, New Asset, Setting, which are exactly the tiles the phone showed). With it ticked (2026-10-19, with the user's go-ahead; WEB functions unchanged; affects the role's 195 users on UAT) the Stocktaker home shows a **Stocktake (Ad Hoc)** tile listing the officer's ad hoc stocktakes (9, including ADST00000034/35 created by Wong and ADST00000036 created by the officer on web as HTX-A4805FB), and an ad hoc asset can be sighted and submitted from the phone (web: SIGHTED with the phone's remarks). Check this role setting on other environments before release.

## History
- 2026-10-16: filed from mobile exploration 2026-10-16 in the Test Manager app.
- 2026-10-16: linked to MHM-019 (automated, expected to fail while open; reuses ADST00000034).
- 2026-10-19: cause found: the Stocktaker role's MOBILE function Stocktake (Ad Hoc) was off on UAT. Ticked it (user's go-ahead); MHM-019 reworked into the full ad hoc sighting flow and passes (run 2026-10-19_1536). Status verified.
