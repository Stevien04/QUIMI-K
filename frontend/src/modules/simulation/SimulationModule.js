/**
 * Módulo de Simulación 2D (Capa de Presentación - Frontend)
 * Basado en Diagrama de Paquetes de FD04 (Figura 3.3.1).
 */
export class SimulationModule {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.particles = [];
  }

  async runReaction(reactant1, reactant2, heatActive = false) {
    return await this.apiClient.postCollision({
      reactant1,
      reactant2,
      heatActive
    });
  }
}
