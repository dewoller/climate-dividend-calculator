Okay, this is a great specification for a single-page "Climate Dividend Calculator." Let's break this down into a detailed blueprint and then into iterative, testable steps suitable for prompting a code-generation LLM.

**Project Blueprint: Climate Dividend Calculator**

**Phase 1: Foundational HTML Structure & Static Content**

1.  **Core HTML (`index.html`):**
      * Basic document structure (doctype, head, body).
      * Title.
      * Placeholders for CSS and JS links.
      * Main container div.
2.  **Tabs Structure:**
      * Navigation buttons/links for "Main Calculator," "Background Assumptions," and "Calculation Details."
      * Divs for each tab's content area. Initially, only the "Main Calculator" tab will be visible.
3.  **Main Calculator Tab - Static Inputs:**
      * Form elements (labels, inputs) for: Adults, Children, Electricity, Gas, Petrol.
      * Set default values as static text or input `value` attributes.
4.  **Main Calculator Tab - Static Outputs:**
      * Placeholder elements (divs, spans) for: Headline, Narrative Summary, Table (with rows for Per-adult dividend, Per-household dividend, Total extra cost, Net benefit – each with Annual & Monthly columns).
5.  **Background Assumptions Tab - Static Inputs:**
      * Form elements (labels, inputs) for all 11 background assumption fields.
      * Set default values as static text or input `value` attributes.
6.  **Calculation Details Tab - Static Placeholders:**
      * Placeholder elements for displaying intermediate calculations (e.g., Gross Revenue, Net Revenue, Per-fuel costs).
7.  **Footer & Privacy Notice:**
      * Static text for the footer and privacy notice.
8.  **Basic CSS (`styles.css`):**
      * Minimal styling to make tabs visually distinct and content readable.
      * Rule to hide "Background Assumptions" and "Calculation Details" tabs by default.

**Phase 2: Core Calculation Logic (JavaScript - `calculator.js`)**

1.  **Constants & Default Values:**
      * Define JavaScript objects or constants to hold all default values for both main inputs and background assumptions.
2.  **Revenue and Dividend Calculations:**
      * `calculateGrossRevenue(P, E)`
      * `calculateNetRevenue(grossRevenue, r)`
      * `calculateAdultDividend(netRevenue, N)`
      * `calculateHouseholdDividend(adults, children, c, adultDividend)`
3.  **Extra Household Cost Calculations:**
      * `calculateExtraCostPerUnit(P, EF, PT)`
      * `calculateAnnualFuelCost(usage, extraCostPerUnit)`
      * `calculateTotalExtraHouseholdCost(annualElectricityCost, annualGasCost, annualPetrolCost)`
4.  **Net Benefit Calculation:**
      * `calculateNetBenefit(householdDividend, totalExtraCost)`
5.  **Monthly Value Helper:**
      * `getMonthlyValue(annualValue)`
6.  **Orchestration Function:**
      * A main function `runCalculations(userInput, policyAssumptions)` that takes all inputs and returns an object with all calculated outputs (main page outputs and intermediate values for details tab).

**Phase 3: UI Interaction & Dynamic Display (JavaScript - `app.js`)**

1.  **DOM Element References:**
      * Get references to all input fields and output display elements.
2.  **Tab Navigation Logic:**
      * Event listeners for tab buttons to show/hide respective content divs.
3.  **Input Gathering:**
      * Functions to read current values from main input fields and background assumption fields. Provide default values if fields are empty or invalid (initially).
4.  **Display Update Logic:**
      * Function `updateDisplay(calculatedData)` to take the output from `runCalculations` and populate the HTML elements in the Main Calculator tab and the Calculation Details tab.
      * Currency formatting helper for display.
5.  **Event Listeners for Inputs:**
      * Attach event listeners (`input` or `change`) to all user input fields (Main Calculator and Background Assumptions).
      * On input change:
          * Gather all current inputs.
          * Call `runCalculations`.
          * Call `updateDisplay`.
6.  **Initial Calculation on Load:**
      * Run calculations and display results using default values when the page loads.

**Phase 4: Input Validation & Error Handling (JavaScript - `app.js` / `validation.js`)**

1.  **Input Validation Functions:**
      * `isNonNegativeNumber(value)`: Checks if value is a number and \>= 0.
2.  **Inline Error Display:**
      * For each input field, create a small area (e.g., a `<span>`) for error messages.
      * Modify input event listeners:
          * Validate input.
          * If invalid: show error message, potentially add an error class to the input, and block calculation updates (or use last valid value/default).
          * If valid: clear error message.
3.  **Revert to Default on Invalid Focus Out:**
      * Add `blur` event listeners. If the field is invalid on blur, revert its value to its default.
4.  **Division by Zero Handling:**
      * Modify relevant functions in `calculator.js` (e.g., `calculateAdultDividend`) to check for divisor being zero. Return a special value (e.g., `null`, `Infinity`, or handle as per spec: "—").
      * Update `updateDisplay` in `app.js` to show "—" or an appropriate message for outputs affected by division by zero.

