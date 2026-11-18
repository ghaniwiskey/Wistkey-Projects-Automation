---
id: HLM-001
title: "App opens on the Dashboard with every task tile"
feature: smoke
priority: P0
tags: [smoke]
envs: [all]
automated: true
created: 2026-11-18
updated: 2026-11-18
---

## Goal
The handheld app starts and shows the Dashboard with the data update card and all task tiles.

## Preconditions
- Emulator running with com.htx.lims.dev installed
- App account in .env (envs.<env>.mobileAccount, default HLW_ADMIN)

## Steps
1. Launch the app (sign in with the .env account if it shows the login screen)
2. Look at the Dashboard

## Expected
- "Dashboard", "Choose a task to get started."
- Data update card with "Last updated: ..." and "Update all data"
- Tiles with subtitles: Pre Check-in (Store · tag new items), Check-in (Lab · scan items in), Check-out (Scan items leaving), All Assets (Search assets & locations), Stocktake (Scan & reconcile assets), Settings (RFID reader & device), Upload queue (Upload saved records)

## Notes
Automated in tests/e2e/smoke/dashboard.spec.ts. Reuses the app's session when signed in, because logging out deletes the device data.
