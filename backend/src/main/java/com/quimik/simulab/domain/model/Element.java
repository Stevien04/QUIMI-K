package com.quimik.simulab.domain.model;

/**
 * Representa un Elemento químico de la tabla periódica con datos consumidos de PubChem.
 */
public class Element {
    private final String symbol;
    private final String name;
    private final int atomicNumber;
    private final double electronegativity; // Escala de Pauling
    private final double atomicRadiusPm;
    private final double atomicMass;

    public Element(String symbol, String name, int atomicNumber, double electronegativity, double atomicRadiusPm, double atomicMass) {
        this.symbol = symbol;
        this.name = name;
        this.atomicNumber = atomicNumber;
        this.electronegativity = electronegativity;
        this.atomicRadiusPm = atomicRadiusPm;
        this.atomicMass = atomicMass;
    }

    public String getSymbol() { return symbol; }
    public String getName() { return name; }
    public int getAtomicNumber() { return atomicNumber; }
    public double getElectronegativity() { return electronegativity; }
    public double getAtomicRadiusPm() { return atomicRadiusPm; }
    public double getAtomicMass() { return atomicMass; }
}