**Phase 5: Styling & Responsiveness (CSS - `styles.css` & Bootstrap)**

1.  **Integrate Bootstrap (Minimal):**
      * Add Bootstrap CDN link.
      * Use Bootstrap's grid system for basic layout and responsiveness of main sections.
      * Use Bootstrap form styling for inputs and buttons.
      * Use Bootstrap table styling.
2.  **Custom Styling:**
      * Ensure minimal, uncluttered interface.
      * Verify single-page layout without scrolling for key elements on typical desktop.
      * Ensure readability on mobile (font sizes, spacing).
      * Style error messages (e.g., small red text).

**Phase 6: Testing & Finalization**

1.  **Functional Testing:** As per spec.
2.  **Layout Testing:** As per spec.
3.  **Accessibility Testing:** Basic checks (keyboard nav, labels).
4.  **Browser Compatibility Testing.**
5.  **Privacy Confirmation.**
6.  **Code Comments & Readability:** Ensure `calculator.js` and `app.js` are well-commented, especially the calculation logic.
7.  **README.md:** Create a simple README.

-----

**Iterative Breakdown into Small, Testable Steps & LLM Prompts**

We'll build this incrementally. Each step will specify files to create/modify and context files.

-----

**Iteration 1: Basic HTML Structure and Main Page Static Display**

**Prompt 1.1**
`Context: None`
`Create/Modify: index.html, styles.css`

````text
Create an HTML file named `index.html`.
It should have:
1.  Standard HTML5 doctype and structure (`<html>`, `<head>`, `<body>`).
2.  A `<title>`: "Climate Dividend Calculator".
3.  Placeholders for CSS (`<link rel="stylesheet" href="styles.css">`) and JavaScript files (`<script src="calculator.js" defer></script>`, `<script src="app.js" defer></script>`) in the `<head>` and before the closing `</body>` tag respectively.
4.  Inside the `<body>`, create a main container: `<div id="app-container">`.
5.  Inside `app-container`, create three `<div>` elements for the tab content:
    * `<div id="main-calculator-tab" class="tab-content active-tab">`
    * `<div id="background-assumptions-tab" class="tab-content">`
    * `<div id="calculation-details-tab" class="tab-content">`
6.  Also inside `app-container`, before the tab content divs, create a navigation area: `<nav id="tab-navigation">`.
    * Add three buttons:
        * `<button id="btn-main-calculator" class="tab-button active">Main Calculator</button>`
        * `<button id="btn-background-assumptions" class="tab-button">Background Assumptions</button>`
        * `<button id="btn-calculation-details" class="tab-button">Calculation Details</button>`
7.  Inside `main-calculator-tab`, add a section for "User Inputs": `<h2>User Inputs</h2>`.
    * Create labeled number inputs for:
        * `numAdults`: "Number of adults in household", default value 2, min 0.
        * `numChildren`: "Number of eligible children", default value 0, min 0.
        * `annualElectricityKwh`: "Annual household electricity use (kWh)", default value 5000, min 0.
        * `annualGasGj`: "Annual household gas use (GJ)", default value 20, min 0.
        * `annualPetrolL`: "Annual household petrol use (L)", default value 1600, min 0.
    * For each input, add a `<span>` next to it for potential error messages, e.g., `<span id="numAdultsError" class="error-message"></span>`.
8.  Inside `main-calculator-tab`, add a section for "Outputs": `<h2>Outputs</h2>`.
    * Headline: `<h3 id="output-headline">Your household’s net benefit is $X per year.</h3>`
    * Narrative Summary: `<p id="output-narrative">With these settings, your household receives a total annual dividend of $Y and pays an estimated $Z in extra costs, giving a net benefit of $X per year.</p>`
    * Table: `<table id="output-table">`
        * <thead>: "Figure", "Annual", "Monthly"
        * <tbody> with `<tr>` for:
            * "Per-adult dividend": `<td id="table-adult-dividend-annual">$A</td><td id="table-adult-dividend-monthly">$a</td>`
            * "Per-household dividend": `<td id="table-household-dividend-annual">$B</td><td id="table-household-dividend-monthly">$b</td>`
            * "Total extra household cost": `<td id="table-extra-cost-annual">$C</td><td id="table-extra-cost-monthly">$c</td>`
            * "Net benefit": `<td id="table-net-benefit-annual">$D</td><td id="table-net-benefit-monthly">$d</td>`
9.  Add a footer outside `app-container` but within `<body>`:
    ```html
    <footer>
        <p>Model based on UNSW Australian Carbon Dividend Plan.</p>
        <p>Text, photos and graphics © Citizens’ Climate Lobby (CCL) Australia or used with permission. All rights reserved. Text available under Creative Commons NC SA licence.</p>
        <div id="privacy-notice">
            <p><strong>Privacy Notice:</strong> No data is saved or shared.</p>
        </div>
    </footer>
    ```
10. Create a `styles.css` file. Add basic CSS:
    * Make `.tab-content` hidden by default.
    * Make `.tab-content.active-tab` display as `block`.
    * Make `.error-message` have `color: red; font-size: 0.8em;`.
    * Style `.tab-button.active` differently from other `.tab-button`s to indicate selection.
    * Basic styling for table to be readable.

