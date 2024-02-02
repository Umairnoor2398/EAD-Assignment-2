// worker.js

onmessage = function (e) {
  const baseCurrency = e.data.baseCurrency;
  const rates = e.data.rates;

  // Process the exchange rates
  const processedRates = {};
  for (const currency in rates) {
    let exchangeRate = rates[currency];

    // If PKR is selected, manually calculate exchange rate
    if (baseCurrency === "PKR") {
      exchangeRate = (1 / rates.PKR) * rates[currency];
    }
    exchangeRate = parseFloat(exchangeRate.toFixed(5));

    processedRates[currency] = exchangeRate;
  }

  postMessage(processedRates);
};
