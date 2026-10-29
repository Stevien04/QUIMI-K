package com.quimik.simulab.domain.engine;

import com.quimik.simulab.domain.model.Atom;
import com.quimik.simulab.domain.model.Element;
import com.quimik.simulab.domain.model.Molecule;
import com.quimik.simulab.domain.rules.ElectronegativityRule;

import java.util.Arrays;

/**
 * Núcleo de Dominio Científico - ReactionEngine.
 * Corazón de la Arquitectura Hexagonal (FD04). Desacoplado de la UI y servicios web.
 */
public class ReactionEngine {

    public ReactionResult processCollision(Element e1, Element e2, boolean hasHeatActivation) {
        if (e1 == null || e2 == null) {
            return new ReactionResult(false, null, 0.0, "N/A", "N/A", "Elementos no identificados.");
        }

        ElectronegativityRule.BondEvaluation eval = ElectronegativityRule.evaluate(e1, e2);

        // Síntesis de NaCl (Sodio + Cloro)
        if ((e1.getSymbol().equals("Na") && e2.getSymbol().equals("Cl")) ||
            (e1.getSymbol().equals("Cl") && e2.getSymbol().equals("Na"))) {
            
            Atom a1 = new Atom(e1, 1);
            Atom a2 = new Atom(e2, 7);
            Molecule nacl = new Molecule("NaCl", "Cloruro de Sodio", Arrays.asList(a1, a2), eval.getBondType());

            return new ReactionResult(
                true,
                nacl,
                eval.getDeltaEN(),
                eval.getBondType(),
                "2Na(s) + Cl₂(g) → 2NaCl(s)",
                "¡Reacción completada con éxito! " + eval.getExplanation()
            );
        }

        // Síntesis de Agua (Hidrógeno + Oxígeno)
        if ((e1.getSymbol().equals("H") && e2.getSymbol().equals("O")) ||
            (e1.getSymbol().equals("O") && e2.getSymbol().equals("H"))) {
            
            Atom h = new Atom(e1.getSymbol().equals("H") ? e1 : e2, 1);
            Atom o = new Atom(e1.getSymbol().equals("O") ? e1 : e2, 6);
            Molecule h2o = new Molecule("H₂O", "Agua", Arrays.asList(h, o), eval.getBondType());

            return new ReactionResult(
                true,
                h2o,
                eval.getDeltaEN(),
                eval.getBondType(),
                "2H₂(g) + O₂(g) → 2H₂O(l)",
                "¡Molécula de agua formada! " + eval.getExplanation()
            );
        }

        // Reacción genérica evaluada científicamente
        Atom a1 = new Atom(e1, 1);
        Atom a2 = new Atom(e2, 1);
        Molecule generic = new Molecule(e1.getSymbol() + e2.getSymbol(), "Compuesto Binario", Arrays.asList(a1, a2), eval.getBondType());

        return new ReactionResult(
            true,
            generic,
            eval.getDeltaEN(),
            eval.getBondType(),
            e1.getSymbol() + " + " + e2.getSymbol() + " → " + generic.getSymbol(),
            eval.getExplanation()
        );
    }
}
