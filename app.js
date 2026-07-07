const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.innerText = currCode;
    option.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }

    select.append(option);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update flags
const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];

  if (countryCode) {
    const img = element.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  }
};

// Get exchange rate from your backend
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = Number(amount.value);

  // Check for empty or non-numeric input
  if (isNaN(amtVal)) {
    msg.innerText = "⚠️ Please enter a valid number.";
    return;
  }

  // Check for negative values
  if (amtVal < 0) {
    msg.innerText = "⚠️ Amount cannot be negative.";
    return;
  }

  // Check for zero
  if (amtVal === 0) {
    msg.innerText = "⚠️ Please enter an amount greater than 0.";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/convert?from=${fromCurr.value}`
    );

    const data = await response.json();

    const rate = data.conversion_rates[toCurr.value];
    const finalAmount = (amtVal * rate).toFixed(2);

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error(error);
    msg.innerText = "Error fetching exchange rate.";
  }
};

// Button click
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// Initial load
window.addEventListener("load", () => {
  dropdowns.forEach((select) => updateFlag(select));
  updateExchangeRate();
});