*Self-test for this step:* Open `index.html`. The "Main Calculator" tab should be visible with its inputs and placeholder outputs. Other tabs should be hidden. The footer and privacy notice should be visible. Buttons for tabs should be present.
````

-----

**Prompt 1.2**
`Context: index.html, styles.css`
`Create/Modify: index.html`

```text
Modify `index.html` to populate the static structure for the "Background Assumptions" and "Calculation Details" tabs.

1.  Inside `<div id="background-assumptions-tab" class="tab-content">`:
    * Add `<h2>Background Policy Assumptions</h2>`.
    * Create labeled number inputs for the following fields, each with a `min="0"` attribute and their specified default value in the `value` attribute. For fields that are rates/factors (e.g., Admin Cost Rate, Child Share Factor, Pass-Through Rates), allow decimals using `step="any"` or an appropriate small step like `step="0.01"`.
        1.  `carbonPrice` (P): "Carbon Price ($/t CO₂-e)", default 50
        2.  `totalCoveredEmissions` (E): "Total Covered Emissions (Mt CO₂-e)", default 466
        3.  `adminCostRate` (r): "Administrative Cost Rate", default 0.10, step 0.01
        4.  `eligibleAdultPopulation` (N): "Eligible Adult Population", default 16000000
        5.  `childShareFactor` (c): "Child Share Factor", default 0, step 0.1
        6.  `gridEmissionsFactor` (EFₑ): "Grid Emissions Factor (t/kWh)", default 0.0007, step "any"
        7.  `gasEmissionsFactor` (EFg): "Gas Emissions Factor (t/GJ)", default 0.051, step "any"
        8.  `petrolEmissionsFactor` (EFp): "Petrol Emissions Factor (t/L)", default 0.0023, step "any"
        9.  `passThroughElectricity` (PTₑ): "Pass-Through Rate — Electricity", default 1, step 0.01
        10. `passThroughGas` (PTg): "Pass-Through Rate — Gas", default 1, step 0.01
        11. `passThroughPetrol` (PTp): "Pass-Through Rate — Petrol", default 1, step 0.01
    * For each input, add a `<span>` next to it for potential error messages, e.g., `<span id="carbonPriceError" class="error-message"></span>`.

2.  Inside `<div id="calculation-details-tab" class="tab-content">`:
    * Add `<h2>Calculation Details (Read-Only)</h2>`.
    * Create `div` or `p` elements with `id`s to display the following read-only values. Use placeholder text like "[value]".
        * `details-gross-revenue`: "Gross Revenue: [value]"
        * `details-net-revenue`: "Net Revenue (after admin): [value]"
        * `details-per-adult-dividend`: "Per-Adult Dividend (annual): [value]"
        * `details-cost-electricity-per-unit`: "Extra Cost per kWh Electricity: [value]"
        * `details-cost-gas-per-unit`: "Extra Cost per GJ Gas: [value]"
        * `details-cost-petrol-per-unit`: "Extra Cost per L Petrol: [value]"
        * `details-annual-cost-electricity`: "Annual Extra Electricity Cost: [value]"
        * `details-annual-cost-gas`: "Annual Extra Gas Cost: [value]"
        * `details-annual-cost-petrol`: "Annual Extra Petrol Cost: [value]"
        * `details-total-annual-household-cost`: "Total Annual Extra Household Cost: [value]"
        * `details-annual-household-dividend`: "Total Annual Household Dividend: [value]"
        * `details-net-annual-benefit`: "Net Annual Household Benefit: [value]"

*Self-test for this step:* Open `index.html`. Manually change `styles.css` (or use browser dev tools) to make `background-assumptions-tab` or `calculation-details-tab` active. Verify the new inputs and placeholder texts are present and structured correctly. Revert CSS changes.
```

-----

**Iteration 2: Core Calculation Logic (No UI Connection Yet)**

**Prompt 2.1**
`Context: None`
`Create/Modify: calculator.js`

````text
Create a JavaScript file named `calculator.js`.
This file will contain the core calculation logic. Do not interact with the DOM in this file.

1.  Define an object `DEFAULT_POLICY_ASSUMPTIONS` to store the default values for background assumptions:
    * `carbonPrice (P)`: 50
    * `totalCoveredEmissions (E)`: 466 (Note: This is in Mt CO₂-e. For calculations, you might need to convert it to t CO₂-e, so 466,000,000 t CO₂-e. Clarify if the formula uses Mt or t directly; the formula G = P * E usually expects consistent units. Assuming P is $/t and E is in t for the formula, store E as 466,000,000).
    * `adminCostRate (r)`: 0.10
    * `eligibleAdultPopulation (N)`: 16000000
    * `childShareFactor (c)`: 0
    * `gridEmissionsFactor (EF_e)`: 0.0007
    * `gasEmissionsFactor (EF_g)`: 0.051
    * `petrolEmissionsFactor (EF_p)`: 0.0023
    * `passThroughElectricity (PT_e)`: 1
    * `passThroughGas (PT_g)`: 1
    * `passThroughPetrol (PT_p)`: 1

