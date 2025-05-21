## Climate Dividend Calculator: Developer Specification

This document outlines the detailed specification for modifying the Climate Dividend Calculator, focusing on streamlining the input model and adhering strictly to the new dividend calculation algorithm. The existing detailed fossil fuel calculations will be removed in favor of a single national emissions input.

### 1\. Project Goal

The primary goal of this modification is to simplify the calculator's input model for revenue generation by focusing on a single "National Emissions" figure, and to align the dividend distribution algorithm precisely with the provided formula, while maintaining clear separation of concerns between UI (app.js) and core calculations (calculator.js).

### 2\. Architecture Choices

  * **Frontend Technologies**: HTML, CSS, JavaScript
  * **Module Separation**:
      * `src/index.html`: Defines the application's structure and UI elements.
      * `src/styles.css`: Handles all visual styling.
      * `src/app.js`: Manages UI interactions, input gathering, validation, and updating the display. It acts as the bridge between the UI and the core calculation logic.
      * `src/calculator.js`: Contains all core mathematical formulas and default values, ensuring modularity, testability, and reusability of calculation logic.
  * **Data Flow**: User inputs are gathered by `app.js`, passed to `calculator.js` for computation, and results are then formatted and displayed back in `app.js`.

### 3\. Data Handling and UI Details

#### 3.1. Elimination of Fossil Fuel Block Inputs and Calculations

  * **HTML (`src/index.html`):**
      * Remove all `<div class="input-group">` elements related to:
          * Black-coal production/exports
          * Brown-coal production
          * Petroleum-liquids production/exports/imports
          * Natural-gas production/LNG exports/Gas domestic use
      * Remove their corresponding `<label>`, `<input>`, and `<span class="error-message">` tags.
  * **JavaScript (`src/calculator.js`):**
      * Delete the `DEFAULT_FUEL_DATA` object entirely.
      * Remove the functions `calculateFuelEmissions`, `calculateFuelFeeRevenue`, and `calculateTotalFeeRevenuePerFuel` if they were partially implemented.
  * **JavaScript (`src/app.js`):**
      * Remove all DOM references (`const ... = document.getElementById(...)`) for the eliminated fossil fuel inputs and error messages.
      * Remove all input validation logic for these fields from `getPolicyAssumptions`.
      * Remove all `setupBlurHandler` calls associated with these fields from `setupBlurEventListeners`.

#### 3.2. National Emissions Input

  * **HTML (`src/index.html`):**
      * Locate the existing "Total Covered Emissions (Mt CO₂-e)" input.
      * Change its `id` from `totalCoveredEmissions` to `nationalEmissionsInput`.
      * Update its `<label>` text to "National Emissions (Mt CO₂-e)".
      * Set its `value` attribute to `434.9`.
      * Change the associated error span `id` from `totalCoveredEmissionsError` to `nationalEmissionsError`.
  * **JavaScript (`src/calculator.js`):**
      * In `DEFAULT_POLICY_ASSUMPTIONS`, rename the property `totalCoveredEmissions` to `nationalEmissions`.
      * Set the default value for `nationalEmissions` to `434900000` (434.9 Mt converted to tonnes).
  * **JavaScript (`src/app.js`):**
      * Update DOM references: `totalCoveredEmissionsInput` to `nationalEmissionsInput`, and `totalCoveredEmissionsError` to `nationalEmissionsError`.
      * In `getPolicyAssumptions`, ensure the `nationalEmissionsInput` value is validated and converted from Mt to tonnes (multiply by 1,000,000) before being assigned to `policyAssumptions.nationalEmissions`.
      * Update `setupBlurHandler` call for this field to use `nationalEmissionsInput`, `nationalEmissionsError`, and the new default `434.9`.

