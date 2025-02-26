const dieren = [];
const dierenLijst = [];
let huidigDier = null;
let correct = 0;
let wrong = 0;

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

function laadWillekeurigDier() {
    const dierenContainer = document.querySelector(".plaatjes-content");
    const weetjesTekst = document.querySelector(".weetjes-content");

    if (dierenLijst.length >= dieren.length) {
        console.log("Alle dieren zijn getoond.");
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


function updateCorrect() {
    correct++;
    document.getElementById("correctScore").textContent = correct;
  }
  
  function updateWrong() {
    wrong++;
    document.getElementById("wrongScore").textContent = wrong;
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