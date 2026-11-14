
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("===== RESTAURANT BILL SPLITTER =====");

rl.question("Enter total bill: PHP ", (billInput) => {
    rl.question("Enter tip percentage: ", (tipInput) => {
        rl.question("Enter number of people: ", (peopleInput) => {

            const bill = Number(billInput);
            const tip = Number(tipInput);
            const people = Number(peopleInput);

            if (
                !Number.isFinite(bill) || bill <= 0 ||
                !Number.isFinite(tip) || tip < 0 ||
                !Number.isInteger(people) || people <= 0
            ) {
                console.log("Invalid input. Please try again.");
            } else {
                const tipAmount = bill * (tip / 100);
                const totalBill = bill + tipAmount;
                const share = totalBill / people;

                console.log("\n===== BILL SUMMARY =====");
                console.log(`Original Bill: PHP ${bill.toFixed(2)}`);
                console.log(`Tip Amount: PHP ${tipAmount.toFixed(2)}`);
                console.log(`Total Bill: PHP ${totalBill.toFixed(2)}`);
                console.log(`People: ${people}`);
                console.log(`Each Person Pays: PHP ${share.toFixed(2)}`);
            }

            rl.close();
        });
    });
});