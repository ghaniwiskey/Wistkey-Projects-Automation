---
id: HLM-017
title: "RFID reader settings without a reader and the reader test"
feature: settings
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
Reader settings

Verify that Settings explains a missing reader and that the reader test counts tags when a reader is connected.

## Preconditions
- A device without a connected RFID reader (or the dev build's simulation)

## Steps
1. On the handheld open Settings and tap Connect reader
2. Open Test RFID scan
3. Switch to Simulation, tap Connect reader, then Start scan for a few seconds and Stop scan

## Expected
- Without a reader: "Not connected" and "Cannot connect to the RFID reader. Check the handheld and close other RFID apps, then retry."
- Start scan stays disabled until the reader is connected
- With the (simulated) reader connected the test shows Unique tags, Total reads, Elapsed and an EPC list, and creates no records

## Notes
Executed 2026-11-19 on the emulator: pass (simulation: 8 unique tags, 112 reads in 7 s).
