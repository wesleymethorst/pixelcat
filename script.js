const dieren = [];
const dierenLijst = [];
let huidigDier = null;
let correct = 0;
let wrong = 0;
let playerName = ""; // Declare playerName as a global variable

// VERKRIJG ALLE DATA OVER DIEREN
fetch('dieren.json')
    .then(response => response.json())
    .then(data => {   
        dieren.push(...data);
        laadWillekeurigDier()
});

document.addEventListener("DOMContentLoaded", () => {
    const animalInput = document.querySelector(".input");

    // animalInput.addEventListener("input", function() {
    //     controleerInput(animalInput.value);
    // });

    animalInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            controleerInput(animalInput.value);
            event.target.value = "";
        };
    })
});

function startGame() {
    playerName = document.getElementById('playerName').value; // Set the global variable
    if (playerName) {
        document.querySelector('.start-container').style.display = 'none';
        document.querySelector('.media-container').style.display = 'grid';
        document.querySelector('.stats-container').style.display = 'grid';
        console.log(`Player Name: ${playerName}`);
    } else {
        alert('Voer je naam in om te beginnen!');
    }
}

function laadWillekeurigDier() {
    const dierenContainer = document.querySelector(".plaatjes-container");
    const weetjesTekst = document.querySelector(".weetjes-content");

    if (dierenLijst.length >= dieren.length) {
        toonEindScherm();
        return;
    }

    let randomNummer = createRandomNumber();
    while (dierenLijst.includes(randomNummer)) {
        randomNummer = createRandomNumber();
    }

    dierenLijst.push(randomNummer);
    huidigDier = dieren[randomNummer];  // Opslaan in de globale variabele
    dierenContainer.src = `images/${huidigDier.number}.jpg`;
    weetjesTekst.textContent = huidigDier.weetje;
}

function triggerCorrectAnimation() {
    const correctIcon = document.getElementById("correctScore");
    correctIcon.classList.add("correct-animation");
    setTimeout(() => correctIcon.classList.remove("correct-animation"), 500);
}

function triggerWrongAnimation() {
    const wrongIcon = document.getElementById("wrongScore");
    wrongIcon.classList.add("wrong-animation");
    setTimeout(() => wrongIcon.classList.remove("wrong-animation"), 500);
}

function updateCorrect() {
    correct++;
    document.getElementById("correctScore").textContent = correct;
    triggerCorrectAnimation();
}

function updateWrong() {
    wrong++;
    document.getElementById("wrongScore").textContent = wrong;
    triggerWrongAnimation();
}

// CONTROLEER INPUT TEXTBOX
function controleerInput(input) {
    if (normalizeString(input) === normalizeString(huidigDier.naam)) {
        updateCorrect();
    } else {
        updateWrong();
    }

    laadWillekeurigDier();
}

function normalizeString(str) {
    return str
      .toLowerCase()                        // ZET DE TEKST OM NAAR KLEINE LETTERS
      .normalize("NFD")                     // SPLITS LETTERS EN DIAKRITISCHE TEKENS
      .replace(/[\u0300-\u036f]/g, "");      // VERWIJDER DE DIAKRITISCHE TEKENS
}

function createRandomNumber() {
    return Math.floor(Math.random() * dieren.length)
}

function toonEindScherm() {
    document.querySelector('.media-container').style.display = 'none';
    document.querySelector('.stats-container').style.display = 'none';
    document.querySelector('.end-container').style.display = 'flex';
    document.getElementById('endMessage').textContent = `Naam: ${playerName}, Correct: ${correct}, Wrong: ${wrong}`;
}

function restartGame() {
    // laadWillekeurigDier();
    correct = 0;
    wrong = 0;
    dierenLijst = [];
    huidigDier = null;
    playerName = "";
    document.getElementById('playerName').value = "";
    document.getElementById("correctScore").textContent = correct;
    document.getElementById("wrongScore").textContent = wrong;
    document.querySelector('.end-container').style.display = 'none';
    document.querySelector('.start-container').style.display = 'flex';
}