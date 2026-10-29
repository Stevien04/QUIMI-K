package com.quimik.simulab.application.ports.in;

import com.quimik.simulab.domain.engine.ReactionResult;

/**
 * Puerto de Entrada (Input Port) según Arquitectura Hexagonal de FD04 (Figura 3.3.1 y 3.3.2).
 */
public interface ChemicalReactionService {
    ReactionResult simulateReaction(String symbol1, String symbol2, boolean hasHeatActivation);
}
