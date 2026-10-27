# MHA SPF: testing context

The ATS web app is shared with HTA: product, roles, page map, quirks, and the rules, behavior and test data per area are in `shared/mha-ats/context.md` and `shared/mha-ats/context/`. This file holds what is SPF-specific (docs/conventions.md > Knowledge files).

## Environment and account
- UAT: https://mhauatweb.southeastasia.cloudapp.azure.com/ (project.yaml). The manual's other URLs need the SPF intranet VPN and are not used.
- Account: `.env` only (`SPF_USER`, `SPF_PASS` empty = passwordless; README > Accounts). It lacks HQ AO, HQ FALO and End User, and there is no second LOGS1/FALO user; URO was added for SPF-018. Its units include 332600 APD: keep that one when adding units (asset tests use its data).
- SPF has every role of the manual's Table 3 (FALO, End User, HQ AO, HQ FALO); UAO approval is final on UAT. No user delete.
- FAVE numbers `FAVE FYaa-20cc` (agency code 20).
- Login footer: the SPF warning (FOOTER announcement, until 2033).

## SPF-only tests
FALO flows that HTA cannot run (no FALO role there): assign to / return from FALO (SPF-009/010/011/028), recall (SPF-018), FALO closes a follow-up item (SPF-041).
