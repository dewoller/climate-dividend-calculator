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
 * @returns {number|null} - Annual dividend per adult in A$, or null if population is 0 or invalid
 */
function calculateAdultDividend(netRevenue, eligibleAdultPopulation) {
    // D_adult = R / N
    // Handle division by zero - return null if population is 0 or invalid
    if (eligibleAdultPopulation <= 0 || !isFinite(eligibleAdultPopulation)) {
        return null;
    }
    return netRevenue / eligibleAdultPopulation;
}

/**
 * Calculate household dividend based on adults, children, and per-adult dividend
 * 
 * @param {number} numAdults - Number of adults in household
 * @param {number} numChildren - Number of eligible children
 * @param {number} childShareFactor - Child share factor (decimal)
 * @param {number|null} adultAnnualDividend - Annual dividend per adult
 * @returns {number|null} - Total annual dividend for household, or null if adultAnnualDividend is null
 */
function calculateHouseholdDividend(numAdults, numChildren, childShareFactor, adultAnnualDividend) {
    // Propagate null if adultAnnualDividend is null
    if (adultAnnualDividend === null) {
        return null;
    }
    // D_household = (adults + c × children) × D_adult
    return (numAdults + childShareFactor * numChildren) * adultAnnualDividend;
}

/**
 * Calculate extra cost per unit for a fuel type
 * 
 * @param {number} carbonPrice - Carbon price in A$/t CO₂-e
 * @param {number} emissionsFactor - Emissions factor for the fuel type
 * @param {number} passThroughRate - Pass-through rate (0-1)
 * @returns {number} - Extra cost per unit in A$
 */
function calculateExtraCostPerUnit(carbonPrice, emissionsFactor, passThroughRate) {
    // Δp = P × EF × PT
    return carbonPrice * emissionsFactor * passThroughRate;
}

/**
 * Calculate annual extra cost for a fuel type
 * 
 * @param {number} usage - Annual usage of the fuel
 * @param {number} extraCostPerUnit - Extra cost per unit
 * @returns {number} - Annual extra cost in A$
 */
function calculateAnnualFuelCost(usage, extraCostPerUnit) {
    // ΔC = Usage × Δp
    return usage * extraCostPerUnit;
}

/**
 * Calculate total annual extra household cost
 * 
 * @param {number} annualElectricityCost - Annual electricity extra cost
 * @param {number} annualGasCost - Annual gas extra cost
 * @param {number} annualPetrolCost - Annual petrol extra cost
 * @returns {number} - Total annual extra cost in A$
 */
function calculateTotalExtraHouseholdCost(annualElectricityCost, annualGasCost, annualPetrolCost) {
    return annualElectricityCost + annualGasCost + annualPetrolCost;
}

/**
 * Calculate net annual benefit
 * 
 * @param {number|null} annualHouseholdDividend - Annual household dividend
 * @param {number} totalAnnualExtraCost - Total annual extra cost
 * @returns {number|null} - Net annual benefit in A$, or null if annualHouseholdDividend is null
 */
function calculateNetBenefit(annualHouseholdDividend, totalAnnualExtraCost) {
    // Propagate null if household dividend is null
    if (annualHouseholdDividend === null) {
        return null;
    }
    return annualHouseholdDividend - totalAnnualExtraCost;
}

/**
 * Convert annual value to monthly value
 * 
 * @param {number|null} annualValue - Annual value
 * @returns {number|null} - Monthly value, or null if annualValue is null
 */
function getMonthlyValue(annualValue) {
    // Propagate null value
    if (annualValue === null) {
        return null;
    }
    
    // Handle undefined values (shouldn't happen, but just in case)
    if (annualValue === undefined) {
        return null;
    }
    
    return annualValue / 12;
}

/**
 * Format currency value as AUD
 * 
 * @param {number|null} value - The value to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} - Formatted value in AUD, or "—" if value is null
 */
function formatCurrency(value, decimals = 2) {
    // Handle null value (division by zero)
    if (value === null) {
        return "—";
    }
    
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
        calculateExtraCostPerUnit,
        calculateAnnualFuelCost,
        calculateTotalExtraHouseholdCost,
        calculateNetBenefit,
        getMonthlyValue,
        formatCurrency
    };
}

// Test snippet (for development only, remove or comment out for production)
/*
// Test the initial calculations
const testGrossRevenue = calculateGrossRevenue(DEFAULT_POLICY_ASSUMPTIONS.carbonPrice, DEFAULT_POLICY_ASSUMPTIONS.totalCoveredEmissions);
console.log('Test Gross Revenue:', testGrossRevenue); // Expected: 50 * 466,000,000 = 23,300,000,000
const testNetRevenue = calculateNetRevenue(testGrossRevenue, DEFAULT_POLICY_ASSUMPTIONS.adminCostRate);
console.log('Test Net Revenue:', testNetRevenue); // Expected: 23,300,000,000 * (1 - 0.10) = 20,970,000,000

// Test division by zero handling
console.log('Test Adult Dividend with zero population:', calculateAdultDividend(testNetRevenue, 0)); // Expected: null
console.log('Test Adult Dividend with valid population:', calculateAdultDividend(testNetRevenue, DEFAULT_POLICY_ASSUMPTIONS.eligibleAdultPopulation)); // Expected: ~1310.625

// Test null propagation
const nullAdultDividend = calculateAdultDividend(testNetRevenue, 0);
console.log('Test Household Dividend with null adult dividend:', calculateHouseholdDividend(2, 1, 0.5, nullAdultDividend)); // Expected: null

const validAdultDividend = calculateAdultDividend(testNetRevenue, DEFAULT_POLICY_ASSUMPTIONS.eligibleAdultPopulation);
const householdDiv = calculateHouseholdDividend(
    DEFAULT_USER_INPUTS.numAdults, 
    DEFAULT_USER_INPUTS.numChildren, 
    DEFAULT_POLICY_ASSUMPTIONS.childShareFactor, 
    validAdultDividend
);
console.log('Test Household Dividend with valid adult dividend:', householdDiv); // Expected: ~2621.25

// Test formatCurrency with null
console.log('Format null value:', formatCurrency(null)); // Expected: "—"
console.log('Format valid value:', formatCurrency(1234.56)); // Expected: "$1,234.56"
*/
