package com.quimik.simulab.domain.rules;

import com.quimik.simulab.domain.model.Element;

/**
 * Reglas de Negocio del Dominio Químico:
 * Aplica la escala de Linus Pauling: ΔEN = |EN1 - EN2|
 * Clasificación:
 * - ΔEN >= 2.0 -> Enlace Iónico
 * - 0.4 < ΔEN < 2.0 -> Enlace Covalente Polar
 * - ΔEN <= 0.4 -> Enlace Covalente Apolar
 */
public class ElectronegativityRule {

    public static class BondEvaluation {
        private final double deltaEN;
        private final String bondType;
        private final String category;
        private final String explanation;

        public BondEvaluation(double deltaEN, String bondType, String category, String explanation) {
            this.deltaEN = deltaEN;
            this.bondType = bondType;
            this.category = category;
            this.explanation = explanation;
        }

        public double getDeltaEN() { return deltaEN; }
        public String getBondType() { return bondType; }
        public String getCategory() { return category; }
        public String getExplanation() { return explanation; }
    }

    public static BondEvaluation evaluate(Element e1, Element e2) {
        double delta = Math.abs(e1.getElectronegativity() - e2.getElectronegativity());
        double roundedDelta = Math.round(delta * 100.0) / 100.0;

        if (roundedDelta >= 2.0) {
            return new BondEvaluation(
                roundedDelta,
                "Iónico",
                "ionic",
                String.format("ΔEN = %.2f (≥ 2.0). Transferencia de electrones entre %s y %s.", roundedDelta, e1.getName(), e2.getName())
            );
        } else if (roundedDelta > 0.4) {
            return new BondEvaluation(
                roundedDelta,
                "Covalente Polar",
                "covalent-polar",
                String.format("ΔEN = %.2f (0.4 < ΔEN < 2.0). Compartición asimétrica de electrones.", roundedDelta)
            );
        } else {
            return new BondEvaluation(
                roundedDelta,
                "Covalente Apolar",
                "covalent-nonpolar",
                String.format("ΔEN = %.2f (≤ 0.4). Densidad electrónica equitativa.", roundedDelta)
            );
        }
    }
}
