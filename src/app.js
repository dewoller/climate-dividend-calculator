/**
 * Climate Dividend Calculator - App Logic
 * Handles UI interaction and connects to calculator.js
 */

// ============================================================================
// DOM Element References
// ============================================================================

// Tab navigation elements
const mainCalculatorTab = document.getElementById('main-calculator-tab');
const backgroundAssumptionsTab = document.getElementById('background-assumptions-tab');
const calculationDetailsTab = document.getElementById('calculation-details-tab');
const btnMainCalculator = document.getElementById('btn-main-calculator');
const btnBackgroundAssumptions = document.getElementById('btn-background-assumptions');
const btnCalculationDetails = document.getElementById('btn-calculation-details');

// Main Calculator - Input fields
const numAdultsInput = document.getElementById('numAdults');
const numChildrenInput = document.getElementById('numChildren');
const annualElectricityKwhInput = document.getElementById('annualElectricityKwh');
const annualGasGjInput = document.getElementById('annualGasGj');
const annualPetrolLInput = document.getElementById('annualPetrolL');

// Main Calculator - Error message elements
const numAdultsError = document.getElementById('numAdultsError');
const numChildrenError = document.getElementById('numChildrenError');
const annualElectricityKwhError = document.getElementById('annualElectricityKwhError');
const annualGasGjError = document.getElementById('annualGasGjError');
const annualPetrolLError = document.getElementById('annualPetrolLError');

// Main Calculator - Output elements
const outputHeadline = document.getElementById('output-headline');
const outputNarrative = document.getElementById('output-narrative');
const tableAdultDividendAnnual = document.getElementById('table-adult-dividend-annual');
const tableAdultDividendMonthly = document.getElementById('table-adult-dividend-monthly');
const tableHouseholdDividendAnnual = document.getElementById('table-household-dividend-annual');
const tableHouseholdDividendMonthly = document.getElementById('table-household-dividend-monthly');
const tableExtraCostAnnual = document.getElementById('table-extra-cost-annual');
const tableExtraCostMonthly = document.getElementById('table-extra-cost-monthly');
const tableNetBenefitAnnual = document.getElementById('table-net-benefit-annual');
const tableNetBenefitMonthly = document.getElementById('table-net-benefit-monthly');

// Background Assumptions - Input fields
const carbonPriceInput = document.getElementById('carbonPrice');
const nationalEmissionsInput = document.getElementById('nationalEmissionsInput');
const householdRebateShareInput = document.getElementById('householdRebateShareInput');
const populationInput = document.getElementById('populationInput');
const adultShareInput = document.getElementById('adultShareInput');
const childShareFactorInput = document.getElementById('childShareFactor');
const gridEmissionsFactorInput = document.getElementById('gridEmissionsFactor');
const gasEmissionsFactorInput = document.getElementById('gasEmissionsFactor');
const petrolEmissionsFactorInput = document.getElementById('petrolEmissionsFactor');
const passThroughElectricityInput = document.getElementById('passThroughElectricity');
const passThroughGasInput = document.getElementById('passThroughGas');
const passThroughPetrolInput = document.getElementById('passThroughPetrol');

// Background Assumptions - Error message elements
const carbonPriceError = document.getElementById('carbonPriceError');
const nationalEmissionsError = document.getElementById('nationalEmissionsError');
const householdRebateShareError = document.getElementById('householdRebateShareError');
const populationError = document.getElementById('populationError');
const adultShareError = document.getElementById('adultShareError');
const childShareFactorError = document.getElementById('childShareFactorError');
const gridEmissionsFactorError = document.getElementById('gridEmissionsFactorError');
const gasEmissionsFactorError = document.getElementById('gasEmissionsFactorError');
const petrolEmissionsFactorError = document.getElementById('petrolEmissionsFactorError');
const passThroughElectricityError = document.getElementById('passThroughElectricityError');
const passThroughGasError = document.getElementById('passThroughGasError');
const passThroughPetrolError = document.getElementById('passThroughPetrolError');