#### 3.3. Dividend Calculation Logic Refactor

  * **HTML (`src/index.html`):**
      * Remove the input group for `eligibleAdultPopulation`.
      * **Add "Household Rebate Share" Input:**
        ```html
        <div class="input-group">
            <label for="householdRebateShareInput">Household Rebate Share</label>
            <input type="number" id="householdRebateShareInput" min="0" max="1" value="0.90" step="0.01">
            <span id="householdRebateShareError" class="error-message"></span>
        </div>
        ```
      * **Add "Total Population" Input:**
        ```html
        <div class="input-group">
            <label for="populationInput">Total Population (persons)</label>
            <input type="number" id="populationInput" min="0" step="1" value="27204809">
            <span id="populationError" class="error-message"></span>
        </div>
        ```
      * **Add "Adult Share" Input:**
        ```html
        <div class="input-group">
            <label for="adultShareInput">Adult Share (15+ years)</label>
            <input type="number" id="adultShareInput" min="0" max="1" value="0.811" step="0.001">
            <span id="adultShareError" class="error-message"></span>
        </div>
        ```
  * **JavaScript (`src/calculator.js`):**
      * **Delete `calculateNetRevenue` function**.
      * **Modify `calculateGrossRevenue`:** This function will continue to calculate `Gross Revenue = Carbon Price × National Emissions`. Its name remains appropriate as it represents the total revenue before any distribution.
      * **Modify `calculateAdultDividend`:**
          * **Rename** to `calculatePerAdultDividend` for consistency with the new specification.
          * **Update Parameters:** Accept `carbonPrice`, `nationalEmissions`, `householdRebateShare`, `totalPopulation`, and `adultShare` as parameters.
          * **Implement New Formula:**
            ```javascript
            function calculatePerAdultDividend(carbonPrice, nationalEmissions, householdRebateShare, totalPopulation, adultShare) {
                // Per-adult dividend = ( household-rebate share × national emissions × fee-per-tonne ) ÷ ( population × adult fraction )
                // Note: nationalEmissions is already in tonnes (t CO2-e)
                // Note: carbonPrice is in A$/t CO2-e
                if (totalPopulation <= 0 || adultShare <= 0 || !isFinite(totalPopulation) || !isFinite(adultShare)) {
                    console.warn("Invalid population or adult share for dividend calculation.");
                    return null; // Return null to indicate inability to calculate
                }
                return (householdRebateShare * nationalEmissions * carbonPrice) / (totalPopulation * adultShare);
            }
            ```
          * Ensure the function correctly handles division by zero by returning `null` if `totalPopulation` or `adultShare` is zero or invalid.
  * **JavaScript (`src/app.js`):**
      * Remove DOM references and error spans for the old `eligibleAdultPopulation`.
      * Add DOM references and error spans for `householdRebateShareInput`, `populationInput`, and `adultShareInput`.
      * In `getPolicyAssumptions`:
          * Remove validation for the old `eligibleAdultPopulation`.
          * Add validation for `householdRebateShareInput` (min: 0, max: 1), `populationInput` (min: 0), and `adultShareInput` (min: 0, max: 1), using their respective default values from `DEFAULT_POLICY_ASSUMPTIONS`.
          * The `policyAssumptions` object will now include `householdRebateShare`, `population`, and `adultShare`.
      * In `performCalculationsAndUpdateDisplay`:
          * The call to the dividend calculation function (`calculatePerAdultDividend`) must be updated to pass the correct parameters (`policyAssumptions.carbonPrice`, `policyAssumptions.nationalEmissions`, `policyAssumptions.householdRebateShare`, `policyAssumptions.population`, `policyAssumptions.adultShare`).
          * Remove any code related to `netRevenue` or `adminCostRate`.
          * Update dividend output logic (e.g., `adultAnnualDividend`, `householdAnnualDividend`) to use the results from the new `calculatePerAdultDividend` function.
      * Update `setupBlurEventListeners`: Remove `setupBlurHandler` for the old `eligibleAdultPopulationInput` and add `setupBlurHandler` calls for `householdRebateShareInput`, `populationInput`, and `adultShareInput` using their `DEFAULT_POLICY_ASSUMPTIONS` values.
  * **JavaScript (`src/calculator.js` - `DEFAULT_POLICY_ASSUMPTIONS`):**
      * Remove `adminCostRate`.
      * Remove `eligibleAdultPopulation`.
      * Add `householdRebateShare: 0.90`.
      * Add `population: 27204809`.
      * Add `adultShare: 0.811`.

#### 3.4. Carbon Fee Selector

  * **HTML (`src/index.html`):**
      * In the "Background Assumptions" tab, change the `carbonPrice` input from `<input type="number">` to a `<select>` element.
      * Maintain the `id="carbonPrice"` for the `<select>` element.
      * Populate the `<select>` with `<option>` tags for values: 50, 40, 30, 20, 15, 10.
      * Set the `value="50"` option as `selected`.
    <!-- end list -->
    ```html
    <div class="input-group">
        <label for="carbonPrice">Carbon Price ($/t CO₂-e)</label>
        <select id="carbonPrice">
            <option value="50" selected>50</option>
            <option value="40">40</option>
            <option value="30">30</option>
            <option value="20">20</option>
            <option value="15">15</option>
            <option value="10">10</option>
        </select>
        <span id="carbonPriceError" class="error-message"></span>
    </div>
    ```
  * **JavaScript (`src/app.js`):**
      * The `carbonPriceInput` DOM reference will continue to target the element with `id="carbonPrice"`.
      * In `getPolicyAssumptions`, modify the logic for `carbonPrice` to directly parse `parseFloat(carbonPriceInput.value)`. No complex validation (`min`, `max`) is needed for a dropdown, but `isNaN` check is still prudent.
      * Remove the `setupBlurHandler` call for `carbonPriceInput` from `setupBlurEventListeners` as it's a `<select>` now.

