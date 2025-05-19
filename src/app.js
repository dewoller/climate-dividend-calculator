/**
 * Climate Dividend Calculator - App Logic
 * Handles UI interactions and connects to calculator.js
 */

// Initialize calculator
const calculator = new Calculator();

// DOM elements - Tab navigation
const mainCalculatorTab = document.getElementById('main-calculator-tab');
const backgroundAssumptionsTab = document.getElementById('background-assumptions-tab');
const calculationDetailsTab = document.getElementById('calculation-details-tab');
const btnMainCalculator = document.getElementById('btn-main-calculator');
const btnBackgroundAssumptions = document.getElementById('btn-background-assumptions');
const btnCalculationDetails = document.getElementById('btn-calculation-details');

// DOM elements - Main inputs
const numAdultsInput = document.getElementById('numAdults');
const numChildrenInput = document.getElementById('numChildren');
const annualElectricityKwhInput = document.getElementById('annualElectricityKwh');
const annualGasGjInput = document.getElementById('annualGasGj');
const annualPetrolLInput = document.getElementById('annualPetrolL');

// DOM elements - Error messages
const numAdultsError = document.getElementById('numAdultsError');
const numChildrenError = document.getElementById('numChildrenError');
const annualElectricityKwhError = document.getElementById('annualElectricityKwhError');
const annualGasGjError = document.getElementById('annualGasGjError');
const annualPetrolLError = document.getElementById('annualPetrolLError');

// DOM elements - Background assumptions
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

// DOM elements - Background assumption error messages
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

// DOM elements - Output
const outputHeadline = document.getElementById('output-headline');
const outputNarrative = document.getElementById('output-narrative');

// DOM elements - Output table
const tableAdultDividendAnnual = document.getElementById('table-adult-dividend-annual');
const tableAdultDividendMonthly = document.getElementById('table-adult-dividend-monthly');
const tableHouseholdDividendAnnual = document.getElementById('table-household-dividend-annual');
const tableHouseholdDividendMonthly = document.getElementById('table-household-dividend-monthly');
const tableExtraCostAnnual = document.getElementById('table-extra-cost-annual');
const tableExtraCostMonthly = document.getElementById('table-extra-cost-monthly');
const tableNetBenefitAnnual = document.getElementById('table-net-benefit-annual');
const tableNetBenefitMonthly = document.getElementById('table-net-benefit-monthly');

// DOM elements - Calculation details
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

/**
 * Tab switching functionality
 */
function switchTab(tabButton, tabContent) {
    // Update active button
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    tabButton.classList.add('active');
    
    // Update active content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active-tab');
    });
    tabContent.classList.add('active-tab');
}

// Tab button event listeners
btnMainCalculator.addEventListener('click', () => {
    switchTab(btnMainCalculator, mainCalculatorTab);
});

btnBackgroundAssumptions.addEventListener('click', () => {
    switchTab(btnBackgroundAssumptions, backgroundAssumptionsTab);
});

btnCalculationDetails.addEventListener('click', () => {
    switchTab(btnCalculationDetails, calculationDetailsTab);
});

/**
 * Validate and update input values
 * @param {HTMLInputElement} inputElement - The input element
 * @param {HTMLElement} errorElement - The error message element
 * @param {string} key - The calculator key for this input
 * @return {boolean} - Whether validation succeeded
 */
function validateAndUpdateInput(inputElement, errorElement, key) {
    const value = inputElement.value.trim();
    
    // Check if empty
    if (value === '') {
        errorElement.textContent = 'Required field';
        // Revert to default after showing error
        setTimeout(() => {
            inputElement.value = calculator.defaults[key];
            errorElement.textContent = '';
            calculator.updateValue(key, calculator.defaults[key]);
            updateResults();
        }, 3000);
        return false;
    }
    
    // Check if valid number
    const numValue = Number(value);
    if (isNaN(numValue) || !isFinite(numValue)) {
        errorElement.textContent = 'Please enter a valid number';
        return false;
    }
    
    // Check if negative
    if (numValue < 0) {
        errorElement.textContent = 'Value cannot be negative';
        return false;
    }
    
    // Special case for rate values (between 0 and 1)
    if (['adminCostRate', 'passThroughElectricity', 'passThroughGas', 'passThroughPetrol'].includes(key)) {
        if (numValue > 1) {
            errorElement.textContent = 'Value must be between 0 and 1';
            return false;
        }
    }
    
    // Special case for adult population - must be positive for division
    if (key === 'eligibleAdultPopulation' && numValue === 0) {
        errorElement.textContent = 'Value must be greater than 0';
        return false;
    }
    
    // Update calculator with new value
    errorElement.textContent = '';
    calculator.updateValue(key, numValue);
    return true;
}

/**
 * Update all output displays with latest calculation results
 */