// Calculation Details - Display elements
const detailsGrossRevenue = document.getElementById('details-gross-revenue');
const detailsPerAdultDividend = document.getElementById('details-per-adult-dividend');
const detailsCostElectricityPerUnit = document.getElementById('details-cost-electricity-per-unit');
const detailsCostGasPerUnit = document.getElementById('details-cost-gas-per-unit');
const detailsCostPetrolPerUnit = document.getElementById('details-cost-petrol-per-unit');
const detailsAnnualCostElectricity = document.getElementById('details-annual-cost-electricity');
const detailsAnnualCostGas = document.getElementById('details-annual-cost-gas');
const detailsAnnualCostPetrol = document.getElementById('details-annual-cost-petrol');
const detailsTotalAnnualHouseholdCost = document.getElementById('details-total-annual-household-cost');
const detailsAnnualHouseholdDividend = document.getElementById('details-annual-household-dividend');
const detailsNetAnnualBenefit = document.getElementById('details-net-annual-benefit');

// ============================================================================
// Tab Navigation Logic
// ============================================================================

/**
 * Show the specified tab and hide others
 * @param {string} tabIdToShow - The ID of the tab to show
 */
function showTab(tabIdToShow) {
    // Hide all tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active-tab');
        tab.style.display = 'none';
    });
    
    // Show the selected tab
    const tabToShow = document.getElementById(tabIdToShow);
    if (tabToShow) {
        tabToShow.classList.add('active-tab');
        tabToShow.style.display = 'block';
    }
    
    // Update button active states
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Add active class to the appropriate button
    if (tabIdToShow === 'main-calculator-tab') {
        btnMainCalculator.classList.add('active');
    } else if (tabIdToShow === 'background-assumptions-tab') {
        btnBackgroundAssumptions.classList.add('active');
    } else if (tabIdToShow === 'calculation-details-tab') {
        btnCalculationDetails.classList.add('active');
    }
}

// Add event listeners to tab buttons
btnMainCalculator.addEventListener('click', () => {
    showTab('main-calculator-tab');
});

btnBackgroundAssumptions.addEventListener('click', () => {
    showTab('background-assumptions-tab');
});

btnCalculationDetails.addEventListener('click', () => {
    showTab('calculation-details-tab');
});

// ============================================================================
// Currency Formatting Helper
// ============================================================================

/**
 * Format a number as AUD currency
 * @param {number|null} value - The value to format
 * @param {boolean} includeSign - Whether to include a + sign for positive values
 * @returns {string} - Formatted currency string or "—" for null values
 */
