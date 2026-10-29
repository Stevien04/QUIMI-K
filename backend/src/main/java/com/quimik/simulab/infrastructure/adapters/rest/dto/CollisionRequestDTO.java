package com.quimik.simulab.infrastructure.adapters.rest.dto;

/**
 * DTO para la petición de colisión/simulación desde el Frontend hacia el Backend.
 * Basado en Diagrama de Componentes de FD04 (Figura 3.3.2).
 */
public class CollisionRequestDTO {
    private String reactant1;
    private String reactant2;
    private boolean heatActive;

    public CollisionRequestDTO() {}

    public CollisionRequestDTO(String reactant1, String reactant2, boolean heatActive) {
        this.reactant1 = reactant1;
        this.reactant2 = reactant2;
        this.heatActive = heatActive;
    }

    public String getReactant1() { return reactant1; }
    public void setReactant1(String reactant1) { this.reactant1 = reactant1; }

    public String getReactant2() { return reactant2; }
    public void setReactant2(String reactant2) { this.reactant2 = reactant2; }

    public boolean isHeatActive() { return heatActive; }
    public void setHeatActive(boolean heatActive) { this.heatActive = heatActive; }
}
