// Datos del vocabulario
const vocabulary = {
    animals: [
        { english: "dog", spanish: "perro", image: "🐕" },
        { english: "cat", spanish: "gato", image: "🐱" },
        { english: "bird", spanish: "pájaro", image: "🐦" },
        { english: "fish", spanish: "pez", image: "🐠" },
        { english: "horse", spanish: "caballo", image: "🐎" },
        { english: "cow", spanish: "vaca", image: "🐄" },
        { english: "pig", spanish: "cerdo", image: "🐷" },
        { english: "sheep", spanish: "oveja", image: "🐑" },
        { english: "chicken", spanish: "pollo", image: "🐔" },
        { english: "duck", spanish: "pato", image: "🦆" },
        { english: "elephant", spanish: "elefante", image: "🐘" },
        { english: "lion", spanish: "león", image: "🦁" },
        { english: "tiger", spanish: "tigre", image: "🐯" },
        { english: "bear", spanish: "oso", image: "🐻" },
        { english: "wolf", spanish: "lobo", image: "🐺" },
        { english: "fox", spanish: "zorro", image: "🦊" },
        { english: "rabbit", spanish: "conejo", image: "🐰" },
        { english: "deer", spanish: "ciervo", image: "🦌" },
        { english: "monkey", spanish: "mono", image: "🐒" },
        { english: "giraffe", spanish: "jirafa", image: "🦒" }
    ],
    colors: [
        { english: "red", spanish: "rojo", image: "🔴" },
        { english: "blue", spanish: "azul", image: "🔵" },
        { english: "green", spanish: "verde", image: "🟢" },
        { english: "yellow", spanish: "amarillo", image: "🟡" },
        { english: "orange", spanish: "naranja", image: "🟠" },
        { english: "purple", spanish: "morado", image: "🟣" },
        { english: "pink", spanish: "rosa", image: "🩷" },
        { english: "brown", spanish: "marrón", image: "🟤" },
        { english: "black", spanish: "negro", image: "⚫" },
        { english: "white", spanish: "blanco", image: "⚪" },
        { english: "gray", spanish: "gris", image: "🔘" },
        { english: "gold", spanish: "dorado", image: "🟡" },
        { english: "silver", spanish: "plateado", image: "⚪" },
        { english: "turquoise", spanish: "turquesa", image: "🟢" },
        { english: "violet", spanish: "violeta", image: "🟣" }
    ],
    food: [
        { english: "apple", spanish: "manzana", image: "🍎" },
        { english: "banana", spanish: "plátano", image: "🍌" },
        { english: "orange", spanish: "naranja", image: "🍊" },
        { english: "strawberry", spanish: "fresa", image: "🍓" },
        { english: "grape", spanish: "uva", image: "🍇" },
        { english: "watermelon", spanish: "sandía", image: "🍉" },
        { english: "pineapple", spanish: "piña", image: "🍍" },
        { english: "mango", spanish: "mango", image: "🥭" },
        { english: "pear", spanish: "pera", image: "🍐" },
        { english: "peach", spanish: "melocotón", image: "🍑" },
        { english: "bread", spanish: "pan", image: "🍞" },
        { english: "cheese", spanish: "queso", image: "🧀" },
        { english: "milk", spanish: "leche", image: "🥛" },
        { english: "egg", spanish: "huevo", image: "🥚" },
        { english: "meat", spanish: "carne", image: "🥩" },
        { english: "chicken", spanish: "pollo", image: "🍗" },
        { english: "fish", spanish: "pescado", image: "🐟" },
        { english: "rice", spanish: "arroz", image: "🍚" },
        { english: "pasta", spanish: "pasta", image: "🍝" },
        { english: "pizza", spanish: "pizza", image: "🍕" },
        { english: "hamburger", spanish: "hamburguesa", image: "🍔" },
        { english: "hot dog", spanish: "perrito caliente", image: "🌭" },
        { english: "ice cream", spanish: "helado", image: "🍦" },
        { english: "cake", spanish: "pastel", image: "🍰" },
        { english: "cookie", spanish: "galleta", image: "🍪" },
        { english: "chocolate", spanish: "chocolate", image: "🍫" }
    ],
    family: [
        { english: "mother", spanish: "madre", image: "👩" },
        { english: "father", spanish: "padre", image: "👨" },
        { english: "sister", spanish: "hermana", image: "👧" },
        { english: "brother", spanish: "hermano", image: "👦" },
        { english: "grandmother", spanish: "abuela", image: "👵" },
        { english: "grandfather", spanish: "abuelo", image: "👴" },
        { english: "aunt", spanish: "tía", image: "👩" },
        { english: "uncle", spanish: "tío", image: "👨" },
        { english: "cousin", spanish: "primo/a", image: "👶" },
        { english: "daughter", spanish: "hija", image: "👧" },
        { english: "son", spanish: "hijo", image: "👦" },
        { english: "wife", spanish: "esposa", image: "👩" },
        { english: "husband", spanish: "esposo", image: "👨" },
        { english: "baby", spanish: "bebé", image: "👶" },
        { english: "twin", spanish: "gemelo/a", image: "👥" },
        { english: "stepmother", spanish: "madrastra", image: "👩" },
        { english: "stepfather", spanish: "padrastro", image: "👨" },
        { english: "family", spanish: "familia", image: "👨‍👩‍👧‍👦" }
    ]
};