2.  Define an object `DEFAULT_USER_INPUTS` to store default user household inputs:
    * `numAdults`: 2
    * `numChildren`: 0
    * `annualElectricityKwh`: 5000
    * `annualGasGj`: 20
    * `annualPetrolL`: 1600

3.  Implement the following pure calculation functions. Add JSDoc comments explaining parameters and return values.

    * `calculateGrossRevenue(carbonPrice, totalCoveredEmissions)`:
        * Formula: `G = P * E`
        * Ensure `totalCoveredEmissions` is used in tonnes (e.g., if input is Mt, multiply by 1,000,000). Given the `carbonPrice` unit is `A$/t CO₂-e`, `totalCoveredEmissions` should be in `t CO₂-e`. So, if the input `E` is 466 Mt, the calculation should use 466,000,000.
        * Returns the gross revenue.

    * `calculateNetRevenue(grossRevenue, adminCostRate)`:
        * Formula: `R = G * (1 - r)`
        * Returns the net revenue.

    * `calculateAdultDividend(netRevenue, eligibleAdultPopulation)`:
        * Formula: `D_adult = R / N`
        * Handle potential division by zero if `eligibleAdultPopulation` is 0. Return 0 or null in such a case, and add a comment about this handling.
        * Returns the annual dividend per adult.

To test these functions, you can include example calls at the end of the file (commented out or within a self-executing anonymous function for testing purposes during development):
```javascript
/*
// Test snippet (for development only, remove or comment out for production)
const testGrossRevenue = calculateGrossRevenue(DEFAULT_POLICY_ASSUMPTIONS.carbonPrice, DEFAULT_POLICY_ASSUMPTIONS.totalCoveredEmissions);
console.log('Test Gross Revenue:', testGrossRevenue); // Expected: 50 * 466,000,000 = 23,300,000,000

const testNetRevenue = calculateNetRevenue(testGrossRevenue, DEFAULT_POLICY_ASSUMPTIONS.adminCostRate);
console.log('Test Net Revenue:', testNetRevenue); // Expected: 23,300,000,000 * (1 - 0.10) = 20,970,000,000

const testAdultDividend = calculateAdultDividend(testNetRevenue, DEFAULT_POLICY_ASSUMPTIONS.eligibleAdultPopulation);
console.log('Test Adult Dividend:', testAdultDividend); // Expected: 20,970,000,000 / 16,000,000 = 1310.625
*/
````

```
*Self-test for this step:* Manually run the JS file (e.g., with Node.js or in browser console by pasting the code). Check if the console logs show the expected values for the test calculations.
```

-----

**Prompt 2.2**
`Context: calculator.js`
`Create/Modify: calculator.js`

````text
Continue building `calculator.js` by adding the remaining calculation functions. Ensure JSDoc comments for all functions.

1.  `calculateHouseholdDividend(numAdults, numChildren, childShareFactor, adultAnnualDividend)`:
    * Formula: `D_household = (adults + c * children) * D_adult`
    * Returns the annual dividend per household.

2.  `calculateExtraCostPerUnit(carbonPrice, emissionsFactor, passThroughRate)`:
    * Formula: `Δp = P * EF * PT`
    * Returns the extra cost per unit of a specific fuel.

3.  `calculateAnnualFuelCost(usage, extraCostPerUnit)`:
    * Formula: `ΔC = Usage * Δp`
    * Returns the total annual extra cost for a specific fuel.

4.  `calculateTotalExtraHouseholdCost(annualElectricityCost, annualGasCost, annualPetrolCost)`:
    * Sums the three provided annual fuel costs.
    * Returns the total extra household cost.

5.  `calculateNetBenefit(annualHouseholdDividend, totalAnnualExtraCost)`:
    * Formula: `Net benefit (annual) = D_household - Total extra cost`
    * Returns the net annual benefit.

6.  `getMonthlyValue(annualValue)`:
    * Divides the annual value by 12.
    * Returns the monthly equivalent. Ensure this handles cases where `annualValue` might be null or undefined gracefully (e.g., return 0 or null).

Add test snippets similar to Prompt 2.1 for these new functions, using the default values from `DEFAULT_POLICY_ASSUMPTIONS` and `DEFAULT_USER_INPUTS` and results from previously tested functions. For example:
```javascript
/*
// Test snippet (for development only)
const adultAnnDividend = 1310.625; // From previous test
const householdDiv = calculateHouseholdDividend(DEFAULT_USER_INPUTS.numAdults, DEFAULT_USER_INPUTS.numChildren, DEFAULT_POLICY_ASSUMPTIONS.childShareFactor, adultAnnDividend);
console.log('Test Household Dividend:', householdDiv); // Expected: (2 + 0 * 0) * 1310.625 = 2621.25

const costPerKwh = calculateExtraCostPerUnit(DEFAULT_POLICY_ASSUMPTIONS.carbonPrice, DEFAULT_POLICY_ASSUMPTIONS.gridEmissionsFactor, DEFAULT_POLICY_ASSUMPTIONS.passThroughElectricity);
console.log('Test Cost Per kWh:', costPerKwh); // Expected: 50 * 0.0007 * 1 = 0.035

const annualElecCost = calculateAnnualFuelCost(DEFAULT_USER_INPUTS.annualElectricityKwh, costPerKwh);
console.log('Test Annual Elec Cost:', annualElecCost); // Expected: 5000 * 0.035 = 175

// ... continue for gas, petrol, total cost, net benefit, and monthly values
const costPerGj = calculateExtraCostPerUnit(DEFAULT_POLICY_ASSUMPTIONS.carbonPrice, DEFAULT_POLICY_ASSUMPTIONS.gasEmissionsFactor, DEFAULT_POLICY_ASSUMPTIONS.passThroughGas);
const annualGasCostCalc = calculateAnnualFuelCost(DEFAULT_USER_INPUTS.annualGasGj, costPerGj); // ~50 * 0.051 * 1 * 20 = 51
console.log('Test Annual Gas Cost:', annualGasCostCalc);

const costPerLitre = calculateExtraCostPerUnit(DEFAULT_POLICY_ASSUMPTIONS.carbonPrice, DEFAULT_POLICY_ASSUMPTIONS.petrolEmissionsFactor, DEFAULT_POLICY_ASSUMPTIONS.passThroughPetrol);
const annualPetrolCostCalc = calculateAnnualFuelCost(DEFAULT_USER_INPUTS.annualPetrolL, costPerLitre); // ~50 * 0.0023 * 1 * 1600 = 184
console.log('Test Annual Petrol Cost:', annualPetrolCostCalc);

const totalExtra = calculateTotalExtraHouseholdCost(annualElecCost, annualGasCostCalc, annualPetrolCostCalc);
console.log('Test Total Extra Cost:', totalExtra); // Expected: 175 + 51 + 184 = 410

const netBenefit = calculateNetBenefit(householdDiv, totalExtra);
console.log('Test Net Benefit:', netBenefit); // Expected: 2621.25 - 410 = 2211.25

console.log('Test Monthly Net Benefit:', getMonthlyValue(netBenefit)); // Expected: 2211.25 / 12 = 184.27...
*/
````

