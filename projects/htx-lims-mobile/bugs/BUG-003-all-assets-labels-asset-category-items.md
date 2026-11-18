---
id: BUG-003
title: "All Assets labels Asset category items as Fixed asset"
severity: minor
status: open
env: staging
url: "app: All Assets"
updated: 2026-11-18T08:35:26.651Z
found: 2026-11-18T08:34:54.221Z
foundBy: "explorations/2026-11-18-handheld.md"
tests: [HLM-009]
frequency: always
---
## Summary
Items of category Asset (e.g. Box) are shown as 'Fixed asset' on the handheld; the category filter offers only Consumable, Chemical, Fixed asset (no Asset).

## Steps to reproduce
1. Handheld: All Assets, search 001000029 (web: Asset / Box)

## Expected
'Asset · Box' and an Asset category filter, as on the web (Asset, Chemical, Consumable, Fixed Asset).

## Actual
'68 · Fixed asset · Box'; 001000031 'Fixed asset · Box'.

## Evidence
- 

## Environment
- Base URL: app: All Assets
- Env: staging

## History
- 2026-11-18: filed from explorations/2026-11-18-handheld.md in the Test Manager app.
