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
const totalCoveredEmissionsInput = document.getElementById('totalCoveredEmissions');
const adminCostRateInput = document.getElementById('adminCostRate');
const eligibleAdultPopulationInput = document.getElementById('eligibleAdultPopulation');
const childShareFactorInput = document.getElementById('childShareFactor');
const gridEmissionsFactorInput = document.getElementById('gridEmissionsFactor');
const gasEmissionsFactorInput = document.getElementById('gasEmissionsFactor');
const petrolEmissionsFactorInput = document.getElementById('petrolEmissionsFactor');
const passThroughElectricityInput = document.getElementById('passThroughElectricity');
const passThroughGasInput = document.getElementById('passThroughGas');
const passThroughPetrolInput = document.getElementById('passThroughPetrol');

// Background Assumptions - Error message elements
const carbonPriceError = document.getElementById('carbonPriceError');
const totalCoveredEmissionsError = document.getElementById('totalCoveredEmissionsError');
const adminCostRateError = document.getElementById('adminCostRateError');
const eligibleAdultPopulationError = document.getElementById('eligibleAdultPopulationError');
const childShareFactorError = document.getElementById('childShareFactorError');
const gridEmissionsFactorError = document.getElementById('gridEmissionsFactorError');
const gasEmissionsFactorError = document.getElementById('gasEmissionsFactorError');
const petrolEmissionsFactorError = document.getElementById('petrolEmissionsFactorError');
const passThroughElectricityError = document.getElementById('passThroughElectricityError');
const passThroughGasError = document.getElementById('passThroughGasError');
const passThroughPetrolError = document.getElementById('passThroughPetrolError');

// Calculation Details - Display elements
const detailsGrossRevenue = document.getElementById('details-gross-revenue');
const detailsNetRevenue = document.getElementById('details-net-revenue');
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
 * @param {number} value - The value to format
 * @param {boolean} includeSign - Whether to include a + sign for positive values
 * @returns {string} - Formatted currency string
 */
