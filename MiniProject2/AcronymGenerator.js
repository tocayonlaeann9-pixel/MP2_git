
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("===== ACRONYM GENERATOR =====");

rl.question("Enter a phrase: ", (phrase) => {

    if (phrase.trim() === "") {
        console.log("Please enter a valid phrase.");
    } else {
        const acronym = phrase
            .trim()
            .split(/\s+/)
            .map(word => word[0].toUpperCase())
            .join("");

        console.log("\n===== RESULT =====");
        console.log(`Original Phrase: ${phrase}`);
        console.log(`Generated Acronym: ${acronym}`);
    }

    rl.close();
});