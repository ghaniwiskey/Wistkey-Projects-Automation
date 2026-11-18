---
id: Q-003
title: "Should the server check the whitelist itself for gantry reads?"
status: open
askedTo: "user"
env: staging
found: 2026-11-18T03:32:23.282Z
foundBy: "explorations/2026-11-18-gantry-api.md"
tests: [HLW-021, HLW-022]
bugs: []
updated: 2026-11-18T03:32:23.282Z
answered: ""
---
## Question
POST /api/Gantry/authorizerfid accepts a read of an IN item that is not whitelisted at exit gantry 1a and logs it Authorized, with no alert. The server trusts the gantry's own whitelist decision. Is that intended (gantry decides), or should the server raise Unauthorized removal for any non-whitelisted item at an exit gantry?

## Context
2026-11-18 via the API: item 001000009 (IN, not whitelisted) sent as authorized at 1a EXIT (192.168.1.106) -> Gantry Log 'Authorized', no alert. The gantry endpoints also need no login.

## Answer
Not answered yet.

## History
- 2026-11-18: asked from explorations/2026-11-18-gantry-api.md.
