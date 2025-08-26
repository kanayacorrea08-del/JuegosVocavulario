/**
 * Gestor de Vocabulario Escalable
 * Maneja todas las operaciones CRUD del vocabulario
 */

class VocabularyManager {
    constructor() {
        this.vocabulary = {};
        this.categories = new Map();
        this.loadVocabulary();
        this.setupEventListeners();
    }

    /**
     * Cargar vocabulario desde el almacenamiento
     */
    loadVocabulary() {
        try {
            // Cargar vocabulario personalizado
            const customVocabulary = storageManager.get('vocabulary', {});
            
            // Combinar con vocabulario por defecto
            this.vocabulary = { ...this.getDefaultVocabulary(), ...customVocabulary };
            
            // Actualizar categorías
            this.updateCategories();
            
            this.log('Vocabulary loaded', this.vocabulary);
        } catch (error) {
            console.error('Error loading vocabulary:', error);
            this.vocabulary = this.getDefaultVocabulary();
        }
    }

    /**
     * Obtener vocabulario por defecto
     */
    getDefaultVocabulary() {
        return {
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
                { english: "duck", spanish: "pato", image: "🦆" }
            ],
            colors: [
                { english: "red", spanish: "rojo", image: "🔴" },
                { english: "blue", spanish: "azul", image: "🔵" },
                { english: "green", spanish: "verde", image: "🟢" },
                { english: "yellow", spanish: "amarillo", image: "🟡" },
                { english: "orange", spanish: "naranja", image: "🟠" },
                { english: "purple", spanish: "morado", image: "🟣" }
            ],
            food: [
                { english: "apple", spanish: "manzana", image: "🍎" },
                { english: "banana", spanish: "plátano", image: "🍌" },
                { english: "bread", spanish: "pan", image: "🍞" },
                { english: "cheese", spanish: "queso", image: "🧀" },
                { english: "milk", spanish: "leche", image: "🥛" },
                { english: "egg", spanish: "huevo", image: "🥚" }
            ],
            family: [
                { english: "mother", spanish: "madre", image: "👩" },
                { english: "father", spanish: "padre", image: "👨" },
                { english: "sister", spanish: "hermana", image: "👧" },
                { english: "brother", spanish: "hermano", image: "👦" },
                { english: "grandmother", spanish: "abuela", image: "👵" },
                { english: "grandfather", spanish: "abuelo", image: "👴" }
            ]
        };
    }

    /**
     * Actualizar mapa de categorías
     */
    updateCategories() {
        this.categories.clear();
        Object.keys(this.vocabulary).forEach(category => {
            this.categories.set(category, {
                name: category,
                displayName: this.getCategoryDisplayName(category),
                wordCount: this.vocabulary[category].length,
                lastModified: new Date().toISOString()
            });
        });
    }

    /**
     * Obtener nombre de visualización de categoría
     */
    getCategoryDisplayName(category) {
        const displayNames = {
            animals: 'Animales',
            colors: 'Colores',
            food: 'Comida',
            family: 'Familia'
        };
        return displayNames[category] || this.capitalizeFirst(category);
    }

    /**
     * Capitalizar primera letra
     */
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Guardar vocabulario en almacenamiento
     */
    saveVocabulary() {
        try {
            storageManager.set('vocabulary', this.vocabulary);
            this.updateCategories();
            this.log('Vocabulary saved');
            return true;
        } catch (error) {
            console.error('Error saving vocabulary:', error);
            return false;
        }
    }

    /**
     * Crear nueva categoría
     */
    createCategory(categoryName, displayName = null) {
        try {
            // Validar entrada
            const validation = validationManager.validate(categoryName, {
                required: true,
                minLength: 2,
                maxLength: 50,
                noSpecialChars: true
            });

            if (!validation.isValid) {
                return {
                    success: false,
                    message: validation.errors.join(', '),
                    validation
                };
            }

            // Verificar si ya existe
            if (this.vocabulary[categoryName]) {
                return {
                    success: false,
                    message: 'La categoría ya existe'
                };
            }

            // Verificar límite de categorías
            if (Object.keys(this.vocabulary).length >= APP_CONFIG.VOCABULARY.MAX_CATEGORIES) {
                return {
                    success: false,
                    message: `No se pueden crear más de ${APP_CONFIG.VOCABULARY.MAX_CATEGORIES} categorías`
                };
            }

            // Crear categoría
            this.vocabulary[categoryName] = [];
            
            // Guardar
            this.saveVocabulary();

            this.log('Category created', categoryName);
            return {
                success: true,
                message: 'Categoría creada exitosamente',
                category: categoryName
            };
        } catch (error) {
            console.error('Error creating category:', error);
            return {
                success: false,
                message: 'Error interno al crear categoría'
            };
        }
    }

    /**
     * Eliminar categoría
     */
    deleteCategory(categoryName) {
        try {
            // Verificar si existe
            if (!this.vocabulary[categoryName]) {
                return {
                    success: false,
                    message: 'La categoría no existe'
                };
            }

            // Verificar que no sea la última
            if (Object.keys(this.vocabulary).length <= 1) {
                return {
                    success: false,
                    message: 'No se puede eliminar la última categoría'
                };
            }

            // Confirmar eliminación
            const wordCount = this.vocabulary[categoryName].length;
            if (wordCount > 0) {
                if (!confirm(`¿Estás seguro de eliminar la categoría "${this.getCategoryDisplayName(categoryName)}" con ${wordCount} palabras?`)) {
                    return {
                        success: false,
                        message: 'Operación cancelada por el usuario'
                    };
                }
            }

            // Eliminar categoría
            delete this.vocabulary[categoryName];
            this.saveVocabulary();

            this.log('Category deleted', categoryName);
            return {
                success: true,
                message: 'Categoría eliminada exitosamente'
            };
        } catch (error) {
            console.error('Error deleting category:', error);
            return {
                success: false,
                message: 'Error interno al eliminar categoría'
            };
        }
    }

    /**
     * Renombrar categoría
     */
    renameCategory(oldName, newName) {
        try {
            // Validar nuevo nombre
            const validation = validationManager.validate(newName, {
                required: true,
                minLength: 2,
                maxLength: 50,
                noSpecialChars: true
            });

            if (!validation.isValid) {
                return {
                    success: false,
                    message: validation.errors.join(', '),
                    validation
                };
            }

            // Verificar si existe la categoría original
            if (!this.vocabulary[oldName]) {
                return {
                    success: false,
                    message: 'La categoría original no existe'
                };
            }

            // Verificar si el nuevo nombre ya existe
            if (this.vocabulary[newName]) {
                return {
                    success: false,
                    message: 'El nuevo nombre ya está en uso'
                };
            }

            // Renombrar
            this.vocabulary[newName] = this.vocabulary[oldName];
            delete this.vocabulary[oldName];
            this.saveVocabulary();

            this.log('Category renamed', { old: oldName, new: newName });
            return {
                success: true,
                message: 'Categoría renombrada exitosamente'
            };
        } catch (error) {
            console.error('Error renaming category:', error);
            return {
                success: false,
                message: 'Error interno al renombrar categoría'
            };
        }
    }

    /**
     * Añadir palabra a categoría
     */
    addWord(categoryName, english, spanish, image = APP_CONFIG.VOCABULARY.DEFAULT_EMOJI) {
        try {
            // Validar entrada
            const validation = validationManager.validateWord({ english, spanish, image }, categoryName);
            if (!validation.isValid) {
                return {
                    success: false,
                    message: validation.errors.join(', '),
                    validation
                };
            }

            // Verificar si la categoría existe
            if (!this.vocabulary[categoryName]) {
                return {
                    success: false,
                    message: 'La categoría no existe'
                };
            }

            // Verificar límite de palabras
            if (this.vocabulary[categoryName].length >= APP_CONFIG.VOCABULARY.MAX_WORDS_PER_CATEGORY) {
                return {
                    success: false,
                    message: `No se pueden añadir más de ${APP_CONFIG.VOCABULARY.MAX_WORDS_PER_CATEGORY} palabras por categoría`
                };
            }

            // Verificar si la palabra ya existe
            const exists = this.vocabulary[categoryName].some(w => 
                w.english.toLowerCase() === english.toLowerCase()
            );
            if (exists) {
                return {
                    success: false,
                    message: 'La palabra ya existe en esta categoría'
                };
            }

            // Añadir palabra
            const newWord = {
                english: english.trim(),
                spanish: spanish.trim(),
                image: image || APP_CONFIG.VOCABULARY.DEFAULT_EMOJI,
                createdAt: new Date().toISOString(),
                modifiedAt: new Date().toISOString()
            };

            this.vocabulary[categoryName].push(newWord);
            this.saveVocabulary();

            this.log('Word added', { category: categoryName, word: newWord });
            return {
                success: true,
                message: 'Palabra añadida exitosamente',
                word: newWord
            };
        } catch (error) {
            console.error('Error adding word:', error);
            return {
                success: false,
                message: 'Error interno al añadir palabra'
            };
        }
    }

    /**
     * Editar palabra
     */
    editWord(categoryName, index, english, spanish, image) {
        try {
            // Validar entrada
            const validation = validationManager.validateWord({ english, spanish, image }, categoryName);
            if (!validation.isValid) {
                return {
                    success: false,
                    message: validation.errors.join(', '),
                    validation
                };
            }

            // Verificar si la categoría y palabra existen
            if (!this.vocabulary[categoryName] || !this.vocabulary[categoryName][index]) {
                return {
                    success: false,
                    message: 'Palabra no encontrada'
                };
            }

            // Verificar si el nuevo nombre ya existe (excluyendo la palabra actual)
            const exists = this.vocabulary[categoryName].some((w, i) => 
                i !== index && w.english.toLowerCase() === english.toLowerCase()
            );
            if (exists) {
                return {
                    success: false,
                    message: 'Ya existe otra palabra con ese nombre en inglés'
                };
            }

            // Actualizar palabra
            const updatedWord = {
                ...this.vocabulary[categoryName][index],
                english: english.trim(),
                spanish: spanish.trim(),
                image: image || APP_CONFIG.VOCABULARY.DEFAULT_EMOJI,
                modifiedAt: new Date().toISOString()
            };

            this.vocabulary[categoryName][index] = updatedWord;
            this.saveVocabulary();

            this.log('Word edited', { category: categoryName, index, word: updatedWord });
            return {
                success: true,
                message: 'Palabra editada exitosamente',
                word: updatedWord
            };
        } catch (error) {
            console.error('Error editing word:', error);
            return {
                success: false,
                message: 'Error interno al editar palabra'
            };
        }
    }

    /**
     * Eliminar palabra
     */
    deleteWord(categoryName, index) {
        try {
            // Verificar si la categoría y palabra existen
            if (!this.vocabulary[categoryName] || !this.vocabulary[categoryName][index]) {
                return {
                    success: false,
                    message: 'Palabra no encontrada'
                };
            }

            // Obtener información de la palabra
            const word = this.vocabulary[categoryName][index];
            
            // Confirmar eliminación
            if (!confirm(`¿Estás seguro de eliminar "${word.english}" (${word.spanish})?`)) {
                return {
                    success: false,
                    message: 'Operación cancelada por el usuario'
                };
            }

            // Eliminar palabra
            this.vocabulary[categoryName].splice(index, 1);
            this.saveVocabulary();

            this.log('Word deleted', { category: categoryName, index, word });
            return {
                success: true,
                message: 'Palabra eliminada exitosamente'
            };
        } catch (error) {
            console.error('Error deleting word:', error);
            return {
                success: false,
                message: 'Error interno al eliminar palabra'
            };
        }
    }

    /**
     * Buscar palabras
     */
    searchWords(query, category = null) {
        try {
            const results = [];
            const searchQuery = query.toLowerCase().trim();

            if (!searchQuery) return results;

            const categories = category ? [category] : Object.keys(this.vocabulary);

            categories.forEach(cat => {
                if (this.vocabulary[cat]) {
                    this.vocabulary[cat].forEach((word, index) => {
                        if (word.english.toLowerCase().includes(searchQuery) ||
                            word.spanish.toLowerCase().includes(searchQuery)) {
                            results.push({
                                ...word,
                                category: cat,
                                index: index
                            });
                        }
                    });
                }
            });

            return results.sort((a, b) => a.english.localeCompare(b.english));
        } catch (error) {
            console.error('Error searching words:', error);
            return [];
        }
    }

    /**
     * Obtener estadísticas del vocabulario
     */
    getVocabularyStats() {
        try {
            const stats = {
                totalCategories: Object.keys(this.vocabulary).length,
                totalWords: 0,
                categories: {},
                lastModified: null,
                size: 0
            };

            Object.keys(this.vocabulary).forEach(category => {
                const wordCount = this.vocabulary[category].length;
                stats.totalWords += wordCount;
                stats.categories[category] = {
                    name: category,
                    displayName: this.getCategoryDisplayName(category),
                    wordCount: wordCount,
                    lastModified: this.getCategoryLastModified(category)
                };
            });

            // Calcular tamaño aproximado
            stats.size = JSON.stringify(this.vocabulary).length;
            stats.sizeKB = (stats.size / 1024).toFixed(2);

            return stats;
        } catch (error) {
            console.error('Error getting vocabulary stats:', error);
            return null;
        }
    }

    /**
     * Obtener última modificación de una categoría
     */
    getCategoryLastModified(category) {
        if (!this.vocabulary[category]) return null;
        
        const timestamps = this.vocabulary[category]
            .map(word => new Date(word.modifiedAt || word.createdAt))
            .filter(date => !isNaN(date.getTime()));
        
        if (timestamps.length === 0) return null;
        
        return new Date(Math.max(...timestamps)).toISOString();
    }

    /**
     * Exportar vocabulario
     */
    exportVocabulary(categories = null) {
        try {
            const exportData = categories 
                ? categories.reduce((acc, cat) => {
                    if (this.vocabulary[cat]) {
                        acc[cat] = this.vocabulary[cat];
                    }
                    return acc;
                }, {})
                : this.vocabulary;

            const exportObj = {
                exportDate: new Date().toISOString(),
                version: APP_CONFIG.VERSION,
                vocabulary: exportData,
                stats: this.getVocabularyStats()
            };

            return JSON.stringify(exportObj, null, 2);
        } catch (error) {
            console.error('Error exporting vocabulary:', error);
            return null;
        }
    }

    /**
     * Importar vocabulario
     */
    importVocabulary(jsonString, options = {}) {
        try {
            const importData = JSON.parse(jsonString);
            
            if (!importData.vocabulary || typeof importData.vocabulary !== 'object') {
                return {
                    success: false,
                    message: 'Formato de importación inválido'
                };
            }

            const { overwrite = false, merge = true, validate = true } = options;
            let importedCount = 0;
            let skippedCount = 0;
            let errorCount = 0;

            Object.keys(importData.vocabulary).forEach(category => {
                const words = importData.vocabulary[category];
                
                if (!Array.isArray(words)) {
                    errorCount++;
                    return;
                }

                if (!this.vocabulary[category]) {
                    this.vocabulary[category] = [];
                }

                words.forEach(word => {
                    try {
                        if (validate) {
                            const validation = validationManager.validateWord(word, category);
                            if (!validation.isValid) {
                                errorCount++;
                                return;
                            }
                        }

                        if (overwrite || !this.wordExists(category, word.english)) {
                            this.vocabulary[category].push({
                                ...word,
                                createdAt: word.createdAt || new Date().toISOString(),
                                modifiedAt: new Date().toISOString()
                            });
                            importedCount++;
                        } else {
                            skippedCount++;
                        }
                    } catch (error) {
                        errorCount++;
                    }
                });
            });

            this.saveVocabulary();

            this.log('Vocabulary imported', { imported: importedCount, skipped: skippedCount, errors: errorCount });
            return {
                success: true,
                message: `Importación completada: ${importedCount} importadas, ${skippedCount} omitidas, ${errorCount} errores`,
                stats: { imported: importedCount, skipped: skippedCount, errors: errorCount }
            };
        } catch (error) {
            console.error('Error importing vocabulary:', error);
            return {
                success: false,
                message: 'Error al importar vocabulario'
            };
        }
    }

    /**
     * Verificar si una palabra existe
     */
    wordExists(category, english) {
        return this.vocabulary[category]?.some(w => 
            w.english.toLowerCase() === english.toLowerCase()
        ) || false;
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Event listeners para la interfaz de administración
        document.addEventListener('DOMContentLoaded', () => {
            this.setupAdminEventListeners();
        });
    }

    /**
     * Configurar event listeners del admin
     */
    setupAdminEventListeners() {
        // Estos se implementarán cuando se cree la interfaz de admin
    }

    /**
     * Logging para debugging
     */
    log(action, data) {
        if (APP_CONFIG.DEBUG_MODE) {
            console.log(`[VocabularyManager] ${action}:`, data);
        }
    }
}

// Crear instancia global
const vocabularyManager = new VocabularyManager();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VocabularyManager;
} else {
    window.VocabularyManager = VocabularyManager;
    window.vocabularyManager = vocabularyManager;
}




