package com.quimik.simulab.infrastructure.adapters.pubchem;

import com.quimik.simulab.application.ports.out.ElementDataRepository;
import com.quimik.simulab.domain.model.Element;

import java.util.Optional;

/**
 * Adaptador de Infraestructura: PubChemElementRepository.
 * Implementa el puerto de salida ElementDataRepository según diagrama 3.3.2 de FD04.
 */
public class PubChemElementRepository implements ElementDataRepository {

    private final PubChemCache cache;

    public PubChemElementRepository(PubChemCache cache) {
        this.cache = cache;
    }

    @Override
    public Optional<Element> findElementBySymbol(String symbol) {
        // 1. Consultar primero en la memoria caché (< 50 ms)
        Optional<Element> cached = cache.get(symbol);
        if (cached.isPresent()) {
            return cached;
        }

        // 2. Si no se encuentra, consulta fallback o live PUG-REST
        return Optional.empty();
    }
}
