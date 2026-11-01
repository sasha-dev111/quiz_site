document.addEventListener('DOMContentLoaded', () => {

    const allQuestions = {
        easy: [
            {
                question: "Як оголосити змінну, яку не можна змінювати?",
                answers: ["let", "var", "const", "fixed"],
                correct: 2
            },
            {
                question: "Який метод виводить повідомлення в консоль?",
                answers: ["console.log()", "print()", "alert()", "write()"],
                correct: 0
            },
            {
                question: "Який оператор використовують для присвоєння значення змінній?",
                answers: ["==", "===", "=", "=>"],
                correct: 2
            },
            {
                question: "Як створити однорядковий коментар в JavaScript?",
                answers: ["<!-- коментар -->", "/* коментар */", "# коментар", "// коментар"],
                correct: 3
            }
        ],
        medium: [
            {
                question: "Що повертає document.querySelector()?",
                answers: ["Масив", "Перший знайдений елемент", "Всі елементи", "Нічого"],
                correct: 1
            },
            {
                question: "Який тип даних є числом в JavaScript?",
                answers: ["String", "Boolean", "Number", "Object"],
                correct: 2
            },
            {
                question: "Який метод додає елемент в кінець масиву?",
                answers: ["pop()", "push()", "shift()", "unshift()"],
                correct: 1
            },
            {
                question: "Як правильно округлити число 4.7 до найближчого цілого (5)?",
                answers: ["Math.floor(4.7)", "Math.ceil(4.7)", "Math.round(4.7)", "Math.trunc(4.7)"],
                correct: 2
            }
        ],
        hard: [
            {
                question: "Що поверне typeof null?",
                answers: ["object", "null", "undefined", "number"],
                correct: 0
            },
            {
                question: "Яке значення буде результатом виразу: [] + []?",
                answers: ["undefined", "NaN", "[]", "'' (порожній рядок)"],
                correct: 3
            },
            {
                question: "Який метод створює новий масив із елементами, що пройшли перевірку?",
                answers: ["map()", "forEach()", "filter()", "reduce()"],
                correct: 2
            },
            {
                question: "Що таке замикання (closure) в JavaScript?",
                answers: [
                    "Функція, яка блокує браузер",
                    "Функція, що має доступ до своєї зовнішньої області видимості",
                    "Метод для закриття вкладки",
                    "Видалення змінних з пам'яті"
                ],
                correct: 1
            }
        ]
    };

    let questions = [...allQuestions.easy];
    let selectedDifficulty = 'easy';
        
    let questionIndex = 0;
    let score = 0;
    let timerInterval = null;
    let timeLeft = 10;
    let answerLocked = false;
    
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');
    
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const timerCount = document.getElementById('timer-count');
    const scoreCount = document.getElementById('score-count');
    const resultText = document.getElementById('result-text');
    
    function changeScreen(activeScreen) {
        startScreen.style.display = 'none';
        quizScreen.style.display = 'none';
        resultScreen.style.display = 'none';
        activeScreen.style.display = 'block';
    }

    function startTimer() {
        clearInterval(timerInterval);
        timeLeft = 10;
        timerCount.textContent = timeLeft;
        
        timerInterval = setInterval(() => {
            timeLeft--;
            timerCount.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleTimeOut();
            }
        }, 1000);
    }

    function handleTimeOut() {
        if (answerLocked) return;
        answerLocked = true;
        
        const buttons = answersContainer.querySelectorAll('button');
        const currentQ = questions[questionIndex];
        buttons[currentQ.correct].classList.add('correct');
        
        disableAllButtons();

        setTimeout(() => {
            nextQuestion();
        }, 1200);
    }
    
    function showQuestion() {
        if (questionIndex >= questions.length) {
            clearInterval(timerInterval);
            resultText.textContent = `Ви відповіли правильно на ${score} з ${questions.length} запитань!`;
            changeScreen(resultScreen);
            return;
        }
        
        answerLocked = false;
        startTimer();
        answersContainer.innerHTML = '';
        
        const currentQ = questions[questionIndex];
        questionText.textContent = currentQ.question;
        
        for (let i = 0; i < currentQ.answers.length; i++) {
            const button = document.createElement('button');
            button.textContent = currentQ.answers[i];
            button.classList.add('answer-btn');
            
            button.addEventListener('click', () => {
                checkAnswer(button, i);
            });
            
            answersContainer.appendChild(button);
        }
    }
    
    function checkAnswer(button, answerIndex) {
        if (answerLocked) return;
        answerLocked = true;
        clearInterval(timerInterval);
        
        const currentQ = questions[questionIndex];
        const buttons = answersContainer.querySelectorAll('button');

        if (answerIndex === currentQ.correct) {
            score++;
            scoreCount.textContent = score;
            button.classList.add('correct');
        } else {
            button.classList.add('wrong');
            buttons[currentQ.correct].classList.add('correct');
        }
        
        disableAllButtons();

        setTimeout(() => {
            nextQuestion();
        }, 1200);
    }

    function disableAllButtons() {
        const buttons = answersContainer.querySelectorAll('button');
        buttons.forEach(btn => btn.disabled = true);
    }

    function nextQuestion() {
        questionIndex++;
        showQuestion();
    }
    
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('diff-btn')) {
            document.querySelectorAll('.diff-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            selectedDifficulty = e.target.getAttribute('data-level');
        }
    });

    function startGame() {
        questions = [...allQuestions[selectedDifficulty]];
        questionIndex = 0;
        score = 0;
        scoreCount.textContent = score;
        changeScreen(quizScreen);
        showQuestion();
    }
    
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
});