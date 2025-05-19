/**
 * Climate Dividend Calculator - Core Calculation Logic
 * Based on UNSW Australian Carbon Dividend Plan
 */

/**
 * Default policy assumptions for the carbon dividend calculation
 * These are the baseline values that can be adjusted in the background assumptions tab
 */
const DEFAULT_POLICY_ASSUMPTIONS = {
    carbonPrice: 50,                   // A$/t CO₂-e
    totalCoveredEmissions: 466000000,  // t CO₂-e (466 Mt converted to t for consistent units)
    adminCostRate: 0.10,               // Administrative cost rate (decimal)
    eligibleAdultPopulation: 16000000, // Number of eligible adults
    childShareFactor: 0,               // Child share factor (decimal)
    gridEmissionsFactor: 0.0007,       // t/kWh
    gasEmissionsFactor: 0.051,         // t/GJ
    petrolEmissionsFactor: 0.0023,     // t/L
    passThroughElectricity: 1,         // Decimal (1 = 100% pass-through)
    passThroughGas: 1,                 // Decimal (1 = 100% pass-through)
    passThroughPetrol: 1               // Decimal (1 = 100% pass-through)
};

/**
 * Default user household inputs
 * These are the starting values for the main calculator tab
 */
const DEFAULT_USER_INPUTS = {
    numAdults: 2,              // Number of adults in household
    numChildren: 0,            // Number of eligible children
    annualElectricityKwh: 5000, // Annual electricity usage in kWh
    annualGasGj: 20,           // Annual gas usage in GJ
    annualPetrolL: 1600        // Annual petrol usage in L
};

/**
 * Calculate gross revenue from carbon price and emissions
 * 
 * @param {number} carbonPrice - Carbon price in A$/t CO₂-e
 * @param {number} totalCoveredEmissions - Total covered emissions in t CO₂-e
 * @returns {number} - Gross revenue in A$
 */
function calculateGrossRevenue(carbonPrice, totalCoveredEmissions) {
    // G = P × E
    return carbonPrice * totalCoveredEmissions;
}

/**
 * Calculate net revenue after administrative costs
 * 
 * @param {number} grossRevenue - Gross revenue in A$
 * @param {number} adminCostRate - Administrative cost rate (0-1)
 * @returns {number} - Net revenue in A$
 */
function calculateNetRevenue(grossRevenue, adminCostRate) {
    // R = G × (1 - r)
    return grossRevenue * (1 - adminCostRate);
}

/**
 * Calculate annual dividend per adult
 * 
 * @param {number} netRevenue - Net revenue in A$
 * @param {number} eligibleAdultPopulation - Number of eligible adults
 * @returns {number} - Annual dividend per adult in A$, or 0 if population is 0
 */
function calculateAdultDividend(netRevenue, eligibleAdultPopulation) {
    // D_adult = R / N
    // Handle division by zero - return 0 if population is 0
    if (eligibleAdultPopulation <= 0) {
        return 0; // Return 0 instead of null for easier calculations later
    }
    return netRevenue / eligibleAdultPopulation;
}

/**
 * Calculate household dividend based on adults, children, and per-adult dividend
 * 
 * @param {number} numAdults - Number of adults in household
 * @param {number} numChildren - Number of eligible children
 * @param {number} childShareFactor - Child share factor (decimal)
 * @param {number} adultDividend - Annual dividend per adult
 * @returns {number} - Total annual dividend for household
 */
function calculateHouseholdDividend(numAdults, numChildren, childShareFactor, adultDividend) {
    // D_household = (adults + c × children) × D_adult
    return (numAdults + childShareFactor * numChildren) * adultDividend;
}

/**
 * Calculate extra cost per unit for a fuel type
 * 
 * @param {number} carbonPrice - Carbon price in A$/t CO₂-e
 * @param {number} emissionsFactor - Emissions factor for the fuel type
 * @param {number} passThrough - Pass-through rate (0-1)
 * @returns {number} - Extra cost per unit in A$
 */
function calculateUnitCost(carbonPrice, emissionsFactor, passThrough) {
    // Δp = P × EF × PT
    return carbonPrice * emissionsFactor * passThrough;
}

/**
 * Calculate annual extra cost for a fuel type
 * 
 * @param {number} usage - Annual usage of the fuel
 * @param {number} unitCost - Extra cost per unit
 * @returns {number} - Annual extra cost in A$
 */
function calculateAnnualCost(usage, unitCost) {
    // ΔC = Usage × Δp
    return usage * unitCost;
}

/**
 * Calculate total annual extra household cost
 * 
 * @param {number} electricityCost - Annual electricity extra cost
 * @param {number} gasCost - Annual gas extra cost
 * @param {number} petrolCost - Annual petrol extra cost
 * @returns {number} - Total annual extra cost in A$
 */
function calculateTotalExtraCost(electricityCost, gasCost, petrolCost) {
    return electricityCost + gasCost + petrolCost;
}

/**
 * Calculate net annual benefit
 * 
 * @param {number} householdDividend - Annual household dividend
 * @param {number} totalExtraCost - Total annual extra cost
 * @returns {number} - Net annual benefit in A$
 */
function calculateNetBenefit(householdDividend, totalExtraCost) {
    return householdDividend - totalExtraCost;
}

/**
 * Convert annual value to monthly value
 * 
 * @param {number} annualValue - Annual value
 * @returns {number} - Monthly value
 */
function calculateMonthlyValue(annualValue) {
    return annualValue / 12;
}

/**
 * Format currency value as AUD
 * 
 * @param {number} value - The value to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} - Formatted value in AUD
 */
function formatCurrency(value, decimals = 2) {
    return value.toLocaleString('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

// Export functions and constants for use in other modules
// This will be used in a browser environment, so we're attaching to window
if (typeof window !== 'undefined') {
    window.Calculator = {
        DEFAULT_POLICY_ASSUMPTIONS,
        DEFAULT_USER_INPUTS,
        calculateGrossRevenue,
        calculateNetRevenue,
        calculateAdultDividend,
        calculateHouseholdDividend,
        calculateUnitCost,
        calculateAnnualCost,
        calculateTotalExtraCost,
        calculateNetBenefit,
        calculateMonthlyValue,
        formatCurrency
    };
}

// Test snippet (for development only, remove or comment out for production)
/*
const testGrossRevenue = calculateGrossRevenue(DEFAULT_POLICY_ASSUMPTIONS.carbonPrice, DEFAULT_POLICY_ASSUMPTIONS.totalCoveredEmissions);
console.log('Test Gross Revenue:', testGrossRevenue); // Expected: 50 * 466,000,000 = 23,300,000,000
const testNetRevenue = calculateNetRevenue(testGrossRevenue, DEFAULT_POLICY_ASSUMPTIONS.adminCostRate);
console.log('Test Net Revenue:', testNetRevenue); // Expected: 23,300,000,000 * (1 - 0.10) = 20,970,000,000
const testAdultDividend = calculateAdultDividend(testNetRevenue, DEFAULT_POLICY_ASSUMPTIONS.eligibleAdultPopulation);
console.log('Test Adult Dividend:', testAdultDividend); // Expected: 20,970,000,000 / 16,000,000 = 1310.625
*/
