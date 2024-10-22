const questions = [
    {
        question: 'What does HTML stand for?',
        answers: [
            { text: 'HyperText Markup Language', correct: true },
            { text: 'HyperTool Markup Language', correct: false },
            { text: 'HomeText Markup Language', correct: false },
            { text: 'HyperText Machine Language', correct: false }
        ]
    },
    {
        question: 'Which property is used to change the background color in CSS?',
        answers: [
            { text: 'background-color', correct: true },
            { text: 'color', correct: false },
            { text: 'bgcolor', correct: false },
            { text: 'bg-color', correct: false }
        ]
    },
    {
        question: 'What is the correct HTML element for the largest heading?',
        answers: [
            { text: '<h1>', correct: true },
            { text: '<heading>', correct: false },
            { text: '<h6>', correct: false },
            { text: '<h2>', correct: false }
        ]
    },
    {
        question: 'How can you create a numbered list in HTML?',
        answers: [
            { text: '<ol>', correct: true },
            { text: '<ul>', correct: false },
            { text: '<dl>', correct: false },
            { text: '<list>', correct: false }
        ]
    },
    {
        question: 'Which CSS property controls the text size?',
        answers: [
            { text: 'font-size', correct: true },
            { text: 'text-size', correct: false },
            { text: 'font-style', correct: false },
            { text: 'text-style', correct: false }
        ]
    }
];

const startContainer = document.getElementById('start-container');
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const welcomeText = document.getElementById('welcome-text');
const userScoreElement = document.getElementById('user-score');
const resultMessage = document.getElementById('result-message');
const emojiElement = document.getElementById('emoji');
const gradeElement = document.getElementById('grade');
const timerElement = document.getElementById('time-left');
const usernameInput = document.getElementById('username');
const startButton = document.getElementById('start-btn');

const errorMessage = document.getElementById('error-message'); // Assuming there's an element for error messages
const restartButton = document.getElementById('restart-btn');

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 120; // 2 minutes
let totalQuestionsAttempted = 0; // Track the number of attempted questions
 // Enable "Start Quiz" button when user types 3 or more characters
 usernameInput.addEventListener('input', () => {
    const username = usernameInput.value.trim();
    if (username.length >= 3) {
        startButton.classList.remove('hidden');  // Show Start button
        errorMessage.classList.add('hidden');    // Hide error message
    } else {
        startButton.classList.add('hidden');     // Hide Start button
        errorMessage.classList.remove('hidden'); // Show error message
    }
});

// Shuffle answers
function shuffleAnswers(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Start the quiz
function startQuiz() {
    const username = usernameInput.value.trim();
    if (!username) {
        alert("Please enter your name to start the quiz.");
        return;
    }
    startContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    welcomeText.innerText = `Welcome, ${username}!`;

    timeLeft = 120; // Reset timer
    score = 0; // Reset score
    currentQuestionIndex = 0; // Reset question index
    totalQuestionsAttempted = 0; // Reset attempted questions

    startTimer();
    showQuestion();
}

// Timer function
function startTimer() {
    const countdown = setInterval(() => {
        timeLeft--;
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerElement.innerText = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            showResult();
        }
    }, 1000);
}

// Display the current question
function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    let answers = [...currentQuestion.answers];
    shuffleAnswers(answers);

    answers.forEach(answer => {
        const button = document.createElement('li');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

// Clear previous question's answers
function resetState() {
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
    nextButton.classList.add('hidden');
}

// Select an answer
function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    if (correct) {
        score++;
        selectedButton.style.backgroundColor = '#4CAF50';
    } else {
        selectedButton.style.backgroundColor = '#f44336';
    }
    totalQuestionsAttempted++; // Track how many questions the user attempts
    nextButton.classList.remove('hidden');
}

// Move to the next question or show the result
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
});

// Display the result with grade and user details
function showResult() {
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');

    const username = usernameInput.value.trim();
    userScoreElement.innerText = `${score} out of ${questions.length}`;

    const scorePercentage = (score / questions.length) * 100;
    let grade = '';

    if (scorePercentage >= 90) {
        grade = 'A';
        resultMessage.innerText = `Congratulations, ${username}! 🎉 You attempted ${totalQuestionsAttempted} questions.`;
        emojiElement.innerText = '😁';
    } else if (scorePercentage >= 80) {
        grade = 'B';
        resultMessage.innerText = `Good Job, ${username}! 😊 You attempted ${totalQuestionsAttempted} questions.`;
        emojiElement.innerText = '😊';
    } else if (scorePercentage >= 60) {
        grade = 'C';
        resultMessage.innerText = `Average Performance, ${username}. You attempted ${totalQuestionsAttempted} questions.`;
        emojiElement.innerText = '😐';
    } else {
        grade = 'F';
        resultMessage.innerText = `You Lose,Try again, ${username}! You attempted ${totalQuestionsAttempted} questions.`;
        emojiElement.innerText = '😢';
    }

    // Display grade
    gradeElement.innerText = `Your Grade: ${grade} (${scorePercentage.toFixed(2)}%)`;
}

// Restart the quiz
restartButton.addEventListener('click', () => {
    resultContainer.classList.add('hidden');
    startContainer.classList.remove('hidden');
    quizContainer.classList.add('hidden');
    startButton.classList.add('hidden'); // Hide start button again until user enters a name
});

startButton.addEventListener('click', startQuiz);
