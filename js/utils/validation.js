/**
 * Sistema de validación escalable
 * Maneja todas las validaciones de la aplicación de forma centralizada
 */

class ValidationManager {
    constructor() {
        this.rules = this.initializeRules();
        this.customValidators = new Map();
    }

    /**
     * Inicializar reglas de validación
     */
    initializeRules() {
        return {
            // Validaciones de texto
            text: {
                required: (value) => value !== null && value !== undefined && value.toString().trim() !== '',
                minLength: (value, min) => value.toString().length >= min,
                maxLength: (value, max) => value.toString().length <= max,
                pattern: (value, regex) => regex.test(value.toString()),
                noSpecialChars: (value) => /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]+$/.test(value.toString()),
                noNumbers: (value) => /^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/.test(value.toString()),
                onlyNumbers: (value) => /^\d+$/.test(value.toString()),
                email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toString()),
                url: (value) => /^https?:\/\/.+/.test(value.toString())
            },

            // Validaciones de vocabulario
            vocabulary: {
                validCategory: (value) => {
                    const validCategories = Object.keys(APP_CONFIG.VOCABULARY.SUPPORTED_LANGUAGES);
                    return validCategories.includes(value);
                },
                validLanguage: (value) => {
                    return APP_CONFIG.VOCABULARY.SUPPORTED_LANGUAGES.includes(value);
                },
                wordExists: (value, category, vocabulary) => {
                    return !vocabulary[category]?.some(w => 
                        w.english.toLowerCase() === value.toLowerCase()
                    );
                },
                validEmoji: (value) => {
                    // Validar que sea un emoji válido
                    return /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(value);
                }
            },

            // Validaciones de autenticación
            auth: {
                passwordStrength: (value) => {
                    const hasMinLength = value.length >= APP_CONFIG.AUTH.PASSWORD_MIN_LENGTH;
                    const hasUpperCase = /[A-Z]/.test(value);
                    const hasLowerCase = /[a-z]/.test(value);
                    const hasNumbers = /\d/.test(value);
                    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                    
                    return {
                        isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumbers,
                        score: [hasMinLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars].filter(Boolean).length,
                        details: {
                            minLength: hasMinLength,
                            upperCase: hasUpperCase,
                            lowerCase: hasLowerCase,
                            numbers: hasNumbers,
                            specialChars: hasSpecialChars
                        }
                    };
                },
                username: (value) => {
                    return /^[a-zA-Z0-9_]{3,20}$/.test(value);
                }
            },

