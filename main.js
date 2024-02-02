// Function to fetch exchange rates using XMLHttpRequest
function fetchExchangeRates() {
  // Get the selected base currency from the HTML element with the id "baseCurrency"
  const baseCurrency = document.getElementById("baseCurrency").value;

  // Create a new XMLHttpRequest object
  const xhr = new XMLHttpRequest();

  // Define a callback function to handle the state change of the XMLHttpRequest
  xhr.onreadystatechange = function () {
    // Check if the request is complete (state 4)
    if (xhr.readyState === 4) {
      // Check if the response status is OK (status 200)
      if (xhr.status === 200) {
        // Parse the JSON response
        const data = JSON.parse(xhr.responseText);
        // Extract exchange rates from the response
        const rates = data.rates;

        // Create a new Web Worker for further processing
        const worker = new Worker("worker.js");

        // Define a callback function to handle messages from the Web Worker
        worker.onmessage = function (e) {
          // Get the processed exchange rates from the Web Worker
          const processedRates = e.data;

          // Display the processed exchange rates in the UI
          displayExchangeRates(processedRates);

          // Terminate the Web Worker as it has completed its task
          worker.terminate();
        };

        // Send base currency and rates to the Web Worker
        worker.postMessage({ baseCurrency, rates });
      } else {
        // Log an error message if there is an issue with the XMLHttpRequest
        console.error("Error fetching data:", xhr.statusText);
      }
    }
  };

  // Open a GET request to the exchange rates API
  xhr.open("GET", "https://open.er-api.com/v6/latest/USD", true);
  // Send the request
  xhr.send();
}

// Function to display processed exchange rates in the UI
function displayExchangeRates(processedRates) {
  // Get the table body element where exchange rates will be displayed
  const tableBody = document.getElementById("exchangeRateTableBody");

  // Clear existing content in the table body
  tableBody.innerHTML = "";

  // Iterate through processed exchange rates and create table rows
  for (const currency in processedRates) {
    const exchangeRate = processedRates[currency];

    // Create a new table row
    const row = document.createElement("tr");

    // Create a table cell for the currency
    const currencyCell = document.createElement("td");
    currencyCell.textContent = currency;

    // Create a table cell for the exchange rate
    const rateCell = document.createElement("td");
    rateCell.textContent = exchangeRate;

    // Append cells to the row
    row.appendChild(currencyCell);
    row.appendChild(rateCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  }
}

// Add an event listener for the DOMContentLoaded event to initiate fetching exchange rates
document.addEventListener("DOMContentLoaded", fetchExchangeRates);
