/**
 * Payroll Calculation Helper Utilities
 */

/**
 * Get total days in a month (e.g., Feb 2024 = 29)
 * @param {number} year 
 * @param {number} month (1-12)
 * @returns {number}
 */
export const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
};

/**
 * Get number of Sundays in a specific month
 * @param {number} year 
 * @param {number} month (1-12)
 * @returns {number}
 */
export const getSundaysInMonth = (year, month) => {
    let count = 0;
    const days = getDaysInMonth(year, month);
    for (let i = 1; i <= days; i++) {
        if (new Date(year, month - 1, i).getDay() === 0) {
            count++;
        }
    }
    return count;
};

/**
 * Standard Indian Public Holidays (Example - Can be made dynamic/fetched)
 * Format: "MM-DD"
 */

export const DEFAULT_HOLIDAYS = [
    "01-01", // New Year
    "01-26", // Republic Day
    "05-01", // May Day
    "08-15", // Independence Day
    "10-02", // Gandhi Jayanti
    "11-01", // Karnataka Rajyotsava (Example)
    "12-25", // Christmas
];

/**
 * Get Holidays in a month (excluding Sundays to avoid double counting)
 * @param {number} year 
 * @param {number} month (1-12)
 * @param {string[]} customHolidays List of "YYYY-MM-DD" or "MM-DD"
 * @returns {number}
 */
export const getHolidaysInMonth = (year, month, customHolidays = DEFAULT_HOLIDAYS) => {
    let count = 0;
    const daysInMonth = getDaysInMonth(year, month);

    // Normalize custom holidays to strings if they are objects/dates
    const normalizedHolidays = customHolidays.map(h => String(h));

    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month - 1, i);
        const day = date.getDay();
        const dateStrShort = `${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dateStrLong = `${year}-${dateStrShort}`;

        // If it's a holiday AND not a Sunday (Sunday is already excluded from working days)
        if (day !== 0) {
            if (normalizedHolidays.includes(dateStrShort) || normalizedHolidays.includes(dateStrLong)) {
                count++;
            }
        }
    }
    return count;
};

/**
 * Calculate Total Working Days (Calendar Days - Sundays)
 * Note: Holidays are often treated as "paid days" so they are effectively part of the working days 
 * pool but the user's logic says: "if that holiday covert to working day and give salary of day it easy for calaculated"
 * 
 * Logic based on user request:
 * Working Days = Calendar Days - Sundays
 * Total Paid Days = Working Days - LOP Days (Holidays are counted as worked/paid)
 * 
 * @param {number} year 
 * @param {number} month (1-12)
 * @returns {number}
 */
export const calculateTotalWorkingDays = (year, month) => {
    const totalDays = getDaysInMonth(year, month);
    const sundays = getSundaysInMonth(year, month);
    return totalDays - sundays;
};

/**
 * Calculate prorated amount based on formula: (Monthly Component * Paid Days) / Total Working Days
 * @param {number} monthlyAmount 
 * @param {number} paidDays 
 * @param {number} totalWorkingDays 
 * @returns {number}
 */
export const calculateProratedAmount = (monthlyAmount, paidDays, totalWorkingDays) => {
    if (!totalWorkingDays || totalWorkingDays === 0) return 0;
    return Math.round((monthlyAmount * paidDays) / totalWorkingDays);
};

/**
 * Calculate Net Pay
 * @param {Object} salaryData 
 * @returns {number}
 */
export const calculateNetPay = (salaryData) => {
    const earnings =
        Number(salaryData.basic || 0) +
        // Number(salaryData.hra || 0) +
        Number(salaryData.otherAllowance || 0) +
        Number(salaryData.specialPay || 0) +
        Number(salaryData.incentive || 0);

    const deductions =
        Number(salaryData.tds || 0) +
        Number(salaryData.otherDeductions || 0);

    return earnings - deductions;
};
