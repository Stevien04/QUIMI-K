package com.quimik.simulab.infrastructure.adapters.rest.dto;

/**
 * DTO que responde el Backend al Frontend con el resultado del motor científico.
 * Basado en Diagrama de Componentes de FD04 (Figura 3.3.2).
 */
public class ReactionResultDTO {
    private boolean successful;
    private String productFormula;
    private String productName;
    private double deltaElectronegativity;
    private String bondType;
    private String equation;
    private String feedback;

    public ReactionResultDTO() {}

    public ReactionResultDTO(boolean successful, String productFormula, String productName, double deltaElectronegativity, String bondType, String equation, String feedback) {
        this.successful = successful;
        this.productFormula = productFormula;
        this.productName = productName;
        this.deltaElectronegativity = deltaElectronegativity;
        this.bondType = bondType;
        this.equation = equation;
        this.feedback = feedback;
    }

    public boolean isSuccessful() { return successful; }
    public String getProductFormula() { return productFormula; }
    public String getProductName() { return productName; }
    public double getDeltaElectronegativity() { return deltaElectronegativity; }
    public String getBondType() { return bondType; }
    public String getEquation() { return equation; }
    public String getFeedback() { return feedback; }
}
