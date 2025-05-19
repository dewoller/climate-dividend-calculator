/**
 * Climate Dividend Calculator - Core Calculation Logic
 * Based on UNSW Australian Carbon Dividend Plan
 * 
 * This file contains all the calculation functions for the Carbon Dividend Calculator.
 * It implements the mathematical model for calculating dividends, costs, and net benefits
 * based on user inputs and policy parameters.
 */

/**
 * Default policy assumptions for the carbon dividend calculation
 * These are the baseline values that can be adjusted in the background assumptions tab
 * All values are based on the UNSW Australian Carbon Dividend Plan model
 */
const DEFAULT_POLICY_ASSUMPTIONS = {
    carbonPrice: 50,                   // A$/t CO₂-e - The carbon price in Australian dollars per tonne of CO2 equivalent
    totalCoveredEmissions: 466000000,  // t CO₂-e (466 Mt converted to t for consistent units) - Total emissions covered by the scheme
    adminCostRate: 0.10,               // Administrative cost rate (decimal) - Fraction of gross revenue used for administration
    eligibleAdultPopulation: 16000000, // Number of eligible adults - Population receiving dividends
    childShareFactor: 0,               // Child share factor (decimal) - Portion of adult dividend allocated per child
    gridEmissionsFactor: 0.0007,       // t/kWh - Carbon emissions per kilowatt-hour of electricity
    gasEmissionsFactor: 0.051,         // t/GJ - Carbon emissions per gigajoule of gas
    petrolEmissionsFactor: 0.0023,     // t/L - Carbon emissions per liter of petrol
    passThroughElectricity: 1,         // Decimal (1 = 100% pass-through) - Portion of carbon price passed to consumers for electricity
    passThroughGas: 1,                 // Decimal (1 = 100% pass-through) - Portion of carbon price passed to consumers for gas
    passThroughPetrol: 1               // Decimal (1 = 100% pass-through) - Portion of carbon price passed to consumers for petrol
};

/**
 * Default user household inputs
 * These are the starting values for the main calculator tab
 * Represents an average Australian household
 */
const DEFAULT_USER_INPUTS = {
    numAdults: 2,              // Number of adults in household - Default assumes two adults
    numChildren: 0,            // Number of eligible children - Default assumes no children
    annualElectricityKwh: 5000, // Annual electricity usage in kWh - Average household electricity consumption
    annualGasGj: 20,           // Annual gas usage in GJ - Average household gas consumption
    annualPetrolL: 1600        // Annual petrol usage in L - Average household petrol consumption
};

/**
 * Calculate gross revenue from carbon price and emissions
 * Formula: G = P × E where:
 * - G is the gross revenue
 * - P is the carbon price
 * - E is the total covered emissions
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
 * Formula: R = G × (1 - r) where:
 * - R is the net revenue
 * - G is the gross revenue
 * - r is the administrative cost rate
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
 * Formula: D_adult = R / N where:
 * - D_adult is the dividend per adult
 * - R is the net revenue
 * - N is the eligible adult population
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
 * Formula: D_household = (adults + c × children) × D_adult where:
 * - D_household is the household dividend
 * - adults is the number of adults in the household
 * - c is the child share factor
 * - children is the number of children in the household
 * - D_adult is the per-adult dividend
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
 * Formula: Δp = P × EF × PT where:
 * - Δp is the extra cost per unit
 * - P is the carbon price
 * - EF is the emissions factor for the fuel
 * - PT is the pass-through rate
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
 * Formula: ΔC = Usage × Δp where:
 * - ΔC is the annual extra cost
 * - Usage is the annual consumption of the fuel
 * - Δp is the extra cost per unit
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
 * Sum of all fuel-specific extra costs
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
 * Formula: Net benefit = D_household - Total extra cost where:
 * - D_household is the household dividend
 * - Total extra cost is the sum of all extra costs for all fuels
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
 * Simple division by 12 to provide monthly equivalents
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
 * Handles null values by returning an em-dash character
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
