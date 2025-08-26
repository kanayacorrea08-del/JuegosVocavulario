/**
 * Sistema de almacenamiento escalable
 * Maneja localStorage, sessionStorage y futuras APIs de base de datos
 */

class StorageManager {
    constructor() {
        this.prefix = APP_CONFIG.STORAGE.PREFIX;
        this.backupInterval = APP_CONFIG.STORAGE.BACKUP_INTERVAL;
        this.maxBackups = APP_CONFIG.STORAGE.MAX_BACKUPS;
        this.init();
    }

    /**
     * Inicializar el sistema de almacenamiento
     */
    init() {
        this.setupAutoBackup();
        this.cleanupOldBackups();
    }

    /**
     * Obtener clave con prefijo
     */
    getKey(key) {
        return `${this.prefix}${key}`;
    }

    /**
     * Guardar datos en localStorage
     */
    set(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(this.getKey(key), serializedValue);
            this.log('set', key, value);
            return true;
        } catch (error) {
            this.handleError('set', key, error);
            return false;
        }
    }

    /**
     * Obtener datos de localStorage
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.getKey(key));
            if (item === null) return defaultValue;
            
            const parsed = JSON.parse(item);
            this.log('get', key, parsed);
            return parsed;
        } catch (error) {
            this.handleError('get', key, error);
            return defaultValue;
        }
    }

    /**
     * Eliminar datos de localStorage
     */
    remove(key) {
        try {
            localStorage.removeItem(this.getKey(key));
            this.log('remove', key);
            return true;
        } catch (error) {
            this.handleError('remove', key, error);
            return false;
        }
    }

    /**
     * Verificar si existe una clave
     */
    has(key) {
        return localStorage.getItem(this.getKey(key)) !== null;
    }

    /**
     * Obtener todas las claves con el prefijo
     */
    getAllKeys() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.prefix)) {
                keys.push(key.replace(this.prefix, ''));
            }
        }
        return keys;
    }

    /**
     * Limpiar todos los datos de la aplicación
     */
    clear() {
        try {
            const keys = this.getAllKeys();
            keys.forEach(key => this.remove(key));
            this.log('clear', 'all');
            return true;
        } catch (error) {
            this.handleError('clear', 'all', error);
            return false;
        }
    }

    /**
     * Obtener estadísticas de almacenamiento
     */
    getStats() {
        const keys = this.getAllKeys();
        let totalSize = 0;
        
        keys.forEach(key => {
            const value = this.get(key);
            totalSize += JSON.stringify(value).length;
        });

        return {
            totalKeys: keys.length,
            totalSize: totalSize,
            totalSizeKB: (totalSize / 1024).toFixed(2),
            availableSpace: this.getAvailableSpace()
        };
    }

    /**
     * Crear backup automático
     */
    createBackup() {
        try {
            const timestamp = new Date().toISOString();
            const backupData = {};
            const keys = this.getAllKeys();
            
            keys.forEach(key => {
                backupData[key] = this.get(key);
            });

            const backup = {
                timestamp,
                version: APP_CONFIG.VERSION,
                data: backupData
            };

            const backupKey = `backup_${timestamp}`;
            this.set(backupKey, backup);
            
            // Limpiar backups antiguos
            this.cleanupOldBackups();
            
            this.log('backup', 'created', backupKey);
            return backupKey;
        } catch (error) {
            this.handleError('backup', 'create', error);
            return null;
        }
    }

    /**
     * Restaurar desde backup
     */
    restoreFromBackup(backupKey) {
        try {
            const backup = this.get(backupKey);
            if (!backup || !backup.data) {
                throw new Error('Backup inválido');
            }

            // Restaurar datos
            Object.keys(backup.data).forEach(key => {
                this.set(key, backup.data[key]);
            });

            this.log('restore', 'from', backupKey);
            return true;
        } catch (error) {
            this.handleError('restore', backupKey, error);
            return false;
        }
    }

    /**
     * Obtener lista de backups disponibles
     */
    getAvailableBackups() {
        const keys = this.getAllKeys();
        return keys
            .filter(key => key.startsWith('backup_'))
            .map(key => {
                const backup = this.get(key);
                return {
                    key,
                    timestamp: backup.timestamp,
                    version: backup.version,
                    size: JSON.stringify(backup).length
                };
            })
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    /**
     * Configurar backup automático
     */
    setupAutoBackup() {
        if (this.backupInterval > 0) {
            setInterval(() => {
                this.createBackup();
            }, this.backupInterval);
        }
    }

    /**
     * Limpiar backups antiguos
     */
    cleanupOldBackups() {
        const backups = this.getAvailableBackups();
        if (backups.length > this.maxBackups) {
            const toDelete = backups.slice(this.maxBackups);
            toDelete.forEach(backup => {
                this.remove(backup.key);
            });
            this.log('cleanup', 'backups', `${toDelete.length} deleted`);
        }
    }

    /**
     * Obtener espacio disponible (estimado)
     */
    getAvailableSpace() {
        try {
            const testKey = 'test_space';
            const testData = 'x'.repeat(1024 * 1024); // 1MB
            
            localStorage.setItem(testKey, testData);
            localStorage.removeItem(testKey);
            
            return 'Available';
        } catch (error) {
            return 'Limited';
        }
    }

    /**
     * Exportar datos como JSON
     */
    exportData(keys = null) {
        try {
            const exportKeys = keys || this.getAllKeys();
            const exportData = {};
            
            exportKeys.forEach(key => {
                exportData[key] = this.get(key);
            });

            const exportObj = {
                exportDate: new Date().toISOString(),
                version: APP_CONFIG.VERSION,
                data: exportData
            };

            return JSON.stringify(exportObj, null, 2);
        } catch (error) {
            this.handleError('export', 'data', error);
            return null;
        }
    }

    /**
     * Importar datos desde JSON
     */
    importData(jsonString, overwrite = false) {
        try {
            const importData = JSON.parse(jsonString);
            
            if (!importData.data || typeof importData.data !== 'object') {
                throw new Error('Formato de importación inválido');
            }

            let importedCount = 0;
            let skippedCount = 0;

            Object.keys(importData.data).forEach(key => {
                if (overwrite || !this.has(key)) {
                    this.set(key, importData.data[key]);
                    importedCount++;
                } else {
                    skippedCount++;
                }
            });

            this.log('import', 'data', `${importedCount} imported, ${skippedCount} skipped`);
            return { imported: importedCount, skipped: skippedCount };
        } catch (error) {
            this.handleError('import', 'data', error);
            return null;
        }
    }

    /**
     * Logging para debugging
     */
    log(action, key, value) {
        if (APP_CONFIG.DEBUG_MODE) {
            console.log(`[Storage] ${action}: ${key}`, value);
        }
    }

    /**
     * Manejo de errores
     */
    handleError(action, key, error) {
        console.error(`[Storage Error] ${action}: ${key}`, error);
        
        // Aquí podrías implementar notificaciones al usuario
        if (typeof window.showToast === 'function') {
            window.showToast(`Error de almacenamiento: ${action}`, 'error');
        }
    }
}

// Crear instancia global
const storageManager = new StorageManager();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
} else {
    window.StorageManager = StorageManager;
    window.storageManager = storageManager;
}




