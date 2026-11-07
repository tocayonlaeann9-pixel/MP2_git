
/* =====================================
   ALLOWANCE TRACKER
   PART 1 - SETUP AND STORAGE
===================================== */

// ===== DOM ELEMENTS =====

const form = document.getElementById("transactionForm");

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");

const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");
const expenseDisplay = document.getElementById("expense");

const transactionList = document.getElementById("transactionList");

const searchTransaction = document.getElementById("searchTransaction");
const sortTransaction = document.getElementById("sortTransaction");

const filterButtons = document.querySelectorAll(".filter-btn");

const submitTransaction = document.getElementById("submitTransaction");
const cancelEdit = document.getElementById("cancelEdit");

// ===== MONTHLY BUDGET ELEMENTS =====

const budgetAmountDisplay = document.getElementById("budgetAmount");
const monthlySpentDisplay = document.getElementById("monthlySpent");
const budgetLeftDisplay = document.getElementById("budgetLeft");
const budgetProgress = document.getElementById("budgetProgress");
const budgetMessage = document.getElementById("budgetMessage");

// ===== DARK MODE =====

const themeToggle = document.getElementById("themeToggle");

// ===== LOAD SAVED TRANSACTIONS =====

let transactions = [];

try {
    const savedTransactions =
        localStorage.getItem("allowanceTransactions");

    if (savedTransactions) {
        const parsedTransactions = JSON.parse(savedTransactions);

        if (Array.isArray(parsedTransactions)) {
            transactions = parsedTransactions;
        }
    }
} catch (error) {
    console.error("Error loading transactions:", error);
}

let editingTransactionId = null;s
let activeFilter = "all";

// ===== SAVE TRANSACTIONS =====

function saveTransactions() {
    try {
        localStorage.setItem(
            "allowanceTransactions",
            JSON.stringify(transactions)
        );

        return true;

    } catch (error) {
        console.error("Error saving transactions:", error);

        alert("Unable to save your transactions. Check your browser storage.");

        return false;
    }
}

// ===== FORMAT MONEY =====

function formatMoney(amount) {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP"
    }).format(Number(amount) || 0);
}

// ===== GET TODAY'S DATE =====

function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// ===== PARSE TRANSACTION DATE =====

function parseTransactionDate(dateString) {
    if (!dateString) return null;

    // Handle YYYY-MM-DD without timezone shifting
    const dateOnly = String(dateString).match(
        /^(\d{4})-(\d{2})-(\d{2})$/
    );

    if (dateOnly) {
        return new Date(
            Number(dateOnly[1]),
            Number(dateOnly[2]) - 1,
            Number(dateOnly[3])
        );
    }

    // Handle older MM/DD/YYYY dates
    const oldDate = String(dateString).match(
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    );

    if (oldDate) {
        return new Date(
            Number(oldDate[3]),
            Number(oldDate[1]) - 1,
            Number(oldDate[2])
        );
    }

    const parsed = new Date(dateString);

    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/* =====================================
   PART 2 - ADD AND UPDATE TRANSACTIONS
===================================== */

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;

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

    if (editingTransactionId !== null) {

        const index = transactions.findIndex(function(item) {
            return item.id === editingTransactionId;
        });

        if (index !== -1) {
            transactions[index].description = description;
            transactions[index].amount =
                Math.round(amount * 100) / 100;
            transactions[index].type = type;
            transactions[index].category = category;
        }

        editingTransactionId = null;

        submitTransaction.textContent = "+ Add Transaction";
        cancelEdit.style.display = "none";

    } else {

        const transaction = {
            id: Date.now().toString() +
                Math.random().toString(36).slice(2),

            description: description,
            amount: Math.round(amount * 100) / 100,
            type: type,
            category: category,
            date: getTodayDate()
        };

        transactions.push(transaction);
    }

    saveTransactions();
    updateDashboard();
    displayTransactions();

    form.reset();
});

// ===== UPDATE DASHBOARD =====

function updateDashboard() {

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function(transaction) {

        const amount = Number(transaction.amount) || 0;

        if (transaction.type === "income") {
            totalIncome += amount;

        } else if (transaction.type === "expense") {
            totalExpense += amount;
        }
    });

    const balance = totalIncome - totalExpense;

    balanceDisplay.textContent = formatMoney(balance);
    incomeDisplay.textContent = formatMoney(totalIncome);
    expenseDisplay.textContent = formatMoney(totalExpense);

    updateBudget();
}


/* =====================================
   PART 3 - DISPLAY TRANSACTIONS
===================================== */

