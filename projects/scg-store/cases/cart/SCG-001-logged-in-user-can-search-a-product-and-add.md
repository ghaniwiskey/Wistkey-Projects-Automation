---
id: SCG-001
title: "Logged-in user can search a product and add it to cart"
feature: cart
priority: P0
tags: [smoke, cart]
envs: [all]
automated: true
created: 2026-10-05
updated: 2026-10-05
---

## Goal
A logged-in customer finds a product through search and adds it to the cart.

## Preconditions
- Test account from .env (SCG_EMAIL / SCG_PASSWORD)
- The product is not already in the cart (stock is limited to 4 units)

## Data
- Product: RA-TECH WE M14 CNC steel Gas Cylinder Plug | NO.72
- SKU: RAG-WE-M14-010

## Steps
1. Open the store home page (confirm the "Choose your location" modal if it appears)
2. Log in with the email and password of the test account
3. Search for "RA-TECH WE M14 CNC steel Gas Cylinder Plug | NO.72" and open the product
4. Check the product page title and SKU
5. Click Add to Cart
6. Open the cart

## Expected
- After login the account icon shows the logged-in state
- The product page shows the exact product name and SKU RAG-WE-M14-010
- "Successfully Added to Cart" appears and the cart badge goes up by 1
- The cart lists the product

## Notes
Automated in tests/e2e/cart/add-to-cart.spec.ts (page objects in tests/pages). The test removes the product from the cart before and after, because the API rejects adds beyond stock with no UI error.
