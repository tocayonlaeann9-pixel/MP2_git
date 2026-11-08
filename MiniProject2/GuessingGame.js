
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

console.log("===== NUMBER GUESSING GAME =====");
console.log("Guess a number between 1 and 100!");

function playGame() {
    rl.question("Enter your guess: ", (input) => {
        let guess = Number(input);

        if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
            console.log("Please enter a valid number between 1 and 100.");
            playGame();
            return;
        }

        attempts++;

        if (guess < randomNumber) {
            console.log("Too low! Try again.");
            playGame();
        } 
        else if (guess > randomNumber) {
            console.log("Too high! Try again.");
            playGame();
        } 
        else {
            console.log("Congratulations! You guessed correctly!");
            console.log("Number of attempts: " + attempts);
            rl.close();
        }
    });
}

playGame();