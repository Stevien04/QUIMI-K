package com.quimik.simulab.infrastructure.adapters.rest.controllers;

import com.quimik.simulab.application.ports.in.ChemicalReactionService;
import com.quimik.simulab.domain.engine.ReactionResult;
import com.quimik.simulab.infrastructure.adapters.rest.dto.CollisionRequestDTO;
import com.quimik.simulab.infrastructure.adapters.rest.dto.ReactionResultDTO;

/**
 * Adaptador de Entrada (REST Controller) según FD04 (Figuras 3.3.1 y 3.3.2).
 * Expone la API REST que consume el Frontend SPA.
 */
public class SimulationController {

    private final ChemicalReactionService chemicalReactionService;

    public SimulationController(ChemicalReactionService chemicalReactionService) {
        this.chemicalReactionService = chemicalReactionService;
    }

    public ReactionResultDTO simulateCollision(CollisionRequestDTO request) {
        ReactionResult result = chemicalReactionService.simulateReaction(
            request.getReactant1(),
            request.getReactant2(),
            request.isHeatActive()
        );

        return new ReactionResultDTO(
            result.isSuccessful(),
            result.getProduct() != null ? result.getProduct().getSymbol() : "Ninguno",
            result.getProduct() != null ? result.getProduct().getName() : "Sin Reacción",
            result.getDeltaElectronegativity(),
            result.getBondClassification(),
            result.getChemicalEquation(),
            result.getPedagogicalFeedback()
        );
    }
}