// Nombres legibles de categorías
function getCategoryName(key) {
    const names = {
        animals: 'Animales',
        colors: 'Colores',
        food: 'Comida',
        family: 'Familia'
    };
    return names[key] || key;
}

// Estado del juego
let gameState = {
    currentGame: null,
    score: 0,
    wordsLearned: 0,
    gamesCompleted: 0
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    updateProgressDisplay();
});

// Síntesis de voz (pronunciación)
const speech = {
    enVoice: null
};

function loadVoices() {
    const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    // Intentar elegir una voz en inglés
    speech.enVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en')) || null;
}

if ('speechSynthesis' in window) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
}

function pronounce(text, rate = 0.95) {
    if (!('speechSynthesis' in window)) return;
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    if (speech.enVoice) utter.voice = speech.enVoice;
    utter.rate = rate;
    // Cancelar cualquier lectura anterior y reproducir
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
}

// Funciones de navegación
function scrollToGames() {
    document.getElementById('games').scrollIntoView({ behavior: 'smooth' });
}

// Funciones del menú móvil
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
}

function closeMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    navLinks.classList.remove('active');
    menuToggle.classList.remove('active');
}

function startGame(gameType) {
    gameState.currentGame = gameType;
    const modal = document.getElementById('gameModal');
    const gameContainer = document.getElementById('gameContainer');
    
    // Limpiar contenedor
    gameContainer.innerHTML = '';
    
    // Crear juego específico
    switch(gameType) {
        case 'memory':
            if (typeof createMemoryGame === 'function') {
                createMemoryGame(gameContainer);
            } else {
                gameContainer.innerHTML = '<p>Juego de Memoria en construcción.</p>';
            }
            break;
        case 'quiz':
            if (typeof createQuizGame === 'function') {
                createQuizGame(gameContainer);
            } else {
                gameContainer.innerHTML = '<p>Quiz en construcción.</p>';
            }
            break;
        case 'hangman':
            if (typeof createHangmanGame === 'function') {
                createHangmanGame(gameContainer);
            } else {
                gameContainer.innerHTML = '<p>Ahorcado en construcción.</p>';
            }
            break;
        case 'wordsearch':
            if (typeof createWordSearchGame === 'function') {
                createWordSearchGame(gameContainer);
            } else {
                gameContainer.innerHTML = '<p>Sopa de Letras en construcción.</p>';
            }
            break;
    }
    
    modal.style.display = 'block';
}

function closeGame() {
    document.getElementById('gameModal').style.display = 'none';
    gameState.currentGame = null;
    if ('speechSynthesis' in window) speechSynthesis.cancel();
}

function showCategory(category) {
    const modal = document.getElementById('gameModal');
    const gameContainer = document.getElementById('gameContainer');
    
    gameContainer.innerHTML = `
        <h2>Vocabulario: ${getCategoryName(category)}</h2>
        <div class="vocabulary-list">
            ${vocabulary[category].map(word => `
                <div class="vocab-item">
                    <span class="vocab-image">${word.image}</span>
                    <div class="vocab-text">
                        <strong>${word.english}</strong>
                        <span>${word.spanish}</span>
                    </div>
                    <button class="speak-button" title="Pronunciar" onclick="pronounce('${word.english}')">🔊</button>
                </div>
            `).join('')}
        </div>
        <button class="cta-button" onclick="startGame('quiz')">Practicar con Quiz</button>
    `;
    
    modal.style.display = 'block';
}

// Utilidades de progreso (persistencia simple)
function loadProgress() {
    try {
        const saved = JSON.parse(localStorage.getItem('learn_en_progress') || '{}');
        if (saved && typeof saved === 'object') {
            gameState.score = saved.score || 0;
            gameState.wordsLearned = saved.wordsLearned || 0;
            gameState.gamesCompleted = saved.gamesCompleted || 0;
        }
    } catch (_) {
        // ignorar errores de parseo
    }
}

function saveProgress() {
    const data = {
        score: gameState.score,
        wordsLearned: gameState.wordsLearned,
        gamesCompleted: gameState.gamesCompleted
    };
    localStorage.setItem('learn_en_progress', JSON.stringify(data));
}

