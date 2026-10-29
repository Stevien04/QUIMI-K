/**
 * Módulo Asistente Virtual "Quimi" (Capa de Presentación - Frontend)
 * Basado en Diagrama de Paquetes de FD04 (Figura 3.3.1).
 * Implementa consultas contextuales restringidas a opciones guiadas.
 */
export class QuimiAssistantModule {
  constructor() {
    this.history = [];
  }

  getPresetQuestions() {
    return [
      '¿Por qué reacciona el Sodio con el Cloro en la Práctica 1?',
      '¿Cómo se interpreta la diferencia de electronegatividad (ΔEN)?',
      '¿Cuál es la función del Mechero Bunsen en la reacción?',
      '¿Qué medidas de seguridad y cuidado exige esta práctica?'
    ];
  }
}
