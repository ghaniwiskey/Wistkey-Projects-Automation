---
id: Q-004
title: "Should a product be saveable with a price of HKD 0.00?"
status: open
askedTo: "Product owner"
env: staging
found: 2026-10-27
foundBy: "explorations/2026-10-27-crm-eshop-critical.md"
tests: [SCRM-057]
bugs: []
answered: ""
---
## Question
Is a HKD 0.00 product allowed (e.g. free gifts), or must the product form reject a zero price?

## Context
On 2026-10-27 a Hidden physical product saved with Final Price HKD 0.00 and no warning (product 3199, terminated afterwards). Negative input is reset to 0 by the field. SCRM-057 expects zero to be rejected and is recorded as fail (untriaged) until this is answered.

## Answer
Not answered yet.

## History
- 2026-10-27: asked from explorations/2026-10-27-crm-eshop-critical.md.
