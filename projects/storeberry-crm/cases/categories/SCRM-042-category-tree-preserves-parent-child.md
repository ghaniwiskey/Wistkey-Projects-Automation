---
id: SCRM-042
title: "Category tree preserves parent-child hierarchy"
feature: categories
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
The category Tree View displays a child category under its configured parent.

## Preconditions
- At least one parent category with a child is available.

## Data
- Parent-child category pair selected dynamically.

## Steps
1. Sign in to the staging CRM and open Categories > Tree view.
2. Choose an existing parent category that has at least one child.
3. Compare the child placement with the All Categories list.

## Expected
- The child category is nested under the selected parent in Tree View.
- The parent and child names correspond to the same category records in All Categories.

## Notes
Read-only. Do not edit category hierarchy.
