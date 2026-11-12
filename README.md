# 🧪 QUIMI-K: Simulador de Laboratorio Virtual de Química

**Prototipo Interactivo & Arquitectura Hexagonal (SimuLab)**  
*Institución Educativa Alexander Fleming — Tacna, Perú (2026)*  
*Curso:* Gestión de Proyecto de TI  

---

## 📖 Descripción del Proyecto

**QUIMI-K** es un simulador de laboratorio virtual de química orientado a la experimentación científica escolar en educación secundaria. Permite a estudiantes y docentes ejecutar prácticas guiadas, simular reacciones químicas mediante la escala de electronegatividad de Linus Pauling ($\Delta EN$), visualizar estructuras moleculares en 2D y 3D (integración con **PubChem REST** y **3Dmol.js**), y evaluar el desempeño procedimental con una rúbrica vigesimal (0–20).

El repositorio integra:
1. **Demo Web Completo (Raíz):** Aplicación cliente-servidor lista para ejecutar localmente con Python (`server.py`) y soporte de persistencia en PostgreSQL o respaldo local (`database_quimik.json`) + modo offline PWA (`IndexedDB`).
2. **Arquitectura Hexagonal Empresarial (`backend/` y `frontend/`):** Implementación estructural en Java 17 + Spring Boot 3.2.0 (con Spring Security JWT, JPA/PostgreSQL e iText 7 para reportes PDF) y módulos React SPA conforme al Documento de Arquitectura **FD04**.
3. **Versión Compacta (`Produccion/`):** Versión ligera independiente del simulador y su documentación pedagógica extendida (`Produccion/README.md`).

---

## 🚀 Cómo Iniciar el Demo

### Opción 1: Servidor Local Completo (Recomendado)
Ejecuta el lanzador automático en Windows:
- **Doble clic en:** `iniciar_demo.bat`

Este script abre `http://localhost:8000` en tu navegador e inicia `server.py` (servidor HTTP multi-hilo en Python) para habilitar todas las rutas `/api/...` (base de datos, telemetría, PubChem SDF 3D y recuperación de cuenta).

> **Nota:** Si deseas iniciarlo manualmente desde la terminal:
> ```bash
> python server.py
> ```
> Luego ingresa a `http://localhost:8000`.

### Opción 2: Apertura Directa (Solo Vista Estática)
También puedes abrir `index.html` directamente en Google Chrome, Microsoft Edge o Mozilla Firefox. Ten en cuenta que, sin `server.py` activo, las llamadas a `/api/...` usarán el modo de respaldo local en el navegador.

---

## 👤 Cuentas de Prueba (Demo)

| Rol | Correo | Contraseña | Descripción |
| :--- | :--- | :--- | :--- |
| **Estudiante** | `estudiante@fleming.edu.pe` | `123` | Acceso a prácticas, simulador, historial y evaluaciones |
| **Estudiante (alt.)** | `razself@gmail.com` | `123` | Cuenta de estudiante de 4to Año "A" |
| **Docente** | `profesora@fleming.edu.pe` | `123` | Gestión de salones, evaluaciones y revisión de notas |
| **Administrador** | `admin@fleming.edu.pe` | `123` | Gestión global de usuarios y plataforma |

---

## 🏗️ Estructura del Proyecto & Arquitectura Hexagonal (FD04)

Siguiendo los diagramas del **Documento de Arquitectura FD04** (Figura 3.3.1 *Diagrama de Paquetes*, Figura 3.3.2 *Diagrama de Componentes* y Figura 3.5.1 *Diagrama de Despliegue*), el proyecto se organiza de la siguiente manera:

```text
QUIMI-K/
├── backend/                                   # Servidor Empresarial (Java 17 + Spring Boot 3.2.0)
│   ├── pom.xml                                # Dependencias Maven (Web, Security, JPA, JWT, iText7)
│   └── src/main/
│       ├── resources/application.properties   # Configuración PostgreSQL, JWT y PubChem
│       └── java/com/quimik/simulab/
│           ├── SimuLabApplication.java        # Punto de entrada Spring Boot
│           ├── domain/                        # Capa de Dominio (Núcleo Científico puro)
│           │   ├── model/                     # ChemicalEntity, Element, Atom, Molecule,
│           │   │                              # TelemetryPayload, GradingEvaluation
│           │   ├── engine/                    # ReactionEngine, ReactionResult
│           │   ├── rules/                     # ElectronegativityRule (Escala de Pauling)
│           │   └── service/                   # GradingService (Rúbrica 0-20)
│           ├── application/                   # Capa de Aplicación (Puertos y Casos de Uso)
│           │   ├── ports/in/                  # ChemicalReactionService
│           │   ├── ports/out/                 # ElementDataRepository, PdfReportPort
│           │   └── usecases/                  # ChemicalReactionUseCase
│           └── infrastructure/                # Capa de Infraestructura (Adaptadores)
│               ├── adapters/
│               │   ├── rest/                  # SimulationController, TelemetryGradingController, DTOs
│               │   ├── pubchem/               # PubChemCache (< 50 ms), PubChemElementRepository
│               │   ├── persistence/           # Entidades JPA (User, Practice, TelemetryRecord) y repos
│               │   └── reports/               # PdfReportGeneratorAdapter (iText 7)
│               ├── config/                    # HexagonalConfig
│               └── security/                  # SecurityConfig, JwtTokenProvider
│
├── frontend/                                  # Estructura Modular SPA (Capa de Presentación)
│   └── src/
│       ├── modules/
│       │   ├── simulation/SimulationModule.js
│       │   ├── education/EducationModule.js
│       │   └── assistant/QuimiAssistantModule.js
│       └── services/SimuLabApiClient.js
│
├── Produccion/                                # Versión compacta del simulador y README pedagógico
│   ├── index.html, style.css, app.js
│   ├── ChemEngine.js, simulation_canvas.js
│   ├── iniciar_simulador.bat, README.md
│
├── documentacion/                             # Documentos formales de gestión (FD01, FD02, FD03, FD04, FD06)
│
├── index.html                                 # Interfaz web principal del demo
├── style.css                                  # Hoja de estilos principal
├── app.js                                     # Controlador principal de UI, roles y flujos del demo
├── ChemEngine.js                              # Motor químico avanzado de sustancias y reacciones
├── simulation_canvas.js                       # Renderizado 2D interactivo del laboratorio en Canvas
├── reaction_engine.js                         # Motor de enlace químico (ΔEN Pauling) y reacciones curadas
├── pubchem_service.js                         # Cliente PubChem PUG-REST con caché local en memoria
├── offline_storage.js                         # Persistencia local PWA con IndexedDB y cola de sincronización
├── database_quimik.json                       # Base de datos JSON local de respaldo
├── server.py                                  # Servidor local multi-hilo (Python + PostgreSQL opcional)
└── iniciar_demo.bat                           # Lanzador directo en Windows
```

---

## ⚙️ Funcionalidades Principales

- **Motor de Enlaces Químicos (`reaction_engine.js` & `ChemEngine.js`):**
  - Calcula la diferencia de electronegatividad ($\Delta EN = |EN_1 - EN_2|$) según la escala de Linus Pauling:
    - $\Delta EN \ge 2.0$: **Enlace Iónico** (transferencia de electrones).
    - $0.4 < \Delta EN < 2.0$: **Covalente Polar** (compartición asimétrica).
    - $\Delta EN \le 0.4$: **Covalente Apolar** (distribución equitativa).
- **Simulación 2D y Visualización Molecular 3D:**
  - Laboratorio visual en `<canvas>` (`simulation_canvas.js`) con cristalería, mecheros, buretas e interacción de partículas.
  - Visualizador molecular 3D integrado con **3Dmol.js** y descarga de estructuras `.sdf` desde **PubChem** (`/api/pubchem/sdf`).
- **Rúbrica Formativa Automatizada (Escala 0–20):**
  - Evaluación de telemetría (`/api/v1/telemetry/evaluate`) considerando: exactitud volumétrica (0–8), lectura de menisco (0–5), agitación cinética (0–4) y purga/seguridad (0–3), con calificación literal (`AD`, `A`, `B`, `C`) y retroalimentación cualitativa.