#### 3.5. Minor UI Adjustments

  * **Calculation Details Tab (`src/index.html`):**
      * Remove `detailsNetRevenue` as `netRevenue` concept is eliminated.
      * Update `detailsPerAdultDividend` to reflect the new `calculatePerAdultDividend` function output.
      * Remove `detailsAnnualCostElectricity`, `detailsAnnualCostGas`, `detailsAnnualCostPetrol` and `detailsTotalAnnualHouseholdCost` if these are not explicitly calculated based on the new reduced scope. Reconfirm if per-household costs (`annualElectricityKwh`, `annualGasGj`, `annualPetrolL`) are still relevant to the output. Based on the new spec, only dividend calculation is detailed. However, the existing `DEFAULT_USER_INPUTS` and related cost calculations in `calculator.js` (e.g., `calculateAnnualFuelCost`, `calculateTotalExtraHouseholdCost`) remain in the current code, implying these user inputs and their associated costs are still part of the *household-specific* calculation that gets compared against the dividend. **Assumption:** User-specific annual fuel costs and net benefit will remain, calculated using `extraCostPerUnit` and the pass-through rates. Thus, the display elements for these costs in the details tab should remain.
      * The `detailsGrossRevenue` will continue to display the output of `calculateGrossRevenue` (Carbon Price x National Emissions).

### 4\. Error Handling Strategy

  * **Input Validation:**
      * `validateInput` function in `app.js` will continue to be used for number inputs, providing specific error messages for non-numeric, out-of-range, or negative values where appropriate.
      * Error messages will be displayed in red next to the invalid input field.
      * Invalid inputs will have a red border and light red background.
      * On blur, invalid or empty fields will revert to their `DEFAULT_POLICY_ASSUMPTIONS` or `DEFAULT_USER_INPUTS` values and clear the error state.
  * **Division by Zero/Invalid Calculations:**
      * Core calculation functions in `calculator.js` will return `null` if a critical parameter (e.g., `population`, `adultShare`) is zero or invalid, preventing division by zero errors.
      * `app.js` will check for `null` results from `calculator.js` functions and display "—" (em-dash) in the UI for those output fields, along with an explanatory narrative message if the dividend calculation fails due to invalid population data.
      * The `output-headline` and `output-narrative` will clearly indicate calculation failures related to zero or invalid population inputs.

### 5\. Testing Plan

  * **Unit Tests (conceptual, not implemented in current project structure but good practice):**
      * `calculator.js`:
          * Test `calculateGrossRevenue` with valid inputs and edge cases (e.g., carbon price 0, national emissions 0).
          * Test `calculatePerAdultDividend` with valid inputs, and edge cases including:
              * `totalPopulation = 0`, `adultShare = 0` (should return `null`).
              * `householdRebateShare = 0` or `1`.
              * Various combinations of valid inputs to verify the formula.
          * Test `calculateExtraCostPerUnit`, `calculateAnnualFuelCost`, `calculateTotalExtraHouseholdCost`, `calculateNetBenefit`, and `getMonthlyValue` (as these still exist and are part of the household cost calculations) with valid inputs and edge cases.
  * **Integration Tests:**
      * Verify that changing inputs in `app.js` correctly triggers calculations in `calculator.js` and updates the UI.
      * Test the full flow: modify carbon price (via dropdown), national emissions, household numbers, rebate share, population, adult share, and observe changes in all output fields.
  * **UI/User Acceptance Tests:**
      * Verify all input fields and labels are correctly rendered according to the specification.
      * Confirm the carbon price dropdown functions correctly and its default is 50.
      * Check that error messages appear and disappear as expected for invalid inputs.
      * Verify that "—" is displayed for results when calculations cannot be performed (e.g., zero population inputs).
      * Confirm the overall narrative and headline output accurately reflect the calculated net benefit/cost.
      * Ensure tab navigation works correctly, and all default values are pre-filled on load.
      * Verify the "Calculation Details" tab accurately reflects the underlying calculations.
      * Test responsiveness on various screen sizes.

This comprehensive specification provides a clear roadmap for the developer to implement the required modifications based on the new algorithm and design choices.