            // Validaciones de juegos
            games: {
                validGameType: (value) => {
                    return ['memory', 'quiz', 'hangman', 'wordsearch'].includes(value);
                },
                validDifficulty: (value) => {
                    return ['easy', 'medium', 'hard'].includes(value);
                },
                validScore: (value) => {
                    return Number.isInteger(value) && value >= 0;
                }
            }
        };
    }

    /**
     * Validar un valor con reglas específicas
     */
    validate(value, rules) {
        const results = {
            isValid: true,
            errors: [],
            warnings: [],
            details: {}
        };

        for (const [ruleName, ruleValue] of Object.entries(rules)) {
            const rule = this.getRule(ruleName);
            if (!rule) {
                results.warnings.push(`Regla de validación '${ruleName}' no encontrada`);
                continue;
            }

            try {
                const ruleResult = rule(value, ruleValue);
                
                if (typeof ruleResult === 'object' && ruleResult.isValid !== undefined) {
                    // Regla que retorna objeto con resultado
                    if (!ruleResult.isValid) {
                        results.isValid = false;
                        results.errors.push(ruleResult.message || `Error en regla: ${ruleName}`);
                    }
                    results.details[ruleName] = ruleResult;
                } else if (ruleResult === false) {
                    // Regla que retorna boolean
                    results.isValid = false;
                    results.errors.push(`Error en regla: ${ruleName}`);
                }
            } catch (error) {
                results.isValid = false;
                results.errors.push(`Error ejecutando regla ${ruleName}: ${error.message}`);
            }
        }

        return results;
    }

    /**
     * Obtener regla de validación
     */
    getRule(ruleName) {
        // Buscar en reglas predefinidas
        for (const category of Object.values(this.rules)) {
            if (category[ruleName]) {
                return category[ruleName];
            }
        }

        // Buscar en validadores personalizados
        return this.customValidators.get(ruleName);
    }

    /**
     * Añadir validador personalizado
     */
    addCustomValidator(name, validator) {
        if (typeof validator === 'function') {
            this.customValidators.set(name, validator);
            return true;
        }
        return false;
    }

    /**
     * Validar formulario completo
     */
    validateForm(formData, formRules) {
        const results = {
            isValid: true,
            fields: {},
            globalErrors: []
        };

        for (const [fieldName, fieldRules] of Object.entries(formRules)) {
            const fieldValue = formData[fieldName];
            const fieldValidation = this.validate(fieldValue, fieldRules);
            
            results.fields[fieldName] = fieldValidation;
            
            if (!fieldValidation.isValid) {
                results.isValid = false;
            }
        }

        return results;
    }

    /**
     * Validar vocabulario completo
     */
    validateVocabulary(vocabulary) {
        const results = {
            isValid: true,
            errors: [],
            warnings: [],
            stats: {
                totalCategories: 0,
                totalWords: 0,
                validCategories: 0,
                validWords: 0
            }
        };

        for (const [categoryName, words] of Object.entries(vocabulary)) {
            results.stats.totalCategories++;
            
            // Validar nombre de categoría
            const categoryValidation = this.validate(categoryName, {
                required: true,
                minLength: 2,
                maxLength: 50,
                noSpecialChars: true
            });

            if (!categoryValidation.isValid) {
                results.isValid = false;
                results.errors.push(`Categoría '${categoryName}': ${categoryValidation.errors.join(', ')}`);
            } else {
                results.stats.validCategories++;
            }

            // Validar palabras de la categoría
            if (Array.isArray(words)) {
                results.stats.totalWords += words.length;
                
                words.forEach((word, index) => {
                    const wordValidation = this.validateWord(word, categoryName);
                    if (!wordValidation.isValid) {
                        results.isValid = false;
                        results.errors.push(`Palabra ${index + 1} en '${categoryName}': ${wordValidation.errors.join(', ')}`);
                    } else {
                        results.stats.validWords++;
                    }
                });
            } else {
                results.isValid = false;
                results.errors.push(`Categoría '${categoryName}': Las palabras deben ser un array`);
            }
        }

        return results;
    }

    /**
     * Validar palabra individual
     */
    validateWord(word, category) {
        if (typeof word !== 'object' || !word) {
            return { isValid: false, errors: ['Palabra debe ser un objeto válido'] };
        }

        const rules = {
            english: { required: true, minLength: 2, maxLength: 50 },
            spanish: { required: true, minLength: 2, maxLength: 50 },
            image: { required: false, validEmoji: true }
        };

        return this.validate(word, rules);
    }

    /**
     * Validar configuración de juego
     */
    validateGameConfig(config, gameType) {
        const gameRules = this.rules.games;
        const configRules = {};

        switch (gameType) {
            case 'memory':
                configRules.pairs = { 
                    minLength: APP_CONFIG.GAMES.MEMORY.MIN_PAIRS,
                    maxLength: APP_CONFIG.GAMES.MEMORY.MAX_PAIRS
                };
                break;
            case 'quiz':
                configRules.questions = { 
                    minLength: 1,
                    maxLength: APP_CONFIG.GAMES.QUIZ.QUESTIONS_PER_GAME
                };
                break;
            case 'hangman':
                configRules.maxAttempts = { 
                    minLength: 1,
                    maxLength: APP_CONFIG.GAMES.HANGMAN.MAX_ATTEMPTS
                };
                break;
        }

        return this.validate(config, configRules);
    }

    /**
     * Obtener mensajes de error en español
     */
    getErrorMessage(ruleName, fieldName = 'campo') {
        const messages = {
            required: `${fieldName} es obligatorio`,
            minLength: `${fieldName} debe tener al menos {0} caracteres`,
            maxLength: `${fieldName} debe tener máximo {0} caracteres`,
            pattern: `${fieldName} no tiene el formato correcto`,
            noSpecialChars: `${fieldName} no puede contener caracteres especiales`,
            noNumbers: `${fieldName} no puede contener números`,
            onlyNumbers: `${fieldName} solo puede contener números`,
            email: `${fieldName} debe ser un email válido`,
            url: `${fieldName} debe ser una URL válida`,
            validCategory: `${fieldName} debe ser una categoría válida`,
            validLanguage: `${fieldName} debe ser un idioma válido`,
            wordExists: `${fieldName} ya existe en esta categoría`,
            validEmoji: `${fieldName} debe ser un emoji válido`,
            username: `${fieldName} debe tener entre 3 y 20 caracteres alfanuméricos`,
            validGameType: `${fieldName} debe ser un tipo de juego válido`,
            validDifficulty: `${fieldName} debe ser una dificultad válida`,
            validScore: `${fieldName} debe ser un puntaje válido`
        };

        return messages[ruleName] || `${fieldName} no es válido`;
    }

    /**
     * Sanitizar entrada de usuario
     */
    sanitizeInput(input, type = 'text') {
        if (typeof input !== 'string') return input;

        switch (type) {
            case 'text':
                return input.trim().replace(/[<>]/g, '');
            case 'html':
                return input.trim();
            case 'email':
                return input.trim().toLowerCase();
            case 'url':
                return input.trim();
            case 'number':
                return input.trim().replace(/[^\d.-]/g, '');
            default:
                return input.trim();
        }
    }
}

// Crear instancia global
const validationManager = new ValidationManager();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ValidationManager;
} else {
    window.ValidationManager = ValidationManager;
    window.validationManager = validationManager;
}