Ensure calculations for gas and petrol also use the `calculateExtraCostPerUnit` and `calculateAnnualFuelCost` functions. Update the example costs for the `UNSW default example` in the specification: Extra costs are $410 (total). Dividend is $2620 (actually $2621.25 by calculation). Net is $2210 (actually $2211.25 by calculation). The slight difference might be due to rounding in the example; your functions should not round intermediate results unless specified.

```
*Self-test for this step:* Manually run `calculator.js`. Check all console logs for correctness.
```

-----

**Iteration 3: UI Interaction and Dynamic Display**

**Prompt 3.1**
`Context: index.html, styles.css, calculator.js`
`Create/Modify: app.js`

```text
Create an JavaScript file named `app.js`. This file will handle DOM manipulation and connect the UI to the calculation logic.

1.  **DOM Element References:**
    * At the top of the file, use `document.getElementById` to get references to all relevant HTML elements:
        * All input fields from both "Main Calculator" and "Background Assumptions" tabs.
        * All output display elements in "Main Calculator" (headline, narrative, table cells).
        * All placeholder elements in "Calculation Details" tab.
        * The three tab buttons (`btn-main-calculator`, `btn-background-assumptions`, `btn-calculation-details`).
        * The three tab content divs (`main-calculator-tab`, `background-assumptions-tab`, `calculation-details-tab`).
    * Store these in clearly named constants.

2.  **Tab Navigation Logic:**
    * Create a function `showTab(tabIdToShow)` that:
        * Hides all tab content divs by removing the `active-tab` class and setting `display: none;`.
        * Shows the tab with `tabIdToShow` by adding `active-tab` class and setting `display: block;`.
        * Updates the active state of tab buttons (remove `active` class from all, add to the one corresponding to `tabIdToShow`).
    * Add event listeners to each tab button:
        * `btnMainCalculator` -> `showTab('main-calculator-tab')`
        * `btnBackgroundAssumptions` -> `showTab('background-assumptions-tab')`
        * `btnCalculationDetails` -> `showTab('calculation-details-tab')`
    * Ensure `main-calculator-tab` is shown by default when the script runs (e.g., by calling `showTab('main-calculator-tab')` once at the end of the script or by ensuring `active-tab` is correctly set in HTML initially).

3.  **Currency Formatting Helper:**
    * Create a function `formatCurrency(value, includeSign = false)`:
        * Takes a number.
        * Returns it formatted as AUD currency (e.g., "$1,234.56"). Use `toFixed(2)` for cents.
        * Use `toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })` if appropriate, or manually construct the string.
        * If `includeSign` is true and the number is positive, prepend a "+". (e.g. "+$100.00")

*Self-test for this step:* Open `index.html`.
* Tab buttons should switch between the (mostly static) content sections.
* The "Main Calculator" tab should be active by default.
* Test `formatCurrency` by calling it from the browser console with various numbers.
```

