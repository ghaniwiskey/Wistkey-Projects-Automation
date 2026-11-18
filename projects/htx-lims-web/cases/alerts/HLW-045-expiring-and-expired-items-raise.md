---
id: HLW-045
title: "Expiring and expired items raise Dashboard alerts"
feature: alerts
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Expiry alerts

Verify that an IN item expiring within 30 days raises an Expiring alert and an IN item past its expiry date raises an Expired alert.

## Preconditions
- An IN item expiring within 30 days and one past its expiry date (or register one with such an expiry date and check it in)

## Steps
1. Log in to HTX LIMS web with the administrator account
2. Open the Dashboard and Report > Stock Expiry Report

## Expected
- Each IN item expiring within 30 days has an Expiring alert with the expiry date and days left
- Each IN item past its expiry has an Expired alert
- Items that are OUT raise no expiry alert

## Notes
Alerts are checked every minute.
