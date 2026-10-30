---
id: TWW-126
title: "Resending a reset contact skips other sent, delivered and read contacts"
feature: sending
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Resend one reset contact

Verify that resetting one completed contact makes it eligible again while other Sent, Delivered and Read contacts remain untouched.

## Preconditions
- An admin account and an approved template are available.
- An isolated test setup with a mocked transport contains disposable contacts in Sent, Delivered and Read states, with no other Pending or Failed contacts.

## Data
- Use only disposable test records and mocked delivery; no real messages.

## Steps
1. Log in with your admin account and open the contact list.
2. Reset one Sent contact and confirm the reset.
3. Check that this contact alone changes to Pending and its old message and send information is cleared.
4. Send the template again and wait for the mocked batch to finish.
5. Inspect outgoing requests and compare the other contacts with their previous state.

## Expected
- Exactly one outgoing request targets the reset contact.
- The reset contact becomes Sent with a new message identifier.
- Other Sent, Delivered and Read contacts receive no request and their data is unchanged.

## Notes
Passed in runs/2026-10-30_1503_local_manual as an isolated source integration variant: actual reset/send/queue code, in-memory auth/Prisma and mocked Twilio. Exactly one request after resetting one contact; other Sent/Delivered/Read records unchanged. Browser interaction, live database and real Twilio delivery were not tested.

User-requested retry/skip verification on 2026-10-30. Distinct from TWW-122, which has additional pending/failed recipients and tests explicit selection; distinct from TWW-125 Reset all. Use mocked data, not the user's retained sticker contact. This case requires approval before any future reset or live send affecting actual app data.
