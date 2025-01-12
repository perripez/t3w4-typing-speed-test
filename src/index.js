console.log("Typing Speed Test Begins!");

// Global variables
let correctCharacters = 0;
let totalCharacters = 0;
let startTime;
let timer = 10; // Timer in seconds (adjustable)
let timerInterval;

// Element Selectors
const playButton = document.getElementById("playButton");
const sentenceDisplay = document.getElementById("sentenceDisplay");
const inputField = document.getElementById("inputField");
const resultsSection = document.getElementById("resultsSection");
const timerDisplay = document.getElementById("timerDisplay");

// Sentence Fetching
async function getRandomSentence(wordCount){
    try{
    const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${wordCount}`);
    const data = await response.json();
    let sentence = data.join(' ');
    console.log(sentence);
    return sentence;
    } catch (error) {
        console.error("Failed to fetch sentence", error);
        return "Error loading sentence, please try again"
    }
}

// Display sentence on front end
async function displaySentence(){
    // Fetch sentence with 10 words
    const randomSentence = await getRandomSentence(10);
    // Display in HTML content
    sentenceDisplay.textContent = randomSentence;
}

// Event listeners
playButton.addEventListener('click', startGame);
inputField.addEventListener('input', trackTyping);

// Start game feature
function startGame(){
    // Reset game variables and UI Elements
    correctCharacters = 0;
    totalCharacters = 0;
    inputField.value = '';
    resultsSection.innerHTML = '';
    startTime = null;
    displaySentence();
    
    // Show neccessary elements
    inputField.style.display = 'block';
    sentenceDisplay.style.display = 'block';
    timerDisplay.style.display = 'block';

}

// Timer function
function startTimer(){
    timerInterval = setInterval(() => {
        if (timer > 0){
            timer--;
            timerDisplay.textContent = `Time Left ${timer}s`
        } else {
            endGame();
        }
    }, 1000);
}

// Typing and Tracking functions - WPM/Accuracy
function trackTyping() {
    console.log(startTime);
    if (!startTime) {
        // Record start time on first input
        startTime = new Date();
        startTimer();
    }

    const typedText = inputField.value;
    const sentence = sentenceDisplay.textContent;

    totalCharacters = typedText.length;
    correctCharacters = countCorrectCharacters(typedText, sentence);

    if (typedText === sentence){
        // End the game if the user finishes early
        endGame();
    }

    updateStats();
}

function countCorrectCharacters(typedText, sentence){
    let correct = 0;
    const minLength = Math.min(typedText.length, sentence.length);

    for (let i = 0; i < minLength; i++) {
        if (typedText[i] === sentence[i]){
            correct++;
        } 
    }
    console.log(correct);
    return correct;
}

function updateStats(){
    const wpm = calculateWPM();
    const accuracy = Math.floor((correctCharacters / totalCharacters) * 100);
    console.log("Accuracy: ", accuracy);
    displayResults(wpm, accuracy);
}

function displayResults(wpm, accuracy){
    resultsSection.innerHTML = `WPM: ${wpm} | Accuracy: ${accuracy}%`;

}

// Calculates the CORRECT words typed per minute
function calculateWPM(){
    //  Time in seconds
    const timeElapsed = (new Date() - startTime) / 1000;
    console.log("Time in seconds: ", timeElapsed);
    console.log("Time in minutes: ", (timeElapsed / 60));

    // Return the correct words per minute
    wpm = Math.floor((correctCharacters / 5) * (60 / timeElapsed));
    console.log("WPM: ", wpm);
    return wpm;

}

function endGame() {
    // Stop the timer
    clearInterval(timerInterval);
    // Disable the input field
    inputField.style.display = 'none';

    const accuracy = Math.floor((correctCharacters / totalCharacters) * 100);

    // Display the result in the resultDiv
    resultsSection.innerHTML = `<p>Game over! Your Final WPM: ${wpm} | Accuracy: ${accuracy}%</p>`

}