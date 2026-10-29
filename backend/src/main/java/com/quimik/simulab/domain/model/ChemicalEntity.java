package com.quimik.simulab.domain.model;

/**
 * Entidad química base según el Diagrama de Arquitectura de FD04 (Figura 3.3.2).
 */
public interface ChemicalEntity {
    String getSymbol();
    String getName();
    double getMass();
}
