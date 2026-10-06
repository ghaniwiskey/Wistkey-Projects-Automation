---
id: BUG-002
title: "Ad Hoc Setup: one-off stocktakes show a Cancel button but cancelling always fails"
severity: minor
status: open
env: staging
url: https://mhauatweb.southeastasia.cloudapp.azure.com/Stocktake/StocktakeForm?stktakeId=<id>
found: 2026-10-06
foundBy: "SPF-022 first automated run 2026-10-06"
tests: [SPF-022]
frequency: always
---
## Summary
A new one-off ad hoc stocktake (status CREATED) shows a Cancel button on its details page, but submitting the Cancel dialog always answers "Can't cancel one-off stocktake type.". Either hide Cancel for one-off setups or allow the cancel.

## Steps to reproduce
1. Log in as SPF-A2216GA, switch the role to Logistics Officer 1.
2. Stocktake > Ad Hoc Setup > Create: One-Off, Manual, any name, Next, tick one asset, Next, Submit.
3. Open the new ADST number from Ad Hoc Setup (status CREATED, frequency ONE-OFF) and click Cancel.
4. Pick the reason (BUG-001: the only option has an empty label), type remarks, Submit.

## Expected
Cancel is offered only when the setup can be cancelled, or the one-off setup is cancelled.

## Actual
The Cancel button is shown; Submit shows "Can't cancel one-off stocktake type." and the setup stays CREATED. Seen on ADST00000013.

## Evidence
- Playwright run of SPF-022 on 2026-10-06 (cleanup step): alert text "Can't cancel one-off stocktake type."

## Environment
- Base URL: https://mhauatweb.southeastasia.cloudapp.azure.com/Stocktake/StocktakeForm?stktakeId=<id>
- Env: staging

## History
- 2026-10-06: filed from SPF-022 first automated run 2026-10-06 in the Test Manager app.
