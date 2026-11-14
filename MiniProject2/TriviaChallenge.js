
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const questions = [
    {
        question: "What is the capital of Japan?",
        answer: "Tokyo"
    },
    {
        question: "How many planets are in our solar system?",
        answer: "8"
    },
    {
        question: "What is the largest ocean in the world?",
        answer: "Pacific Ocean"
    },
    {
        question: "Which planet is known as the Red Planet?",
        answer: "Mars"
    },
    {
        question: "What is the chemical symbol for water?",
        answer: "H2O"
    }
];

let score = 0;
let current = 0;

console.log("===== TRIVIA CHALLENGE =====");
console.log("Answer the following questions!\n");

function askQuestion() {
    if (current === questions.length) {
        console.log("\n===== FINAL RESULT =====");
        console.log(`Your Score: ${score}/${questions.length}`);
        console.log(
            `Percentage: ${((score / questions.length) * 100).toFixed(2)}%`
        );

        rl.close();
        return;
    }

    const item = questions[current];

    rl.question(
        `Question ${current + 1}: ${item.question}\nYour answer: `,
        (answer) => {

            if (
                answer.trim().toLowerCase() ===
                item.answer.toLowerCase()
            ) {
                console.log("Correct!\n");
                score++;
            } else {
                console.log(`Incorrect! Answer: ${item.answer}\n`);
            }

            current++;
            askQuestion();
        }
    );
}

askQuestion();