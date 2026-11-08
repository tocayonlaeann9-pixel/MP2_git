
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let records = [];

function addRecords() {
    console.log("\n===== DUPLICATE RECORD DETECTOR =====");

    rl.question("How many records do you want to enter? ", (input) => {
        const count = Number(input);

        if (!Number.isInteger(count) || count <= 0) {
            console.log("Please enter a valid positive number.");
            addRecords();
            return;
        }

        enterRecord(count, 0);
    });
}

function enterRecord(total, current) {
    if (current === total) {
        analyzeRecords();
        return;
    }

    rl.question(`Enter record ${current + 1}: `, (record) => {
        if (record.trim() === "") {
            console.log("Record cannot be empty.");
            enterRecord(total, current);
            return;
        }

        records.push(record.trim());
        enterRecord(total, current + 1);
    });
}

function analyzeRecords() {
    const recordCounts = {};

    records.forEach(record => {
        const key = record.toLowerCase();

        recordCounts[key] = (recordCounts[key] || 0) + 1;
    });

    const uniqueRecords = [];
    const duplicateRecords = [];

    for (const record in recordCounts) {
        if (recordCounts[record] === 1) {
            uniqueRecords.push(record);
        } else {
            duplicateRecords.push({
                record: record,
                occurrences: recordCounts[record]
            });
        }
    }

    console.log("\n===== ANALYSIS RESULTS =====");

    console.log("\nOriginal Records:");
    console.log(records);

    console.log("\nUnique Records:");
    console.log(uniqueRecords);

    console.log("\nDuplicate Records:");

    if (duplicateRecords.length === 0) {
        console.log("No duplicate records found.");
    } else {
        duplicateRecords.forEach(item => {
            console.log(
                `${item.record} - ${item.occurrences} occurrences`
            );
        });
    }

    console.log("\nTotal Records:", records.length);
    console.log("Unique Record Types:", uniqueRecords.length);
    console.log("Duplicate Record Types:", duplicateRecords.length);

    rl.close();
}

addRecords();