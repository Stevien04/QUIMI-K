package com.quimik.simulab.application.ports.out;

import com.quimik.simulab.domain.model.Element;
import java.util.Optional;

/**
 * Puerto de Salida (Output Port) para obtención de datos científicos (PubChem).
 * Basado en Diagrama de Paquetes de FD04 (Figura 3.3.1).
 */
public interface ElementDataRepository {
    Optional<Element> findElementBySymbol(String symbol);
}
