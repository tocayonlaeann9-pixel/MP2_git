
/* ===== ALLOWANCE TRACKER ===== */

// Transaction form elements
const form = document.getElementById("transactionForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");

// Dashboard elements
const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");
const expenseDisplay = document.getElementById("expense");

// Transaction history and search
const transactionList = document.getElementById("transactionList");
const searchTransaction = document.getElementById("searchTransaction");

// Monthly budget elements
const budgetInput = document.getElementById("monthlyBudget");
const saveBudgetBtn = document.getElementById("saveBudget");

// Dark mode button
const themeToggle = document.getElementById("themeToggle");

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
    console.error("Unable to load transactions:", error);
}

// Load saved monthly budget
let monthlyBudget = Number(
    localStorage.getItem("monthlyBudget")
) || 0;

// Format Philippine Peso
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

// Get today's local date
function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return $`{year}-${month}-${day}`;
}

/* ===== ADD TRANSACTION ===== */

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;

    // Validate inputs
    if (
        description === "" ||
        !Number.isFinite(amount) ||
        amount <= 0 ||
        !["income", "expense"].includes(type) ||
        category === ""
    ) {
        alert("Please enter valid transaction details.");
        return;
    }

    // Create new transaction
    const transaction = {
        id: crypto.randomUUID(),
        description: description,
        amount: Math.round(amount * 100) / 100,
        type: type,
        category: category,
        date: getTodayDate()
    };

    transactions.push(transaction);

    // Save and refresh
    saveTransactions();
    updateDashboard();
    displayTransactions();

    // Clear form
    form.reset();
});


/* ===== UPDATE DASHBOARD ===== */

function updateDashboard() {

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else if (transaction.type === "expense") {
            totalExpense += transaction.amount;
        }

    });

    const balance = totalIncome - totalExpense;

    balanceDisplay.textContent = formatMoney(balance);
    incomeDisplay.textContent = formatMoney(totalIncome);
    expenseDisplay.textContent = formatMoney(totalExpense);

    // Update monthly budget too
    updateBudget();
}

/* ===== DISPLAY AND SEARCH TRANSACTIONS ===== */

function displayTransactions() {

    transactionList.innerHTML = "";

    // Check if there are saved transactions
    if (transactions.length === 0) {
        transactionList.innerHTML =
            '<p class="empty">No transactions yet.</p>';
        return;
    }

    // Get text entered in the search bar
    const searchText = searchTransaction.value.toLowerCase().trim();

    // Filter by description or category
    const filteredTransactions = transactions.filter(function(transaction) {

        const description =
            (transaction.description || "").toLowerCase();

        const category =
            (transaction.category || "").toLowerCase();

        return (
            description.includes(searchText) ||
            category.includes(searchText)
        );
    });

    // Show message if no transactions match
    if (filteredTransactions.length === 0) {
        transactionList.innerHTML =
            '<p class="empty">No matching transactions found.</p>';
        return;
    }

    // Display newest transactions first
    [...filteredTransactions].reverse().forEach(function(transaction) {

        const item = document.createElement("div");
        item.className = "transaction";

        // Transaction information
        const info = document.createElement("div");
        info.className = "transaction-info";

        const title = document.createElement("strong");
        title.textContent = transaction.description;

        const date = document.createElement("small");
        date.textContent =
            (transaction.category || "Uncategorized") +
            " • " +
            transaction.date;

        info.appendChild(title);
        info.appendChild(document.createElement("br"));
        info.appendChild(date);

        // Transaction amount and actions
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

        // Delete button
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


/* ===== REAL-TIME SEARCH ===== */

searchTransaction.addEventListener("input", displayTransactions);


/* ===== DELETE TRANSACTION ===== */

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

/* ===== SAVE MONTHLY BUDGET ===== */

saveBudgetBtn.addEventListener("click", function() {

    const amount = Number(budgetInput.value);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid budget amount.");
        return;
    }

    monthlyBudget = amount;

    localStorage.setItem(
        "monthlyBudget",
        monthlyBudget
    );

    budgetInput.value = "";

    updateBudget();
});


/* ===== CONVERT TRANSACTION DATE ===== */

function parseTransactionDate(dateString) {

    if (typeof dateString !== "string") {
        return null;
    }

    let year, month, day;

    // New format: YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {

        [year, month, day] = dateString.split("-").map(Number);

    }
    // Older saved records: MM/DD/YYYY
    else if (dateString.includes("/")) {

        const parts = dateString.split("/").map(Number);

        if (parts.length !== 3) {
            return null;
        }

        [month, day, year] = parts;

    } else {
        return null;
    }

    const parsed = new Date(year, month - 1, day);

    // Reject invalid dates
    if (
        parsed.getFullYear() !== year ||
        parsed.getMonth() !== month - 1 ||
        parsed.getDate() !== day
    ) {
        return null;
    }

    return parsed;
}


/* ===== UPDATE MONTHLY BUDGET ===== */

function updateBudget() {

    const now = new Date();

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let monthlySpent = 0;

    transactions.forEach(function(transaction) {

        if (transaction.type !== "expense") {
            return;
        }

        const transactionDate =
            parseTransactionDate(transaction.date);

        if (!transactionDate) {
            return;
        }

        if (
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
        ) {
            monthlySpent += transaction.amount;
        }
    });

    const budgetLeft = monthlyBudget - monthlySpent;

    const percentage = monthlyBudget > 0
        ? (monthlySpent / monthlyBudget) * 100
        : 0;

    document.getElementById("budgetAmount").textContent =
        formatMoney(monthlyBudget);

    document.getElementById("monthlySpent").textContent =
        formatMoney(monthlySpent);

    document.getElementById("budgetLeft").textContent =
        formatMoney(budgetLeft);

    // Update progress bar
    const progress = document.getElementById("budgetProgress");

    progress.style.width =
        Math.min(percentage, 100) + "%";

    // Display budget message
    const message = document.getElementById("budgetMessage");

    if (monthlyBudget === 0) {

        message.textContent =
            "Set your monthly budget to get started.";

    } else if (percentage >= 100) {

        message.textContent =
            "You have reached or exceeded your monthly budget!";

    } else if (percentage >= 80) {

        message.textContent =
            "You are getting close to your monthly budget.";

    } else {

        message.textContent =
            "Your spending is within your monthly budget.";

    }
}

/* ===== DARK MODE TOGGLE ===== */

function updateThemeButton() {

    const isDark =
        document.documentElement.classList.contains("dark-mode");

    themeToggle.textContent =
        isDark ? "☀️ Light Mode" : "🌙 Dark Mode";

    themeToggle.setAttribute(
        "aria-pressed",
        String(isDark)
    );

    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );
}

themeToggle.addEventListener("click", function() {

    document.documentElement.classList.toggle("dark-mode");

    const isDark =
        document.documentElement.classList.contains("dark-mode");

    localStorage.setItem(
        "allowanceTheme",
        isDark ? "dark" : "light"
    );

    updateThemeButton();
});


/* ===== INITIALIZE APPLICATION ===== */

function initializeApp() {

    // Load dashboard totals and budget
    updateDashboard();

    // Display saved transactions
    displayTransactions();

    // Display correct theme button label
    updateThemeButton();
}

// Start Allowance Tracker
initializeApp();