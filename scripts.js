// Select form elements
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// Select list elements
const expenseList = document.querySelector("ul");
const expensesTotal = document.querySelector("main section aside header h2");
const expenseNumber = document.querySelector(
  "main section aside header p span"
);
console.log(expenseNumber);
// Capture the input event to format the value
amount.oninput = () => {
  // Accepting only numbers
  // Obtain the current input value and remove the non-numerical characters
  let value = amount.value.replace(/\D/g, "");

  // Transform value to cents (If the user types 100 -> input will return 1). The input will divide by 100 every time the values updates
  value = Number(value) / 100;

  // update the value
  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  // Format the value to BRL default format
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // Returns the formatted value
  return value;
}

// Getting the form submitted data from the form to get the values
form.onsubmit = (event) => {
  // This avoids the default browser behavior, which refreshes the page after onsubmit event
  event.preventDefault();

  // Creates an object of a new expense
  const newExpense = {
    id: new Date().getTime(),
    name: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };

  // Calls function that will add item to the list
  expenseAdd(newExpense);
};

// Method that adds new items to the list
function expenseAdd(newExpense) {
  try {
    // Create element to add item (li) on the list (ul)
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    // Create the category icon
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `./img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    // Create expense info
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    // Creating expense name
    const expanseName = document.createElement("strong");
    expanseName.textContent = newExpense.name;

    // Creates expend category
    const expanseCategory = document.createElement("span");
    expanseCategory.textContent = newExpense.category_name;

    // Creates expenseAmount
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");

    // Creates small
    const expenseSmall = document.createElement("small");
    expenseAmount.textContent = newExpense.amount;

    // Creates removeIcon
    const removeIcon = document.createElement("img");
    removeIcon.setAttribute("src", "./img/remove.svg");
    removeIcon.setAttribute("alt", "remover");
    removeIcon.classList.add("remove-icon");

    // Adds small to expenseAmount
    expenseAmount.append(expenseSmall);

    // Adds name and category to expanse information div
    expenseInfo.append(expanseName, expanseCategory);

    // Adds the item information
    expenseItem.append(expenseIcon, expenseInfo);

    // Adds expenseAmount to expanseItem
    expenseItem.append(expenseAmount);

    // Adds removeIcon tp expanseItem
    expenseItem.append(removeIcon);

    // Adds item to list
    expenseList.append(expenseItem);
  } catch (error) {
    alert("Error while updating expense list");
    console.log(error.name);
  }

  updateTotals();

  // Clears the input to add a new item
  clearInputs();
}

// Updates totals
function updateTotals() {
  try {
    // Recovers all the items (li) of the list (ul)
    const items = expenseList.children;
    expenseNumber.innerText = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;
    // Variable to increment total
    let total = 0;

    // Loops through every item (li) of the list (ul)
    for (let i = 0; i < items.length; i++) {
      const itemAmount = items[i].querySelector(".expense-amount");

      // Remove non-numeric characters and replace comma to dot
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      // Convert value to float
      value = parseFloat(value);

      // verify if it is a valid number
      if (isNaN(value)) {
        return alert(
          "Error while calculating total. The value might not be a number."
        );
      }
      total += Number(value);
    }

    //  Create span to add formatted R$
    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    // Formats the value and removes "R$" that was shown by small with a custom style
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    // Cleans the element's content
    expensesTotal.innerHTML = "";

    // Adds currency symbol and formatted total value
    expensesTotal.append(symbolBRL, total);
  } catch (error) {
    console.log(error);
    alert("Error while updating the totals");
  }
}

// Event that listens to list items
expenseList.addEventListener("click", (event) => {
  // Verifies if the clicked element is the remove icon
  console.log(event.target);
  if (event.target.classList.contains("remove-icon")) {
    // Get the li above the clicked element
    const item = event.target.closest(".expense");

    // Removes the item inside the list
    item.remove();
  }

  // Updates the quantity and the totals
  updateTotals();
  // if (event.target.classList.contains("remove-icon")) {
  //   event.target.closest("li").remove();
  // }
});

function clearInputs() {
  // Clear the inputs
  amount.value = "";
  expense.value = "";
  category.value = "";

  // Insert a focus on the expense input
  expense.focus();
}
