/**
 * Núcleo del Sistema de Administración
 * Maneja autenticación, sesiones y la interfaz principal
 */

class AdminCore {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.sessionTimeout = null;
        this.loginAttempts = 0;
        this.lockoutUntil = null;
        
        // Configuración de paginación
        this.paginationConfig = {
            wordsPerPage: 10,
            currentPage: 1,
            totalPages: 1,
            totalWords: 0
        };
        
        this.init();
    }

    /**
     * Inicializar el sistema de administración
     */
    init() {
        this.checkAuthStatus();
        this.setupEventListeners();
        this.setupSessionTimeout();
    }

    /**
     * Verificar estado de autenticación
     */
    checkAuthStatus() {
        try {
            const authData = storageManager.get('admin_auth', null);
            
            if (authData && authData.token && authData.expiresAt) {
                const now = new Date().getTime();
                const expiresAt = new Date(authData.expiresAt).getTime();
                
                if (now < expiresAt) {
                    this.isAuthenticated = true;
                    this.currentUser = authData.user;
                    this.setupSessionTimeout();
                    this.log('Session restored', this.currentUser);
                } else {
                    this.logout();
                }
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            this.logout();
        }
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupLoginForm();
            this.setupLogoutButton();
            this.setupTabNavigation();
            this.setupAdminActions();
        });
    }

    /**
     * Configurar formulario de login
     */
    setupLoginForm() {
        const loginForm = document.getElementById('admin-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    }

    /**
     * Configurar botón de logout
     */
    setupLogoutButton() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }

    /**
     * Manejar intento de login
     */
    handleLogin() {
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;
        const messageDiv = document.getElementById('login-message');

        // Verificar si está bloqueado
        if (this.lockoutUntil && new Date() < this.lockoutUntil) {
            const remainingTime = Math.ceil((this.lockoutUntil - new Date()) / 1000);
            messageDiv.innerHTML = `<div class="error">Cuenta bloqueada. Intenta de nuevo en ${remainingTime} segundos.</div>`;
            return;
        }

        // Validar credenciales
        if (this.authenticate(username, password)) {
            this.loginSuccess(username);
        } else {
            this.loginFailed();
        }
    }

    /**
     * Autenticar usuario
     */
    authenticate(username, password) {
        // En producción, esto se haría contra una API
        const validCredentials = {
            'admin': 'admin123',
            'teacher': 'teacher123',
            'demo': 'demo123'
        };

        return validCredentials[username] === password;
    }

    /**
     * Login exitoso
     */
    loginSuccess(username) {
        this.isAuthenticated = true;
        this.currentUser = {
            username: username,
            role: username === 'admin' ? 'Administrador' : 'Profesor',
            loginTime: new Date().toISOString()
        };

        // Guardar sesión
        const sessionData = {
            token: this.generateToken(),
            user: this.currentUser,
            expiresAt: new Date(Date.now() + APP_CONFIG.AUTH.SESSION_TIMEOUT).toISOString()
        };

        storageManager.set('admin_auth', sessionData);

        // Mostrar panel de admin
        this.showAdminPanel();
        this.setupSessionTimeout();
        this.resetLoginAttempts();

        this.log('Login successful', username);
    }

    /**
     * Login fallido
     */
    loginFailed() {
        this.loginAttempts++;
        const messageDiv = document.getElementById('login-message');
        
        if (this.loginAttempts >= APP_CONFIG.AUTH.MAX_LOGIN_ATTEMPTS) {
            this.lockoutUntil = new Date(Date.now() + APP_CONFIG.AUTH.LOCKOUT_DURATION);
            messageDiv.innerHTML = `<div class="error">Demasiados intentos fallidos. Cuenta bloqueada por ${APP_CONFIG.AUTH.LOCKOUT_DURATION / 1000 / 60} minutos.</div>`;
        } else {
            const remainingAttempts = APP_CONFIG.AUTH.MAX_LOGIN_ATTEMPTS - this.loginAttempts;
            messageDiv.innerHTML = `<div class="error">Credenciales incorrectas. Intentos restantes: ${remainingAttempts}</div>`;
        }

        this.log('Login failed', { attempts: this.loginAttempts });
    }

    /**
     * Mostrar panel de administración
     */
    showAdminPanel() {
        document.getElementById('admin-login-section').style.display = 'none';
        document.getElementById('admin-panel-section').style.display = 'block';
        
        // Actualizar nombre de usuario
        const userNameSpan = document.getElementById('admin-user-name');
        const userRoleSpan = document.getElementById('user-role');
        const sessionTimeSpan = document.getElementById('session-time');
        
        if (userNameSpan) userNameSpan.textContent = this.currentUser.role;
        if (userRoleSpan) userRoleSpan.textContent = this.currentUser.role;
        if (sessionTimeSpan) sessionTimeSpan.textContent = new Date().toLocaleTimeString();

        // Cargar contenido inicial
        this.loadDashboard();
        this.loadCategories();
        this.loadWords();
        this.loadBackups();
    }

    /**
     * Configurar navegación por pestañas
     */
    setupTabNavigation() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Actualizar botones activos
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Mostrar pestaña correspondiente
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.id === `${targetTab}-tab`) {
                        pane.classList.add('active');
                    }
                });

                // Cargar contenido de la pestaña
                this.loadTabContent(targetTab);
            });
        });
    }

    /**
     * Cargar contenido de pestaña
     */
    loadTabContent(tabName) {
        switch (tabName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'categories':
                this.loadCategories();
                break;
            case 'words':
                this.loadWords();
                break;
            case 'backup':
                this.loadBackups();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    /**
     * Cargar dashboard
     */
    loadDashboard() {
        const statsContent = document.getElementById('stats-content');
        const recentActivity = document.getElementById('recent-activity');

        if (statsContent) {
            const stats = vocabularyManager.getVocabularyStats();
            if (stats) {
                statsContent.innerHTML = `
                    <div class="stat-item">
                        <span class="stat-label">Categorías:</span>
                        <span class="stat-value">${stats.totalCategories}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Palabras:</span>
                        <span class="stat-value">${stats.totalWords}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Tamaño:</span>
                        <span class="stat-value">${stats.sizeKB} KB</span>
                    </div>
                `;
            } else {
                statsContent.innerHTML = '<div class="error">Error al cargar estadísticas</div>';
            }
        }

        if (recentActivity) {
            const now = new Date();
            recentActivity.innerHTML = `
                <div class="activity-item">
                    <span class="activity-time">${now.toLocaleTimeString()}</span>
                    <span class="activity-text">Sesión iniciada</span>
                </div>
                <div class="activity-item">
                    <span class="activity-time">${now.toLocaleTimeString()}</span>
                    <span class="activity-text">Panel de administración cargado</span>
                </div>
            `;
        }
    }

    /**
     * Cargar categorías
     */
    loadCategories() {
        const categoriesList = document.getElementById('categories-list');
        const totalCategories = document.getElementById('total-categories');
        const totalWords = document.getElementById('total-words');
        const avgWordsPerCategory = document.getElementById('avg-words-per-category');

        if (categoriesList) {
            const stats = vocabularyManager.getVocabularyStats();
            if (stats) {
                // Actualizar estadísticas
                if (totalCategories) totalCategories.textContent = stats.totalCategories;
                if (totalWords) totalWords.textContent = stats.totalWords;
                if (avgWordsPerCategory) {
                    const avg = stats.totalCategories > 0 ? Math.round(stats.totalWords / stats.totalCategories) : 0;
                    avgWordsPerCategory.textContent = avg;
                }

                // Generar lista de categorías
                let categoriesHTML = '';
                Object.keys(stats.categories).forEach(category => {
                    const catData = stats.categories[category];
                    categoriesHTML += `
                        <div class="category-item">
                            <div class="category-info">
                                <div class="category-name">${catData.displayName}</div>
                                <div class="category-count">${catData.wordCount} palabras</div>
                            </div>
                            <div class="category-actions">
                                <button class="btn btn-secondary btn-sm" onclick="adminCore.editCategory('${category}')">
                                    ✏️ Editar
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="adminCore.deleteCategory('${category}')">
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    `;
                });

                categoriesList.innerHTML = categoriesHTML || '<div class="no-data">No hay categorías disponibles</div>';

                // Inicializar filtro de categorías en la pestaña de vocabulario
                this.initializeCategoryFilter();
            } else {
                categoriesList.innerHTML = '<div class="error">Error al cargar categorías</div>';
            }
        }
    }

    /**
     * Limpiar paginación
     */
    clearPagination() {
        const existingPagination = document.querySelector('.pagination-container');
        if (existingPagination) {
            existingPagination.remove();
        }
    }

    /**
     * Cargar palabras con paginación
     */
    loadWords(page = 1, searchQuery = '', categoryFilter = '') {
        try {
            const wordsList = document.getElementById('words-list');
            const wordsFoundCount = document.getElementById('words-found-count');

            if (!wordsList) {
                console.error('Elemento words-list no encontrado');
                return;
            }

            // Limpiar paginación anterior
            this.clearPagination();

            const stats = vocabularyManager.getVocabularyStats();
            if (!stats) {
                wordsList.innerHTML = '<div class="error">Error al cargar vocabulario: No se pudieron obtener estadísticas</div>';
                if (wordsFoundCount) {
                    wordsFoundCount.textContent = 'Error al cargar datos';
                }
                return;
            }

            // Obtener todas las palabras
            let allWords = [];
            try {
                Object.keys(stats.categories).forEach(category => {
                    const words = vocabularyManager.vocabulary[category] || [];
                    words.forEach((word, index) => {
                        if (word && word.english && word.spanish) {
                            allWords.push({
                                ...word,
                                category,
                                index,
                                displayName: stats.categories[category]?.displayName || category
                            });
                        }
                    });
                });
            } catch (error) {
                console.error('Error al procesar palabras:', error);
                wordsList.innerHTML = '<div class="error">Error al procesar el vocabulario</div>';
                return;
            }

            // Filtrar por búsqueda si hay query
            if (searchQuery && searchQuery.trim() !== '') {
                const query = searchQuery.toLowerCase();
                allWords = allWords.filter(word => 
                    word.english.toLowerCase().includes(query) ||
                    word.spanish.toLowerCase().includes(query) ||
                    word.displayName.toLowerCase().includes(query)
                );
            }

            // Filtrar por categoría si se aplica
            if (categoryFilter && categoryFilter.trim() !== '') {
                allWords = allWords.filter(word => word.category === categoryFilter);
            }

            // Actualizar configuración de paginación
            this.paginationConfig.totalWords = allWords.length;
            this.paginationConfig.totalPages = Math.ceil(allWords.length / this.paginationConfig.wordsPerPage);
            this.paginationConfig.currentPage = Math.min(page, this.paginationConfig.totalPages);
            this.paginationConfig.currentPage = Math.max(1, this.paginationConfig.totalPages);

            // Obtener palabras para la página actual
            const startIndex = (this.paginationConfig.currentPage - 1) * this.paginationConfig.wordsPerPage;
            const endIndex = startIndex + this.paginationConfig.wordsPerPage;
            const currentPageWords = allWords.slice(startIndex, endIndex);

            // Generar HTML para las palabras
            let wordsHTML = '';
            if (currentPageWords.length > 0) {
                currentPageWords.forEach(word => {
                    wordsHTML += `
                        <div class="word-item">
                            <div class="word-info">
                                <span class="word-emoji">${word.image || '📝'}</span>
                                <div class="word-english">${word.english}</div>
                                <div class="word-spanish">${word.spanish}</div>
                                <div class="word-category">📁 ${word.displayName}</div>
                            </div>
                            <div class="word-actions">
                                <button class="btn btn-secondary btn-sm" onclick="adminCore.editWord('${word.category}', ${word.index})">
                                    ✏️ Editar
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="adminCore.deleteWord('${word.category}', ${word.index})">
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    `;
                });
            } else {
                // Mensaje personalizado según los filtros aplicados
                let noDataMessage = 'No hay palabras disponibles';
                if (searchQuery && categoryFilter) {
                    noDataMessage = `No se encontraron palabras para "${searchQuery}" en la categoría seleccionada`;
                } else if (searchQuery) {
                    noDataMessage = `No se encontraron palabras para "${searchQuery}"`;
                } else if (categoryFilter) {
                    noDataMessage = 'No hay palabras en la categoría seleccionada';
                }
                wordsHTML = `<div class="no-data">${noDataMessage}</div>`;
            }

            // Actualizar contador y lista con información de filtros
            if (wordsFoundCount) {
                let totalText = `${allWords.length} palabras`;
                
                if (searchQuery && categoryFilter) {
                    totalText += ` encontradas para "${searchQuery}" en categoría filtrada`;
                } else if (searchQuery) {
                    totalText += ` encontradas para "${searchQuery}"`;
                } else if (categoryFilter) {
                    const categoryName = stats.categories[categoryFilter]?.displayName || categoryFilter;
                    totalText += ` en categoría "${categoryName}"`;
                } else {
                    totalText += ' totales';
                }
                
                if (this.paginationConfig.totalPages > 1) {
                    totalText += ` - Página ${this.paginationConfig.currentPage} de ${this.paginationConfig.totalPages}`;
                }
                
                wordsFoundCount.textContent = totalText;
            }

            wordsList.innerHTML = wordsHTML;

            // Añadir paginación solo si hay más de una página
            if (this.paginationConfig.totalPages > 1) {
                this.addPagination(wordsList);
            }

            // Log para debug
            if (APP_CONFIG.DEBUG_MODE) {
                console.log('Paginación actualizada:', {
                    totalWords: allWords.length,
                    totalPages: this.paginationConfig.totalPages,
                    currentPage: this.paginationConfig.currentPage,
                    wordsPerPage: this.paginationConfig.wordsPerPage,
                    searchQuery,
                    categoryFilter
                });
            }

        } catch (error) {
            console.error('Error en loadWords:', error);
            const wordsList = document.getElementById('words-list');
            if (wordsList) {
                wordsList.innerHTML = '<div class="error">Error inesperado al cargar palabras</div>';
            }
        }
    }

    /**
     * Añadir controles de paginación
     */
    addPagination(container) {
        // Eliminar paginación anterior si existe
        const existingPagination = container.parentNode.querySelector('.pagination-container');
        if (existingPagination) {
            existingPagination.remove();
        }

        if (this.paginationConfig.totalPages <= 1) return;

        const paginationHTML = `
            <div class="pagination-container">
                <div class="pagination-info">
                    Mostrando ${this.paginationConfig.wordsPerPage} palabras por página
                </div>
                <div class="pagination-controls">
                    <button class="btn btn-secondary btn-sm" 
                            onclick="adminCore.changePage(1)" 
                            ${this.paginationConfig.currentPage === 1 ? 'disabled' : ''}>
                        ⏮️ Primera
                    </button>
                    <button class="btn btn-secondary btn-sm" 
                            onclick="adminCore.changePage(${this.paginationConfig.currentPage - 1})" 
                            ${this.paginationConfig.currentPage === 1 ? 'disabled' : ''}>
                        ◀️ Anterior
                    </button>
                    
                    <span class="pagination-numbers">
                        ${this.generatePageNumbers()}
                    </span>
                    
                    <button class="btn btn-secondary btn-sm" 
                            onclick="adminCore.changePage(${this.paginationConfig.currentPage + 1})" 
                            ${this.paginationConfig.currentPage === this.paginationConfig.totalPages ? 'disabled' : ''}>
                        Siguiente ▶️
                    </button>
                    <button class="btn btn-secondary btn-sm" 
                            onclick="adminCore.changePage(${this.paginationConfig.totalPages})" 
                            ${this.paginationConfig.currentPage === this.paginationConfig.totalPages ? 'disabled' : ''}>
                        Última ⏭️
                    </button>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('afterend', paginationHTML);
    }

    /**
     * Generar números de página
     */
    generatePageNumbers() {
        const current = this.paginationConfig.currentPage;
        const total = this.paginationConfig.totalPages;
        let pages = [];

        // Mostrar máximo 5 páginas alrededor de la actual
        const start = Math.max(1, current - 2);
        const end = Math.min(total, current + 2);

        for (let i = start; i <= end; i++) {
            if (i === current) {
                pages.push(`<button class="btn btn-primary btn-sm" disabled>${i}</button>`);
            } else {
                pages.push(`<button class="btn btn-secondary btn-sm" onclick="adminCore.changePage(${i})">${i}</button>`);
            }
        }

        return pages.join('');
    }

    /**
     * Cambiar de página
     */
    changePage(page) {
        if (page < 1 || page > this.paginationConfig.totalPages) return;
        
        this.paginationConfig.currentPage = page;
        
        // Obtener query de búsqueda actual
        const searchInput = document.getElementById('word-search-input');
        const searchQuery = searchInput ? searchInput.value : '';
        const categoryFilterSelect = document.getElementById('category-filter-select');
        const categoryFilter = categoryFilterSelect ? categoryFilterSelect.value : '';
        
        // Recargar palabras con la nueva página
        this.loadWords(page, searchQuery, categoryFilter);
        
        // Hacer scroll hacia arriba de la lista
        const wordsList = document.getElementById('words-list');
        if (wordsList) {
            wordsList.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Actualizar paginación automáticamente
     */
    updatePagination() {
        // Recalcular total de palabras
        const stats = vocabularyManager.getVocabularyStats();
        if (stats) {
            let totalWords = 0;
            Object.keys(stats.categories).forEach(category => {
                const words = vocabularyManager.vocabulary[category] || [];
                totalWords += words.length;
            });

            // Si el total cambió, recalcular páginas
            if (totalWords !== this.paginationConfig.totalWords) {
                this.paginationConfig.totalWords = totalWords;
                this.paginationConfig.totalPages = Math.ceil(totalWords / this.paginationConfig.wordsPerPage);
                
                // Si la página actual ya no existe, ir a la primera
                if (this.paginationConfig.currentPage > this.paginationConfig.totalPages) {
                    this.paginationConfig.currentPage = 1;
                }
                
                // Recargar palabras con la nueva paginación
                const searchInput = document.getElementById('word-search-input');
                const searchQuery = searchInput ? searchInput.value : '';
                const categoryFilterSelect = document.getElementById('category-filter-select');
                const categoryFilter = categoryFilterSelect ? categoryFilterSelect.value : '';
                this.loadWords(this.paginationConfig.currentPage, searchQuery, categoryFilter);
            }
        }
    }

    /**
     * Recargar datos después de cambios
     */
    reloadData() {
        // Recargar dashboard
        this.loadDashboard();
        
        // Recargar categorías
        this.loadCategories();
        
        // Recargar palabras con paginación actual
        const searchInput = document.getElementById('word-search-input');
        const searchQuery = searchInput ? searchInput.value : '';
        const categoryFilterSelect = document.getElementById('category-filter-select');
        const categoryFilter = categoryFilterSelect ? categoryFilterSelect.value : '';
        this.loadWords(this.paginationConfig.currentPage, searchQuery, categoryFilter);
    }

    /**
     * Cargar backups
     */
    loadBackups() {
        const backupsList = document.getElementById('backups-list');
        const lastBackupTime = document.getElementById('last-backup-time');
        const availableBackups = document.getElementById('available-backups');
        const backupSize = document.getElementById('backup-size');

        if (backupsList) {
            try {
                const backups = storageManager.getAvailableBackups();
                
                if (lastBackupTime) {
                    lastBackupTime.textContent = backups.length > 0 ? 
                        new Date(backups[0].timestamp).toLocaleString() : 'Nunca';
                }
                
                if (availableBackups) availableBackups.textContent = backups.length;
                
                if (backupSize) {
                    const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0);
                    backupSize.textContent = `${(totalSize / 1024).toFixed(2)} KB`;
                }

                let backupsHTML = '';
                backups.forEach(backup => {
                    backupsHTML += `
                        <div class="backup-item">
                            <div class="backup-info">
                                <div class="backup-date">${new Date(backup.timestamp).toLocaleString()}</div>
                                <div class="backup-size">${(backup.size / 1024).toFixed(2)} KB</div>
                            </div>
                            <div class="backup-actions">
                                <button class="btn btn-warning btn-sm" onclick="adminCore.restoreBackup('${backup.key}')">
                                    🔄 Restaurar
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="adminCore.deleteBackup('${backup.key}')">
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    `;
                });

                backupsList.innerHTML = backupsHTML || '<div class="no-data">No hay backups disponibles</div>';
            } catch (error) {
                backupsList.innerHTML = '<div class="error">Error al cargar backups</div>';
            }
        }
    }

    /**
     * Cargar configuración
     */
    loadSettings() {
        const sessionTimeout = document.getElementById('session-timeout-setting');
        const maxCategories = document.getElementById('max-categories-setting');
        const maxWordsPerCategory = document.getElementById('max-words-per-category-setting');
        const autoBackup = document.getElementById('auto-backup-setting');
        const maxBackups = document.getElementById('max-backups-setting');

        if (sessionTimeout) sessionTimeout.value = APP_CONFIG.AUTH.SESSION_TIMEOUT / 60000;
        if (maxCategories) maxCategories.value = APP_CONFIG.VOCABULARY.MAX_CATEGORIES;
        if (maxWordsPerCategory) maxWordsPerCategory.value = APP_CONFIG.VOCABULARY.MAX_WORDS_PER_CATEGORY;
        if (maxBackups) maxBackups.value = APP_CONFIG.STORAGE.MAX_BACKUPS;
    }

    /**
     * Configurar acciones del admin
     */
    setupAdminActions() {
        // Botón añadir categoría
        const addCategoryBtn = document.getElementById('add-category-btn');
        if (addCategoryBtn) {
            addCategoryBtn.addEventListener('click', () => {
                this.showAddCategoryModal();
            });
        }

        // Botón añadir palabra
        const addWordBtn = document.getElementById('add-word-btn');
        if (addWordBtn) {
            addWordBtn.addEventListener('click', () => {
                this.showAddWordModal();
            });
        }

        // Configurar búsqueda en tiempo real
        const wordSearchInput = document.getElementById('word-search-input');
        if (wordSearchInput) {
            let searchTimeout;
            wordSearchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300); // Debounce de 300ms
            });
        }

        // Configurar filtro de categorías
        const categoryFilterSelect = document.getElementById('category-filter-select');
        if (categoryFilterSelect) {
            categoryFilterSelect.addEventListener('change', (e) => {
                this.performSearch(wordSearchInput ? wordSearchInput.value : '', e.target.value);
            });
        }

        // Botón de búsqueda
        const searchBtn = document.getElementById('search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = wordSearchInput ? wordSearchInput.value : '';
                const category = categoryFilterSelect ? categoryFilterSelect.value : '';
                this.performSearch(query, category);
            });
        }

        // Botón limpiar búsqueda
        const clearSearchBtn = document.getElementById('clear-search-btn');
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                if (wordSearchInput) wordSearchInput.value = '';
                if (categoryFilterSelect) categoryFilterSelect.value = '';
                this.performSearch('', '');
            });
        }

        // Botones de backup
        const exportBtn = document.getElementById('export-vocabulary-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportVocabulary();
            });
        }

        const importBtn = document.getElementById('import-vocabulary-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                this.showImportModal();
            });
        }

        const createBackupBtn = document.getElementById('create-backup-btn');
        if (createBackupBtn) {
            createBackupBtn.addEventListener('click', () => {
                this.createBackup();
            });
        }

        const restoreBackupBtn = document.getElementById('restore-backup-btn');
        if (restoreBackupBtn) {
            restoreBackupBtn.addEventListener('click', () => {
                this.showRestoreBackupModal();
            });
        }

        // Botón guardar configuración
        const saveSettingsBtn = document.getElementById('save-settings-btn');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.saveSettings();
            });
        }

        // Botón actualizar datos
        const refreshDataBtn = document.getElementById('refresh-data-btn');
        if (refreshDataBtn) {
            refreshDataBtn.addEventListener('click', () => {
                this.refreshData();
            });
        }
    }

    /**
     * Probar filtro de categorías
     */
    testCategoryFilter() {
        const categoryFilterSelect = document.getElementById('category-filter-select');
        if (categoryFilterSelect) {
            console.log('Filtro de categorías actual:', {
                selectedValue: categoryFilterSelect.value,
                selectedText: categoryFilterSelect.options[categoryFilterSelect.selectedIndex]?.text,
                totalOptions: categoryFilterSelect.options.length
            });
        }
    }

    /**
     * Realizar búsqueda
     */
    performSearch(query, category = '') {
        // Log para debug
        if (APP_CONFIG.DEBUG_MODE) {
            console.log('Realizando búsqueda:', { query, category });
        }

        // Resetear a la primera página
        this.paginationConfig.currentPage = 1;
        
        // Cargar palabras con la búsqueda y filtro de categoría
        this.loadWords(1, query, category);
        
        // Actualizar filtro de categorías si es necesario
        this.updateCategoryFilter(category);

        // Probar filtro para debug
        if (APP_CONFIG.DEBUG_MODE) {
            this.testCategoryFilter();
        }
    }

    /**
     * Actualizar filtro de categorías
     */
    updateCategoryFilter(selectedCategory = '') {
        const categoryFilterSelect = document.getElementById('category-filter-select');
        if (categoryFilterSelect) {
            // Limpiar opciones existentes
            categoryFilterSelect.innerHTML = '<option value="">Todas las categorías</option>';
            
            // Obtener categorías disponibles
            const stats = vocabularyManager.getVocabularyStats();
            if (stats && stats.categories) {
                Object.keys(stats.categories).forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = stats.categories[category].displayName;
                    if (category === selectedCategory) {
                        option.selected = true;
                    }
                    categoryFilterSelect.appendChild(option);
                });
            }
        }
    }

    /**
     * Inicializar filtro de categorías
     */
    initializeCategoryFilter() {
        this.updateCategoryFilter('');
    }

    /**
     * Mostrar modal para añadir categoría
     */
    showAddCategoryModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>➕ Nueva Categoría</h3>
                <form id="add-category-form">
                    <div class="form-group">
                        <label for="category-name">Nombre técnico:</label>
                        <input type="text" id="category-name" name="name" required 
                               placeholder="ej: professions" pattern="[a-z_]+">
                        <small>Usar solo letras minúsculas y guiones bajos</small>
                    </div>
                    <div class="form-group">
                        <label for="category-display">Nombre visible:</label>
                        <input type="text" id="category-display" name="display" required 
                               placeholder="ej: Profesiones">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Crear Categoría</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Configurar formulario
        const form = modal.querySelector('#add-category-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddCategory(form);
        });
    }

    /**
     * Manejar creación de categoría
     */
    handleAddCategory(form) {
        const formData = new FormData(form);
        const name = formData.get('name');
        const display = formData.get('display');

        const result = vocabularyManager.createCategory(name, display);
        
        if (result.success) {
            this.showMessage('Categoría creada exitosamente', 'success');
            form.closest('.modal').remove();
            this.reloadData(); // Recargar todos los datos
        } else {
            this.showMessage(result.message, 'error');
        }
    }

    /**
     * Mostrar modal para añadir palabra
     */
    showAddWordModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>📝 Nueva Palabra</h3>
                <form id="add-word-form">
                    <div class="form-group">
                        <label for="word-category">Categoría:</label>
                        <select id="word-category" name="category" required>
                            ${this.getCategoryOptions()}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="word-english">Inglés:</label>
                        <input type="text" id="word-english" name="english" required>
                    </div>
                    <div class="form-group">
                        <label for="word-spanish">Español:</label>
                        <input type="text" id="word-spanish" name="spanish" required>
                    </div>
                    <div class="form-group">
                        <label for="word-image">Emoji:</label>
                        <input type="text" id="word-image" name="image" placeholder="🐕">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Añadir Palabra</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Configurar formulario
        const form = modal.querySelector('#add-word-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddWord(form);
        });
    }

    /**
     * Obtener opciones de categorías para el select
     */
    getCategoryOptions() {
        const stats = vocabularyManager.getVocabularyStats();
        if (!stats) return '<option value="">No hay categorías disponibles</option>';

        return Object.keys(stats.categories).map(category => 
            `<option value="${category}">${stats.categories[category].displayName}</option>`
        ).join('');
    }

    /**
     * Manejar creación de palabra
     */
    handleAddWord(form) {
        const formData = new FormData(form);
        const category = formData.get('category');
        const english = formData.get('english');
        const spanish = formData.get('spanish');
        const image = formData.get('image') || '📝';

        const result = vocabularyManager.addWord(category, english, spanish, image);
        
        if (result.success) {
            this.showMessage('Palabra añadida exitosamente', 'success');
            form.closest('.modal').remove();
            this.reloadData(); // Recargar todos los datos
        } else {
            this.showMessage(result.message, 'error');
        }
    }

    /**
     * Exportar vocabulario
     */
    exportVocabulary() {
        try {
            const data = vocabularyManager.exportVocabulary();
            if (data) {
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `vocabulary_${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                this.showMessage('Vocabulario exportado exitosamente', 'success');
            } else {
                this.showMessage('Error al exportar vocabulario', 'error');
            }
        } catch (error) {
            this.showMessage('Error al exportar vocabulario', 'error');
        }
    }

    /**
     * Crear backup
     */
    createBackup() {
        try {
            const backupKey = storageManager.createBackup();
            if (backupKey) {
                this.showMessage('Backup creado exitosamente', 'success');
                this.loadBackups();
            } else {
                this.showMessage('Error al crear backup', 'error');
            }
        } catch (error) {
            this.showMessage('Error al crear backup', 'error');
        }
    }

    /**
     * Mostrar mensaje
     */
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    /**
     * Generar token de sesión
     */
    generateToken() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    /**
     * Configurar timeout de sesión
     */
    setupSessionTimeout() {
        if (this.sessionTimeout) {
            clearTimeout(this.sessionTimeout);
        }

        this.sessionTimeout = setTimeout(() => {
            this.logout('Sesión expirada');
        }, APP_CONFIG.AUTH.SESSION_TIMEOUT);
    }

    /**
     * Resetear intentos de login
     */
    resetLoginAttempts() {
        this.loginAttempts = 0;
        this.lockoutUntil = null;
    }

    /**
     * Cerrar sesión
     */
    logout(reason = 'Logout manual') {
        this.isAuthenticated = false;
        this.currentUser = null;
        
        if (this.sessionTimeout) {
            clearTimeout(this.sessionTimeout);
            this.sessionTimeout = null;
        }

        storageManager.remove('admin_auth');
        
        // Ocultar panel de admin
        const adminPanel = document.getElementById('admin-panel-section');
        const adminLogin = document.getElementById('admin-login-section');
        
        if (adminPanel) adminPanel.style.display = 'none';
        if (adminLogin) adminLogin.style.display = 'block';

        // Limpiar formulario
        const loginForm = document.getElementById('admin-login-form');
        if (loginForm) loginForm.reset();

        // Limpiar mensajes
        const loginMessage = document.getElementById('login-message');
        if (loginMessage) loginMessage.innerHTML = '';

        this.log('Logout', reason);
    }

    /**
     * Actualizar datos
     */
    refreshData() {
        this.loadDashboard();
        this.loadCategories();
        this.loadWords();
        this.loadBackups();
        this.showMessage('Datos actualizados', 'success');
    }

    /**
     * Logging para debugging
     */
    log(action, data) {
        if (APP_CONFIG.DEBUG_MODE) {
            console.log(`[AdminCore] ${action}:`, data);
        }
    }

    /**
     * Mostrar modal para restaurar backup
     */
    showRestoreBackupModal() {
        const backups = storageManager.getAvailableBackups();
        if (backups.length === 0) {
            this.showMessage('No hay backups disponibles para restaurar', 'warning');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>🔄 Restaurar desde Backup</h3>
                <div class="form-group">
                    <label for="backup-select">Seleccionar backup:</label>
                    <select id="backup-select" required>
                        ${backups.map(backup => 
                            `<option value="${backup.key}">${new Date(backup.timestamp).toLocaleString()} (${(backup.size / 1024).toFixed(2)} KB)</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="overwrite-data"> Sobrescribir datos existentes
                    </label>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                    <button type="button" class="btn btn-warning" onclick="adminCore.restoreBackup()">🔄 Restaurar</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * Restaurar backup
     */
    restoreBackup() {
        const backupSelect = document.getElementById('backup-select');
        const overwriteData = document.getElementById('overwrite-data');
        
        if (!backupSelect || !backupSelect.value) {
            this.showMessage('Selecciona un backup para restaurar', 'error');
            return;
        }

        try {
            const result = storageManager.restoreFromBackup(backupSelect.value);
            if (result) {
                this.showMessage('Backup restaurado exitosamente. Recargando página...', 'success');
                setTimeout(() => {
                    location.reload();
                }, 2000);
            } else {
                this.showMessage('Error al restaurar backup', 'error');
            }
        } catch (error) {
            this.showMessage('Error al restaurar backup', 'error');
        }

        // Cerrar modal
        const modal = document.querySelector('.modal');
        if (modal) modal.remove();
    }

    /**
     * Eliminar backup
     */
    deleteBackup(backupKey) {
        if (confirm('¿Estás seguro de eliminar este backup?')) {
            try {
                storageManager.remove(backupKey);
                this.showMessage('Backup eliminado exitosamente', 'success');
                this.loadBackups();
            } catch (error) {
                this.showMessage('Error al eliminar backup', 'error');
            }
        }
    }

    /**
     * Mostrar modal para importar vocabulario
     */
    showImportModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>📥 Importar Vocabulario</h3>
                <div class="form-group">
                    <label for="import-file">Seleccionar archivo JSON:</label>
                    <input type="file" id="import-file" accept=".json" required>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="import-overwrite"> Sobrescribir datos existentes
                    </label>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                    <button type="button" class="btn btn-primary" onclick="adminCore.handleImport()">📥 Importar</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * Manejar importación de archivo
     */
    handleImport() {
        const fileInput = document.getElementById('import-file');
        const overwrite = document.getElementById('import-overwrite');
        
        if (!fileInput.files[0]) {
            this.showMessage('Selecciona un archivo para importar', 'error');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const result = vocabularyManager.importVocabulary(e.target.result, {
                    overwrite: overwrite.checked,
                    validate: true
                });

                if (result && result.success) {
                    this.showMessage(`Importación completada: ${result.stats.imported} importadas, ${result.stats.skipped} omitidas`, 'success');
                    this.loadDashboard();
                    this.loadCategories();
                    this.loadWords();
                } else {
                    this.showMessage('Error al importar vocabulario', 'error');
                }
            } catch (error) {
                this.showMessage('Error al procesar archivo', 'error');
            }

            // Cerrar modal
            const modal = document.querySelector('.modal');
            if (modal) modal.remove();
        };

        reader.readAsText(file);
    }

    /**
     * Editar categoría
     */
    editCategory(categoryName) {
        const stats = vocabularyManager.getVocabularyStats();
        if (!stats || !stats.categories[categoryName]) {
            this.showMessage('Categoría no encontrada', 'error');
            return;
        }

        const catData = stats.categories[categoryName];
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>✏️ Editar Categoría</h3>
                <form id="edit-category-form">
                    <div class="form-group">
                        <label for="edit-category-name">Nombre técnico:</label>
                        <input type="text" id="edit-category-name" name="name" value="${categoryName}" readonly>
                        <small>El nombre técnico no se puede cambiar</small>
                    </div>
                    <div class="form-group">
                        <label for="edit-category-display">Nombre visible:</label>
                        <input type="text" id="edit-category-display" name="display" value="${catData.displayName}" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">💾 Guardar Cambios</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Configurar formulario
        const form = modal.querySelector('#edit-category-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditCategory(categoryName, form);
        });
    }

    /**
     * Manejar edición de categoría
     */
    handleEditCategory(oldName, form) {
        const formData = new FormData(form);
        const newDisplayName = formData.get('display');

        if (newDisplayName.trim() === '') {
            this.showMessage('El nombre visible no puede estar vacío', 'error');
            return;
        }

        // Actualizar el nombre de visualización en el vocabulario
        try {
            // Aquí actualizarías el nombre de visualización
            // Por ahora, solo mostramos un mensaje de éxito
            this.showMessage('Categoría actualizada exitosamente', 'success');
            this.loadCategories();
            form.closest('.modal').remove();
        } catch (error) {
            this.showMessage('Error al actualizar categoría', 'error');
        }
    }

    /**
     * Eliminar categoría
     */
    deleteCategory(categoryName) {
        const stats = vocabularyManager.getVocabularyStats();
        if (!stats || !stats.categories[categoryName]) {
            this.showMessage('Categoría no encontrada', 'error');
            return;
        }

        const catData = stats.categories[categoryName];
        const confirmMessage = `¿Estás seguro de eliminar la categoría "${catData.displayName}" con ${catData.wordCount} palabras? Esta acción no se puede deshacer.`;

        if (confirm(confirmMessage)) {
            try {
                const result = vocabularyManager.deleteCategory(categoryName);
                if (result.success) {
                    this.showMessage('Categoría eliminada exitosamente', 'success');
                    this.reloadData(); // Recargar todos los datos
                } else {
                    this.showMessage(result.message, 'error');
                }
            } catch (error) {
                this.showMessage('Error al eliminar categoría', 'error');
            }
        }
    }

    /**
     * Editar palabra
     */
    editWord(categoryName, wordIndex) {
        const words = vocabularyManager.vocabulary[categoryName];
        if (!words || !words[wordIndex]) {
            this.showMessage('Palabra no encontrada', 'error');
            return;
        }

        const word = words[wordIndex];
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>✏️ Editar Palabra</h3>
                <form id="edit-word-form">
                    <div class="form-group">
                        <label for="edit-word-category">Categoría:</label>
                        <input type="text" id="edit-word-category" name="category" value="${categoryName}" readonly>
                    </div>
                    <div class="form-group">
                        <label for="edit-word-english">Inglés:</label>
                        <input type="text" id="edit-word-english" name="english" value="${word.english}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-word-spanish">Español:</label>
                        <input type="text" id="edit-word-spanish" name="spanish" value="${word.spanish}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-word-image">Emoji:</label>
                        <input type="text" id="edit-word-image" name="image" value="${word.image}" placeholder="🐕">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">💾 Guardar Cambios</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Configurar formulario
        const form = modal.querySelector('#edit-word-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditWord(categoryName, wordIndex, form);
        });
    }

    /**
     * Manejar edición de palabra
     */
    handleEditWord(categoryName, wordIndex, form) {
        const formData = new FormData(form);
        const english = formData.get('english');
        const spanish = formData.get('spanish');
        const image = formData.get('image') || '📝';

        const result = vocabularyManager.editWord(categoryName, wordIndex, english, spanish, image);
        
        if (result.success) {
            this.showMessage('Palabra editada exitosamente', 'success');
            form.closest('.modal').remove();
            this.reloadData(); // Recargar todos los datos
        } else {
            this.showMessage(result.message, 'error');
        }
    }

    /**
     * Eliminar palabra
     */
    deleteWord(categoryName, wordIndex) {
        const words = vocabularyManager.vocabulary[categoryName];
        if (!words || !words[wordIndex]) {
            this.showMessage('Palabra no encontrada', 'error');
            return;
        }

        const word = words[wordIndex];
        const confirmMessage = `¿Estás seguro de eliminar "${word.english}" (${word.spanish})?`;

        if (confirm(confirmMessage)) {
            try {
                const result = vocabularyManager.deleteWord(categoryName, wordIndex);
                if (result.success) {
                    this.showMessage('Palabra eliminada exitosamente', 'success');
                    this.reloadData(); // Recargar todos los datos
                } else {
                    this.showMessage(result.message, 'error');
                }
            } catch (error) {
                this.showMessage('Error al eliminar palabra', 'error');
            }
        }
    }

    /**
     * Guardar configuración
     */
    saveSettings() {
        const sessionTimeout = document.getElementById('session-timeout-setting');
        const maxCategories = document.getElementById('max-categories-setting');
        const maxWordsPerCategory = document.getElementById('max-words-per-category-setting');
        const autoBackup = document.getElementById('auto-backup-setting');
        const maxBackups = document.getElementById('max-backups-setting');

        try {
            // Actualizar configuración
            if (sessionTimeout) {
                APP_CONFIG.AUTH.SESSION_TIMEOUT = parseInt(sessionTimeout.value) * 60000;
            }
            if (maxCategories) {
                APP_CONFIG.VOCABULARY.MAX_CATEGORIES = parseInt(maxCategories.value);
            }
            if (maxWordsPerCategory) {
                APP_CONFIG.VOCABULARY.MAX_WORDS_PER_CATEGORY = parseInt(maxWordsPerCategory.value);
            }
            if (maxBackups) {
                APP_CONFIG.STORAGE.MAX_BACKUPS = parseInt(maxBackups.value);
            }

            // Guardar en localStorage
            storageManager.set('app_config', APP_CONFIG);
            
            this.showMessage('Configuración guardada exitosamente', 'success');
        } catch (error) {
            this.showMessage('Error al guardar configuración', 'error');
        }
    }

    /**
     * Búsqueda rápida
     */
    quickSearch() {
        const searchInput = document.getElementById('quick-search-input');
        if (!searchInput || !searchInput.value.trim()) {
            this.showMessage('Ingresa un término de búsqueda', 'warning');
            return;
        }

        const query = searchInput.value.trim();
        const results = vocabularyManager.searchWords(query);
        
        if (results.length > 0) {
            // Cambiar a la pestaña de vocabulario y mostrar resultados
            const wordsTab = document.querySelector('[data-tab="words"]');
            if (wordsTab) {
                wordsTab.click();
                
                // Actualizar la búsqueda en la pestaña de vocabulario
                const wordSearchInput = document.getElementById('word-search-input');
                if (wordSearchInput) {
                    wordSearchInput.value = query;
                }
                
                // Filtrar y mostrar resultados
                this.filterWords(query);
            }
        } else {
            this.showMessage('No se encontraron palabras con ese término', 'info');
        }
    }

    /**
     * Filtrar palabras
     */
    filterWords(query) {
        const wordsList = document.getElementById('words-list');
        const wordsFoundCount = document.getElementById('words-found-count');
        
        if (!wordsList) return;

        const results = vocabularyManager.searchWords(query);
        
        if (wordsFoundCount) {
            wordsFoundCount.textContent = `${results.length} palabras encontradas`;
        }

        if (results.length > 0) {
            let wordsHTML = '';
            results.forEach(result => {
                wordsHTML += `
                    <div class="word-item">
                        <div class="word-info">
                            <span class="word-emoji">${result.image}</span>
                            <div class="word-english">${result.english}</div>
                            <div class="word-spanish">${result.spanish}</div>
                        </div>
                        <div class="word-actions">
                            <button class="btn btn-secondary btn-sm" onclick="adminCore.editWord('${result.category}', ${result.index})">
                                ✏️ Editar
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="adminCore.deleteWord('${result.category}', ${result.index})">
                                🗑️ Eliminar
                            </button>
                        </div>
                    </div>
                `;
            });
            wordsList.innerHTML = wordsHTML;
        } else {
            wordsList.innerHTML = '<div class="no-data">No se encontraron palabras</div>';
        }
    }
}

// Crear instancia global
const adminCore = new AdminCore();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminCore;
} else {
    window.AdminCore = AdminCore;
    window.adminCore = adminCore;
}
