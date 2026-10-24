
const form = document.getElementById("transactionForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");

const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");
const expenseDisplay = document.getElementById("expense");
const transactionList = document.getElementById("transactionList");

// Load saved transactions
let transactions = [];

try {
    const saved = JSON.parse(
        localStorage.getItem("allowanceTransactions")
    );

    if (Array.isArray(saved)) {
        transactions = saved;
    }
} catch (error) {
    console.error("Unable to load saved transactions:", error);
}

// Format amount into Philippine Peso
function formatMoney(amount) {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP"
    }).format(amount);
}

// Save transactions
function saveTransactions() {
    localStorage.setItem(
        "allowanceTransactions",
        JSON.stringify(transactions)
    );
}

// Add transaction
form.addEventListener("submit", function(event) {

    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    if (
        description === "" ||
        !Number.isFinite(amount) ||
        amount <= 0 ||
        !["income", "expense"].includes(type)
    ) {
        alert("Please enter valid transaction details.");
        return;
    }

    const transaction = {
        id: crypto.randomUUID(),
        description: description,
        amount: Math.round(amount * 100) / 100,
        type: type,
        date: new Date().toLocaleDateString("en-PH")
    };

    transactions.push(transaction);

    saveTransactions();
    updateDashboard();
    displayTransactions();

    form.reset();

});

// Update dashboard
function updateDashboard() {

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }

    });

    const balance = totalIncome - totalExpense;

    balanceDisplay.textContent = formatMoney(balance);
    incomeDisplay.textContent = formatMoney(totalIncome);
    expenseDisplay.textContent = formatMoney(totalExpense);

}

// Display transaction history
function displayTransactions() {

    transactionList.innerHTML = "";

    if (transactions.length === 0) {
        transactionList.innerHTML =
            '<p class="empty">No transactions yet.</p>';
        return;
    }

    [...transactions].reverse().forEach(function(transaction) {

        const item = document.createElement("div");
        item.className = "transaction";

        const info = document.createElement("div");
        info.className = "transaction-info";

        const title = document.createElement("strong");
        title.textContent = transaction.description;

        const date = document.createElement("small");
        date.textContent = transaction.date;

        info.appendChild(title);
        info.appendChild(document.createElement("br"));
        info.appendChild(date);

        const actions = document.createElement("div");
        actions.className = "transaction-actions";

        const amount = document.createElement("span");

        amount.className =
            transaction.type === "income"
                ? "positive"
                : "negative";

        amount.textContent =
            (transaction.type === "income" ? "+ " : "- ") +
            formatMoney(transaction.amount);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            deleteTransaction(transaction.id);
        });

        actions.appendChild(amount);
        actions.appendChild(deleteButton);

        item.appendChild(info);
        item.appendChild(actions);

        transactionList.appendChild(item);

    });

}

// Delete transaction
function deleteTransaction(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) {
        return;
    }

    transactions = transactions.filter(function(transaction) {
        return transaction.id !== id;
    });

    saveTransactions();
    updateDashboard();
    displayTransactions();

}

// Initial display
updateDashboard();
displayTransactions();