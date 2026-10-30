---
id: TWW-122
title: "Resend only selected reset contacts while other contacts remain pending"
feature: sending
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Resend to chosen contacts only

Verify that resending selected reset contacts does not also message unselected pending or failed contacts.

## Preconditions
- An admin account and an approved template are available.
- An isolated app with a mocked sending transport has disposable contacts A, B and C: A sent, B pending, C failed.

## Data
- No external send requests; all three contacts are controlled mock recipients.

## Steps
1. Log in with your admin account and open the template’s contact list.
2. Reset contact A only and confirm the reset.
3. Choose only A as the resend recipient.
4. Start the resend and inspect the transport request log and statuses of A, B and C.

## Expected
- The interface provides a way to limit the resend to the chosen contact A.
- Exactly one resend request targets A; B and C receive no request and retain their statuses.

## Notes
Source: attached requirements Saas Function 7c, resend to selected/reset contacts. TWW-034 covers reset only; TWW-091 covers retrying all failed contacts. Code review: contacts page has reset/delete but no recipient selection, and /api/send accepts templateId only and queries every PENDING/FAILED contact. Likely missing selection capability; not runtime-confirmed or filed as a reproduced bug. Use mocks; reset requires fresh approval.