function formatCurrency(value, includeSign = false) {
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

// ============================================================================
// Input Gathering Functions
// ============================================================================

/**
 * Read values from Main Calculator input fields
 * @returns {object} Object containing user input values
 */
function getUserInputs() {
    // Start with default values
    const userInputs = {...Calculator.DEFAULT_USER_INPUTS};
    
    // Parse and update each value, fallback to default if invalid
    try {
        const numAdults = parseFloat(numAdultsInput.value);
        if (!isNaN(numAdults) && isFinite(numAdults) && numAdults >= 0) {
            userInputs.numAdults = numAdults;
        }
    } catch (e) {
        // Keep default value
    }
    
    try {
        const numChildren = parseFloat(numChildrenInput.value);
        if (!isNaN(numChildren) && isFinite(numChildren) && numChildren >= 0) {
            userInputs.numChildren = numChildren;
        }
    } catch (e) {
        // Keep default value
    }
    
    try {
        const annualElectricityKwh = parseFloat(annualElectricityKwhInput.value);
        if (!isNaN(annualElectricityKwh) && isFinite(annualElectricityKwh) && annualElectricityKwh >= 0) {
            userInputs.annualElectricityKwh = annualElectricityKwh;
        }
    } catch (e) {
        // Keep default value
    }
    
    try {
        const annualGasGj = parseFloat(annualGasGjInput.value);
        if (!isNaN(annualGasGj) && isFinite(annualGasGj) && annualGasGj >= 0) {
            userInputs.annualGasGj = annualGasGj;
        }
    } catch (e) {
        // Keep default value
    }
    
    try {
        const annualPetrolL = parseFloat(annualPetrolLInput.value);
        if (!isNaN(annualPetrolL) && isFinite(annualPetrolL) && annualPetrolL >= 0) {
            userInputs.annualPetrolL = annualPetrolL;
        }
    } catch (e) {
        // Keep default value
    }
    
    return userInputs;
}

/**
 * Read values from Background Assumptions input fields
 * @returns {object} Object containing policy assumption values
 */
function getPolicyAssumptions() {
    // Start with default values
    const policyAssumptions = {...Calculator.DEFAULT_POLICY_ASSUMPTIONS};
    
    // Parse and update each value, fallback to default if invalid
    try {
        const carbonPrice = parseFloat(carbonPriceInput.value);
        if (!isNaN(carbonPrice) && isFinite(carbonPrice) && carbonPrice >= 0) {
            policyAssumptions.carbonPrice = carbonPrice;
        }
    } catch (e) {
        // Keep default value
    }
    
    try {
        // For totalCoveredEmissions, we convert from Mt to t (multiply by 1,000,000)
        const totalCoveredEmissionsMt = parseFloat(totalCoveredEmissionsInput.value);
        if (!isNaN(totalCoveredEmissionsMt) && isFinite(totalCoveredEmissionsMt) && totalCoveredEmissionsMt >= 0) {
            policyAssumptions.totalCoveredEmissions = totalCoveredEmissionsMt * 1000000;
        }
    } catch (e) {
        // Keep default value
    }
    
    try {
        const adminCostRate = parseFloat(adminCostRateInput.value);
        if (!isNaN(adminCostRate) && isFinite(adminCostRate) && adminCostRate >= 0 && adminCostRate <= 1) {
            policyAssumptions.adminCostRate = adminCostRate;
        }
    } catch (e) {
        // Keep default value
    }
    
    try {
        const eligibleAdultPopulation = parseFloat(eligibleAdultPopulationInput.value);
        if (!isNaN(eligibleAdultPopulation) && isFinite(eligibleAdultPopulation) && eligibleAdultPopulation > 0) {
            policyAssumptions.eligibleAdultPopulation = eligibleAdultPopulation;
        }
    } catch (e) {
        // Keep default value
    }
    
    try {
        const childShareFactor = parseFloat(childShareFactorInput.value);
        if (!isNaN(childShareFactor) && isFinite(childShareFactor) && childShareFactor >= 0) {
            policyAssumptions.childShareFactor = childShareFactor;
        }
    } catch (e) {
        // Keep default value
    }
    
    try {
        const gridEmissionsFactor = parseFloat(gridEmissionsFactorInput.value);
        if (!isNaN(gridEmissionsFactor) && isFinite(gridEmissionsFactor) && gridEmissionsFactor >= 0) {
            policyAssumptions.gridEmissionsFactor = gridEmissionsFactor;
        }
    } catch (e) {
        // Keep default value
    }
    
    try {
        const gasEmissionsFactor = parseFloat(gasEmissionsFactorInput.value);
        if (!isNaN(gasEmissionsFactor) && isFinite(gasEmissionsFactor) && gasEmissionsFactor >= 0) {
            policyAssumptions.gasEmissionsFactor = gasEmissionsFactor;
        }
    } catch (e) {
        // Keep default value
    }
    
    try {
        const petrolEmissionsFactor = parseFloat(petrolEmissionsFactorInput.value);
        if (!isNaN(petrolEmissionsFactor) && isFinite(petrolEmissionsFactor) && petrolEmissionsFactor >= 0) {
            policyAssumptions.petrolEmissionsFactor = petrolEmissionsFactor;
        }
    } catch (e) {
        // Keep default value
    }
    
    try {
        const passThroughElectricity = parseFloat(passThroughElectricityInput.value);
        if (!isNaN(passThroughElectricity) && isFinite(passThroughElectricity) && passThroughElectricity >= 0 && passThroughElectricity <= 1) {
            policyAssumptions.passThroughElectricity = passThroughElectricity;
        }
    } catch (e) {
        // Keep default value
    }
    
    try {
        const passThroughGas = parseFloat(passThroughGasInput.value);
        if (!isNaN(passThroughGas) && isFinite(passThroughGas) && passThroughGas >= 0 && passThroughGas <= 1) {
            policyAssumptions.passThroughGas = passThroughGas;
        }
    } catch (e) {
        // Keep default value
    }
    
    try {
        const passThroughPetrol = parseFloat(passThroughPetrolInput.value);
        if (!isNaN(passThroughPetrol) && isFinite(passThroughPetrol) && passThroughPetrol >= 0 && passThroughPetrol <= 1) {
            policyAssumptions.passThroughPetrol = passThroughPetrol;
        }
    } catch (e) {
        // Keep default value
    }
    
    return policyAssumptions;
}

// ============================================================================
// Calculation and Display Functions
// ============================================================================

/**
 * Perform all calculations and update display
 */
function performCalculationsAndUpdateDisplay() {
    // Get current inputs
    const userInputs = getUserInputs();
    const policyAssumptions = getPolicyAssumptions();
    
    // Perform all calculations
    // 1. Revenue and dividend calculations
    const grossRevenue = Calculator.calculateGrossRevenue(
        policyAssumptions.carbonPrice, 
        policyAssumptions.totalCoveredEmissions
    );
    
    const netRevenue = Calculator.calculateNetRevenue(
        grossRevenue, 
        policyAssumptions.adminCostRate
    );
    
    const adultAnnualDividend = Calculator.calculateAdultDividend(
        netRevenue, 
        policyAssumptions.eligibleAdultPopulation
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
    
    // Headline - handle positive/negative net benefit
    if (netAnnualBenefit >= 0) {
        outputHeadline.textContent = `Your household's net benefit is ${formatCurrency(netAnnualBenefit)} per year.`;
    } else {
        // Display as positive number but indicate it's a cost
        outputHeadline.textContent = `Your household's net cost is ${formatCurrency(-netAnnualBenefit)} per year.`;
    }
    
    // Narrative
    outputNarrative.textContent = `With these settings, your household receives a total annual dividend of ${formatCurrency(householdAnnualDividend)} and pays an estimated ${formatCurrency(totalAnnualExtraCost)} in extra costs, giving a net ${netAnnualBenefit >= 0 ? 'benefit' : 'cost'} of ${formatCurrency(Math.abs(netAnnualBenefit))} per year.`;
    
    // Update table values
    tableAdultDividendAnnual.textContent = formatCurrency(adultAnnualDividend);
    tableAdultDividendMonthly.textContent = formatCurrency(adultMonthlyDividend);
    
    tableHouseholdDividendAnnual.textContent = formatCurrency(householdAnnualDividend);
    tableHouseholdDividendMonthly.textContent = formatCurrency(householdMonthlyDividend);
    
    tableExtraCostAnnual.textContent = formatCurrency(totalAnnualExtraCost);
    tableExtraCostMonthly.textContent = formatCurrency(totalMonthlyExtraCost);
    
    tableNetBenefitAnnual.textContent = formatCurrency(netAnnualBenefit, true);
    tableNetBenefitMonthly.textContent = formatCurrency(netMonthlyBenefit, true);
    
    // Update Calculation Details Tab
    detailsGrossRevenue.textContent = formatCurrency(grossRevenue);
    detailsNetRevenue.textContent = formatCurrency(netRevenue);
    detailsPerAdultDividend.textContent = formatCurrency(adultAnnualDividend);
    detailsCostElectricityPerUnit.textContent = `${formatCurrency(extraCostPerKwh)}/kWh`;
    detailsCostGasPerUnit.textContent = `${formatCurrency(extraCostPerGj)}/GJ`;
    detailsCostPetrolPerUnit.textContent = `${formatCurrency(extraCostPerLitre)}/L`;
    detailsAnnualCostElectricity.textContent = formatCurrency(annualElecCost);
    detailsAnnualCostGas.textContent = formatCurrency(annualGasCost);
    detailsAnnualCostPetrol.textContent = formatCurrency(annualPetrolCost);
    detailsTotalAnnualHouseholdCost.textContent = formatCurrency(totalAnnualExtraCost);
    detailsAnnualHouseholdDividend.textContent = formatCurrency(householdAnnualDividend);
    detailsNetAnnualBenefit.textContent = formatCurrency(netAnnualBenefit, true);
}

// ============================================================================
// Event Listeners for Inputs
// ============================================================================

// Main Calculator input event listeners
numAdultsInput.addEventListener('input', performCalculationsAndUpdateDisplay);
numChildrenInput.addEventListener('input', performCalculationsAndUpdateDisplay);
annualElectricityKwhInput.addEventListener('input', performCalculationsAndUpdateDisplay);
annualGasGjInput.addEventListener('input', performCalculationsAndUpdateDisplay);
annualPetrolLInput.addEventListener('input', performCalculationsAndUpdateDisplay);

// Background Assumptions input event listeners
carbonPriceInput.addEventListener('input', performCalculationsAndUpdateDisplay);
totalCoveredEmissionsInput.addEventListener('input', performCalculationsAndUpdateDisplay);
adminCostRateInput.addEventListener('input', performCalculationsAndUpdateDisplay);
eligibleAdultPopulationInput.addEventListener('input', performCalculationsAndUpdateDisplay);
childShareFactorInput.addEventListener('input', performCalculationsAndUpdateDisplay);
gridEmissionsFactorInput.addEventListener('input', performCalculationsAndUpdateDisplay);
gasEmissionsFactorInput.addEventListener('input', performCalculationsAndUpdateDisplay);
petrolEmissionsFactorInput.addEventListener('input', performCalculationsAndUpdateDisplay);
passThroughElectricityInput.addEventListener('input', performCalculationsAndUpdateDisplay);
passThroughGasInput.addEventListener('input', performCalculationsAndUpdateDisplay);
passThroughPetrolInput.addEventListener('input', performCalculationsAndUpdateDisplay);

// ============================================================================
// Initialize the application
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Show the main calculator tab by default
    showTab('main-calculator-tab');
    
    // Perform initial calculations and display results
    performCalculationsAndUpdateDisplay();
});
