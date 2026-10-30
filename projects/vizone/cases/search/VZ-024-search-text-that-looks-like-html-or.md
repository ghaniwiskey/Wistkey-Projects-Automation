---
id: VZ-024
title: "Search text that looks like HTML or script finishes and is not executed"
feature: search
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Pasted text with HTML tags is searched safely and never hangs the page.

## Data
- Keywords: <b>bold</b>, <script>alert(1)</script>

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Search Items for <b>bold</b>
3. Search Items for <script>alert(1)</script>

## Expected
- Each search ends within 5 seconds with a results count or "No search results found"
- No alert dialog appears and the text is shown as typed in the search box

## Notes
On 2026-10-30 <b>bold</b> showed "No search results found" but <script>alert(1)</script> stayed on "Loading Search Results" for 25+ seconds and sent no search request: BUG-001.
