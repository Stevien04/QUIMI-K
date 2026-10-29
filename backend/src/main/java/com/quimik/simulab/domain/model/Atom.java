package com.quimik.simulab.domain.model;

/**
 * Representa un Átomo individual que implementa ChemicalEntity.
 * Basado en Diagrama de Componentes de FD04 (Figura 3.3.2).
 */
public class Atom implements ChemicalEntity {
    private final Element element;
    private final int valenceElectrons;

    public Atom(Element element, int valenceElectrons) {
        this.element = element;
        this.valenceElectrons = valenceElectrons;
    }

    public Element getElement() { return element; }
    public int getValenceElectrons() { return valenceElectrons; }

    @Override
    public String getSymbol() { return element.getSymbol(); }

    @Override
    public String getName() { return element.getName(); }

    @Override
    public double getMass() { return element.getAtomicMass(); }
}
