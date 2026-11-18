---
id: BUG-002
title: "All Assets shows a DISPOSED item as Checked in"
severity: major
status: open
env: staging
url: "app: All Assets"
updated: 2026-11-18T08:35:26.528Z
found: 2026-11-18T08:34:54.109Z
foundBy: "explorations/2026-11-18-handheld.md"
tests: [HLM-009]
frequency: always
---
## Summary
On the handheld All Assets list a disposed item is shown as 'Checked in' at its old room. The status filter has no Disposed / Not found option.

## Steps to reproduce
1. Dispose an item through the web Stock-take adjustment (e.g. 003000032)
2. Handheld: All Assets, Refresh list, search 003000032

## Expected
The item shows as Disposed (or is not listed as available).

## Actual
'003000032 · 92 · Chemical · Toluene · Checked in · Chemistry' after Refresh list; status filter options: All statuses, Not pre check-in, Not check-in, Checked in, In use, Checked out. Web and API: DISPOSED.

## Evidence
- Screenshot: ![all assets](../explorations/2026-11-18-handheld/HLM-allassets-disposed.png)

## Environment
- Base URL: app: All Assets
- Env: staging

## History
- 2026-11-18: filed from explorations/2026-11-18-handheld.md in the Test Manager app.
