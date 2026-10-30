---
id: VZ-045
title: "Workstation with an old Vizone plugin gets the approved version centrally"
feature: premiere-plugin
priority: P2
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Central version enforcement keeps all workstations on the approved plugin.

## Preconditions
- Central plugin deployment is in place
- One test workstation can be set back to an older plugin version

## Data
- Approved plugin version (from IT) and one older version

## Steps
1. Install the older plugin on the test workstation
2. Let the central update run (or log in again)
3. Open Premiere and check the Vizone plugin version

## Expected
- The workstation shows the approved plugin version without a manual install
- If the update cannot run, Premiere or the plugin warns that the version is not approved

## Notes
Fix verification for the 28 Oct 2026 feedback report, recommended remediation: enforce centralized upgrade to the latest stable Vizone plugin (CNCA 5). See context.md > Known user issues. Manual only. VZ-018 audits all workstations.
