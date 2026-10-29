/**
 * Cliente de Servicios API REST para comunicación Frontend -> Backend
 * Basado en Diagramas 3.3.1 y 3.5.1 de FD04 (HTTP/JSON Puerto 443).
 */
export class SimuLabApiClient {
  constructor(baseUrl = 'http://localhost:8080/api') {
    this.baseUrl = baseUrl;
  }

  async postCollision(collisionRequest) {
    try {
      const res = await fetch(`${this.baseUrl}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collisionRequest)
      });
      return await res.json();
    } catch (e) {
      console.warn('Backend local desconectado. Usando simulación local de contingencia.');
      return null;
    }
  }
}
