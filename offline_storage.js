/**
 * 💾 QUIMI-K • OfflineStorage (IndexedDB PWA)
 * Sección 14 de Producción/README.md:
 * "Persistencia local: IndexedDB (PWA) con tolerancia a microcortes de red."
 */
const OfflineStorage = {
  dbName: 'QuimiK_PWA_DB',
  dbVersion: 1,
  db: null,

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('telemetry_queue')) {
          db.createObjectStore('telemetry_queue', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('evaluations_cache')) {
          db.createObjectStore('evaluations_cache', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('lab_state')) {
          db.createObjectStore('lab_state', { keyPath: 'key' });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        console.log('[OfflineStorage] IndexedDB PWA inicializado exitosamente.');
        this.listenNetworkEvents();
        resolve(this.db);
      };

      request.onerror = (e) => {
        console.warn('[OfflineStorage] Error al inicializar IndexedDB:', e);
        resolve(null);
      };
    });
  },

  listenNetworkEvents() {
    window.addEventListener('online', () => {
      console.log('[OfflineStorage] Conexión de red restablecida. Sincronizando telemetría pendiente...');
      this.syncPendingTelemetry();
    });

    window.addEventListener('offline', () => {
      console.log('[OfflineStorage] Modo Offline activo. Las acciones se guardarán localmente en IndexedDB.');
    });
  },

  async saveTelemetry(payload) {
    if (!this.db) await this.init();
    if (!this.db) return false;

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('telemetry_queue', 'readwrite');
        const store = tx.objectStore('telemetry_queue');
        const record = {
          timestamp: new Date().toISOString(),
          payload: payload,
          synced: false
        };
        const req = store.add(record);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (err) {
        console.error('[OfflineStorage] Error al guardar telemetría:', err);
        resolve(false);
      }
    });
  },

  async cacheEvaluation(evaluation) {
    if (!this.db) await this.init();
    if (!this.db) return false;

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('evaluations_cache', 'readwrite');
        const store = tx.objectStore('evaluations_cache');
        const record = {
          timestamp: new Date().toISOString(),
          evaluation: evaluation
        };
        const req = store.add(record);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (err) {
        console.error('[OfflineStorage] Error al guardar evaluación:', err);
        resolve(false);
      }
    });
  },

  async syncPendingTelemetry() {
    if (!navigator.onLine || !this.db) return;

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('telemetry_queue', 'readwrite');
        const store = tx.objectStore('telemetry_queue');
        const req = store.openCursor();

        req.onsuccess = async (e) => {
          const cursor = e.target.result;
          if (cursor) {
            const item = cursor.value;
            if (!item.synced) {
              try {
                const response = await fetch('/api/v1/telemetry/evaluate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(item.payload)
                });
                if (response.ok) {
                  item.synced = true;
                  cursor.update(item);
                }
              } catch (netErr) {
                console.warn('[OfflineStorage] No se pudo sincronizar paquete individual:', netErr);
              }
            }
            cursor.continue();
          } else {
            resolve();
          }
        };
      } catch (e) {
        resolve();
      }
    });
  }
};

// Auto-inicializar
if (typeof window !== 'undefined') {
  window.OfflineStorage = OfflineStorage;
  OfflineStorage.init();
}
