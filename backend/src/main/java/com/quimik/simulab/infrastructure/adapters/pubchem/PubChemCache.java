package com.quimik.simulab.infrastructure.adapters.pubchem;

import com.quimik.simulab.domain.model.Element;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Sistema de almacenamiento en caché en memoria para respuestas de PubChem API.
 * Cumple con la restricción de rendimiento de FD04 (Tiempo de respuesta <= 50 ms).
 */
public class PubChemCache {
    private final Map<String, Element> cache = new ConcurrentHashMap<>();

    public PubChemCache() {
        seedElements();
    }

    private void seedElements() {
        cache.put("H", new Element("H", "Hidrógeno", 1, 2.20, 37.0, 1.008));
        cache.put("O", new Element("O", "Oxígeno", 8, 3.44, 73.0, 15.999));
        cache.put("Na", new Element("Na", "Sodio", 11, 0.93, 186.0, 22.990));
        cache.put("Cl", new Element("Cl", "Cloro", 17, 3.16, 99.0, 35.453));
        cache.put("C", new Element("C", "Carbono", 6, 2.55, 77.0, 12.011));
        cache.put("N", new Element("N", "Nitrógeno", 7, 3.04, 75.0, 14.007));
    }

    public Optional<Element> get(String symbol) {
        return Optional.ofNullable(cache.get(symbol));
    }

    public void put(String symbol, Element element) {
        cache.put(symbol, element);
    }
}
