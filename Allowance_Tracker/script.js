
const form = document.getElementById("transactionForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");

const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");
const expenseDisplay = document.getElementById("expense");
const transactionList = document.getElementById("transactionList");

// Monthly Budget Elements
const budgetInput = document.getElementById("monthlyBudget");
const saveBudgetBtn = document.getElementById("saveBudget");

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

// Get today's LOCAL date
function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Add new transaction
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

    // Create transaction
    const transaction = {
        id: crypto.randomUUID(),
        description: description,
        amount: Math.round(amount * 100) / 100,
        type: type,
        category: category,
        date: getTodayDate()
    };

    // Add to transaction list
    transactions.push(transaction);

    // Save changes
    saveTransactions();

    // Update dashboard and budget
    updateDashboard();
    displayTransactions();

    // Clear form
    form.reset();

});

// Update dashboard
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

    // Update monthly budget automatically
    updateBudget();
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

        date.textContent =
            (transaction.category || "Uncategorized") +
            " • " +
            transaction.date;

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

    // Refresh everything
    updateDashboard();
    displayTransactions();
}

// Save monthly budget
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

// Convert transaction date
function parseTransactionDate(dateString) {

    if (typeof dateString !== "string") {
        return null;
    }

    let year, month, day;

    // New format: YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {

        [year, month, day] = dateString.split("-").map(Number);

    }
    // Old format: DD/MM/YYYY or MM/DD/YYYY
    else if (dateString.includes("/")) {

        const parts = dateString.split("/").map(Number);

        if (parts.length !== 3) return null;

        // Existing en-PH records use MM/DD/YYYY
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

// Update monthly budget
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

        if (!transactionDate) return;

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

// Initialize Allowance Tracker

function initializeApp() {

    // Display total allowance, expenses, and balance
    updateDashboard();

    // Display saved transaction history
    displayTransactions();

}

// Start application
initializeApp();

/* ===== DARK MODE TOGGLE ===== */

const themeToggle = document.getElementById("themeToggle");

function updateThemeButton() {
    const isDark = document.documentElement.classList.contains("dark-mode");

    themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );
}

themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark-mode");

    const isDark = document.documentElement.classList.contains("dark-mode");

    localStorage.setItem("allowanceTheme", isDark ? "dark" : "light");

    updateThemeButton();
});

updateThemeButton();