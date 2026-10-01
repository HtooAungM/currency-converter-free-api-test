# Currency Changer — Product Document

## Product overview

**Product name:** Currency Changer  
**Platform:** Web / mobile (Expo React Native)  
**App URL:** https://currency-converter-rho-seven.vercel.app/  
**Repository:** https://github.com/HtooAungM/currency-converter-free-api-test  
**Purpose:** Convert an amount from one currency to another using live mid-market exchange rates from the free Frankfurter API. No login is required.

**Primary users:** Anyone who needs a quick currency conversion, especially USD ↔ Myanmar Kyat (MMK) and other common currencies.

---

## Feature in scope

### Feature name
Currency conversion (You send → You receive)

### Feature summary
The user enters an amount to send, chooses a source currency and a target currency, and immediately sees the converted amount they would receive, plus the mid-market rate used for the calculation.

This feature is the core product action. Login is not part of the product and must not be treated as the journey under test.

---

## Default screen state

When the Exchange screen opens:

- Title shows **Exchange**
- Subtitle shows **Mid-market rate**
- **You send** amount defaults to **10**
- Source currency defaults to **USD** (United States Dollar)
- Target currency defaults to **MMK** (Myanmar Kyat)
- The app fetches the latest USD→MMK mid-market rate
- **You receive** shows `10 × rate`, formatted with thousands separators
- Rate note shows: `1 USD = {rate} MMK`
- Rate date shows: `Updated {date}`

---

## User journey under test

### Journey name
Convert an amount and verify the result, then swap currencies and verify the updated result

### Preconditions
- User can open the Exchange screen
- Device/browser has network access to Frankfurter rates
- No authentication is required

### Steps

1. Open https://currency-converter-rho-seven.vercel.app/
2. Confirm default pair is **USD → MMK** and amount is **10**.
3. Wait until the converted result and rate line are visible (loading finished).
4. Clear the amount field and enter **25**.
5. Confirm **You receive** updates to `25 ×` the current USD→MMK rate.
6. Confirm the rate line still reads `1 USD = {rate} MMK`.
7. Open the **You receive** currency picker.
8. Search for **Euro** (or `EUR`).
9. Select **EUR**.
10. Confirm the target currency chip shows **EUR** and the name shows **Euro**.
11. Wait for the new rate to load.
12. Confirm **You receive** shows the converted amount for `25 USD → EUR`.
13. Confirm the rate line reads `1 USD = {rate} EUR`.
14. Tap **Swap currencies**.
15. Confirm the pair becomes **EUR → USD**.
16. Confirm **You send** still shows amount **25**.
17. Confirm **You receive** and the rate line update for `1 EUR = {rate} USD`.

### Expected outcome
The user successfully performs a real conversion action and can verify both:

- the converted receive amount
- the supporting mid-market rate line

after amount changes, currency changes, and swap.

---

## Expected behaviour

### Amount entry
- The amount field accepts digits and at most one decimal point.
- Non-numeric characters are ignored.
- At most 2 decimal places are kept.
- Empty amount or only `.` shows no converted value (`—`) while a valid rate may still be displayed.
- Changing the amount recalculates the receive amount immediately using the already loaded rate. No new network call is required for amount-only changes.

### Currency selection
- Tapping the source chip opens the currency sheet titled **You send**.
- Tapping the target chip opens the currency sheet titled **You receive**.
- The sheet includes search, Popular currencies, and All currencies.
- Popular list includes: USD, EUR, GBP, MMK, SGD, THB, JPY, CNY, INR, AUD.
- Selecting a currency closes the sheet and updates the chip code + currency name.
- If the user selects the same currency already used on the other side, the app swaps the other side so the pair stays useful (never stuck as USD→USD unless intentionally made identical through other means). Same-currency pairs display rate `1` and date text `Same currency`.