function displayTransactions() {

    transactionList.innerHTML = "";

    if (transactions.length === 0) {
        transactionList.innerHTML =
            '<p class="empty">No transactions yet.</p>';
        return;
    }

    const searchText =
        searchTransaction.value.toLowerCase().trim();

    // ===== SEARCH AND FILTER =====

    const filteredTransactions = transactions.filter(
        function(transaction) {

            const description =
                (transaction.description || "").toLowerCase();

            const category =
                (transaction.category || "").toLowerCase();

            const matchesSearch =
                description.includes(searchText) ||
                category.includes(searchText);

            const matchesType =
                activeFilter === "all" ||
                transaction.type === activeFilter;

            return matchesSearch && matchesType;
        }
    );

    if (filteredTransactions.length === 0) {
        transactionList.innerHTML =
            '<p class="empty">No matching transactions found.</p>';
        return;
    }

    // ===== SORT TRANSACTIONS =====

    const sortOrder = sortTransaction.value;

    const sortedTransactions = filteredTransactions
        .map(function(transaction, index) {
            return {
                transaction: transaction,
                originalIndex: index
            };
        });

    sortedTransactions.sort(function(a, b) {

        const dateA = parseTransactionDate(a.transaction.date);
        const dateB = parseTransactionDate(b.transaction.date);

        const timeA = dateA ? dateA.getTime() : 0;
        const timeB = dateB ? dateB.getTime() : 0;

        if (timeA !== timeB) {

            return sortOrder === "oldest"
                ? timeA - timeB
                : timeB - timeA;
        }

        // Same date: preserve insertion order for oldest,
        // and show more recently added transactions first for newest.
        return sortOrder === "oldest"
            ? a.originalIndex - b.originalIndex
            : b.originalIndex - a.originalIndex;
    });

    // ===== DISPLAY TRANSACTIONS =====

    sortedTransactions.forEach(function(entry) {

        const transaction = entry.transaction;

        const item = document.createElement("div");
        item.className = "transaction";

        const info = document.createElement("div");
        info.className = "transaction-info";

        const title = document.createElement("strong");
        title.textContent = transaction.description || "";

        const date = document.createElement("small");

        date.textContent =
            (transaction.category || "Uncategorized") +
            " • " +
            (transaction.date || "");

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

        // ===== EDIT BUTTON =====

        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.className = "edit-btn";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function() {
            startEditTransaction(transaction.id);
        });

        // ===== DELETE BUTTON =====

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            deleteTransaction(transaction.id);
        });

        actions.appendChild(editButton);
        actions.appendChild(amount);
        actions.appendChild(deleteButton);

        item.appendChild(info);
        item.appendChild(actions);

        transactionList.appendChild(item);
    });
}

/* =====================================
   PART 4 - EDIT, DELETE AND FILTERS
===================================== */

// ===== START EDIT =====

function startEditTransaction(id) {

    const transaction = transactions.find(function(item) {
        return item.id === id;
    });

    if (!transaction) return;

    descriptionInput.value = transaction.description;
    amountInput.value = transaction.amount;
    typeInput.value = transaction.type;
    categoryInput.value = transaction.category;

    editingTransactionId = id;

    submitTransaction.textContent = "Update Transaction";
    cancelEdit.style.display = "inline-block";

    form.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

// ===== CANCEL EDIT =====

cancelEdit.addEventListener("click", function() {

    form.reset();

    editingTransactionId = null;

    submitTransaction.textContent = "+ Add Transaction";
    cancelEdit.style.display = "none";
});

// ===== DELETE TRANSACTION =====

function deleteTransaction(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) return;

    transactions = transactions.filter(function(transaction) {
        return transaction.id !== id;
    });

    if (editingTransactionId === id) {

        editingTransactionId = null;

        form.reset();

        submitTransaction.textContent = "+ Add Transaction";
        cancelEdit.style.display = "none";
    }

    saveTransactions();
    updateDashboard();
    displayTransactions();
}

// ===== SEARCH =====

searchTransaction.addEventListener("input", function() {
    displayTransactions();
});

// ===== SORT =====

sortTransaction.addEventListener("change", function() {
    displayTransactions();
});

// ===== FILTER =====

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        activeFilter = button.dataset.filter;

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        displayTransactions();
    });
});

/* =====================================
   PART 5 - BUDGET, DARK MODE AND STARTUP
===================================== */

// ===== AUTOMATIC MONTHLY BUDGET =====

function updateBudget() {

    const now = new Date();

    // Calculate this month's allowance
    const monthlyAllowance = transactions
        .filter(function(item) {

            const date = parseTransactionDate(item.date);

            return (
                item.type === "income" &&
                date !== null &&
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear()
            );
        })
        .reduce(function(total, item) {
            return total + (Number(item.amount) || 0);
        }, 0);

    // Calculate this month's expenses
    const monthlyExpenses = transactions
        .filter(function(item) {

            const date = parseTransactionDate(item.date);

            return (
                item.type === "expense" &&
                date !== null &&
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear()
            );
        })
        .reduce(function(total, item) {
            return total + (Number(item.amount) || 0);
        }, 0);

    const budgetLeft = monthlyAllowance - monthlyExpenses;

    // Update budget details
    budgetAmountDisplay.textContent =
        formatMoney(monthlyAllowance);

    monthlySpentDisplay.textContent =
        formatMoney(monthlyExpenses);

    budgetLeftDisplay.textContent =
        formatMoney(budgetLeft);

    // Update progress bar
    const percentage = monthlyAllowance > 0
        ? (monthlyExpenses / monthlyAllowance) * 100
        : 0;

    budgetProgress.style.width =
        Math.min(percentage, 100) + "%";

    // Update message
    if (monthlyAllowance === 0) {

        budgetMessage.textContent =
            "Add your allowance to start tracking your monthly budget.";

    } else if (percentage >= 100) {

        budgetMessage.textContent =
            "You have reached or exceeded your monthly allowance.";

    } else if (percentage >= 80) {

        budgetMessage.textContent =
            "Warning: You are getting close to your budget limit.";

    } else {

        budgetMessage.textContent =
            "You are within your monthly budget.";
    }
}

// ===== DARK MODE =====

function updateThemeButton() {

    const isDark =
        document.documentElement.classList.contains("dark-mode");

    themeToggle.textContent =
        isDark ? "☀️ Light Mode" : "🌙 Dark Mode";

    themeToggle.setAttribute("aria-pressed", isDark);

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

// ===== INITIALIZE APPLICATION =====

function initializeApp() {

    // Restore saved theme
    const savedTheme = localStorage.getItem("allowanceTheme");

    if (savedTheme === "dark") {
        document.documentElement.classList.add("dark-mode");
    } else {
        document.documentElement.classList.remove("dark-mode");
    }

    updateDashboard();
    displayTransactions();
    updateThemeButton();
}

initializeApp();