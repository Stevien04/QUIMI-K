package com.quimik.simulab.application.usecases;

import com.quimik.simulab.application.ports.in.ChemicalReactionService;
import com.quimik.simulab.application.ports.out.ElementDataRepository;
import com.quimik.simulab.domain.engine.ReactionEngine;
import com.quimik.simulab.domain.engine.ReactionResult;
import com.quimik.simulab.domain.model.Element;

import java.util.Optional;

/**
 * Caso de Uso: Reacciones Químicas.
 * Orquesta la lógica del ReactionEngine con el puerto de salida ElementDataRepository.
 * Conforme al Diagrama de Paquetes y Componentes de FD04 (Figuras 3.3.1 y 3.3.2).
 */
public class ChemicalReactionUseCase implements ChemicalReactionService {

    private final ReactionEngine reactionEngine;
    private final ElementDataRepository elementDataRepository;

    public ChemicalReactionUseCase(ReactionEngine reactionEngine, ElementDataRepository elementDataRepository) {
        this.reactionEngine = reactionEngine;
        this.elementDataRepository = elementDataRepository;
    }

    @Override
    public ReactionResult simulateReaction(String symbol1, String symbol2, boolean hasHeatActivation) {
        Optional<Element> elem1Opt = elementDataRepository.findElementBySymbol(symbol1);
        Optional<Element> elem2Opt = elementDataRepository.findElementBySymbol(symbol2);

        if (elem1Opt.isEmpty() || elem2Opt.isEmpty()) {
            return new ReactionResult(
                false,
                null,
                0.0,
                "Desconocido",
                "N/A",
                "No se encontraron datos científicos para uno de los elementos ingresados."
            );
        }

        return reactionEngine.processCollision(elem1Opt.get(), elem2Opt.get(), hasHeatActivation);
    }
}