function updateProgressDisplay() {
    const wordsEl = document.getElementById('wordsLearned');
    const gamesEl = document.getElementById('gamesCompleted');
    const scoreEl = document.getElementById('totalScore');
    const levelEl = document.getElementById('currentLevel');
    if (wordsEl) wordsEl.textContent = String(gameState.wordsLearned);
    if (gamesEl) gamesEl.textContent = String(gameState.gamesCompleted);
    if (scoreEl) scoreEl.textContent = String(gameState.score);
    if (levelEl) levelEl.textContent = getLevelName(gameState.score);
}

function getLevelName(score) {
    if (score >= 200) return 'Avanzado';
    if (score >= 100) return 'Intermedio';
    return 'Principiante';
}

function resetProgress() {
    gameState.score = 0;
    gameState.wordsLearned = 0;
    gameState.gamesCompleted = 0;
    saveProgress();
    updateProgressDisplay();
}

// Helpers de vocabulario
function getAllWords() {
    return Object.values(vocabulary).flat();
}

function getRandomItems(array, count) {
    const copy = array.slice();
    const selected = [];
    while (copy.length && selected.length < count) {
        const idx = Math.floor(Math.random() * copy.length);
        selected.push(copy.splice(idx, 1)[0]);
    }
    return selected;
}

