
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const fortunes = {
    success: [
        "Your hard work will lead to something meaningful.",
        "A new opportunity may come your way.",
        "Small progress will bring big results.",
        "Your patience will soon be rewarded."
    ],

    happiness: [
        "A little moment will make your day brighter.",
        "Good things can come from unexpected places.",
        "Someone may bring a smile to your day.",
        "Enjoy the simple things around you."
    ],

    friendship: [
        "A meaningful friendship may grow stronger.",
        "Someone appreciates your kindness.",
        "A good conversation may brighten your day.",
        "True friendship is built through small actions."
    ],

    adventure: [
        "A new experience is waiting for you.",
        "Try something outside your usual routine.",
        "An unexpected opportunity may appear.",
        "Your next chapter could be exciting."
    ]
};

function showCategories() {
    console.log("\n===== FORTUNE CATEGORIES =====");
    console.log("1. Success");
    console.log("2. Happiness");
    console.log("3. Friendship");
    console.log("4. Adventure");
    console.log("5. Exit");
}

function generateFortune(category) {
    const messages = fortunes[category];
    const randomIndex = Math.floor(Math.random() * messages.length);

    console.log("\nYour Fortune:");
    console.log(messages[randomIndex]);
}

function startGenerator() {
    showCategories();

    rl.question("\nChoose a category: ", (choice) => {
        const categories = {
            "1": "success",
            "2": "happiness",
            "3": "friendship",
            "4": "adventure"
        };

        if (choice === "5") {
            console.log("\nThank you for using Fortune Generator!");
            rl.close();
            return;
        }

        if (!categories[choice]) {
            console.log("Invalid choice. Please try again.");
            startGenerator();
            return;
        }

        generateFortune(categories[choice]);
        startGenerator();
    });
}

console.log("===== FORTUNE MESSAGE GENERATOR =====");
startGenerator();