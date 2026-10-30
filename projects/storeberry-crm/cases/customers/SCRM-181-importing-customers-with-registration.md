---
id: SCRM-181
title: "Importing customers with registration email disabled sends no registration email"
feature: customers
priority: P1
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Disable registration email during customer import

Verify that importing a customer with registration email disabled sends no registration email and shows an accurate result message.

## Preconditions
- A staff account with customer import access and a controlled test mailbox with delivery logs are available.

## Data
- A new customer with a unique address in the controlled test mailbox.

## Steps
1. Log in to Storeberry with your staff account.
2. Open Customers > Import > Import CSV and download the sample file.
3. Fill in one new customer using the controlled test mailbox address.
4. Upload the file, leave registration email unchecked, and submit the import once.
5. Read the result message and check the mailbox and delivery logs.

## Expected
- The new customer is created.
- No registration email is queued or delivered for the imported customer.
- The result message does not claim that a registration email was sent.

## Notes
Follow-up from SCRM-165, not executed. The import result claimed emails were sent despite the unchecked toggle; actual sending is unverified. Each import/run and retry requires specific approval.