### Conversion calculation
- Formula: `receive_amount = send_amount × mid_market_rate`
- Rate source: Frankfurter public API (`api.frankfurter.dev`)
- Receive amount is formatted with en-US grouping (example: `20,982.40`)
- Very small values (< 0.01) may show up to 6 decimal places so results are not rounded to `0.00`

### Swap
- Swap exchanges source and target currencies.
- Amount value is preserved.
- A new rate is fetched for the reversed pair.
- Receive amount and rate line update to match the new pair.

### Loading and errors
- While a rate is loading, the receive area shows a loading state and the note may show `Fetching the latest rate`.
- If the rate request fails, an error message and **Try again** action are shown.
- Currency list load failure shows an error and retry inside the currency sheet.

---

## Validation rules

| ID | Rule | Pass criteria |
|----|------|---------------|
| VR-01 | Default pair | On first load, source = USD and target = MMK |
| VR-02 | Default amount | On first load, amount = 10 |
| VR-03 | Rate visible | After load, rate line matches `1 USD = {number} MMK` |
| VR-04 | Result visible | After load, receive amount is a formatted number, not `—` and not loading |
| VR-05 | Amount recalculation | Changing amount to 25 updates receive amount without changing the pair |
| VR-06 | Result math | Receive amount equals amount × displayed rate (allowing normal rounding/formatting differences) |
| VR-07 | Currency change | Selecting EUR as target updates chip to EUR and rate line to `1 USD = {number} EUR` |
| VR-08 | Swap pair | After swap from USD→EUR, chips show EUR then USD |
| VR-09 | Swap result | After swap, rate line becomes `1 EUR = {number} USD` and receive amount recalculates |
| VR-10 | Search | Searching `EUR` or `Euro` in the currency sheet lists Euro / EUR |
| VR-11 | No login dependency | The full journey works without any login/logout steps |

---

## Automation target (recommended TestFirst case)

**Test case title:**  
Convert 25 USD to EUR, verify receive amount and rate, then swap and verify EUR to USD

**Why this case:**  
It performs the core product action (conversion), changes input, changes currency, verifies outcomes, and includes swap. It is not a login-only or page-load-only test.

### Suggested automated checks
1. Open https://currency-converter-rho-seven.vercel.app/
2. Assert `from-currency-code` text is `USD`
3. Assert `to-currency-code` text is `MMK`
4. Wait until `rate-line` is visible and contains `1 USD`
5. Wait until `result-amount` is visible
6. Set `amount-input` to `25`
7. Assert `result-amount` updates
8. Click `to-currency`
9. Type `EUR` into `currency-search`
10. Click `currency-EUR`
11. Assert `to-currency-code` is `EUR`
12. Wait until `rate-line` contains `1 USD` and `EUR`
13. Assert `result-amount` is visible and not `—`
14. Click `swap-button`
15. Assert `from-currency-code` is `EUR`
16. Assert `to-currency-code` is `USD`
17. Wait until `rate-line` contains `1 EUR` and `USD`
18. Assert `result-amount` is visible

### Stable selectors (test IDs)

| Element | testID |
|---------|--------|
| Screen | `exchange-screen` |
| Amount input | `amount-input` |
| From currency chip | `from-currency` |
| From currency code | `from-currency-code` |
| To currency chip | `to-currency` |
| To currency code | `to-currency-code` |
| Swap button | `swap-button` |
| Receive amount | `result-amount` |
| Rate line | `rate-line` |
| Rate date | `rate-date` |
| Currency sheet | `currency-sheet` |
| Currency search | `currency-search` |
| Sheet close | `currency-sheet-close` |
| Currency option | `currency-{CODE}` e.g. `currency-EUR` |

---

## Out of scope for this challenge journey

- User authentication / login / logout
- Historical charts
- Offline caching beyond current session behaviour
- Account settings
- Push notifications

---

## Release / quality notes

- Rates are mid-market reference rates, not live trading quotes.
- Network failures should surface a clear retry action.
- Critical risk: incorrect conversion math or stale pair displayed after swap/currency change.
