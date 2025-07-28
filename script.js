let selectedTopic = '';
let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

const topicCards = document.querySelectorAll('.topic-card');
const difficultyCards = document.querySelectorAll('.difficulty-card');

const topicSelectionPage = document.getElementById('topic-selection');
const difficultyPage = document.getElementById('difficulty-selection');
const quizPage = document.getElementById('quiz-page');
const resultsPage = document.getElementById('results-page');
const answerReviewPage = document.getElementById('answer-review');

const selectedTopicDisplay = document.getElementById('selected-topic-display');
const currentTopicDisplay = document.getElementById('current-topic');
const currentDifficultyDisplay = document.getElementById('current-difficulty');
const questionText = document.getElementById('question-text');
const optionsContainer = document.querySelector('.options-container');
const questionCounter = document.getElementById('question-counter');
const progressFill = document.getElementById('progress-fill');

const correctCount = document.getElementById('correct-count');
const wrongCount = document.getElementById('wrong-count');
const finalScore = document.getElementById('final-score');
const resultsPercentage = document.getElementById('results-percentage');

const reviewContainer = document.getElementById('review-container');

const API_KEY = 'iZqsE6ieCcqP7Umd98VQZfhmeP89cIZoBaHz7Vsg';

// Category mapping for quizapi.io
const categoryMap = {
    DBMS: 'sql',
    OS: 'linux',
    DSA: 'code',
    ADA: 'code',
    SE: 'code',
    CN: 'linux',
    ML: 'code',
    Java: 'code',
    JavaScript: 'code',
    HTML: 'code',
    CSS: 'code',
    React: 'code',
    OOPs: 'code'
};

topicCards.forEach(card => {
    card.addEventListener('click', () => {
        selectedTopic = card.dataset.topic;
        selectedTopicDisplay.textContent = selectedTopic;
        showPage(difficultyPage);
    });
});

difficultyCards.forEach(card => {
    card.addEventListener('click', () => {
        currentTopicDisplay.textContent = selectedTopic;
        currentDifficultyDisplay.textContent = 'N/A';
        startQuiz();
    });
});

document.getElementById('back-to-topics').addEventListener('click', () => {
    showPage(topicSelectionPage);
});

function showPage(pageElement) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    pageElement.classList.add('active');
}

// Fetch questions using your API key
async function fetchQuizQuestions(topic) {
    const category = categoryMap[topic] || 'code';
    const url = `https://quizapi.io/api/v1/questions?category=${category}&limit=10`;

    try {
        const response = await fetch(url, {
            headers: {
                "X-Api-Key": API_KEY
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching questions:", error);
        return [];
    }
}

async function startQuiz() {
    showPage(quizPage);
    quizData = await fetchQuizQuestions(selectedTopic);
    score = 0;
    currentQuestionIndex = 0;
    userAnswers = [];
    displayQuestion();
}

function displayQuestion() {
    const question = quizData[currentQuestionIndex];
    if (!question) return;

    questionText.innerHTML = question.question;

    const answers = question.answers;
    optionsContainer.innerHTML = '';

    for (let key in answers) {
        if (answers[key]) {
            const div = document.createElement('div');
            div.className = 'option';
            div.dataset.option = key;
            div.innerHTML = `
                <span class="option-letter">${key.toUpperCase()}</span>
                <span class="option-text">${answers[key]}</span>
            `;
            div.addEventListener('click', () => selectAnswer(div));
            optionsContainer.appendChild(div);
        }
    }

    questionCounter.textContent = `${currentQuestionIndex + 1} / ${quizData.length}`;
    progressFill.style.width = `${((currentQuestionIndex + 1) / quizData.length) * 100}%`;

    document.getElementById('prev-question').disabled = currentQuestionIndex === 0;
    document.getElementById('next-question').disabled = true;
    document.getElementById('submit-quiz').style.display = currentQuestionIndex === quizData.length - 1 ? 'inline-block' : 'none';
}

function selectAnswer(selectedDiv) {
    const allOptions = document.querySelectorAll('.option');
    allOptions.forEach(opt => opt.classList.remove('selected'));
    selectedDiv.classList.add('selected');

    const selectedKey = selectedDiv.dataset.option;
    userAnswers[currentQuestionIndex] = selectedKey;

    document.getElementById('next-question').disabled = false;
}

document.getElementById('next-question').addEventListener('click', () => {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
});

document.getElementById('prev-question').addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
});

document.getElementById('submit-quiz').addEventListener('click', () => {
    calculateResults();
});

function calculateResults() {
    let correct = 0;

    quizData.forEach((q, index) => {
        const correctKey = Object.entries(q.correct_answers).find(
            ([key, value]) => value === "true"
        )?.[0]?.slice(-1); // example: "answer_a_correct" → "a"

        if (userAnswers[index] && userAnswers[index].toLowerCase() === correctKey) {
            correct++;
        }
    });

    score = correct;
    finalScore.textContent = score;
    correctCount.textContent = score;
    wrongCount.textContent = quizData.length - score;
    resultsPercentage.textContent = `${Math.round((score / quizData.length) * 100)}%`;

    showPage(resultsPage);
}

document.getElementById('show-answers').addEventListener('click', () => {
    reviewContainer.innerHTML = '';
    quizData.forEach((q, i) => {
        const correctKey = Object.entries(q.correct_answers).find(
            ([key, value]) => value === "true"
        )?.[0]?.slice(-1);

        const yourAns = userAnswers[i] || 'No Answer';
        const correctAns = q.answers[`answer_${correctKey}`];

        const div = document.createElement('div');
        div.className = 'review-item';
        div.innerHTML = `
            <h3>Q${i + 1}: ${q.question}</h3>
            <p><strong>Your Answer:</strong> ${q.answers[yourAns] || 'No Answer'}</p>
            <p><strong>Correct Answer:</strong> ${correctAns}</p>
            <hr>
        `;
        reviewContainer.appendChild(div);
    });
    showPage(answerReviewPage);
});

document.getElementById('back-to-results').addEventListener('click', () => {
    showPage(resultsPage);
});

document.getElementById('restart-quiz').addEventListener('click', () => {
    showPage(topicSelectionPage);
});

document.getElementById('new-quiz').addEventListener('click', () => {
    showPage(topicSelectionPage);
});
