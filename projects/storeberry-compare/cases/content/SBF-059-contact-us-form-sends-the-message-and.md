---
id: SBF-059
title: "Contact Us form sends the message and tells the customer"
feature: content
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Customers can contact the shop.

## Preconditions
- Find where contact messages arrive (CRM Message Centre or email) at runtime

## Data
- QA name, dotted unique email, short message

## Steps
1. Open /page/contact-us, submit empty, then submit valid data

## Expected
- Empty submit shows required-field errors
- Valid submit shows a confirmation and the message reaches the shop

## Notes
Feature with no cases before the 2026-10-29 feature-coverage review (menu/page found in the live staging app). Never tested.
