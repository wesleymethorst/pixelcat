let playerName = '';
let correct = 0;
let wrong = 0;
let huidigDier = null;
let dierenLijst = [];

// DOM-elementen
const startMenu = document.getElementById("start-menu");
const gameMenu = document.getElementById("game-menu");
const endMenu = document.getElementById("end-menu");
const playerNameInput = document.getElementById("player-name");
const startGameButton = document.getElementById("start-game");
const playAgainButton = document.getElementById("play-again");
const finalScoreDisplay = document.getElementById("final-score");
const correctScore = document.getElementById("correctScore");
const wrongScore = document.getElementById("wrongScore");
const animalInput = document.querySelector(".input");
const weetjesTekst = document.querySelector(".weetjes-content");
const dierenContainer = document.querySelector(".plaatjes-container");

// Start het spel
startGameButton.addEventListener("click", startGame);
playAgainButton.addEventListener("click", restartGame);

// Start het spel na het invoeren van de naam
function startGame() {
    playerName = playerNameInput.value || "Speler";  // Gebruik "Speler" als de naam leeg is
    startMenu.style.display = "none";
    gameMenu.style.display = "block";
    laadDieren();  // Zorg ervoor dat we de dieren inladen
    laadWillekeurigDier();  // Begin met een willekeurig dier
}

// Laad de dieren uit de JSON
function laadDieren() {
    fetch('dieren.json')
        .then(response => response.json())
        .then(data => {
            dierenLijst = data;
        });
}

// Laad een willekeurig dier en toon de gegevens
function laadWillekeurigDier() {
    if (dierenLijst.length === 0) return; // Controleer of de dierenlijst leeg is
    let randomNummer = createRandomNumber();
    huidigDier = dierenLijst[randomNummer]; // Opslaan van het huidige dier
    dierenContainer.src = `images/${huidigDier.number}.jpg`;  // Zorg ervoor dat de afbeeldingen in de juiste map staan
    weetjesTekst.textContent = huidigDier.weetje;
}

// Controleer de invoer van de speler
animalInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        controleerInput(animalInput.value);
        event.target.value = "";
    };
});

// Controleer het ingevoerde antwoord
function controleerInput(input) {
    if (normalizeString(input) === normalizeString(huidigDier.naam)) {
        updateCorrect();
    } else {
        updateWrong();
    }
    laadWillekeurigDier();  // Laad een nieuw dier
}

// Normaliseer de invoer (hoofdletters, accenten verwijderen)
function normalizeString(str) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// Update de score voor correct antwoord
function updateCorrect() {
    correct++;
    correctScore.textContent = correct;
    triggerCorrectAnimation();
}

// Update de score voor verkeerd antwoord
function updateWrong() {
    wrong++;
    wrongScore.textContent = wrong;
    triggerWrongAnimation();
}

// Animatie voor juiste antwoorden
function triggerCorrectAnimation() {
    correctScore.classList.add("correct-animation");
    setTimeout(() => correctScore.classList.remove("correct-animation"), 500);
}

// Animatie voor foute antwoorden
function triggerWrongAnimation() {
    wrongScore.classList.add("wrong-animation");
    setTimeout(() => wrongScore.classList.remove("wrong-animation"), 500);
}

// Genereer een willekeurig nummer voor een dier
function createRandomNumber() {
    return Math.floor(Math.random() * dierenLijst.length);
}

// Einde van het spel
function endGame() {
    gameMenu.style.display = "none";
    endMenu.style.display = "block";
    finalScoreDisplay.textContent = `${correct} goed, ${wrong} fout`;
}

// Start het spel opnieuw
function restartGame() {
    correct = 0;
    wrong = 0;
    correctScore.textContent = "0";
    wrongScore.textContent = "0";
    finalScoreDisplay.textContent = "0";
    startMenu.style.display = "block";
    endMenu.style.display = "none";
    playerNameInput.value = '';
}

// Event listener voor de "Enter" toets om het antwoord in te voeren
animalInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        controleerInput(animalInput.value);
        event.target.value = "";  // Wis de invoer na het controleren
    }
});
