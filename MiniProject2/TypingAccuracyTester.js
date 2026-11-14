
const readline = require("readline");
const { performance } = require("perf_hooks");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const sentence = "JavaScript makes programming fun and interesting";

console.log("===== TYPING ACCURACY TESTER =====");
console.log("\nType the following sentence:");
console.log(`${sentence}\n`);

const startTime = performance.now();

rl.question("Your answer: ", (userInput) => {

    const endTime = performance.now();

    let correctCharacters = 0;

    for (let i = 0; i < sentence.length; i++) {
        if (userInput[i] === sentence[i]) {
            correctCharacters++;
        }
    }

    const accuracy =
        (correctCharacters / sentence.length) * 100;

    const timeInMinutes = (endTime - startTime) / 60000;

    const wordsTyped = userInput.trim().length === 0
        ? 0
        : userInput.trim().split(/\s+/).length;

    const wpm = wordsTyped / timeInMinutes;

    console.log("\n===== TYPING RESULTS =====");
    console.log(`Correct Characters: ${correctCharacters}/${sentence.length}`);
    console.log(`Accuracy: ${accuracy.toFixed(2)}%`);
    console.log(`Time: ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
    console.log(`Typing Speed: ${wpm.toFixed(2)} WPM`);

    rl.close();
});