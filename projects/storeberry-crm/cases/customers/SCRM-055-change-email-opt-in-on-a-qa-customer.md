---
id: SCRM-055
title: "Change email opt-in on a QA customer without sending a message"
feature: customers
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A customer opt-in change persists after reload and does not send an external message.

## Preconditions
- The staging CRM permits creation of a dedicated QA customer and editing its opt-in setting.

## Data
- Email: qa-<unique>@example.invalid.
- Initial opt-in: No.
- Updated opt-in: Yes.

## Steps
1. Sign in to the staging CRM and create a QA customer with Opt-in set to No.
2. Open the customer profile and change Opt-in to Yes.
3. Save and reload the profile.
4. Review the saved opt-in value and confirm no communication was sent.

## Expected
- Opt-in remains Yes after reload.
- No email or marketing message is sent to any person.

## Notes
Data-changing scenario. Use only example.invalid and verify staging notification routing before running; do not contact real customers.
