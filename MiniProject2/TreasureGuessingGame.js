
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const locations = [
    {
        name: "Forest",
        clue: "I am filled with trees and wildlife."
    },
    {
        name: "Beach",
        clue: "I have sand, waves, and a beautiful ocean."
    },
    {
        name: "Mountain",
        clue: "I am tall and often covered with forests."
    },
    {
        name: "Desert",
        clue: "I am dry and covered with sand."
    }
];

const treasure = locations[
    Math.floor(Math.random() * locations.length)
];

let attempts = 3;

console.log("===== TREASURE GUESSING GAME =====");
console.log("Find the hidden treasure location!");
console.log(`Clue: ${treasure.clue}`);

function guessLocation() {
    if (attempts === 0) {
        console.log("\nGame Over!");
        console.log(`The treasure was hidden in the ${treasure.name}.`);
        rl.close();
        return;
    }

    rl.question("\nGuess the location: ", (guess) => {

        if (guess.trim().toLowerCase() === treasure.name.toLowerCase()) {
            console.log("\nCongratulations! You found the treasure!");
            console.log(`Location: ${treasure.name}`);
            rl.close();
        } else {
            attempts--;

            if (attempts > 0) {
                console.log("Wrong guess!");
                console.log(`Attempts remaining: ${attempts}`);
                guessLocation();
            } else {
                guessLocation();
            }
        }
    });
}

guessLocation();