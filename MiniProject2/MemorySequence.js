
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let level = 1;
let score = 0;

function generateSequence(length) {
    let sequence = [];

    for (let i = 0; i < length; i++) {
        sequence.push(Math.floor(Math.random() * 9) + 1);
    }

    return sequence;
}

function playGame() {
    const sequence = generateSequence(level + 2);

    console.log("\n===== MEMORY SEQUENCE GAME =====");
    console.log("Level:", level);
    console.log("Remember this sequence:");

    console.log(sequence.join(" "));

    setTimeout(() => {
        console.clear();

        rl.question("Enter the sequence separated by spaces: ", (answer) => {
            const userAnswer = answer.trim().split(/\s+/).map(Number);

            const correct = sequence.every(
                (number, index) => number === userAnswer[index]
            ) && userAnswer.length === sequence.length;

            if (correct) {
                score++;
                level++;

                console.log("\nCorrect! Great memory!");
                console.log("Current score:", score);

                playGame();
            } else {
                console.log("\nIncorrect sequence!");
                console.log("Correct sequence:", sequence.join(" "));
                console.log("Final score:", score);
                console.log("Highest level reached:", level);

                rl.question("\nPlay again? (yes/no): ", (choice) => {
                    if (choice.toLowerCase() === "yes") {
                        level = 1;
                        score = 0;
                        playGame();
                    } else {
                        console.log("Thanks for playing!");
                        rl.close();
                    }
                });
            }
        });
    }, 3000);
}

console.log("Welcome to the Memory Sequence Game!");
console.log("You have 3 seconds to memorize each sequence.");

playGame();