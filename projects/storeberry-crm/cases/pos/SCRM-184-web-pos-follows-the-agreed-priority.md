---
id: SCRM-184
title: "Web POS follows the agreed priority when a free item also qualifies for a percentage discount"
feature: pos
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
Verify which item discount Web POS applies when an eligible cheaper item qualifies for both a buy-two-get-one-free promotion and a percentage discount.

## Preconditions
- An active buy-two-get-one-free promotion and an item percentage discount both apply to the cheaper eligible item at the selected store. The expected priority between the offers is documented.

## Data
- Two units of a higher-priced eligible item and one unit of the cheaper eligible item.

## Steps
1. Log in to Storeberry with a staff account.
2. Go to Physical Stores POS and open Web POS for the eligible store.
3. Add the lower-priced item and note its sale price and item promotion.
4. Add two units of the higher-priced eligible item.
5. Check the promotion name and price on the cheaper item.
6. Clear the test cart without checking out.

## Expected
- The cheaper line shows the winning offer and its matching price: zero if the free-item promotion takes precedence, or the percentage-discounted price if the percentage offer takes precedence.

## Notes
Q-024: product owner to confirm the expected priority. The observation does not establish which offer should win.
