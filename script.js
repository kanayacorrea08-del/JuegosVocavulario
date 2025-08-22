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
            createMemoryGame(gameContainer);
            break;
        case 'quiz':
            createQuizGame(gameContainer);
            break;
        case 'hangman':
            createHangmanGame(gameContainer);
            break;
        case 'wordsearch':
            createWordSearchGame(gameContainer);
            break;
    }
    
    modal.style.display = 'block';
}

function closeGame() {
    document.getElementById('gameModal').style.display = 'none';
    gameState.currentGame = null;
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
                </div>
            `).join('')}
        </div>
        <button class="cta-button" onclick="startGame('quiz')">Practicar con Quiz</button>
    `;
    
    modal.style.display = 'block';
}

function getCategoryName(category) {
    const names = {
        'animals': 'Animales',
        'colors': 'Colores',
        'food': 'Comida',
        'family': 'Familia'
    };
    return names[category] || category;
}

// Juego de Memoria
function createMemoryGame(container) {
    const category = 'animals'; // Usar animales para el juego de memoria
    const words = vocabulary[category].slice(0, 8); // Solo 8 palabras para 16 cartas
    
    // Crear pares de cartas: una con la palabra en inglés, otra con la traducción en español
    const cards = [];
    words.forEach((word, index) => {
        // Primera carta: palabra en inglés
        cards.push({
            ...word,
            id: index * 2,
            isFlipped: false,
            isMatched: false,
            displayText: word.english,
            displayType: 'english'
        });
        
        // Segunda carta: traducción en español
        cards.push({
            ...word,
            id: index * 2 + 1,
            isFlipped: false,
            isMatched: false,
            displayText: word.spanish,
            displayType: 'spanish'
        });
    });
    
    // Mezclar cartas
    shuffleArray(cards);
    
    let flippedCards = [];
    let canFlip = true;
    
    container.innerHTML = `
        <h2>Juego de Memoria</h2>
        <p>Encuentra las parejas de palabras en inglés y español</p>
        <div class="memory-grid">
            ${cards.map(card => `
                <div class="memory-card" data-id="${card.id}" onclick="flipCard(${card.id})">
                    <span class="card-content">?</span>
                </div>
            `).join('')}
        </div>
        <div class="game-info">
            <p>Puntuación: <span id="memoryScore">0</span></p>
            <button class="cta-button" onclick="resetMemoryGame()">Nuevo Juego</button>
        </div>
    `;
    
    // Función para voltear carta
    window.flipCard = function(id) {
        if (!canFlip) return;
        
        const card = cards.find(c => c.id === id);
        if (card.isFlipped || card.isMatched) return;
        
        card.isFlipped = true;
        const cardElement = document.querySelector(`[data-id="${id}"]`);
        cardElement.classList.add('flipped');
        cardElement.innerHTML = `
            <div class="card-content">
                <div style="font-size: 1.3rem; font-weight: 700; margin-bottom: 0.3rem;">${card.displayText}</div>
                <div style="font-size: 0.75rem; opacity: 0.9; font-style: italic; background: rgba(255,255,255,0.2); padding: 0.2rem 0.5rem; border-radius: 10px;">${card.displayType === 'english' ? '🇺🇸 Inglés' : '🇪🇸 Español'}</div>
            </div>
        `;
        
        flippedCards.push(card);
        
        if (flippedCards.length === 2) {
            canFlip = false;
            
            // Verificar si las cartas forman una pareja (misma palabra base)
            if (flippedCards[0].english === flippedCards[1].english) {
                // Match encontrado
                flippedCards.forEach(c => c.isMatched = true);
                gameState.score += 10;
                gameState.wordsLearned += 1;
                
                setTimeout(() => {
                    flippedCards.forEach(c => {
                        const element = document.querySelector(`[data-id="${c.id}"]`);
                        element.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                        element.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.4)';
                        element.style.transform = 'scale(1.05)';
                    });
                }, 500);
                
                flippedCards = [];
                canFlip = true;
                
                // Verificar si el juego está completo
                if (cards.every(c => c.isMatched)) {
                    setTimeout(() => {
                        alert('¡Felicitaciones! Has completado el juego de memoria.');
                        gameState.gamesCompleted += 1;
                        updateProgress();
                        closeGame();
                    }, 1000);
                }
            } else {
                // No hay match
                setTimeout(() => {
                    flippedCards.forEach(c => {
                        c.isFlipped = false;
                        const element = document.querySelector(`[data-id="${c.id}"]`);
                        element.classList.remove('flipped');
                        element.innerHTML = '<span class="card-content">?</span>';
                    });
                    flippedCards = [];
                    canFlip = true;
                }, 1000);
            }
            
            document.getElementById('memoryScore').textContent = gameState.score;
        }
    };
    
    window.resetMemoryGame = function() {
        createMemoryGame(container);
    };
}

