
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const students = [];

console.log("===== STUDENT RANKING SYSTEM =====");

rl.question("How many students? ", (countInput) => {

    const count = Number(countInput);

    if (!Number.isInteger(count) || count <= 0) {
        console.log("Please enter a valid number of students.");
        rl.close();
        return;
    }

    let current = 0;

    function addStudent() {
        if (current === count) {
            displayRanking();
            rl.close();
            return;
        }

        rl.question(`Enter student ${current + 1} name: `, (name) => {
            if (name.trim() === "") {
                console.log("Name cannot be empty.");
                addStudent();
                return;
            }

            rl.question("Enter grade (0-100): ", (gradeInput) => {
                const grade = Number(gradeInput);

                if (
                    gradeInput.trim() === "" ||
                    !Number.isFinite(grade) ||
                    grade < 0 || grade > 100
                ) {
                    console.log("Invalid grade. Try again.");
                    addStudent();
                    return;
                }

                students.push({
                    name: name.trim(),
                    grade: grade
                });

                current++;
                addStudent();
            });
        });
    }

    function displayRanking() {
        students.sort((a, b) => b.grade - a.grade);

        console.log("\n===== STUDENT RANKINGS =====");

        students.forEach((student, index) => {
            console.log(
                `${index + 1}. ${student.name} - ${student.grade}`
            );
        });
    }

    addStudent();
});