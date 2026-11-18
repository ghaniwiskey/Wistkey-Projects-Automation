# Gantry flow and the HTX API

How the RFID gantries work and how to test them without hardware (the user gave the Swagger page for the gantry flow only).

## Gantries

| Gantry | IP | Room | Exit |
|---|---|---|---|
| 1a | 192.168.1.106 | Airlock 1 | yes |
| 1b | 192.168.1.105 | Airlock 1 | |
| 2a | 192.168.1.104 | Chemistry | |
| 2b | 192.168.1.103 | Office | |
| 3a | 192.168.1.102 | Biology | |
| 3b | 192.168.1.101 | Airlock 2 | yes |

Read them at run time (`GET /api/GantrySetup` or Gantry > Gantry Setup); the table is for orientation only.

- Every read sets the item's location to the gantry's room (`locationId`, `lastReaderId`, `lastReadOn`) and never changes its status.
- The gantry decides: it downloads the whitelist (`GET /api/Gantry`: the 24-digit chip codes) and posts `authorizerfid` or `unauthorizerfid`. The server logs what it is told: an `authorizerfid` for a non-whitelisted IN item at an exit gantry is logged Authorized with no alert (Q-003).
- `unauthorizerfid` at an exit gantry creates an `UnauthorizedRemoval` alert right away: "Unauthorized removal: <description> (Item Number <no>) passed exit gantry <gantry>."
- A read from an IP that is not in Gantry Setup is logged with the IP as the gantry name and no location (old test reads from 192.168.1.1, 10.0.2.16).
- Whitelist = items OUT on Loan or No return (For use is not); check-in removes the item. Loan / No return check-outs of 8-9 Nov 2026 are missing from it (Q-002).

## API

- Swagger UI `/swagger` and `/swagger/v1/swagger.json` are behind HTTP Basic auth (realm "Swagger", `HLW_SWAGGER_USER` / `HLW_SWAGGER_PASS`). A browser tab shows a Chrome error page instead of the Basic prompt, so call it from code.
- The API itself: `POST /api/Account/login` `{username, password}` (an app account, e.g. HLW_ADMIN) returns `{id, username, name}` and sets the `.AspNetCore.Identity.Application` cookie; send the cookie on later calls. `id` is the user id the gantry posts as `userId` (shown as Officer in the logs).
- No login needed: `GET /api/Gantry`, `GET /api/GantryWhitelist/all`, `POST /api/Gantry/authorizerfid`, `POST /api/Gantry/unauthorizerfid`. Login needed: `/api/inventory/alerts`, `/api/Item/*`, `/api/Gantry/all*log`, `/api/GantrySetup`.
- Gantry read body: `{"userId": "<user id>", "gantry": "<gantry IP>", "rfids": [{"rfidTag": "<24-digit encodedRfidTag>", "readStrength": -55}]}`; returns `true`. A plain string in `rfids` gives 400.
- Items: `GET /api/Item/all` (id, rfIdTag = 9-digit item number, encodedRfidTag = chip code), `GET /api/Item/{id}` (status, exhibitStatus = check-out purpose, locationId, lastReaderId, lastReadOn). `POST /api/GantryWhitelist/status {rfId}` answers true for a whitelisted chip code and an error status with `false` otherwise.
- Not used yet: `GET /api/Gantry/testing/{encodedRfidTag}` (purpose unknown) and `PUT /api/Raid/gantry/checkin`.
- Times: logs and items are local time (UTC+8); `/api/inventory/alerts` `createdOn` is UTC. The web shows local time.

## Test data

Pick items at run time (`Item/all` + `Item/{id}`): an IN item that is not whitelisted (unauthorized exit), a whitelisted Loan item (authorized exit). After moving an IN item through another room's gantry, send a read at an inner gantry of its original room to put it back. Unauthorized alerts stay on the Dashboard until someone acknowledges them (permanent): leave them, note them in the session file.
