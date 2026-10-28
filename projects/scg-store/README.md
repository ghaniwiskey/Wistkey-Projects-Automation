# SCG Store (scg-store)

SCG online store at https://scg.next.mystoreberry.com (Storeberry, Astro). Test IDs `SCG-NNN`.

- Smoke: open store -> log in -> search "RA-TECH WE M14 CNC steel Gas Cylinder Plug | NO.72" -> add to cart -> verify cart (`SCG-001`, `tests/e2e/cart/add-to-cart.spec.ts`).
- Credentials: `SCG_EMAIL` / `SCG_PASSWORD` in the root `.env`.
- Run: `.\qa test --project=scg-store` (at most 2 runs per 10 minutes: Testing permissions)

## Testing permissions

- The site firewall 403-blocks this PC's IP after a few quick runs (it happened twice): at most 2 SCG runs per 10 minutes, never loop the test. For CI, ask the site owner to allowlist the test IP.
- The only write is the test account's own cart: SCG-001 removes its item before and after (the cart is shared between runs).

## Site quirks handled

- **Location modal**: first visit shows "Choose your location"; auto-confirmed via `page.addLocatorHandler`.
- **Astro hydration**: clicking before React islands hydrate does nothing (or natively submits the login form as `/login?email=...`). `waitForHydration()` waits until no `<astro-island ssr>` remain.
- **Duplicate elements**: header and Add to Cart are rendered twice (desktop/mobile, sticky bar). Locators filter to the visible copy / `.pdp-checkout-block`.
- **Firewall / rate limit**: repeated automated logins from one IP get a bare `403 Forbidden` for a while; `navigate()` fails fast with a clear message (run limits: Testing permissions).
- **Limited stock**: the product tracks inventory (only 4 available). If the cart already holds them all, the API returns `400 Not enough quantity` and the UI shows **no error**. The test removes the product from the cart before adding (step 2) and again in `afterEach`, and surfaces the API message if add-to-cart is rejected.
- **Shared cart**: the test account's cart persists, so the test asserts the badge goes up by exactly 1 rather than an absolute count.

