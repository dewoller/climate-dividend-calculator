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
    nationalEmissions: 434900000,      // t CO₂-e (434.9 Mt converted to t for consistent units) - Total national emissions
    householdRebateShare: 0.90,        // Decimal (0.9 = 90%) - Portion of revenue allocated to household rebates
    population: 27204809,              // Total population of the country
    adultShare: 0.811,                 // Decimal (0.811 = 81.1%) - Fraction of population that are adults (15+ years)
    childShareFactor: 0.5,             // Child share factor (decimal) - Portion of adult dividend allocated per child
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
 * - E is the national emissions
 * 
 * @param {number} carbonPrice - Carbon price in A$/t CO₂-e
 * @param {number} nationalEmissions - National emissions in t CO₂-e
 * @returns {number} - Gross revenue in A$
 */
function calculateGrossRevenue(carbonPrice, nationalEmissions) {
    // G = P × E
    return carbonPrice * nationalEmissions;
}

/**
 * Calculate annual dividend per adult
 * Formula: Per-adult dividend = (householdRebateShare × nationalEmissions × carbonPrice) ÷ (totalPopulation × adultShare) where:
 * - householdRebateShare is the portion of revenue allocated to households (0-1)
 * - nationalEmissions is the total national emissions in tonnes CO₂-e
 * - carbonPrice is the carbon price in A$/t CO₂-e
 * - totalPopulation is the total population
 * - adultShare is the fraction of the population that are adults (0-1)
 * 
 * @param {number} carbonPrice - Carbon price in A$/t CO₂-e
 * @param {number} nationalEmissions - National emissions in t CO₂-e
 * @param {number} householdRebateShare - Household rebate share (0-1)
 * @param {number} totalPopulation - Total population
 * @param {number} adultShare - Adult share of population (0-1)
 * @returns {number|null} - Annual dividend per adult in A$, or null if population or adultShare is 0 or invalid
 */
function calculatePerAdultDividend(carbonPrice, nationalEmissions, householdRebateShare, totalPopulation, adultShare) {
    // Handle division by zero or invalid inputs
    if (totalPopulation <= 0 || adultShare <= 0 || !isFinite(totalPopulation) || !isFinite(adultShare)) {
        console.warn("Invalid population or adult share for dividend calculation.");
        return null; // Return null to indicate inability to calculate
    }
    
    // Per-adult dividend = (householdRebateShare × nationalEmissions × carbonPrice) ÷ (totalPopulation × adultShare)
    return (householdRebateShare * nationalEmissions * carbonPrice) / (totalPopulation * adultShare);
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
        calculatePerAdultDividend,
        calculateHouseholdDividend,
        calculateExtraCostPerUnit,
        calculateAnnualFuelCost,
        calculateTotalExtraHouseholdCost,
        calculateNetBenefit,
        getMonthlyValue,
        formatCurrency
    };
}