-----

**Prompt 3.2**
`Context: index.html, calculator.js, app.js`
`Create/Modify: app.js`

```text
Continue building `app.js`. Now, let's read inputs, perform calculations, and display results.

1.  **Input Gathering Functions:**
    * `getUserInputs()`: Reads values from the Main Page input fields (`numAdults`, `numChildren`, etc.). Parses them as numbers (`parseFloat`). If parsing fails or value is invalid for now, it can fallback to the default value from `calculator.js`'s `DEFAULT_USER_INPUTS`.
    * `getPolicyAssumptions()`: Reads values from the Background Assumptions input fields. Parses them as numbers. If parsing fails or value is invalid, fallback to `DEFAULT_POLICY_ASSUMPTIONS`. For `totalCoveredEmissions`, remember to multiply by 1,000,000 to convert Mt to t before passing to calculation functions.

2.  **Main Calculation Orchestration and Display Update Function:**
    * Create a master function, `performCalculationsAndUpdateDisplay()`. This function will:
        a.  Call `getUserInputs()` to get current user data.
        b.  Call `getPolicyAssumptions()` to get current policy data.
        c.  Perform all calculations using functions from `calculator.js`:
            * `grossRevenue = calculateGrossRevenue(...)`
            * `netRevenue = calculateNetRevenue(...)`
            * `adultAnnualDividend = calculateAdultDividend(...)`
            * `householdAnnualDividend = calculateHouseholdDividend(...)`
            * `extraCostPerKwh = calculateExtraCostPerUnit(...)` for electricity.
            * `extraCostPerGj = calculateExtraCostPerUnit(...)` for gas.
            * `extraCostPerLitre = calculateExtraCostPerUnit(...)` for petrol.
            * `annualElecCost = calculateAnnualFuelCost(userInput.annualElectricityKwh, extraCostPerKwh)`
            * `annualGasCost = calculateAnnualFuelCost(userInput.annualGasGj, extraCostPerGj)`
            * `annualPetrolCost = calculateAnnualFuelCost(userInput.annualPetrolL, extraCostPerLitre)`
            * `totalAnnualExtraCost = calculateTotalExtraHouseholdCost(annualElecCost, annualGasCost, annualPetrolCost)`
            * `netAnnualBenefit = calculateNetBenefit(householdAnnualDividend, totalAnnualExtraCost)`
        d.  Update Main Page Outputs:
            * Use `formatCurrency` for all monetary values.
            * Headline (`output-headline`): "Your household’s net benefit is [formatted netAnnualBenefit] per year." (Handle positive/negative if net benefit can be negative, e.g. "net cost").
            * Narrative (`output-narrative`): Update with `householdAnnualDividend`, `totalAnnualExtraCost`, and `netAnnualBenefit`.
            * Table (`output-table`):
                * Per-adult dividend (Annual: `adultAnnualDividend`, Monthly: `getMonthlyValue(adultAnnualDividend)`)
                * Per-household dividend (Annual: `householdAnnualDividend`, Monthly: `getMonthlyValue(householdAnnualDividend)`)
                * Total extra household cost (Annual: `totalAnnualExtraCost`, Monthly: `getMonthlyValue(totalAnnualExtraCost)`)
                * Net benefit (Annual: `netAnnualBenefit`, Monthly: `getMonthlyValue(netAnnualBenefit)`)
        e.  Update Calculation Details Tab:
            * Populate all `details-*` elements with their corresponding calculated values (e.g., `details-gross-revenue` with `grossRevenue`). Format currency where appropriate.

3.  **Event Listeners for Inputs:**
    * Get all input elements from both "Main Calculator" and "Background Assumptions" tabs (you should have references already).
    * Iterate over these input elements and add an `input` event listener to each.
    * The event listener should call `performCalculationsAndUpdateDisplay()`.

4.  **Initial Calculation on Load:**
    * At the end of `app.js` (or inside a `DOMContentLoaded` listener), call `performCalculationsAndUpdateDisplay()` once to populate the calculator with results based on default input values.

*Self-test for this step:*
* Open `index.html`. Outputs should now be calculated and displayed based on default values.
* Change any input value on the "Main Calculator" tab. All outputs on the Main page and Calculation Details page should update instantly.
* Switch to the "Background Assumptions" tab, change a value (e.g., Carbon Price). Switch back to "Main Calculator". Outputs should reflect the change.
* Test the `totalCoveredEmissions` conversion: if 466 is entered, calculations should use 466,000,000.
```

-----

**Iteration 4: Input Validation and Error Handling**

**Prompt 4.1**
`Context: index.html, calculator.js, app.js, styles.css`
`Create/Modify: app.js, styles.css`