function formatCurrency(value, includeSign = false) {
    // Handle null value (division by zero)
    if (value === null) {
        return "—";
    }
    
    // Format using toLocaleString
    const formatted = value.toLocaleString('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    // Optionally add + sign for positive values
    if (includeSign && value > 0) {
        return '+' + formatted;
    }
    
    return formatted;
}

/**
 * Format a unit cost (with unit)
 * @param {number|null} value - The value to format
 * @param {string} unit - The unit to append (e.g., "/kWh")
 * @returns {string} - Formatted string with unit or "—" for null values
 */
function formatUnitCost(value, unit) {
    if (value === null) {
        return "—";
    }
    return `${formatCurrency(value)}${unit}`;
}

// ============================================================================
// Input Validation Functions
// ============================================================================

/**
 * Validate an input field, display error if invalid
 * @param {HTMLInputElement} inputElement - The input element to validate
 * @param {HTMLElement} errorElement - The error message element
 * @param {number} defaultValue - Default value to use if validation fails
 * @param {Object} options - Additional validation options
 * @returns {Object} - Validation result object { isValid, value }
 */
function validateInput(inputElement, errorElement, defaultValue, options = {}) {
    const value = inputElement.value.trim();
    const { min = 0, max = Infinity, specialMsg = "" } = options;
    
    // Clear previous error state
    errorElement.textContent = '';
    inputElement.classList.remove('input-error');
    
    // If empty, use default (no error)
    if (value === '') {
        return { isValid: true, value: defaultValue };
    }
    
    // Try to parse as number
    const parsedValue = parseFloat(value);
    
    // Check if valid number
    if (isNaN(parsedValue) || !isFinite(parsedValue)) {
        errorElement.textContent = 'Invalid: must be a number.';
        inputElement.classList.add('input-error');
        return { isValid: false, value: defaultValue };
    }
    
    // Check if within range
    if (parsedValue < min) {
        // Use the special message if available, otherwise use the default message
        errorElement.textContent = specialMsg || `Invalid: must be at least ${min}.`;
        inputElement.classList.add('input-error');
        return { isValid: false, value: defaultValue };
    }
    
    if (parsedValue > max) {
        errorElement.textContent = `Invalid: must be no more than ${max}.`;
        inputElement.classList.add('input-error');
        return { isValid: false, value: defaultValue };
    }
    
    // Check special conditions
    if (specialMsg && options.isValid && !options.isValid(parsedValue)) {
        errorElement.textContent = specialMsg;
        inputElement.classList.add('input-error');
        return { isValid: false, value: defaultValue };
    }
    
    // Valid input
    return { isValid: true, value: parsedValue };
}

/**
 * Reset input to default value on blur if invalid
 * @param {HTMLInputElement} inputElement - The input element
 * @param {HTMLElement} errorElement - The error message element
 * @param {number} defaultValue - Default value to set
 */
function setupBlurHandler(inputElement, errorElement, defaultValue) {
    inputElement.addEventListener('blur', () => {
        const value = inputElement.value.trim();
        
        // If empty or invalid, reset to default
        if (value === '' || 
            inputElement.classList.contains('input-error')) {
            inputElement.value = defaultValue;
            errorElement.textContent = '';
            inputElement.classList.remove('input-error');
            performCalculationsAndUpdateDisplay();
        }
    });
}

// ============================================================================
// Input Gathering Functions
// ============================================================================

/**
 * Read and validate values from Main Calculator input fields
 * @returns {object} Object containing validated user input values
 */
function getUserInputs() {
    // Start with default values
    const userInputs = {...Calculator.DEFAULT_USER_INPUTS};
    
    // Validate each input and update values
    const numAdultsResult = validateInput(
        numAdultsInput, 
        numAdultsError, 
        Calculator.DEFAULT_USER_INPUTS.numAdults
    );
    userInputs.numAdults = numAdultsResult.value;
    
    const numChildrenResult = validateInput(
        numChildrenInput, 
        numChildrenError, 
        Calculator.DEFAULT_USER_INPUTS.numChildren
    );
    userInputs.numChildren = numChildrenResult.value;
    
    const annualElectricityKwhResult = validateInput(
        annualElectricityKwhInput, 
        annualElectricityKwhError, 
        Calculator.DEFAULT_USER_INPUTS.annualElectricityKwh
    );
    userInputs.annualElectricityKwh = annualElectricityKwhResult.value;
    
    const annualGasGjResult = validateInput(
        annualGasGjInput, 
        annualGasGjError, 
        Calculator.DEFAULT_USER_INPUTS.annualGasGj
    );
    userInputs.annualGasGj = annualGasGjResult.value;
    
    const annualPetrolLResult = validateInput(
        annualPetrolLInput, 
        annualPetrolLError, 
        Calculator.DEFAULT_USER_INPUTS.annualPetrolL
    );
    userInputs.annualPetrolL = annualPetrolLResult.value;
    
    return userInputs;
}

/**
 * Read and validate values from Background Assumptions input fields
 * @returns {object} Object containing validated policy assumption values
 */
function getPolicyAssumptions() {
    // Start with default values
    const policyAssumptions = {...Calculator.DEFAULT_POLICY_ASSUMPTIONS};
    
    // Validate each input and update values
    // For carbonPrice, it's now a <select> element
    const carbonPriceValue = parseFloat(carbonPriceInput.value);
    if (isNaN(carbonPriceValue)) {
        policyAssumptions.carbonPrice = Calculator.DEFAULT_POLICY_ASSUMPTIONS.carbonPrice;
    } else {
        policyAssumptions.carbonPrice = carbonPriceValue;
    }
    
    // For nationalEmissions, we convert from Mt to t (multiply by 1,000,000)
    const nationalEmissionsResult = validateInput(
        nationalEmissionsInput, 
        nationalEmissionsError, 
        Calculator.DEFAULT_POLICY_ASSUMPTIONS.nationalEmissions / 1000000
    );
    policyAssumptions.nationalEmissions = nationalEmissionsResult.value * 1000000;
    
    // Validate householdRebateShare (0-1)
    const householdRebateShareResult = validateInput(
        householdRebateShareInput,
        householdRebateShareError,
        Calculator.DEFAULT_POLICY_ASSUMPTIONS.householdRebateShare,
        { min: 0, max: 1 }
    );
    policyAssumptions.householdRebateShare = householdRebateShareResult.value;
    
    // Validate population (min 0)
    const populationResult = validateInput(
        populationInput,
        populationError,
        Calculator.DEFAULT_POLICY_ASSUMPTIONS.population,
        { 
            min: 0,
            specialMsg: "Population must be greater than 0 for dividend calculations."
        }
    );
    policyAssumptions.population = populationResult.value;
    
    // Validate adultShare (0-1)
    const adultShareResult = validateInput(
        adultShareInput,
        adultShareError,
        Calculator.DEFAULT_POLICY_ASSUMPTIONS.adultShare,
        { 
            min: 0, 
            max: 1,
            specialMsg: "Adult share must be greater than 0 for dividend calculations."
        }
    );
    policyAssumptions.adultShare = adultShareResult.value;
    
    const childShareFactorResult = validateInput(
        childShareFactorInput, 
        childShareFactorError, 
        Calculator.DEFAULT_POLICY_ASSUMPTIONS.childShareFactor
    );
    policyAssumptions.childShareFactor = childShareFactorResult.value;
    
    const gridEmissionsFactorResult = validateInput(
        gridEmissionsFactorInput, 
        gridEmissionsFactorError, 
        Calculator.DEFAULT_POLICY_ASSUMPTIONS.gridEmissionsFactor
    );
    policyAssumptions.gridEmissionsFactor = gridEmissionsFactorResult.value;
    
    const gasEmissionsFactorResult = validateInput(
        gasEmissionsFactorInput, 
        gasEmissionsFactorError, 
        Calculator.DEFAULT_POLICY_ASSUMPTIONS.gasEmissionsFactor
    );
    policyAssumptions.gasEmissionsFactor = gasEmissionsFactorResult.value;
    
    const petrolEmissionsFactorResult = validateInput(
        petrolEmissionsFactorInput, 
        petrolEmissionsFactorError, 
        Calculator.DEFAULT_POLICY_ASSUMPTIONS.petrolEmissionsFactor
    );
    policyAssumptions.petrolEmissionsFactor = petrolEmissionsFactorResult.value;
    
    const passThroughElectricityResult = validateInput(
        passThroughElectricityInput, 
        passThroughElectricityError, 
        Calculator.DEFAULT_POLICY_ASSUMPTIONS.passThroughElectricity,
        { min: 0, max: 1 }
    );
    policyAssumptions.passThroughElectricity = passThroughElectricityResult.value;
    
    const passThroughGasResult = validateInput(
        passThroughGasInput, 
        passThroughGasError, 
        Calculator.DEFAULT_POLICY_ASSUMPTIONS.passThroughGas,
        { min: 0, max: 1 }
    );
    policyAssumptions.passThroughGas = passThroughGasResult.value;
    
    const passThroughPetrolResult = validateInput(
        passThroughPetrolInput, 
        passThroughPetrolError, 
        Calculator.DEFAULT_POLICY_ASSUMPTIONS.passThroughPetrol,
        { min: 0, max: 1 }
    );
    policyAssumptions.passThroughPetrol = passThroughPetrolResult.value;
    
    return policyAssumptions;
}

// ============================================================================
// Calculation and Display Functions
// ============================================================================

/**
 * Perform all calculations and update display
 */
function performCalculationsAndUpdateDisplay() {
    // Get current inputs with validation
    const userInputs = getUserInputs();
    const policyAssumptions = getPolicyAssumptions();
    
    // Check if population or adult share is valid
    if (policyAssumptions.population <= 0 || policyAssumptions.adultShare <= 0) {
        if (policyAssumptions.population <= 0) {
            populationError.textContent = "Population must be greater than 0 for dividend calculations.";
            populationInput.classList.add('input-error');
        }
        
        if (policyAssumptions.adultShare <= 0) {
            adultShareError.textContent = "Adult share must be greater than 0 for dividend calculations.";
            adultShareInput.classList.add('input-error');
        }
    }
    
    // Perform all calculations
    // 1. Revenue and dividend calculations
    const grossRevenue = Calculator.calculateGrossRevenue(
        policyAssumptions.carbonPrice, 
        policyAssumptions.nationalEmissions
    );
    
    const adultAnnualDividend = Calculator.calculatePerAdultDividend(
        policyAssumptions.carbonPrice,
        policyAssumptions.nationalEmissions,
        policyAssumptions.householdRebateShare,
        policyAssumptions.population,
        policyAssumptions.adultShare
    );
    
    const householdAnnualDividend = Calculator.calculateHouseholdDividend(
        userInputs.numAdults,
        userInputs.numChildren,
        policyAssumptions.childShareFactor,
        adultAnnualDividend
    );
    
    // 2. Fuel cost calculations
    const extraCostPerKwh = Calculator.calculateExtraCostPerUnit(
        policyAssumptions.carbonPrice,
        policyAssumptions.gridEmissionsFactor,
        policyAssumptions.passThroughElectricity
    );
    
    const extraCostPerGj = Calculator.calculateExtraCostPerUnit(
        policyAssumptions.carbonPrice,
        policyAssumptions.gasEmissionsFactor,
        policyAssumptions.passThroughGas
    );
    
    const extraCostPerLitre = Calculator.calculateExtraCostPerUnit(
        policyAssumptions.carbonPrice,
        policyAssumptions.petrolEmissionsFactor,
        policyAssumptions.passThroughPetrol
    );
    
    const annualElecCost = Calculator.calculateAnnualFuelCost(
        userInputs.annualElectricityKwh,
        extraCostPerKwh
    );
    
    const annualGasCost = Calculator.calculateAnnualFuelCost(
        userInputs.annualGasGj,
        extraCostPerGj
    );
    
    const annualPetrolCost = Calculator.calculateAnnualFuelCost(
        userInputs.annualPetrolL,
        extraCostPerLitre
    );
    
    // 3. Total costs and net benefit
    const totalAnnualExtraCost = Calculator.calculateTotalExtraHouseholdCost(
        annualElecCost,
        annualGasCost,
        annualPetrolCost
    );
    
    const netAnnualBenefit = Calculator.calculateNetBenefit(
        householdAnnualDividend,
        totalAnnualExtraCost
    );
    
    // 4. Monthly values
    const adultMonthlyDividend = Calculator.getMonthlyValue(adultAnnualDividend);
    const householdMonthlyDividend = Calculator.getMonthlyValue(householdAnnualDividend);
    const totalMonthlyExtraCost = Calculator.getMonthlyValue(totalAnnualExtraCost);
    const netMonthlyBenefit = Calculator.getMonthlyValue(netAnnualBenefit);
    
    // Update Main Calculator Outputs
    
    // Handle division by zero case (null values)
    if (adultAnnualDividend === null) {
        // When adult dividend is null (division by zero), update outputs accordingly
        outputHeadline.textContent = `Unable to calculate net benefit with invalid population values.`;
        outputNarrative.textContent = `With these settings, dividend calculation is not possible (e.g., population or adult share is zero). Please check the Background Assumptions.`;
        
        // Update table values with "—" for affected fields
        tableAdultDividendAnnual.textContent = "—";
        tableAdultDividendMonthly.textContent = "—";
        tableHouseholdDividendAnnual.textContent = "—";
        tableHouseholdDividendMonthly.textContent = "—";
        tableNetBenefitAnnual.textContent = "—";
        tableNetBenefitMonthly.textContent = "—";
        
        // Extra costs can still be calculated
        tableExtraCostAnnual.textContent = formatCurrency(totalAnnualExtraCost);
        tableExtraCostMonthly.textContent = formatCurrency(totalMonthlyExtraCost);
    } else {
        // Normal case - all values calculated correctly
        
        // Headline - handle positive/negative net benefit
        if (netAnnualBenefit >= 0) {
            outputHeadline.textContent = `Your household's net benefit is ${formatCurrency(netAnnualBenefit)} per year.`;
            outputHeadline.classList.remove('negative-value');
            outputHeadline.classList.add('positive-value');
        } else {
            // Display as positive number but indicate it's a cost
            outputHeadline.textContent = `Your household's net cost is ${formatCurrency(-netAnnualBenefit)} per year.`;
            outputHeadline.classList.remove('positive-value');
            outputHeadline.classList.add('negative-value');
        }
        
        // Narrative
        outputNarrative.textContent = `With these settings, the total funds available for dividends are derived from the carbon price on national emissions. Your household receives a total annual dividend of ${formatCurrency(householdAnnualDividend)} and pays an estimated ${formatCurrency(totalAnnualExtraCost)} in extra costs, giving a net ${netAnnualBenefit >= 0 ? 'benefit' : 'cost'} of ${formatCurrency(Math.abs(netAnnualBenefit))} per year.`;
        
        // Update table values
        tableAdultDividendAnnual.textContent = formatCurrency(adultAnnualDividend);
        tableAdultDividendMonthly.textContent = formatCurrency(adultMonthlyDividend);
        
        tableHouseholdDividendAnnual.textContent = formatCurrency(householdAnnualDividend);
        tableHouseholdDividendMonthly.textContent = formatCurrency(householdMonthlyDividend);
        
        tableExtraCostAnnual.textContent = formatCurrency(totalAnnualExtraCost);
        tableExtraCostMonthly.textContent = formatCurrency(totalMonthlyExtraCost);
        
        // Apply color to net benefit values in the table
        tableNetBenefitAnnual.textContent = formatCurrency(netAnnualBenefit, true);
        tableNetBenefitMonthly.textContent = formatCurrency(netMonthlyBenefit, true);
        
        // Set color based on positive/negative value
        if (netAnnualBenefit < 0) {
            tableNetBenefitAnnual.classList.remove('positive-value');
            tableNetBenefitAnnual.classList.add('negative-value');
            tableNetBenefitMonthly.classList.remove('positive-value');
            tableNetBenefitMonthly.classList.add('negative-value');
        } else {
            tableNetBenefitAnnual.classList.remove('negative-value');
            tableNetBenefitAnnual.classList.add('positive-value');
            tableNetBenefitMonthly.classList.remove('negative-value');
            tableNetBenefitMonthly.classList.add('positive-value');
        }
    }
    
    // Update Calculation Details Tab
    detailsGrossRevenue.textContent = formatCurrency(grossRevenue);
    detailsPerAdultDividend.textContent = formatCurrency(adultAnnualDividend);
    detailsCostElectricityPerUnit.textContent = formatUnitCost(extraCostPerKwh, "/kWh");
    detailsCostGasPerUnit.textContent = formatUnitCost(extraCostPerGj, "/GJ");
    detailsCostPetrolPerUnit.textContent = formatUnitCost(extraCostPerLitre, "/L");
    detailsAnnualCostElectricity.textContent = formatCurrency(annualElecCost);
    detailsAnnualCostGas.textContent = formatCurrency(annualGasCost);
    detailsAnnualCostPetrol.textContent = formatCurrency(annualPetrolCost);
    detailsTotalAnnualHouseholdCost.textContent = formatCurrency(totalAnnualExtraCost);
    detailsAnnualHouseholdDividend.textContent = formatCurrency(householdAnnualDividend);
    detailsNetAnnualBenefit.textContent = formatCurrency(netAnnualBenefit, true);
    // Set color for net annual benefit in details tab
    if (netAnnualBenefit < 0) {
        detailsNetAnnualBenefit.classList.remove('positive-value');
        detailsNetAnnualBenefit.classList.add('negative-value');
    } else {
        detailsNetAnnualBenefit.classList.remove('negative-value');
        detailsNetAnnualBenefit.classList.add('positive-value');
    }
}

// ============================================================================
// Event Listeners for Inputs
// ============================================================================

// Set up input event listeners for all inputs
function setupInputEventListeners() {
    // Main Calculator inputs
    numAdultsInput.addEventListener('input', performCalculationsAndUpdateDisplay);
    numChildrenInput.addEventListener('input', performCalculationsAndUpdateDisplay);
    annualElectricityKwhInput.addEventListener('input', performCalculationsAndUpdateDisplay);
    annualGasGjInput.addEventListener('input', performCalculationsAndUpdateDisplay);
    annualPetrolLInput.addEventListener('input', performCalculationsAndUpdateDisplay);
    
    // Background Assumptions inputs
    carbonPriceInput.addEventListener('change', performCalculationsAndUpdateDisplay);
    nationalEmissionsInput.addEventListener('input', performCalculationsAndUpdateDisplay);
    householdRebateShareInput.addEventListener('input', performCalculationsAndUpdateDisplay);
    populationInput.addEventListener('input', performCalculationsAndUpdateDisplay);
    adultShareInput.addEventListener('input', performCalculationsAndUpdateDisplay);
    childShareFactorInput.addEventListener('input', performCalculationsAndUpdateDisplay);
    gridEmissionsFactorInput.addEventListener('input', performCalculationsAndUpdateDisplay);
    gasEmissionsFactorInput.addEventListener('input', performCalculationsAndUpdateDisplay);
    petrolEmissionsFactorInput.addEventListener('input', performCalculationsAndUpdateDisplay);
    passThroughElectricityInput.addEventListener('input', performCalculationsAndUpdateDisplay);
    passThroughGasInput.addEventListener('input', performCalculationsAndUpdateDisplay);
    passThroughPetrolInput.addEventListener('input', performCalculationsAndUpdateDisplay);
}

// Set up blur event handlers to revert to defaults if invalid
function setupBlurEventListeners() {
    // Main Calculator inputs
    setupBlurHandler(numAdultsInput, numAdultsError, Calculator.DEFAULT_USER_INPUTS.numAdults);
    setupBlurHandler(numChildrenInput, numChildrenError, Calculator.DEFAULT_USER_INPUTS.numChildren);
    setupBlurHandler(annualElectricityKwhInput, annualElectricityKwhError, Calculator.DEFAULT_USER_INPUTS.annualElectricityKwh);
    setupBlurHandler(annualGasGjInput, annualGasGjError, Calculator.DEFAULT_USER_INPUTS.annualGasGj);
    setupBlurHandler(annualPetrolLInput, annualPetrolLError, Calculator.DEFAULT_USER_INPUTS.annualPetrolL);
    
    // Background Assumptions inputs
    // Note: No blur handler for carbonPriceInput since it's a <select>
    // For nationalEmissions, we store Mt in the UI but t in the calculator
    setupBlurHandler(nationalEmissionsInput, nationalEmissionsError, 
                    Calculator.DEFAULT_POLICY_ASSUMPTIONS.nationalEmissions / 1000000);
    setupBlurHandler(householdRebateShareInput, householdRebateShareError, 
                    Calculator.DEFAULT_POLICY_ASSUMPTIONS.householdRebateShare);
    setupBlurHandler(populationInput, populationError, 
                    Calculator.DEFAULT_POLICY_ASSUMPTIONS.population);
    setupBlurHandler(adultShareInput, adultShareError, 
                    Calculator.DEFAULT_POLICY_ASSUMPTIONS.adultShare);
    setupBlurHandler(childShareFactorInput, childShareFactorError, Calculator.DEFAULT_POLICY_ASSUMPTIONS.childShareFactor);
    setupBlurHandler(gridEmissionsFactorInput, gridEmissionsFactorError, 
                    Calculator.DEFAULT_POLICY_ASSUMPTIONS.gridEmissionsFactor);
    setupBlurHandler(gasEmissionsFactorInput, gasEmissionsFactorError, 
                    Calculator.DEFAULT_POLICY_ASSUMPTIONS.gasEmissionsFactor);
    setupBlurHandler(petrolEmissionsFactorInput, petrolEmissionsFactorError, 
                    Calculator.DEFAULT_POLICY_ASSUMPTIONS.petrolEmissionsFactor);
    setupBlurHandler(passThroughElectricityInput, passThroughElectricityError, 
                    Calculator.DEFAULT_POLICY_ASSUMPTIONS.passThroughElectricity);
    setupBlurHandler(passThroughGasInput, passThroughGasError, Calculator.DEFAULT_POLICY_ASSUMPTIONS.passThroughGas);
    setupBlurHandler(passThroughPetrolInput, passThroughPetrolError, 
                    Calculator.DEFAULT_POLICY_ASSUMPTIONS.passThroughPetrol);
}

// ============================================================================
// Initialize the application
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Show the main calculator tab by default
    showTab('main-calculator-tab');
    
    // Clear any initial error messages
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    
    // Set up all event listeners
    setupInputEventListeners();
    setupBlurEventListeners();
    
    // Perform initial calculations and display results
    performCalculationsAndUpdateDisplay();
});
