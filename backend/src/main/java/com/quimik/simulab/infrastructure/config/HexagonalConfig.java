package com.quimik.simulab.infrastructure.config;

import com.quimik.simulab.application.ports.in.ChemicalReactionService;
import com.quimik.simulab.application.ports.out.ElementDataRepository;
import com.quimik.simulab.application.usecases.ChemicalReactionUseCase;
import com.quimik.simulab.domain.engine.ReactionEngine;
import com.quimik.simulab.infrastructure.adapters.pubchem.PubChemCache;
import com.quimik.simulab.infrastructure.adapters.pubchem.PubChemElementRepository;
import com.quimik.simulab.infrastructure.adapters.rest.controllers.SimulationController;

/**
 * Configuración de Inyección de Dependencias para la Arquitectura Hexagonal.
 * Conecta los Puertos con sus Adaptadores concretos garantizando el desacoplamiento.
 */
public class HexagonalConfig {

    public static SimulationController createSimulationController() {
        // 1. Núcleo de Dominio
        ReactionEngine reactionEngine = new ReactionEngine();

        // 2. Adaptador de Infraestructura PubChem con Caché
        PubChemCache pubChemCache = new PubChemCache();
        ElementDataRepository elementDataRepository = new PubChemElementRepository(pubChemCache);

        // 3. Caso de Uso de Aplicación (Input Port implementation)
        ChemicalReactionService chemicalReactionService = new ChemicalReactionUseCase(reactionEngine, elementDataRepository);

        // 4. Adaptador de Entrada (REST Controller)
        return new SimulationController(chemicalReactionService);
    }
}
