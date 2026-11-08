
// =====================================
// CURRENCY CONVERTER
// =====================================

// Exchange rates relative to PHP
const exchangeRates = {
    PHP: 1,
    USD: 0.017,
    EUR: 0.015,
    JPY: 2.65
};

// ===== CONVERSION FUNCTION =====

function convertCurrency(amount, fromCurrency, toCurrency) {

    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        return "Invalid currency selected.";
    }

    if (amount < 0 || !Number.isFinite(amount)) {
        return "Please enter a valid amount.";
    }

    // Convert the amount to PHP first
    const amountInPHP = amount / exchangeRates[fromCurrency];

    // Convert PHP to the target currency
    const convertedAmount = amountInPHP * exchangeRates[toCurrency];

    return `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
}

// ===== TESTING =====

console.log("===== CURRENCY CONVERTER =====");

console.log(convertCurrency(1000, "PHP", "USD"));
console.log(convertCurrency(50, "USD", "PHP"));
console.log(convertCurrency(100, "EUR", "JPY"));
console.log(convertCurrency(500, "PHP", "EUR"));
console.log(convertCurrency(100, "ABC", "PHP"));