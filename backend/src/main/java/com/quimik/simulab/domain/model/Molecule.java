package com.quimik.simulab.domain.model;

import java.util.List;

/**
 * Representa una Molécula sintetizada que implementa ChemicalEntity.
 * Basado en Diagrama de Componentes de FD04 (Figura 3.3.2).
 */
public class Molecule implements ChemicalEntity {
    private final String formula;
    private final String commonName;
    private final List<Atom> atoms;
    private final String bondType; // Iónico, Covalente Polar, Covalente Apolar

    public Molecule(String formula, String commonName, List<Atom> atoms, String bondType) {
        this.formula = formula;
        this.commonName = commonName;
        this.atoms = atoms;
        this.bondType = bondType;
    }

    @Override
    public String getSymbol() { return formula; }

    @Override
    public String getName() { return commonName; }

    @Override
    public double getMass() {
        return atoms.stream().mapToDouble(Atom::getMass).sum();
    }

    public List<Atom> getAtoms() { return atoms; }
    public String getBondType() { return bondType; }
}