function updateResults() {
    const results = calculator.getAllResults();
    
    // Update main outputs
    outputHeadline.textContent = `Your household's net benefit is ${results.netBenefitAnnualFormatted} per year.`;
    
    outputNarrative.textContent = `With these settings, your household receives a total annual dividend of ${results.householdDividendAnnualFormatted} and pays an estimated ${results.totalExtraCostAnnualFormatted} in extra costs, giving a net benefit of ${results.netBenefitAnnualFormatted} per year.`;
    
    // Update output table
    tableAdultDividendAnnual.textContent = results.adultDividendAnnualFormatted;
    tableAdultDividendMonthly.textContent = results.adultDividendMonthlyFormatted;
    
    tableHouseholdDividendAnnual.textContent = results.householdDividendAnnualFormatted;
    tableHouseholdDividendMonthly.textContent = results.householdDividendMonthlyFormatted;
    
    tableExtraCostAnnual.textContent = results.totalExtraCostAnnualFormatted;
    tableExtraCostMonthly.textContent = results.totalExtraCostMonthlyFormatted;
    
    tableNetBenefitAnnual.textContent = results.netBenefitAnnualFormatted;
    tableNetBenefitMonthly.textContent = results.netBenefitMonthlyFormatted;
    
    // Update calculation details
    detailsGrossRevenue.textContent = results.grossRevenueFormatted;
    detailsNetRevenue.textContent = results.netRevenueFormatted;
    detailsPerAdultDividend.textContent = results.adultDividendAnnualFormatted;
    detailsAnnualHouseholdDividend.textContent = results.householdDividendAnnualFormatted;
    
    detailsCostElectricityPerUnit.textContent = `${results.electricityUnitCostFormatted}/kWh`;
    detailsCostGasPerUnit.textContent = `${results.gasUnitCostFormatted}/GJ`;
    detailsCostPetrolPerUnit.textContent = `${results.petrolUnitCostFormatted}/L`;
    
    detailsAnnualCostElectricity.textContent = results.electricityAnnualCostFormatted;
    detailsAnnualCostGas.textContent = results.gasAnnualCostFormatted;
    detailsAnnualCostPetrol.textContent = results.petrolAnnualCostFormatted;
    
    detailsTotalAnnualHouseholdCost.textContent = results.totalExtraCostAnnualFormatted;
    detailsNetAnnualBenefit.textContent = results.netBenefitAnnualFormatted;
}

/**
 * Set up event listeners for all inputs
 */
function setupInputEventListeners() {
    // Main calculator inputs
    numAdultsInput.addEventListener('change', () => {
        if (validateAndUpdateInput(numAdultsInput, numAdultsError, 'numAdults')) {
            updateResults();
        }
    });
    
    numChildrenInput.addEventListener('change', () => {
        if (validateAndUpdateInput(numChildrenInput, numChildrenError, 'numChildren')) {
            updateResults();
        }
    });
    
    annualElectricityKwhInput.addEventListener('change', () => {
        if (validateAndUpdateInput(annualElectricityKwhInput, annualElectricityKwhError, 'annualElectricityKwh')) {
            updateResults();
        }
    });
    
    annualGasGjInput.addEventListener('change', () => {
        if (validateAndUpdateInput(annualGasGjInput, annualGasGjError, 'annualGasGj')) {
            updateResults();
        }
    });
    
    annualPetrolLInput.addEventListener('change', () => {
        if (validateAndUpdateInput(annualPetrolLInput, annualPetrolLError, 'annualPetrolL')) {
            updateResults();
        }
    });
    
    // Background assumptions inputs
    carbonPriceInput.addEventListener('change', () => {
        if (validateAndUpdateInput(carbonPriceInput, carbonPriceError, 'carbonPrice')) {
            updateResults();
        }
    });
    
    totalCoveredEmissionsInput.addEventListener('change', () => {
        if (validateAndUpdateInput(totalCoveredEmissionsInput, totalCoveredEmissionsError, 'totalCoveredEmissions')) {
            updateResults();
        }
    });
    
    adminCostRateInput.addEventListener('change', () => {
        if (validateAndUpdateInput(adminCostRateInput, adminCostRateError, 'adminCostRate')) {
            updateResults();
        }
    });
    
    eligibleAdultPopulationInput.addEventListener('change', () => {
        if (validateAndUpdateInput(eligibleAdultPopulationInput, eligibleAdultPopulationError, 'eligibleAdultPopulation')) {
            updateResults();
        }
    });
    
    childShareFactorInput.addEventListener('change', () => {
        if (validateAndUpdateInput(childShareFactorInput, childShareFactorError, 'childShareFactor')) {
            updateResults();
        }
    });
    
    gridEmissionsFactorInput.addEventListener('change', () => {
        if (validateAndUpdateInput(gridEmissionsFactorInput, gridEmissionsFactorError, 'gridEmissionsFactor')) {
            updateResults();
        }
    });
    
    gasEmissionsFactorInput.addEventListener('change', () => {
        if (validateAndUpdateInput(gasEmissionsFactorInput, gasEmissionsFactorError, 'gasEmissionsFactor')) {
            updateResults();
        }
    });
    
    petrolEmissionsFactorInput.addEventListener('change', () => {
        if (validateAndUpdateInput(petrolEmissionsFactorInput, petrolEmissionsFactorError, 'petrolEmissionsFactor')) {
            updateResults();
        }
    });
    
    passThroughElectricityInput.addEventListener('change', () => {
        if (validateAndUpdateInput(passThroughElectricityInput, passThroughElectricityError, 'passThroughElectricity')) {
            updateResults();
        }
    });
    
    passThroughGasInput.addEventListener('change', () => {
        if (validateAndUpdateInput(passThroughGasInput, passThroughGasError, 'passThroughGas')) {
            updateResults();
        }
    });
    
    passThroughPetrolInput.addEventListener('change', () => {
        if (validateAndUpdateInput(passThroughPetrolInput, passThroughPetrolError, 'passThroughPetrol')) {
            updateResults();
        }
    });
}

// Initialize the app
function initApp() {
    // Set up all input event listeners
    setupInputEventListeners();
    
    // Initialize with default values
    calculator.resetToDefaults();
    
    // Display initial results
    updateResults();
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
