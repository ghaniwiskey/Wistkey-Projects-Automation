---
id: BUG-011
title: "Ad Hoc Setup: one-off stocktakes show a Cancel button but cancelling always fails"
severity: minor
status: wont-fix
env: staging
url: https://mhauatwebhta.southeastasia.cloudapp.azure.com/Stocktake/StocktakeForm?stktakeId=<id>
found: 2026-10-07
foundBy: "SPF-vs-HTA recheck (Aside)"
tests: []
frequency: always
---
## Summary
A new one-off ad hoc stocktake (status CREATED) shows a Cancel button on its details page, but submitting the Cancel dialog always answers "Can't cancel one-off stocktake type.". Same defect as mha-spf BUG-002 (there closed as wont-fix: accepted behaviour).

## Steps to reproduce
1. Log in as the HTA test account, role Logistics Officer 1
2. Stocktake > Ad Hoc Setup > Create: One-Off, Manual, any name, Next, tick one asset, Next, Submit
3. Open the new ADST number (status CREATED, frequency ONE-OFF) and click Cancel
4. Pick the reason (BUG-002: the only option has an empty label) and Submit

## Expected
Cancel is offered only when the setup can be cancelled, or the one-off setup is cancelled.

## Actual
"Can't cancel one-off stocktake type." and the setup stays CREATED. Seen on HTA 2026-10-07 with ADST00000012 ("QA auto adhoc oneoff check"), which is left behind: one-offs cannot be cleaned up from the UI.

## Evidence
- Test account's ADST00000012 stays CREATED in Stocktake > Ad Hoc Setup

## Environment
- Base URL: https://mhauatwebhta.southeastasia.cloudapp.azure.com/Stocktake/StocktakeForm?stktakeId=<id>
- Env: staging

## History
- 2026-10-07: filed from the SPF-vs-HTA recheck; served as wont-fix like mha-spf BUG-002 (accepted behaviour).
