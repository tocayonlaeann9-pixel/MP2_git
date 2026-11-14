
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const queue = [];
let nextNumber = 1;

console.log("===== QUEUE MANAGEMENT SYSTEM =====");

function showMenu() {
    console.log("\n===== MAIN MENU =====");
    console.log("1. Add Customer");
    console.log("2. Serve Next Customer");
    console.log("3. View Queue");
    console.log("4. Exit");

    rl.question("\nChoose an option: ", (choice) => {

        switch (choice) {
            case "1":
                addCustomer();
                break;

            case "2":
                serveCustomer();
                break;

            case "3":
                viewQueue();
                break;

            case "4":
                console.log("\nThank you for using the system!");
                rl.close();
                break;

            default:
                console.log("Invalid choice. Please try again.");
                showMenu();
        }
    });
}

function addCustomer() {
    rl.question("Enter customer name: ", (name) => {

        if (name.trim() === "") {
            console.log("Customer name cannot be empty.");
        } else {
            const customer = {
                number: nextNumber,
                name: name.trim()
            };

            queue.push(customer);

            console.log("\nCustomer added successfully!");
            console.log(`Queue Number: ${nextNumber}`);
            console.log(`Customer Name: ${name.trim()}`);

            nextNumber++;
        }

        showMenu();
    });
}

function serveCustomer() {
    if (queue.length === 0) {
        console.log("\nNo customers in the queue.");
    } else {
        const customer = queue.shift();

        console.log("\nNow serving:");
        console.log(`Queue Number: ${customer.number}`);
        console.log(`Customer Name: ${customer.name}`);
    }

    showMenu();
}

function viewQueue() {
    console.log("\n===== CURRENT QUEUE =====");

    if (queue.length === 0) {
        console.log("The queue is currently empty.");
    } else {
        queue.forEach((customer, index) => {
            console.log(` ${index + 1}. #${customer.number} - ${customer.name}`);
        });

        console.log(`\nTotal Customers: ${queue.length}`);
    }

    showMenu();
}

showMenu();