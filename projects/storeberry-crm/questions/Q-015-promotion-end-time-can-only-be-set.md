---
id: Q-015
title: "Promotion End Datetime can only be set to whole hours: should a promotion be able to end at 23:59:59?"
status: open
askedTo: "Product owner"
env: staging
found: 2026-10-27T12:55:00.000Z
foundBy: "explorations/2026-10-27-promotions-transfers.md"
tests: []
bugs: []
updated: 2026-10-27T12:55:00.000Z
answered: ""
---
## Question
The Start/End Datetime picker offers only 00:00-23:00. Typing "2026-11-30 23:59:59" is silently changed to "2026-11-30 23:00:00" when the field loses focus, and that is what gets saved. A promotion advertised "until 30 Nov" therefore stops an hour early. Only "Never Expire" gives 23:59:59 (2099-12-31). Is hourly precision intended? If so, should typed minutes be refused with a message instead of being dropped?

## Context
Seen on Add and Edit Promotion (promotion 661, 2026-10-27), xdsoft datetimepicker.

## Answer
Not answered yet.

## History
- 2026-10-27: asked from explorations/2026-10-27-promotions-transfers.md.
