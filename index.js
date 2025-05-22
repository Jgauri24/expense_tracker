const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const addTransaction = (e) => {
  e.preventDefault();
  const description = descriptionEl.value.trim();
  const amount = parseFloat(amountEl.value);
  transactions.push({
    id: Date.now(),
    description: description,
    amount: amount,
  });
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateTransaction();
  updateSummary();
  transactionFormEl.reset();
};
function updateTransaction() {
  transactionListEl.innerHTML = "";
  const sortedTransaction = [...transactions].reverse();
  sortedTransaction.forEach((transaction) => {
    const transactionEl = createTransactionEl(transaction);
    transactionListEl.appendChild(transactionEl);
  });
}

function createTransactionEl(transaction) {
  const li = document.createElement("li");
  li.classList.add("transaction");
  li.classList.add(transaction.amount > 0 ? "income" : "expense");
  li.innerHTML = `
    <span>
    ${transaction.description}
    </span>
    <span>
    ${formatCurrency(transaction.amount)}
  
    <button class="delete-btn" onClick="removeTransaction(${
      transaction.id
    })">x</button>
      </span>`;
  return li;
}
function removeTransaction(id) {
  transactions = transactions.filter((el) => el.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateTransaction();
  updateSummary();
}

function updateSummary() {
  const balance = transactions.reduce((acc, el) => acc + el.amount, 0);
  const income = transactions
    .filter((el) => el.amount > 0)
    .reduce((acc, el) => acc + el.amount, 0);
  const expense = transactions
    .filter((el) => el.amount < 0)
    .reduce((acc, el) => acc + el.amount, 0);
  balanceEl.textContent = formatCurrency(balance);
  incomeAmountEl.textContent = formatCurrency(income);
  expenseAmountEl.textContent = formatCurrency(Math.abs(expense));
}
function formatCurrency(number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
}
updateSummary();
updateTransaction();

transactionFormEl.addEventListener("submit", addTransaction);