```text
Enhance `app.js` with input validation and error handling.

1.  **Input Validation Function:**
    * Create a helper function `validateInput(inputElement, defaultValue)`:
        * It takes an input HTML element and its corresponding default value.
        * Gets the element's value.
        * Checks if the value is empty. If so, consider it valid for now but it will use the default in `getUserInputs` or `getPolicyAssumptions`.
        * If not empty, try `parseFloat(value)`.
        * Check if the parsed number is non-negative (`>= 0`).
        * The function should return an object like `{ isValid: true, value: parsedValue }` or `{ isValid: false, message: "Must be a non-negative number." }`.
        * If the value is empty, it could return `{ isValid: true, value: defaultValue }` or rely on the getter functions to apply defaults. Let's make it so an empty field is not immediately an error, but calculations will use the default. The error should appear if non-numeric text or negative numbers are entered.

2.  **Modify Input Gathering Functions (`getUserInputs`, `getPolicyAssumptions`):**
    * For each input field when reading its value:
        * Retrieve the corresponding error message `<span>` element (e.g., `numAdultsError`).
        * Call a refined validation logic:
            * Attempt to parse the input value (e.g. `parseFloat(inputElement.value)`).
            * If `inputElement.value` is an empty string, use the `defaultValue` for calculations and clear any error message.
            * If `parseFloat(inputElement.value)` results in `NaN` (for non-empty strings) or is less than 0:
                * Display an error message (e.g., "Invalid: must be a non-negative number.") in the corresponding error `<span>`.
                * Add an 'input-error' class to `inputElement`.
                * For the purpose of calculation, return the `defaultValue` for this field to prevent calculation errors.
            * If valid:
                * Clear the error message in the `<span>`.
                * Remove 'input-error' class from `inputElement`.
                * Return the parsed valid number.
    * The `performCalculationsAndUpdateDisplay` function should now always receive numbers (either valid user inputs or defaults).

3.  **Modify `performCalculationsAndUpdateDisplay`:**
    * Before performing calculations, check if any input field currently has an active error state (e.g., by checking if any input has the `input-error` class or if any error span has text).
    * If there are errors, you might choose to *not* run calculations, or run them with defaults for the erroneous fields (which is what step 2 ensures). The spec says "block calculation until valid" but also "revert to default if user enters invalid value and leaves field." The current approach uses defaults for calculation if an input is invalid, which is a safe way to proceed. Let's stick to "calculates with defaults if an input is bad, but shows error".

4.  **CSS for Errors:**
    * In `styles.css`, add styling for `.input-error { border: 1px solid red; }`.
    * Ensure `.error-message` is styled (e.g., `color: red; font-size: 0.8em; display: block; height: 1em; /* to prevent layout jumps */`).

5.  **Revert to Default on Invalid Focus Out (Blur):**
    * For each input field, add a `blur` event listener.
    * Inside the `blur` listener:
        * Get the input's current value.
        * If `parseFloat(inputElement.value)` is `NaN` (and not an empty string) or is `< 0`:
            * Set `inputElement.value` to its `defaultValue` (you'll need to access these defaults, perhaps pass them or store them as data attributes on elements).
            * Clear the associated error message and remove `input-error` class.
            * Trigger `performCalculationsAndUpdateDisplay()` to reflect the change.
        * If the field is empty on blur, also set it to its default value and update.

*Self-test for this step:*
* Enter text into a number field. An error message should appear, the input border might change, and calculations should use the default for that field.
* Enter a negative number. Same behavior.
* Clear an invalid field and tab out (blur). The field should revert to its default value, the error should disappear, and calculations should update.
* Enter a valid number after an error. The error should disappear.
```

-----

**Prompt 4.2**
`Context: calculator.js, app.js`
`Create/Modify: calculator.js, app.js`

```text
Implement graceful division by zero handling.

1.  **Modify `calculator.js`:**
    * In `calculateAdultDividend(netRevenue, eligibleAdultPopulation)`:
        * If `eligibleAdultPopulation` is 0 or not a positive number, return `0` (or `null` if you prefer, but ensure consistency). The spec asks for "—" in UI, so `0` or `null` can be a signal for that. Let's use `null`.
        * If it returns `null`, any subsequent calculation that depends on `adultAnnualDividend` (like `householdAnnualDividend`) might also need to propagate this `null` or handle it. Let's ensure `calculateHouseholdDividend` returns `null` if `adultAnnualDividend` is `null`.
        * Ensure `getMonthlyValue` returns `null` if `annualValue` is `null`.

2.  **Modify `app.js` - `performCalculationsAndUpdateDisplay()`:**
    * When setting the text content for output fields that display results from `adultAnnualDividend` or `householdAnnualDividend` (and their monthly counterparts, and net benefit):
        * If the calculated value is `null` (due to division by zero), display "—" (em-dash or three hyphens) instead of a formatted currency value.
        * The `formatCurrency` function might need to be bypassed or adjusted if it can't handle `null`. A simple check like `value === null ? '—' : formatCurrency(value)` would work.

*Self-test for this step:*
* Go to the "Background Assumptions" tab.
* Set "Eligible Adult Population" to 0.
* Observe the "Main Calculator" outputs:
    * "Per-adult dividend" (Annual & Monthly) should show "—".
    * "Per-household dividend" (Annual & Monthly) should show "—".
    * "Net benefit" (Annual & Monthly) should show "—" (or be calculated based on a zero dividend, resulting in a negative value equal to costs). The spec implies "—" for affected dividends. If dividend is zero, net benefit would be `-TotalExtraCost`. Decide if "—" should propagate to Net Benefit or if Net Benefit should show the actual negative cost. Given the spec example for N=0 shows "—", let's propagate "—" to Net Benefit if adult dividend is "—".
* The "Calculation Details" tab should also show "—" for affected fields.
* Set "Eligible Adult Population" back to a valid number. Outputs should calculate correctly again.
```

