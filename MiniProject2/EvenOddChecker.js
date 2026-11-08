
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("===== EVEN OR ODD CHECKER =====");

rl.question("Enter a number: ", (input) => {
    const number = Number(input);

    if (input.trim() === "" || !Number.isInteger(number)) {
        console.log("Please enter a valid whole number.");
    } 
    else if (number % 2 === 0) {
        console.log(`${number} is an EVEN number.`);
    } 
    else {
        console.log(`${number} is an ODD number.`);
    }

    rl.close();
});