package com.quimik.simulab.domain.engine;

import com.quimik.simulab.domain.model.Molecule;

/**
 * Resultado producido por el ReactionEngine según FD04 (Figura 3.3.2).
 */
public class ReactionResult {
    private final boolean successful;
    private final Molecule product;
    private final double deltaElectronegativity;
    private final String bondClassification;
    private final String chemicalEquation;
    private final String pedagogicalFeedback;

    public ReactionResult(boolean successful, Molecule product, double deltaElectronegativity, String bondClassification, String chemicalEquation, String pedagogicalFeedback) {
        this.successful = successful;
        this.product = product;
        this.deltaElectronegativity = deltaElectronegativity;
        this.bondClassification = bondClassification;
        this.chemicalEquation = chemicalEquation;
        this.pedagogicalFeedback = pedagogicalFeedback;
    }

    public boolean isSuccessful() { return successful; }
    public Molecule getProduct() { return product; }
    public double getDeltaElectronegativity() { return deltaElectronegativity; }
    public String getBondClassification() { return bondClassification; }
    public String getChemicalEquation() { return chemicalEquation; }
    public String getPedagogicalFeedback() { return pedagogicalFeedback; }
}
