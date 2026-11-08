
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let savingsGoal = 0;
let currentSavings = 0;

function showMenu() {
    console.log("\n===== SAVINGS GOAL SIMULATOR =====");
    console.log("1. Add Savings");
    console.log("2. View Savings Progress");
    console.log("3. Reset Savings");
    console.log("4. Exit");

    rl.question("\nChoose an option: ", (choice) => {
        switch (choice) {
            case "1":
                addSavings();
                break;

            case "2":
                showProgress();
                break;

            case "3":
                resetSavings();
                break;

            case "4":
                console.log("\nThank you for using Savings Simulator!");
                rl.close();
                break;

            default:
                console.log("Invalid choice. Try again.");
                showMenu();
        }
    });
}

function addSavings() {
    rl.question("Enter amount to save: ₱", (input) => {
        const amount = Number(input);

        if (!Number.isFinite(amount) || amount <= 0) {
            console.log("Please enter a valid positive amount.");
            showMenu();
            return;
        }

        currentSavings += amount;

        console.log("\nSavings successfully added!");
        console.log("Current Savings: ₱" + currentSavings.toFixed(2));

        if (currentSavings >= savingsGoal) {
            console.log("Congratulations! You reached your savings goal!");
        }

        showMenu();
    });
}

function showProgress() {
    const remaining = Math.max(0, savingsGoal - currentSavings);
    const percentage = Math.min(
        100,
        (currentSavings / savingsGoal) * 100
    );

    console.log("\n===== SAVINGS PROGRESS =====");
    console.log("Savings Goal: ₱" + savingsGoal.toFixed(2));
    console.log("Current Savings: ₱" + currentSavings.toFixed(2));
    console.log("Remaining Amount: ₱" + remaining.toFixed(2));
    console.log("Progress: " + percentage.toFixed(2) + "%");

    showMenu();
}

function resetSavings() {
    currentSavings = 0;

    console.log("\nSavings have been reset.");
    showMenu();
}

function startProgram() {
    console.log("Welcome to Savings Goal Simulator!");

    rl.question("Enter your savings goal: ₱", (input) => {
        savingsGoal = Number(input);

        if (!Number.isFinite(savingsGoal) || savingsGoal <= 0) {
            console.log("Please enter a valid positive goal.");
            startProgram();
            return;
        }

        showMenu();
    });
}

startProgram();