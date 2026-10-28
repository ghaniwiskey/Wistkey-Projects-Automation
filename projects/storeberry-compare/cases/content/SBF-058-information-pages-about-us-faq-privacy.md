---
id: SBF-058
title: "Information pages (About Us, FAQ, Privacy Policy, T&C) open in each language"
feature: content
priority: P2
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Legal and help pages are reachable from the footer.

## Data
- Pages: /page/About-Us, /page/faq, /page/privacy-policy, /page/tnc

## Steps
1. Open each footer link in en-HK, zh-HK and ja

## Expected
- Each page opens with content (no 404, no empty page); the checkout agreement links point to the same T&C

## Notes
Feature with no cases before the 2026-10-29 feature-coverage review (menu/page found in the live staging app). Never tested.
