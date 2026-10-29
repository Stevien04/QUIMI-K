# QUIMI-K: Prototipo Demo & Arquitectura Hexagonal

**Simulador de Laboratorio Virtual de Química para la Experimentación Científica**  
*Institución Educativa Alexander Fleming — Tacna, Perú (2026)*  
*Curso:* Gestión de Proyecto de TI  

---

## 🚀 Cómo Iniciar el Demo
Tiene dos formas directas de abrir el demo interactivo en el navegador:
1. **Doble clic en:** `iniciar_demo.bat`
2. **O abrir directamente en cualquier navegador:** `index.html` (Compatible con Google Chrome, Microsoft Edge, Mozilla Firefox).

---

## 🏗️ Estructura de Carpetas: Arquitectura Hexagonal (FD04)

Siguiendo al detalle los diagramas del **Documento de Arquitectura FD04** (Figura 3.3.1 *Diagrama de Paquetes*, Figura 3.3.2 *Diagrama de Componentes* y Figura 3.5.1 *Diagrama de Despliegue*), se estructuraron las siguientes carpetas:

```text
d:\Proyecto de Gestion de Proyecto\
├── backend/                                   # Servidor de Aplicaciones (Spring Boot)
│   ├── pom.xml                                # Configuración Maven
│   └── src/main/java/com/quimik/simulab/
│       ├── domain/                            # Capa de Dominio (Núcleo Científico puro)
│       │   ├── model/                         # Entidades de negocio
│       │   │   ├── ChemicalEntity.java        # Interfaz ChemicalEntity
│       │   │   ├── Element.java               # Propiedades periódicas (PubChem)
│       │   │   ├── Atom.java                  # Átomo con valencias
│       │   │   └── Molecule.java              # Molécula sintetizada (NaCl, H2O)
│       │   ├── engine/                        # Motor de reacciones químicas
│       │   │   ├── ReactionEngine.java        # Núcleo desacoplado de colisiones
│       │   │   └── ReactionResult.java        # Resultado y ecuaciones
│       │   └── rules/                         # Reglas científicas
│       │       └── ElectronegativityRule.java # Escala de Linus Pauling (ΔEN)
│       │
│       ├── application/                       # Capa de Aplicación (Casos de Uso y Puertos)
│       │   ├── ports/
│       │   │   ├── in/                        # Puertos de Entrada (Interfaces)
│       │   │   │   └── ChemicalReactionService.java
│       │   │   └── out/                       # Puertos de Salida (Interfaces)
│       │   │       ├── ElementDataRepository.java
│       │   │       └── PdfReportPort.java
│       │   └── usecases/                      # Implementación de Casos de Uso
│       │       └── ChemicalReactionUseCase.java
│       │
│       └── infrastructure/                    # Capa de Infraestructura (Adaptadores)
│           ├── adapters/
│           │   ├── rest/                      # Adaptadores Web / Controladores
│           │   │   ├── controllers/
│           │   │   │   └── SimulationController.java
│           │   │   └── dto/
│           │   │       ├── CollisionRequestDTO.java
│           │   │       └── ReactionResultDTO.java
│           │   ├── pubchem/                   # Adaptador Cliente PubChem
│           │   │   ├── PubChemCache.java      # Memoria Caché (< 50 ms)
│           │   │   └── PubChemElementRepository.java
│           │   ├── persistence/               # Adaptador Base de Datos PostgreSQL
│           │   │   └── entities/
│           │   │       ├── UserEntity.java    # Entidad de usuario
│           │   │       └── PracticeEntity.java# Entidad de práctica curada
│           │   └── reports/                   # Adaptador de Reportes
│           │       └── PdfReportGeneratorAdapter.java
│           └── config/                        # Inyección de dependencias
│               └── HexagonalConfig.java
│
├── frontend/                                  # Capa de Presentación (React SPA)
│   └── src/
│       ├── modules/
│       │   ├── simulation/                    # Módulo de Simulación 2D
│       │   │   └── SimulationModule.js
│       │   ├── education/                     # Módulo de Gestión Educativa
│       │   │   └── EducationModule.js
│       │   └── assistant/                     # Módulo Asistente Quimi
│       │       └── QuimiAssistantModule.js
│       └── services/                          # Cliente de API REST
│           └── SimuLabApiClient.js
│
├── index.html                                 # Demo interactivo web listo para ejecutar
├── style.css                                  # Estilos limpios y profesionales
├── app.js                                     # Control del simulador y navegación
├── reaction_engine.js                         # ReactionEngine para el demo cliente
├── pubchem_service.js                         # Servicio PubChem con caché local
└── iniciar_demo.bat                           # Lanzador directo para Windows
```

---

## 🧪 Prácticas Incluidas en el Simulador
1. **Práctica 1:** Síntesis de Enlace Iónico: $2\text{Na(s)} + \text{Cl}_2\text{(g)} \rightarrow 2\text{NaCl(s)}$ ($\Delta EN = 2.23$).
2. **Práctica 2:** Formación de Molécula Polar: $2\text{H}_2\text{(g)} + \text{O}_2\text{(g)} \rightarrow 2\text{H}_2\text{O(l)}$ ($\Delta EN = 1.24$).
3. **Práctica 3:** Neutralización Ácido-Base: $\text{HCl(ac)} + \text{NaOH(ac)} \rightarrow \text{NaCl(ac)} + \text{H}_2\text{O(l)}$.