-----

**Iteration 5: Styling & Responsiveness**

**Prompt 5.1**
`Context: index.html, styles.css`
`Create/Modify: index.html, styles.css`

```text
Apply minimal styling using Bootstrap for layout and responsiveness, and refine existing CSS.

1.  **Integrate Bootstrap:**
    * In `index.html`, add the Bootstrap CSS CDN link in the `<head>`. (e.g., `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">`). For this project, we won't need Bootstrap's JS.
2.  **Apply Bootstrap Classes in `index.html`:**
    * Wrap `app-container` or its contents with Bootstrap container/row/column classes for basic responsive layout. E.g., `container`, `row`, `col-md-8`, `col-lg-6` for the main content block to center it and control width.
    * Style `tab-navigation` buttons using Bootstrap button classes (e.g., `btn btn-primary`, `btn btn-secondary`).
    * Use Bootstrap form styling classes for input groups, labels, and inputs (e.g., `form-label`, `form-control`, `mb-3` for margins).
    * Style the `output-table` using Bootstrap table classes (e.g., `table table-striped table-bordered`).
    * Ensure the footer is styled appropriately, perhaps using Bootstrap text utility classes.
3.  **Refine `styles.css`:**
    * Remove any custom styles that are now handled adequately by Bootstrap (e.g., basic button styling if you used Bootstrap's).
    * Adjust custom styles to work well with Bootstrap. For instance, your `.active-tab` and `.tab-content` logic for showing/hiding tabs should still work.
    * Ensure `.error-message` styles are distinct and don't conflict. Bootstrap has its own `is-invalid` class and validation feedback elements; you can choose to use those or stick to your custom spans. For simplicity with prior steps, let's assume custom spans are still primary, but ensure they look okay with Bootstrap forms.
    * Override Bootstrap styles minimally if necessary to achieve the "minimal, uncluttered interface" and "no color coding" (beyond error states) requirements.
    * Add media queries if necessary (though Bootstrap's grid should handle most responsiveness) to ensure content fits on a single screen on desktop and is clear on mobile, and that font sizes are readable.
    * The goal is a clean, functional look, not a fancy design.

*Self-test for this step:*
* Open `index.html`. The layout should be responsive. Test by resizing the browser window or using mobile device emulation.
* Inputs, buttons, and tables should have a consistent Bootstrap look.
* All functionality (tab switching, calculations, error handling) should remain intact.
* The interface should be uncluttered.
```

-----

**Iteration 6: Finalization and Documentation**

**Prompt 6.1**
`Context: index.html, styles.css, calculator.js, app.js`
`Create/Modify: All files (for comments), README.md`

```text
Finalize the project.

1.  **Code Review and Comments:**
    * In `calculator.js`: Ensure all functions have clear JSDoc comments explaining their purpose, parameters, and return values. Add comments for any complex logic or constants.
    * In `app.js`: Add comments explaining DOM element selections, event listener purposes, the flow of `performCalculationsAndUpdateDisplay`, and any tricky UI logic.
    * In `index.html`: Add comments if there are any complex structural parts, though it should be fairly straightforward.
    * In `styles.css`: Comment any non-obvious custom styles or overrides.
2.  **Verify Reset Behavior:**
    * Confirm that reloading the page resets all input fields to their default values (this should be inherent as no data is stored).
3.  **Privacy Confirmation:**
    * Double-check that no data is stored in cookies or local storage, and no external network requests are made beyond CDN asset loading.
4.  **Create `README.md`:**
    * Create a `README.md` file with:
        * Project Title: Climate Dividend Calculator
        * Brief description: A single-page HTML/CSS/JS application to calculate household net benefit from a carbon fee and dividend scheme.
        * How to run: "Simply open `index.html` in a modern web browser."
        * File structure: Briefly list the purpose of `index.html`, `styles.css`, `calculator.js`, `app.js`.
        * Calculation Logic Source: "Model based on UNSW Australian Carbon Dividend Plan."
        * Note on Dependencies: "Uses Bootstrap CSS via CDN for basic styling and responsiveness."

*Self-test for this step:*
* Read through all code. Is it understandable? Are comments helpful?
* Reload the page multiple times, making changes in between, to confirm reset behavior.
* Use browser developer tools (Network and Application tabs) to confirm no unexpected storage or network calls.
* Review the `README.md`. Is it clear and sufficient for someone to understand and run the project?
* Perform a final round of functional testing based on the original specification's "Testing Plan" section.
```

This detailed, iterative plan should allow an LLM to generate the code step-by-step, with clear instructions and context for each part, leading to a fully functional application that meets the specification.
