---
id: HLW-016
title: "Check out for use and with no return"
feature: check-in-out
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Check Out purposes

Verify that the For use and No return purposes check items out and are recorded with that purpose.

## Preconditions
- Two items with status IN

## Data
- Purposes: For use, No return

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Check In / Out > Check Out, tick one item, set Purpose For use and click Check Out
3. Tick another item, set Purpose No return and click Check Out
4. Open Report > Check In Out Report and search for both items

## Expected
- Both items have Status OUT
- Check In Out Report shows FOR USE for the first and NO RETURN for the second
- Gantry > Gantry Whitelist lists the No return item but not the For use item

## Notes
For use: not whitelisted, stock goes down. No return: whitelisted, stock goes down (workflow). Both take the item out of stock: confirm before running.