- **Tolerancia Offline (PWA):**
  - `offline_storage.js` almacena telemetría y evaluaciones en **IndexedDB** (`QuimiK_PWA_DB`) cuando no hay conexión y sincroniza al recuperar la red.

---

## 🧪 Prácticas y Plantillas Incluidas

### Prácticas de Enlace y Reacción (`reaction_engine.js`)
1. **Práctica 1 — Síntesis de Enlace Iónico:**  
   $$2\text{Na(s)} + \text{Cl}_2\text{(g)} \rightarrow 2\text{NaCl(s)} \quad (\Delta EN = 2.23)$$
2. **Práctica 2 — Formación de Molécula Polar:**  
   $$2\text{H}_2\text{(g)} + \text{O}_2\text{(g)} \rightarrow 2\text{H}_2\text{O(l)} \quad (\Delta EN = 1.24)$$
3. **Práctica 3 — Neutralización Ácido-Base:**  
   $$\text{HCl(ac)} + \text{NaOH(ac)} \rightarrow \text{NaCl(ac)} + \text{H}_2\text{O(l)}$$

### Plantillas de Laboratorio Cuantitativo (`server.py`)
- **Titulación Ácido-Base Fuerte (`HCl + NaOH`):** Punto de equivalencia a $\text{pH} = 7.0$, volumen objetivo $25.0\text{ mL}$ con indicador fenolftaleína.
- **Determinación de Punto de Ebullición y Destilación:** Etanol 96% ($78.37\,^\circ\text{C}$).
- **Curva de Solubilidad Térmica y Cristalización:** Soluto $\text{CuSO}_4\cdot 5\text{H}_2\text{O}$.

---

## 🔌 Endpoints de la API Local (`server.py` — Puerto `8000`)

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Estado del servicio y del motor de calificación |
| `GET` | `/api/v1/courses/templates` | Lista de plantillas de prácticas experimentales |
| `GET` | `/api/pubchem/sdf?name=<compuesto>` | Obtiene estructura 3D SDF desde PubChem REST |
| `GET` | `/api/db/status` | Estado de conexión a PostgreSQL |
| `GET` | `/api/db/data` | Carga usuarios, salones y evaluaciones |
| `POST` | `/api/simulate` | Simula colisión/enlace entre dos reactivos ($\Delta EN$) |
| `POST` | `/api/v1/telemetry/evaluate` | Evalúa telemetría de laboratorio según rúbrica 0–20 |
| `POST` | `/api/db/save-classroom` | Guarda o actualiza un salón |
| `POST` | `/api/db/save-user` | Guarda o actualiza un usuario |
| `POST` | `/api/db/save-score` | Registra la calificación de un estudiante |
| `POST` | `/api/db/save-evaluation` | Publica o actualiza una evaluación |
| `POST` | `/api/db/delete-evaluation` | Elimina una evaluación por ID |
| `POST` | `/api/send-recovery-email` | Envía código de recuperación por SMTP |

---

## 🛠️ Stack Tecnológico

- **Frontend Demo:** HTML5, CSS3, JavaScript ES6+, Canvas 2D, 3Dmol.js (`2.0.4`), IndexedDB (PWA).
- **Servidor Demo:** Python 3 (`http.server.ThreadingHTTPServer`), `psycopg2` (opcional para PostgreSQL 16) con respaldo automático en `database_quimik.json`.
- **Backend Empresarial (`backend/`):** Java 17, Spring Boot 3.2.0, Spring Security + JJWT (`0.11.5`), Spring Data JPA, PostgreSQL, iText 7 (`7.2.5`).

---

## 📄 Documentación Formal (`documentacion/`)

El proyecto incluye los entregables oficiales del curso en la carpeta `documentacion/`:
- `FD01_QUIMI-K.docx`
- `FD02_QUIMI-K.docx`
- `FD03_Quimi-k.docx`
- `FD04_Quimi-k.docx`
- `FD06_QUIMI-K.docx`
