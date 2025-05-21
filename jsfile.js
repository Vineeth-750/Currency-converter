document.addEventListener("DOMContentLoaded", () => {
  const ACCESS_KEY = '';

  const fromSelect = document.getElementById("from-currency");
  const toSelect = document.getElementById("to-currency");
  const fromFlag = document.getElementById("from-flag");
  const toFlag = document.getElementById("to-flag");

  // Populate dropdowns
  function populateDropdowns() {
    for (let code in countryList) {
      const option1 = document.createElement("option");
      const option2 = document.createElement("option");

      option1.value = code;
      option1.innerText = code;
      option1.setAttribute("data-flag", countryList[code]);

      option2.value = code;
      option2.innerText = code;
      option2.setAttribute("data-flag", countryList[code]);

      fromSelect.appendChild(option1);
      toSelect.appendChild(option2);
    }

    // Set default values
    fromSelect.value = "USD";
    toSelect.value = "INR";
  }

  // Update flag image
  function updateFlag(selectElement, flagImg) {
    const flagCode = selectElement.options[selectElement.selectedIndex].getAttribute("data-flag");
    flagImg.src = `https://flagsapi.com/${flagCode}/flat/64.png`;
  }

  // Initialize
  populateDropdowns();
  updateFlag(fromSelect, fromFlag);
  updateFlag(toSelect, toFlag);

  // Event listeners for flag updates
  fromSelect.addEventListener("change", () => updateFlag(fromSelect, fromFlag));
  toSelect.addEventListener("change", () => updateFlag(toSelect, toFlag));

  // Conversion with async/await
  document.getElementById("convert-btn").addEventListener("click", async () => {
    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = fromSelect.value;
    const toCurrency = toSelect.value;
    const resultBox = document.getElementById("result");

    if (!amount || amount <= 0) {
      resultBox.innerText = "Please enter a valid amount.";
      return;
    }

    const url = `https://api.apilayer.com/exchangerates_data/convert?to=${toCurrency}&from=${fromCurrency}&amount=${amount}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "apikey": ACCESS_KEY
        }
      });

      const data = await response.json();
      console.log(data); // Debug: check API response

      if (data.result) {
        resultBox.innerText = `${amount} ${fromCurrency} = ${data.result.toFixed(2)} ${toCurrency}`;
      } else {
        resultBox.innerText = "Conversion failed. Check API or currencies.";
      }
    } catch (err) {
      console.error(err);
      resultBox.innerText = "Error fetching conversion rate.";
    }
  });
});