// Juego de Quiz
function createQuizGame(container) {
    const categories = Object.keys(vocabulary);
    const currentCategory = categories[Math.floor(Math.random() * categories.length)];
    const words = vocabulary[currentCategory];
    const currentWord = words[Math.floor(Math.random() * words.length)];
    
    // Crear opciones incorrectas
    const incorrectOptions = words
        .filter(w => w.english !== currentWord.english)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    
    const allOptions = [...incorrectOptions, currentWord];
    shuffleArray(allOptions);
    
    let answered = false;
    
    container.innerHTML = `
        <h2>Quiz de Vocabulario</h2>
        <p>Categoría: ${getCategoryName(currentCategory)}</p>
        <div class="quiz-container">
            <div class="quiz-question">
                ¿Cómo se dice "${currentWord.spanish}" en inglés?
            </div>
            <div class="quiz-options">
                ${allOptions.map((option, index) => `
                    <div class="quiz-option" onclick="selectQuizOption(${index}, '${option.english}', '${currentWord.english}')">
                        ${option.english}
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="game-info">
            <p>Puntuación: <span id="quizScore">${gameState.score}</span></p>
            <button class="cta-button" onclick="nextQuizQuestion()">Siguiente Pregunta</button>
        </div>
    `;
    
    window.selectQuizOption = function(index, selected, correct) {
        if (answered) return;
        answered = true;
        
        const options = document.querySelectorAll('.quiz-option');
        options.forEach((option, i) => {
            if (i === index) {
                if (selected === correct) {
                    option.classList.add('correct');
                    gameState.score += 10;
                    gameState.wordsLearned += 1;
                } else {
                    option.classList.add('incorrect');
                }
            } else if (options[i].textContent.trim() === correct) {
                options[i].classList.add('correct');
            }
        });
        
        document.getElementById('quizScore').textContent = gameState.score;
        
        setTimeout(() => {
            if (selected === correct) {
                alert('¡Correcto! +10 puntos');
            } else {
                alert(`Incorrecto. La respuesta correcta es: ${correct}`);
            }
        }, 500);
    };
    
    window.nextQuizQuestion = function() {
        createQuizGame(container);
    };
}

// Juego del Ahorcado
function createHangmanGame(container) {
    const categories = Object.keys(vocabulary);
    const currentCategory = categories[Math.floor(Math.random() * categories.length)];
    const words = vocabulary[currentCategory];
    const currentWord = words[Math.floor(Math.random() * words.length)];
    
    let guessedLetters = new Set();
    let wrongGuesses = 0;
    const maxWrongGuesses = 6;
    
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    function updateDisplay() {
        const displayWord = currentWord.english
            .split('')
            .map(letter => guessedLetters.has(letter.toUpperCase()) ? letter.toUpperCase() : '_')
            .join(' ');
        
        const hangmanDrawing = getHangmanDrawing(wrongGuesses);
        
        container.innerHTML = `
            <h2>Juego del Ahorcado</h2>
            <p>Categoría: ${getCategoryName(currentCategory)}</p>
            <div class="hangman-container">
                <div class="hangman-drawing">${hangmanDrawing}</div>
                <div class="hangman-word">${displayWord}</div>
                <p>Pista: ${currentWord.spanish}</p>
                <div class="hangman-letters">
                    ${alphabet.map(letter => `
                        <button class="letter-btn ${guessedLetters.has(letter) ? 'used' : ''}" 
                                onclick="guessLetter('${letter}')" 
                                ${guessedLetters.has(letter) ? 'disabled' : ''}>
                            ${letter}
                        </button>
                    `).join('')}
                </div>
            </div>
            <div class="game-info">
                <p>Errores: ${wrongGuesses}/${maxWrongGuesses}</p>
                <p>Puntuación: <span id="hangmanScore">${gameState.score}</span></p>
                <button class="cta-button" onclick="resetHangmanGame()">Nuevo Juego</button>
            </div>
        `;
    }
    
    window.guessLetter = function(letter) {
        if (guessedLetters.has(letter)) return;
        
        guessedLetters.add(letter);
        
        if (!currentWord.english.toUpperCase().includes(letter)) {
            wrongGuesses++;
        }
        
        updateDisplay();
        
        // Verificar si el juego terminó
        if (wrongGuesses >= maxWrongGuesses) {
            setTimeout(() => {
                alert(`¡Perdiste! La palabra era: ${currentWord.english}`);
                resetHangmanGame();
            }, 500);
        } else if (currentWord.english.split('').every(l => guessedLetters.has(l.toUpperCase()))) {
            setTimeout(() => {
                alert('¡Felicitaciones! Has adivinado la palabra.');
                gameState.score += 20;
                gameState.wordsLearned += 1;
                gameState.gamesCompleted += 1;
                updateProgress();
                resetHangmanGame();
            }, 500);
        }
        
        document.getElementById('hangmanScore').textContent = gameState.score;
    };
    
    window.resetHangmanGame = function() {
        createHangmanGame(container);
    };
    
    updateDisplay();
}

function getHangmanDrawing(wrongGuesses) {
    const drawings = [
        '😊',
        '😐',
        '😟',
        '😨',
        '😰',
        '😱',
        '💀'
    ];
    return drawings[Math.min(wrongGuesses, drawings.length - 1)];
}

// Juego de Sopa de Letras
function createWordSearchGame(container) {
    const category = 'animals';
    const words = vocabulary[category].slice(0, 6); // 6 palabras para la sopa de letras
    
    // Crear grid de 10x10
    const gridSize = 10;
    let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
    
    // Colocar palabras en el grid
    words.forEach(word => {
        placeWordInGrid(grid, word.english.toUpperCase());
    });
    
    // Llenar espacios vacíos con letras aleatorias
    fillEmptySpaces(grid);
    
    let foundWords = new Set();
    
    container.innerHTML = `
        <h2>Sopa de Letras</h2>
        <p>Encuentra las palabras de animales en inglés</p>
        <div class="wordsearch-container">
            <div class="wordsearch-grid">
                ${grid.map((row, i) => 
                    row.map((cell, j) => 
                        `<div class="wordsearch-cell" data-row="${i}" data-col="${j}">${cell}</div>`
                    ).join('')
                ).join('')}
            </div>
            <div class="wordsearch-words">
                <h4>Palabras a encontrar:</h4>
                <ul>
                    ${words.map(word => 
                        `<li id="word-${word.english}" class="${foundWords.has(word.english) ? 'found' : ''}">${word.english}</li>`
                    ).join('')}
                </ul>
            </div>
        </div>
        <div class="game-info">
            <p>Palabras encontradas: ${foundWords.size}/${words.length}</p>
            <p>Puntuación: <span id="wordsearchScore">${gameState.score}</span></p>
            <button class="cta-button" onclick="resetWordSearchGame()">Nuevo Juego</button>
        </div>
    `;
    
    // Implementar lógica de selección de palabras
    let selectedCells = [];
    
    document.querySelectorAll('.wordsearch-cell').forEach(cell => {
        cell.addEventListener('click', function() {
            const row = parseInt(this.dataset.row);
            const col = parseInt(this.dataset.col);
            
            if (selectedCells.length === 0) {
                selectedCells.push({row, col, letter: this.textContent});
                this.style.background = '#e3f2fd';
            } else {
                // Verificar si la selección forma una palabra válida
                const word = checkWordSelection(selectedCells, {row, col, letter: this.textContent});
                if (word && words.some(w => w.english.toUpperCase() === word)) {
                    // Marcar palabra como encontrada
                    foundWords.add(word);
                    selectedCells.forEach(cell => {
                        document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`).classList.add('found');
                    });
                    document.getElementById(`word-${word.toLowerCase()}`).classList.add('found');
                    
                    gameState.score += 15;
                    gameState.wordsLearned += 1;
                    
                    if (foundWords.size === words.length) {
                        setTimeout(() => {
                            alert('¡Felicitaciones! Has encontrado todas las palabras.');
                            gameState.gamesCompleted += 1;
                            updateProgress();
                            closeGame();
                        }, 1000);
                    }
                }
                
                // Limpiar selección
                selectedCells.forEach(cell => {
                    document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`).style.background = '';
                });
                selectedCells = [];
            }
            
            document.getElementById('wordsearchScore').textContent = gameState.score;
        });
    });
    
    window.resetWordSearchGame = function() {
        createWordSearchGame(container);
    };
}

function placeWordInGrid(grid, word) {
    const directions = [
        [0, 1],   // horizontal
        [1, 0],   // vertical
        [1, 1],   // diagonal derecha
        [1, -1]   // diagonal izquierda
    ];
    
    let placed = false;
    let attempts = 0;
    
    while (!placed && attempts < 100) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const startRow = Math.floor(Math.random() * grid.length);
        const startCol = Math.floor(Math.random() * grid[0].length);
        
        if (canPlaceWord(grid, word, startRow, startCol, direction)) {
            placeWord(grid, word, startRow, startCol, direction);
            placed = true;
        }
        attempts++;
    }
}

function canPlaceWord(grid, word, startRow, startCol, direction) {
    for (let i = 0; i < word.length; i++) {
        const row = startRow + i * direction[0];
        const col = startCol + i * direction[1];
        
        if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
            return false;
        }
        
        if (grid[row][col] !== '' && grid[row][col] !== word[i]) {
            return false;
        }
    }
    return true;
}

function placeWord(grid, word, startRow, startCol, direction) {
    for (let i = 0; i < word.length; i++) {
        const row = startRow + i * direction[0];
        const col = startCol + i * direction[1];
        grid[row][col] = word[i];
    }
}

function fillEmptySpaces(grid) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === '') {
                grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
            }
        }
    }
}

function checkWordSelection(selectedCells, newCell) {
    // Implementación simple para verificar si las celdas seleccionadas forman una palabra
    const allCells = [...selectedCells, newCell];
    allCells.sort((a, b) => a.row - b.row || a.col - b.col);
    
    let word = '';
    allCells.forEach(cell => {
        word += cell.letter;
    });
    
    return word;
}

// Funciones de utilidad
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateProgress() {
    saveProgress();
    updateProgressDisplay();
}

function updateProgressDisplay() {
    document.getElementById('wordsLearned').textContent = gameState.wordsLearned;
    document.getElementById('gamesCompleted').textContent = gameState.gamesCompleted;
    document.getElementById('totalScore').textContent = gameState.score;
    
    // Determinar nivel basado en puntuación
    let level = 'Principiante';
    if (gameState.score >= 100) level = 'Intermedio';
    if (gameState.score >= 250) level = 'Avanzado';
    if (gameState.score >= 500) level = 'Experto';
    
    document.getElementById('currentLevel').textContent = level;
}

function saveProgress() {
    localStorage.setItem('englishLearningProgress', JSON.stringify(gameState));
}

function loadProgress() {
    const saved = localStorage.getItem('englishLearningProgress');
    if (saved) {
        gameState = { ...gameState, ...JSON.parse(saved) };
    }
}

function resetProgress() {
    if (confirm('¿Estás seguro de que quieres reiniciar todo tu progreso? Esta acción no se puede deshacer.')) {
        // Reiniciar el estado del juego
        gameState = {
            currentGame: null,
            score: 0,
            wordsLearned: 0,
            gamesCompleted: 0
        };
        
        // Limpiar localStorage
        localStorage.removeItem('englishLearningProgress');
        
        // Actualizar la pantalla
        updateProgressDisplay();
        
        // Mostrar mensaje de confirmación
        alert('¡Progreso reiniciado exitosamente! Puedes comenzar de nuevo.');
    }
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('gameModal');
    if (event.target === modal) {
        closeGame();
    }
}