// Utilidades de formato
function capitalizeFirst(text) {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// Reinicio del juego actual
function restartCurrentGame() {
    if (!gameState.currentGame) return;
    startGame(gameState.currentGame);
}

// Juego: Quiz
function createQuizGame(container) {
    const words = getRandomItems(getAllWords(), 5);
    let current = 0;
    let correct = 0;

    function renderQuestion() {
        const w = words[current];
        const askEnglish = Math.random() > 0.5;
        const questionText = askEnglish ? `¿Cómo se dice "${w.spanish}" en inglés?` : `¿Qué significa "${w.english}" en español?`;
        const correctAnswer = askEnglish ? w.english : w.spanish;
        const optionsPool = askEnglish ? getAllWords().map(x => x.english) : getAllWords().map(x => x.spanish);
        const options = new Set([correctAnswer]);
        while (options.size < 4) {
            const candidate = optionsPool[Math.floor(Math.random() * optionsPool.length)];
            options.add(candidate);
        }
        const shuffled = Array.from(options).sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <div class="game-header">
                <span>Puntuación: <strong id="gameScore">${gameState.score}</strong></span>
            </div>
            <div class="game-instructions">
                <h3>🎯 Quiz de Vocabulario</h3>
                <p>Responde correctamente las preguntas sobre vocabulario en inglés y español. ¡Cada acierto te da puntos!</p>
            </div>
            <div class="quiz-container">
                <div class="quiz-question">${questionText}
                    <button class="speak-button" title="Pronunciar" onclick="pronounce('${w.english}')">🔊</button>
                </div>
                <div class="quiz-options">
                    ${shuffled.map(opt => `<div class="quiz-option" data-opt="${opt}">${capitalizeFirst(opt)}</div>`).join('')}
                </div>
                <div>
                    <button class="cta-button" id="nextBtn" disabled>Siguiente</button>
                </div>
            </div>
            <div class="game-footer">
                <button class="restart-button large" onclick="restartCurrentGame()">🔄 Reiniciar juego</button>
            </div>
        `;

        const optionEls = container.querySelectorAll('.quiz-option');
        let answered = false;
        optionEls.forEach(el => {
            el.addEventListener('click', () => {
                if (answered) return;
                answered = true;
                const value = el.getAttribute('data-opt');
                if (value === correctAnswer) {
                    el.classList.add('correct');
                    correct++;
                    gameState.score += 10;
                    gameState.wordsLearned += 1;
                } else {
                    el.classList.add('incorrect');
                    const correctEl = Array.from(optionEls).find(x => x.getAttribute('data-opt') === correctAnswer);
                    if (correctEl) correctEl.classList.add('correct');
                }
                saveProgress();
                updateProgressDisplay();
                const scoreLbl = container.querySelector('#gameScore');
                if (scoreLbl) scoreLbl.textContent = String(gameState.score);
                container.querySelector('#nextBtn').disabled = false;
            });
        });

        container.querySelector('#nextBtn').addEventListener('click', () => {
            current++;
            if (current < words.length) {
                renderQuestion();
            } else {
                gameState.gamesCompleted += 1;
                saveProgress();
                updateProgressDisplay();
                container.innerHTML = `
                    <div class="game-header">
                        <span>Puntuación: <strong>${gameState.score}</strong></span>
                    </div>
                    <div class="game-instructions">
                        <h3>🏆 Resultado del Quiz</h3>
                        <p>¡Excelente trabajo! Has completado el quiz de vocabulario.</p>
                    </div>
                    <div class="quiz-container">
                        <h3>Resultado: ${correct} / ${words.length}</h3>
                        <button class="cta-button" onclick="closeGame()">Cerrar</button>
                    </div>
                    <div class="game-footer">
                        <button class="restart-button large" onclick="restartCurrentGame()">🔄 Reiniciar juego</button>
                    </div>
                `;
            }
        });
    }

    renderQuestion();
}

// Juego: Memoria (parejas EN-ES)
function createMemoryGame(container) {
    // Deduplicar por palabra en inglés para evitar repetir la misma pareja
    const uniqueByEnglish = [];
    const seen = new Set();
    for (const w of getAllWords()) {
        if (!seen.has(w.english)) {
            seen.add(w.english);
            uniqueByEnglish.push(w);
        }
    }
    const pairs = getRandomItems(uniqueByEnglish, 6);
    const cards = pairs.flatMap(w => ([
        { key: w.english + '_en', display: w.english, sub: w.spanish },
        { key: w.english + '_es', display: w.spanish, sub: w.english }
    ]));
    const deck = cards.sort(() => Math.random() - 0.5);

    let first = null;
    let second = null;
    let matched = 0;

    container.innerHTML = `
        <div class="game-header">
            <span>Puntuación: <strong id="gameScore">${gameState.score}</strong></span>
        </div>
        <div class="game-instructions">
            <h3>🧠 Juego de Memoria</h3>
            <p>Encuentra las parejas de palabras en inglés y español. Haz clic en las cartas para voltearlas y encontrar las coincidencias.</p>
        </div>
        <div class="memory-header">
            <h3>Memoria: Encuentra las parejas</h3>
            <div class="memory-stats">
                <span id="memFound">Parejas: 0/${pairs.length}</span>
                <span>Puntuación: <strong id="memScore">${gameState.score}</strong></span>
            </div>
        </div>
        <div class="memory-grid"></div>
        <div class="game-footer">
            <button class="restart-button large" onclick="restartCurrentGame()">🔄 Reiniciar juego</button>
        </div>`;
    const memFoundEl = container.querySelector('#memFound');
    const memScoreEl = container.querySelector('#memScore');
    const grid = container.querySelector('.memory-grid');

    deck.forEach((card, i) => {
        const el = document.createElement('div');
        el.className = 'memory-card';
        el.dataset.index = String(i);
        el.dataset.value = card.display;
        el.dataset.sub = card.sub;
        el.innerHTML = `<div class="card-content"><div>?</div></div>`;
        el.addEventListener('click', () => {
            if (el.classList.contains('matched') || el.classList.contains('flipped')) return;
            if (second) return;
            flipCard(el, card.display, card.sub);
            if (!first) {
                first = el;
            } else {
                second = el;
                const isPair = (first.dataset.value === second.dataset.sub) || (first.dataset.sub === second.dataset.value);
                if (isPair) {
                    first.classList.add('matched');
                    second.classList.add('matched');
                    matched += 2;
                    gameState.score += 5;
                    gameState.wordsLearned += 1;
                    saveProgress();
                    updateProgressDisplay();
                    // Actualizar barra de estado
                    if (memScoreEl) memScoreEl.textContent = `Puntuación: ${gameState.score}`;
                    if (memFoundEl) memFoundEl.textContent = `Parejas: ${Math.floor(matched/2)}/${pairs.length}`;
                    first = null; second = null;
                    if (matched === deck.length) {
                        gameState.gamesCompleted += 1;
                        saveProgress();
                        updateProgressDisplay();
                        setTimeout(() => {
                            container.innerHTML = `<div style="text-align:center">
                                <h3>¡Completado!</h3>
                                <p>Parejas encontradas: ${pairs.length}/${pairs.length}</p>
                                <p>Puntuación total: ${gameState.score}</p>
                                <button class="cta-button" onclick="closeGame()">Cerrar</button>
                            </div>`;
                        }, 300);
                    }
                } else {
                    setTimeout(() => {
                        unflipCard(first);
                        unflipCard(second);
                        first = null; second = null;
                    }, 800);
                }
            }
        });
        grid.appendChild(el);
    });

    function flipCard(el, text, sub) {
        el.classList.add('flipped');
        // Mostrar solo el idioma de la carta (capitalizado)
        el.querySelector('.card-content').innerHTML = `<div>${capitalizeFirst(text)}</div>`;
    }
    function unflipCard(el) {
        el.classList.remove('flipped');
        el.querySelector('.card-content').innerHTML = `<div>?</div>`;
    }
}

// Juego: Ahorcado
function createHangmanGame(container) {
    const chosen = getRandomItems(getAllWords(), 1)[0];
    const word = chosen.english.toUpperCase();
    let attempts = 6;
    const guessed = new Set();
    let hintsUsed = 0;

    container.innerHTML = `
        <div class="game-header">
            <span>Puntuación: <strong id="gameScore">${gameState.score}</strong></span>
        </div>
        <div class="game-instructions">
            <h3>🎯 Juego del Ahorcado</h3>
            <p>Adivina la palabra en inglés letra por letra. ¡Tienes 6 intentos! Usa las pistas si te quedas atascado.</p>
        </div>
        <div class="hangman-container">
            <div class="hangman-hint-image" style="font-size:2.2rem">${chosen.image || '❓'}</div>
            <div class="hangman-drawing" id="hangmanDraw"></div>
            <div class="hangman-word" id="hangmanWord"></div>
            <div class="hangman-letters" id="hangmanLetters"></div>
            <div style="display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap;">
                <button class="cta-button" onclick="pronounce('${chosen.english}')">🔊 Pronunciar</button>
                <button class="cta-button" id="hintBtn">💡 Pista (${3-hintsUsed})</button>
            </div>
            <div id="hintArea" style="margin-top:0.5rem; color:#166534; font-weight:600;"></div>
        </div>
        <div class="game-footer">
            <button class="restart-button large" onclick="restartCurrentGame()">🔄 Reiniciar juego</button>
        </div>
    `;

    const drawEl = container.querySelector('#hangmanDraw');
    const wordEl = container.querySelector('#hangmanWord');
    const lettersEl = container.querySelector('#hangmanLetters');

    function updateWord() {
        const display = word.split('').map(ch => (/[A-Z]/.test(ch) ? (guessed.has(ch) ? ch : '_') : ch)).join(' ');
        wordEl.textContent = display;
    }
    function updateDraw() {
        const hangmanStates = [
            // 6 vidas - solo la horca
            `<svg class="hangman-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <!-- Base horizontal -->
                <rect x="20" y="180" width="160" height="10" fill="#8B4513" rx="5"/>
                <!-- Poste vertical -->
                <rect x="100" y="40" width="10" height="140" fill="#8B4513"/>
                <!-- Travesaño superior -->
                <rect x="100" y="40" width="80" height="10" fill="#8B4513"/>
                <!-- Soga -->
                <line x1="170" y1="50" x2="170" y2="70" stroke="#654321" stroke-width="3"/>
            </svg>`,
            // 5 vidas - cabeza
            `<svg class="hangman-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <!-- Base horizontal -->
                <rect x="20" y="180" width="160" height="10" fill="#8B4513" rx="5"/>
                <!-- Poste vertical -->
                <rect x="100" y="40" width="10" height="140" fill="#8B4513"/>
                <!-- Travesaño superior -->
                <rect x="100" y="40" width="80" height="10" fill="#8B4513"/>
                <!-- Soga -->
                <line x1="170" y1="50" x2="170" y2="70" stroke="#654321" stroke-width="3"/>
                <!-- Cabeza -->
                <circle cx="170" cy="85" r="15" fill="#FFB6C1" stroke="#000" stroke-width="2"/>
                <!-- Ojos -->
                <circle cx="167" cy="82" r="2" fill="#000"/>
                <circle cx="173" cy="82" r="2" fill="#000"/>
                <!-- Sonrisa -->
                <path d="M 165 90 Q 170 95 175 90" stroke="#000" stroke-width="2" fill="none"/>
            </svg>`,
            // 4 vidas - torso
            `<svg class="hangman-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <!-- Base horizontal -->
                <rect x="20" y="180" width="160" height="10" fill="#8B4513" rx="5"/>
                <!-- Poste vertical -->
                <rect x="100" y="40" width="10" height="140" fill="#8B4513"/>
                <!-- Travesaño superior -->
                <rect x="100" y="40" width="80" height="10" fill="#8B4513"/>
                <!-- Soga -->
                <line x1="170" y1="50" x2="170" y2="70" stroke="#654321" stroke-width="3"/>
                <!-- Cabeza -->
                <circle cx="170" cy="85" r="15" fill="#FFB6C1" stroke="#000" stroke-width="2"/>
                <!-- Ojos -->
                <circle cx="167" cy="82" r="2" fill="#000"/>
                <circle cx="173" cy="82" r="2" fill="#000"/>
                <!-- Sonrisa -->
                <path d="M 165 90 Q 170 95 175 90" stroke="#000" stroke-width="2" fill="none"/>
                <!-- Torso -->
                <rect x="160" y="100" width="20" height="40" fill="#4169E1" stroke="#000" stroke-width="2"/>
            </svg>`,
            // 3 vidas - brazo izquierdo
            `<svg class="hangman-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <!-- Base horizontal -->
                <rect x="20" y="180" width="160" height="10" fill="#8B4513" rx="5"/>
                <!-- Poste vertical -->
                <rect x="100" y="40" width="10" height="140" fill="#8B4513"/>
                <!-- Travesaño superior -->
                <rect x="100" y="40" width="80" height="10" fill="#8B4513"/>
                <!-- Soga -->
                <line x1="170" y1="50" x2="170" y2="70" stroke="#654321" stroke-width="3"/>
                <!-- Cabeza -->
                <circle cx="170" cy="85" r="15" fill="#FFB6C1" stroke="#000" stroke-width="2"/>
                <!-- Ojos -->
                <circle cx="167" cy="82" r="2" fill="#000"/>
                <circle cx="173" cy="82" r="2" fill="#000"/>
                <!-- Sonrisa -->
                <path d="M 165 90 Q 170 95 175 90" stroke="#000" stroke-width="2" fill="none"/>
                <!-- Torso -->
                <rect x="160" y="100" width="20" height="40" fill="#4169E1" stroke="#000" stroke-width="2"/>
                <!-- Brazo izquierdo -->
                <line x1="160" y1="110" x2="140" y2="120" stroke="#FFB6C1" stroke-width="8" stroke-linecap="round"/>
            </svg>`,
            // 2 vidas - brazo derecho
            `<svg class="hangman-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <!-- Base horizontal -->
                <rect x="20" y="180" width="160" height="10" fill="#8B4513" rx="5"/>
                <!-- Poste vertical -->
                <rect x="100" y="40" width="10" height="140" fill="#8B4513"/>
                <!-- Travesaño superior -->
                <rect x="100" y="40" width="80" height="10" fill="#8B4513"/>
                <!-- Soga -->
                <line x1="170" y1="50" x2="170" y2="70" stroke="#654321" stroke-width="3"/>
                <!-- Cabeza -->
                <circle cx="170" cy="85" r="15" fill="#FFB6C1" stroke="#000" stroke-width="2"/>
                <!-- Ojos -->
                <circle cx="167" cy="82" r="2" fill="#000"/>
                <!-- Torso -->
                <rect x="160" y="100" width="20" height="40" fill="#4169E1" stroke="#000" stroke-width="2"/>
                <!-- Brazo izquierdo -->
                <line x1="160" y1="110" x2="140" y2="120" stroke="#FFB6C1" stroke-width="8" stroke-linecap="round"/>
                <!-- Brazo derecho -->
                <line x1="180" y1="110" x2="200" y2="120" stroke="#FFB6C1" stroke-width="8" stroke-linecap="round"/>
            </svg>`,
            // 1 vida - pierna izquierda
            `<svg class="hangman-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <!-- Base horizontal -->
                <rect x="20" y="180" width="160" height="10" fill="#8B4513" rx="5"/>
                <!-- Poste vertical -->
                <rect x="100" y="40" width="10" height="140" fill="#8B4513"/>
                <!-- Travesaño superior -->
                <rect x="100" y="40" width="80" height="10" fill="#8B4513"/>
                <!-- Soga -->
                <line x1="170" y1="50" x2="170" y2="70" stroke="#654321" stroke-width="3"/>
                <!-- Cabeza -->
                <circle cx="170" cy="85" r="15" fill="#FFB6C1" stroke="#000" stroke-width="2"/>
                <!-- Ojos -->
                <circle cx="167" cy="82" r="2" fill="#000"/>
                <!-- Torso -->
                <rect x="160" y="100" width="20" height="40" fill="#4169E1" stroke="#000" stroke-width="2"/>
                <!-- Brazo izquierdo -->
                <line x1="160" y1="110" x2="140" y2="120" stroke="#FFB6C1" stroke-width="8" stroke-linecap="round"/>
                <!-- Brazo derecho -->
                <line x1="180" y1="110" x2="200" y2="120" stroke="#FFB6C1" stroke-width="8" stroke-linecap="round"/>
                <!-- Pierna izquierda -->
                <line x1="165" y1="140" x2="150" y2="170" stroke="#4169E1" stroke-width="8" stroke-linecap="round"/>
            </svg>`,
            // 0 vidas - pierna derecha (game over)
            `<svg class="hangman-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <!-- Base horizontal -->
                <rect x="20" y="180" width="160" height="10" fill="#8B4513" rx="5"/>
                <!-- Poste vertical -->
                <rect x="100" y="40" width="10" height="140" fill="#8B4513"/>
                <!-- Travesaño superior -->
                <rect x="100" y="40" width="80" height="10" fill="#8B4513"/>
                <!-- Soga -->
                <line x1="170" y1="50" x2="170" y2="70" stroke="#654321" stroke-width="3"/>
                <!-- Cabeza (calavera) -->
                <circle cx="170" cy="85" r="15" fill="#F5F5DC" stroke="#000" stroke-width="2"/>
                <!-- Ojos de calavera -->
                <circle cx="167" cy="82" r="2" fill="#000"/>
                <circle cx="173" cy="82" r="2" fill="#000"/>
                <!-- Boca de calavera -->
                <path d="M 165 90 L 175 90 M 165 92 L 175 92" stroke="#000" stroke-width="1"/>
                <!-- Torso -->
                <rect x="160" y="100" width="20" height="40" fill="#4169E1" stroke="#000" stroke-width="2"/>
                <!-- Brazo izquierdo -->
                <line x1="160" y1="110" x2="140" y2="120" stroke="#FFB6C1" stroke-width="8" stroke-linecap="round"/>
                <!-- Brazo derecho -->
                <line x1="180" y1="110" x2="200" y2="120" stroke="#FFB6C1" stroke-width="8" stroke-linecap="round"/>
                <!-- Pierna izquierda -->
                <line x1="165" y1="140" x2="150" y2="170" stroke="#4169E1" stroke-width="8" stroke-linecap="round"/>
                <!-- Pierna derecha -->
                <line x1="175" y1="140" x2="190" y2="170" stroke="#4169E1" stroke-width="8" stroke-linecap="round"/>
            </svg>`
        ];
        drawEl.innerHTML = hangmanStates[6-attempts];
    }
    function endGame(win) {
        Array.from(lettersEl.children).forEach(btn => btn.disabled = true);
        if (win) {
            gameState.score += 15;
            gameState.wordsLearned += 1;
        }
        gameState.gamesCompleted += 1;
        saveProgress();
        updateProgressDisplay();
        const msg = win ? '¡Ganaste!' : `Perdiste. La palabra era: ${word}`;
        const footer = document.createElement('div');
        footer.style.marginTop = '1rem';
        footer.innerHTML = `<h3>${msg}</h3><button class="cta-button" onclick="closeGame()">Cerrar</button>`;
        container.querySelector('.hangman-container').appendChild(footer);
    }

    // Pistas
    const hintBtn = container.querySelector('#hintBtn');
    const hintArea = container.querySelector('#hintArea');
    if (hintBtn) {
        hintBtn.addEventListener('click', () => {
            if (hintsUsed >= 3) return;
            hintsUsed++;
            const hintBtn = container.querySelector('#hintBtn');
            if (hintBtn) hintBtn.textContent = `💡 Pista (${3-hintsUsed})`;
            if (hintBtn && hintsUsed >= 3) hintBtn.disabled = true;
            
            if (hintsUsed === 1) {
                hintArea.textContent = `Traducción: ${chosen.spanish}`;
            } else if (hintsUsed === 2) {
                const first = word[0];
                guessed.add(first);
                updateWord();
                hintArea.textContent += ` | Primera letra: ${first}`;
            } else if (hintsUsed === 3) {
                const category = Object.keys(vocabulary).find(k => vocabulary[k].some(w => w.english === chosen.english));
                hintArea.textContent += ` | Categoría: ${getCategoryName(category)}`;
            }
            // penalización ligera por pista
            gameState.score = Math.max(0, gameState.score - 2);
            saveProgress();
            updateProgressDisplay();
            const scoreLbl = container.querySelector('#gameScore');
            if (scoreLbl) scoreLbl.textContent = String(gameState.score);
        });
    }

    // crear botones A-Z
    for (let i = 65; i <= 90; i++) {
        const ch = String.fromCharCode(i);
        const btn = document.createElement('button');
        btn.className = 'letter-btn';
        btn.textContent = ch;
        btn.addEventListener('click', () => {
            if (btn.classList.contains('used')) return;
            btn.classList.add('used');
            guessed.add(ch);
            if (word.includes(ch)) {
                updateWord();
                if (!word.split('').some(x => /[A-Z]/.test(x) && !guessed.has(x))) {
                    endGame(true);
                }
            } else {
                attempts--;
                updateDraw();
                if (attempts <= 0) endGame(false);
            }
        });
        lettersEl.appendChild(btn);
    }

    updateWord();
    updateDraw();
}

// Juego: Sopa de Letras (básico)
function createWordSearchGame(container) {
    const words = getRandomItems(getAllWords(), 6).map(w => w.english.toUpperCase());
    const size = 10;
    const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => ''));

    // Colocar palabras horizontalmente de forma simple
    words.forEach(w => {
        for (let tries = 0; tries < 50; tries++) {
            const row = Math.floor(Math.random() * size);
            const col = Math.floor(Math.random() * (size - w.length));
            let fits = true;
            for (let i = 0; i < w.length; i++) {
                const cell = grid[row][col + i];
                if (cell && cell !== w[i]) { fits = false; break; }
            }
            if (fits) {
                for (let i = 0; i < w.length; i++) grid[row][col + i] = w[i];
                return;
            }
        }
    });

    // Rellenar huecos con letras aleatorias
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (!grid[r][c]) grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
    }

    container.innerHTML = `
        <div class="game-header"><span>Puntuación: <strong id="gameScore">${gameState.score}</strong></span></div>
        <div class="game-instructions">
            <h3>🔍 Sopa de Letras</h3>
            <p>Encuentra las palabras ocultas en la cuadrícula. Haz clic y arrastra en cualquier dirección (horizontal, vertical o diagonal) para seleccionar las letras.</p>
        </div>
        <div class="wordsearch-container">
            <div class="wordsearch-grid" id="wsGrid" style="grid-template-columns: repeat(${size}, 1fr);"></div>
            <div class="wordsearch-words">
                <h4>Palabras</h4>
                <ul id="wsList">${words.map(w => `<li data-word="${w}">${w}</li>`).join('')}</ul>
            </div>
            <button class="cta-button" onclick="closeGame()">Cerrar</button>
        </div>
        <div class="game-footer">
            <button class="restart-button large" onclick="restartCurrentGame()">🔄 Reiniciar juego</button>
        </div>
    `;

    const wsGrid = container.querySelector('#wsGrid');
    const wsList = container.querySelector('#wsList');

    let selection = [];
    let isSelecting = false;
    let startCell = null;
    
    function clearSelection() {
        selection.forEach(s => s.el.classList.remove('selected'));
        selection = [];
    }
    
    function getCellsInLine(startR, startC, endR, endC) {
        const cells = [];
        const deltaR = endR - startR;
        const deltaC = endC - startC;
        const steps = Math.max(Math.abs(deltaR), Math.abs(deltaC));
        
        for (let i = 0; i <= steps; i++) {
            const r = startR + Math.round((deltaR * i) / steps);
            const c = startC + Math.round((deltaC * i) / steps);
            const cell = wsGrid.children[r * size + c];
            if (cell && !cell.classList.contains('found')) {
                cells.push({ el: cell, letter: cell.textContent, r, c });
            }
        }
        return cells;
    }
    
    function checkSelection() {
        if (selection.length < 2) return;
        
        const word = selection.map(s => s.letter).join('');
        const reversed = selection.map(s => s.letter).reverse().join('');
        const li = wsList.querySelector(`li[data-word="${word}"]`) || wsList.querySelector(`li[data-word="${reversed}"]`);
        
        if (li && !li.classList.contains('found')) {
            li.classList.add('found');
            selection.forEach(s => s.el.classList.add('found'));
            clearSelection();
            gameState.score += 8;
            gameState.wordsLearned += 1;
            if (Array.from(wsList.children).every(x => x.classList.contains('found'))) {
                gameState.gamesCompleted += 1;
            }
            saveProgress();
            updateProgressDisplay();
            const scoreLbl = container.querySelector('#gameScore');
            if (scoreLbl) scoreLbl.textContent = String(gameState.score);
        } else {
            clearSelection();
        }
    }

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement('div');
            cell.className = 'wordsearch-cell';
            cell.textContent = grid[r][c];
            cell.dataset.r = r;
            cell.dataset.c = c;
            
            // Mouse events
            cell.addEventListener('mousedown', (e) => {
                e.preventDefault();
                if (cell.classList.contains('found')) return;
                isSelecting = true;
                startCell = { r, c };
                clearSelection();
                selection.push({ el: cell, letter: cell.textContent, r, c });
                cell.classList.add('selected');
            });
            
            cell.addEventListener('mouseenter', (e) => {
                if (!isSelecting || cell.classList.contains('found')) return;
                
                // Obtener todas las celdas en línea desde startCell hasta la celda actual
                const lineCells = getCellsInLine(startCell.r, startCell.c, r, c);
                clearSelection();
                selection = lineCells;
                selection.forEach(s => s.el.classList.add('selected'));
            });
            
            cell.addEventListener('mouseup', (e) => {
                if (isSelecting) {
                    isSelecting = false;
                    checkSelection();
                }
            });
            
            wsGrid.appendChild(cell);
        }
    }
    
    // Touch events para móviles
    wsGrid.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const cell = document.elementFromPoint(touch.clientX, touch.clientY).closest('.wordsearch-cell');
        if (cell && !cell.classList.contains('found')) {
            isSelecting = true;
            startCell = { r: parseInt(cell.dataset.r), c: parseInt(cell.dataset.c) };
            clearSelection();
            selection.push({ el: cell, letter: cell.textContent, r: startCell.r, c: startCell.c });
            cell.classList.add('selected');
        }
    });
    
    wsGrid.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isSelecting) return;
        
        const touch = e.touches[0];
        const cell = document.elementFromPoint(touch.clientX, touch.clientY).closest('.wordsearch-cell');
        if (cell && !cell.classList.contains('found')) {
            const r = parseInt(cell.dataset.r);
            const c = parseInt(cell.dataset.c);
            
            // Obtener todas las celdas en línea desde startCell hasta la celda actual
            const lineCells = getCellsInLine(startCell.r, startCell.c, r, c);
            clearSelection();
            selection = lineCells;
            selection.forEach(s => s.el.classList.add('selected'));
        }
    });
    
    wsGrid.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (isSelecting) {
            isSelecting = false;
            checkSelection();
        }
    });
}

