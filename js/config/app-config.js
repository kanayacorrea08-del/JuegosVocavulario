/**
 * Configuración principal de la aplicación
 * Centraliza todas las configuraciones para fácil mantenimiento
 */

const APP_CONFIG = {
    // Configuración general
    APP_NAME: 'Learn English',
    VERSION: '2.0.0',
    DEBUG_MODE: false,
    
    // Configuración de autenticación
    AUTH: {
        SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
        MAX_LOGIN_ATTEMPTS: 3,
        LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos
        PASSWORD_MIN_LENGTH: 6
    },
    
    // Configuración de vocabulario
    VOCABULARY: {
        MAX_WORDS_PER_CATEGORY: 100,
        MAX_CATEGORIES: 50,
        SUPPORTED_LANGUAGES: ['en', 'es'],
        DEFAULT_EMOJI: '📝',
        MIN_WORD_LENGTH: 2,
        MAX_WORD_LENGTH: 50
    },
    
    // Configuración de juegos
    GAMES: {
        MEMORY: {
            MIN_PAIRS: 4,
            MAX_PAIRS: 20,
            TIME_LIMIT: 300000 // 5 minutos
        },
        QUIZ: {
            MIN_OPTIONS: 3,
            MAX_OPTIONS: 6,
            QUESTIONS_PER_GAME: 10
        },
        HANGMAN: {
            MAX_ATTEMPTS: 6,
            HINT_PENALTY: 10
        },
        WORDSEARCH: {
            MIN_GRID_SIZE: 8,
            MAX_GRID_SIZE: 15
        }
    },
    
    // Configuración de almacenamiento
    STORAGE: {
        PREFIX: 'learn_en_',
        BACKUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 horas
        MAX_BACKUPS: 10
    },
    
    // Configuración de UI
    UI: {
        THEMES: ['light', 'dark', 'auto'],
        DEFAULT_THEME: 'light',
        ANIMATION_DURATION: 300,
        TOAST_DURATION: 3000
    },
    
    // Configuración de API (para futuras implementaciones)
    API: {
        BASE_URL: 'https://api.learnenglish.com',
        TIMEOUT: 10000,
        RETRY_ATTEMPTS: 3
    }
};

// Configuración de desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    APP_CONFIG.DEBUG_MODE = true;
    APP_CONFIG.API.BASE_URL = 'http://localhost:3000/api';
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APP_CONFIG;
} else {
    window.APP_CONFIG = APP_CONFIG;
}




