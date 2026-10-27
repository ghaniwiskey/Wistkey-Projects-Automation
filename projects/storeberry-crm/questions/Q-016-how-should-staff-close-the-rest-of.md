---
id: Q-016
title: "How should staff close the rest of a Partial Received transfer when the remaining items never arrive?"
status: open
askedTo: "Product owner"
env: staging
found: 2026-10-27T12:55:00.000Z
foundBy: "explorations/2026-10-27-promotions-transfers.md"
tests: [SCRM-104]
bugs: []
updated: 2026-10-27T12:55:00.000Z
answered: ""
---
## Question
After receiving one row of a two-product transfer (status Partial Received), the detail page offers only Receive; "Cancel Transfer" is gone. Receive has no quantity input. So a unit that is lost or damaged in transit can only be marked received (stock appears at the destination) or left In-transit forever. Is there an intended way to cancel or write off the remaining quantity?

Related: on an In-transit transfer "Cancel Transfer" does not cancel; it sends the order back to Pending (stock returned, still reserved) and a second action "Cancel Transfer Orders" is needed. Is the label intended?

## Context
Transfer 311 QA-TO-mvqodhe9 (Office -> TaiPo, C x1 + product test 2 x1), 2026-10-27. Transfer 312 QA-TO-mvqoiwwt for the cancel path. Stock reconciled in Inventory History.

## Answer
Not answered yet.

## History
- 2026-10-27: asked from explorations/2026-10-27-promotions-transfers.md.
