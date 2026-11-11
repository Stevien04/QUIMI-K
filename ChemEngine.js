/**
 * ============================================================================
 * 🧪 ChemEngine.js - Motor Científico Reactivo de Química en Cliente
 * Laboratorio Virtual Integral de Química - Colegio Alexander Fleming (2026)
 * ============================================================================
 * Capacidades Principales:
 * - Cálculos fisicoquímicos en memoria local del navegador a 60 FPS sin latencia.
 * - Simulación volumétrica: Ácido-Base, Henderson-Hasselbalch, curva de titulación.
 * - Virajes de indicadores colorimétricos reales (Fenolftaleína 8.2 - 10.0, etc.).
 * - Termodinámica y Cinética de partículas (Leyes de los gases, estados de la materia).
 * - Arquímedes y densidad: masa, volumen desplazado y flotabilidad.
 * - Formulación inorgánica (IUPAC, Stock, Tradicional) y balanceo de ecuaciones.
 * - Modelado atómico, números cuánticos y configuración electrónica (Moeller / Aufbau).
 * - Enlace químico y electronegatividad (Escala de Linus Pauling).
 * - Registro inmutable de Telemetría JSONB del procedimiento experimental.
 * - Evaluador automático con Rúbrica Vigesimal Escolar Oficial (Escala 0 - 20).
 */

const ChemEngine = (function () {
  'use strict';

  // ==========================================
  // 1. BASE DE DATOS DE ELEMENTOS QUÍMICOS
  // ==========================================
  const ELEMENTS_DB = {
    H:  { z: 1,  symbol: 'H',  name: 'Hidrógeno',  mass: 1.008,  en: 2.20, radius: 37,  group: 1,  period: 1, block: 's', valences: [1],      config: '1s¹', state: 'gas', color: '#E2E8F0' },
    He: { z: 2,  symbol: 'He', name: 'Helio',      mass: 4.0026, en: 0.00, radius: 31,  group: 18, period: 1, block: 's', valences: [0],      config: '1s²', state: 'gas', color: '#D8B4FE' },
    Li: { z: 3,  symbol: 'Li', name: 'Litio',      mass: 6.94,   en: 0.98, radius: 152, group: 1,  period: 2, block: 's', valences: [1],      config: '[He] 2s¹', state: 'solid', color: '#C084FC' },
    Be: { z: 4,  symbol: 'Be', name: 'Berilio',    mass: 9.0122, en: 1.57, radius: 112, group: 2,  period: 2, block: 's', valences: [2],      config: '[He] 2s²', state: 'solid', color: '#A855F7' },
    B:  { z: 5,  symbol: 'B',  name: 'Boro',       mass: 10.81,  en: 2.04, radius: 85,  group: 13, period: 2, block: 'p', valences: [3],      config: '[He] 2s² 2p¹', state: 'solid', color: '#FDBA74' },
    C:  { z: 6,  symbol: 'C',  name: 'Carbono',    mass: 12.011, en: 2.55, radius: 77,  group: 14, period: 2, block: 'p', valences: [2, 4],   config: '[He] 2s² 2p²', state: 'solid', color: '#334155' },
    N:  { z: 7,  symbol: 'N',  name: 'Nitrógeno',  mass: 14.007, en: 3.04, radius: 75,  group: 15, period: 2, block: 'p', valences: [3, 5],   config: '[He] 2s² 2p³', state: 'gas', color: '#38BDF8' },
    O:  { z: 8,  symbol: 'O',  name: 'Oxígeno',    mass: 15.999, en: 3.44, radius: 73,  group: 16, period: 2, block: 'p', valences: [2],      config: '[He] 2s² 2p⁴', state: 'gas', color: '#EF4444' },
    F:  { z: 9,  symbol: 'F',  name: 'Flúor',      mass: 18.998, en: 3.98, radius: 71,  group: 17, period: 2, block: 'p', valences: [1],      config: '[He] 2s² 2p⁵', state: 'gas', color: '#34D399' },
    Ne: { z: 10, symbol: 'Ne', name: 'Neón',       mass: 20.180, en: 0.00, radius: 69,  group: 18, period: 2, block: 'p', valences: [0],      config: '[He] 2s² 2p⁶', state: 'gas', color: '#F472B6' },
    Na: { z: 11, symbol: 'Na', name: 'Sodio',      mass: 22.990, en: 0.93, radius: 186, group: 1,  period: 3, block: 's', valences: [1],      config: '[Ne] 3s¹', state: 'solid', color: '#818CF8' },
    Mg: { z: 12, symbol: 'Mg', name: 'Magnesio',   mass: 24.305, en: 1.31, radius: 160, group: 2,  period: 3, block: 's', valences: [2],      config: '[Ne] 3s²', state: 'solid', color: '#6366F1' },
    Al: { z: 13, symbol: 'Al', name: 'Aluminio',   mass: 26.982, en: 1.61, radius: 143, group: 13, period: 3, block: 'p', valences: [3],      config: '[Ne] 3s² 3p¹', state: 'solid', color: '#94A3B8' },
    Si: { z: 14, symbol: 'Si', name: 'Silicio',    mass: 28.085, en: 1.90, radius: 118, group: 14, period: 3, block: 'p', valences: [4],      config: '[Ne] 3s² 3p²', state: 'solid', color: '#CBD5E1' },
    P:  { z: 15, symbol: 'P',  name: 'Fósforo',    mass: 30.974, en: 2.19, radius: 110, group: 15, period: 3, block: 'p', valences: [3, 5],   config: '[Ne] 3s² 3p³', state: 'solid', color: '#FB923C' },
    S:  { z: 16, symbol: 'S',  name: 'Azufre',     mass: 32.06,  en: 2.58, radius: 103, group: 16, period: 3, block: 'p', valences: [2, 4, 6],config: '[Ne] 3s² 3p⁴', state: 'solid', color: '#FACC15' },
    Cl: { z: 17, symbol: 'Cl', name: 'Cloro',      mass: 35.45,  en: 3.16, radius: 99,  group: 17, period: 3, block: 'p', valences: [1, 3, 5, 7], config: '[Ne] 3s² 3p⁵', state: 'gas', color: '#4ADE80' },
    Ar: { z: 18, symbol: 'Ar', name: 'Argón',      mass: 39.948, en: 0.00, radius: 97,  group: 18, period: 3, block: 'p', valences: [0],      config: '[Ne] 3s² 3p⁶', state: 'gas', color: '#E879F9' },
    K:  { z: 19, symbol: 'K',  name: 'Potasio',    mass: 39.098, en: 0.82, radius: 227, group: 1,  period: 4, block: 's', valences: [1],      config: '[Ar] 4s¹', state: 'solid', color: '#A78BFA' },
    Ca: { z: 20, symbol: 'Ca', name: 'Calcio',     mass: 40.078, en: 1.00, radius: 197, group: 2,  period: 4, block: 's', valences: [2],      config: '[Ar] 4s²', state: 'solid', color: '#8B5CF6' },
    Fe: { z: 26, symbol: 'Fe', name: 'Hierro',     mass: 55.845, en: 1.83, radius: 126, group: 8,  period: 4, block: 'd', valences: [2, 3],   config: '[Ar] 3d⁶ 4s²', state: 'solid', color: '#EA580C' },
    Cu: { z: 29, symbol: 'Cu', name: 'Cobre',      mass: 63.546, en: 1.90, radius: 128, group: 11, period: 4, block: 'd', valences: [1, 2],   config: '[Ar] 3d¹⁰ 4s¹', state: 'solid', color: '#D97706' },
    Zn: { z: 30, symbol: 'Zn', name: 'Zinc',       mass: 65.38,  en: 1.65, radius: 134, group: 12, period: 4, block: 'd', valences: [2],      config: '[Ar] 3d¹⁰ 4s²', state: 'solid', color: '#78716C' },
    Br: { z: 35, symbol: 'Br', name: 'Bromo',      mass: 79.904, en: 2.96, radius: 114, group: 17, period: 4, block: 'p', valences: [1, 5],   config: '[Ar] 3d¹⁰ 4s² 4p⁵', state: 'liquid', color: '#B91C1C' },
    Ag: { z: 47, symbol: 'Ag', name: 'Plata',      mass: 107.87, en: 1.93, radius: 144, group: 11, period: 5, block: 'd', valences: [1],      config: '[Kr] 4d¹⁰ 5s¹', state: 'solid', color: '#E0E7FF' },
    I:  { z: 53, symbol: 'I',  name: 'Yodo',       mass: 126.90, en: 2.66, radius: 133, group: 17, period: 5, block: 'p', valences: [1, 5, 7], config: '[Kr] 4d¹⁰ 5s² 5p⁵', state: 'solid', color: '#6D28D9' }
  };

  // ==========================================
  // 2. BIBLIOTECA DE REACTIVOS QUÍMICOS Y SGA
  // ==========================================
  const REAGENTS_DB = {
    h2o: {
      id: 'h2o',
      name: 'Agua destilada',
      formula: 'H₂O',
      molarMass: 18.015,
      density: 1.00,
      ph: 7.0,
      state: 'liquid',
      color: 'rgba(219, 234, 254, 0.45)',
      sga: { icon: '🛡️', code: 'SGA00', name: 'Sustancia Segura', desc: 'Solvente universal neutro. No clasificado como peligroso.' },
      fds: { ppe: 'Lentes de seguridad estándar', firstAid: 'Enjuagar en caso de salpicadura', storage: 'Temperatura ambiente en frascos limpios.' }
    },
    nacl: {
      id: 'nacl',
      name: 'Cloruro de Sodio (Sal común)',
      formula: 'NaCl',
      molarMass: 58.44,
      density: 2.16,
      ph: 7.0,
      state: 'solid',
      color: '#FFFFFF',
      sga: { icon: '🛡️', code: 'SGA00', name: 'Baja Toxicidad', desc: 'Sal iónica neutra para preparación de disoluciones y curvas de solubilidad.' },
      fds: { ppe: 'Guantes de nitrilo y lentes', firstAid: 'Lavar ojos con abundante agua si genera irritación leve', storage: 'Mantener en recipiente seco hermético.' }
    },
    sucrose: {
      id: 'sucrose',
      name: 'Sacarosa (Azúcar)',
      formula: 'C₁₂H₂₂O₁₁',
      molarMass: 342.30,
      density: 1.59,
      ph: 7.0,
      state: 'solid',
      color: '#F8FAFC',
      sga: { icon: '🛡️', code: 'SGA00', name: 'Sustancia Inerte', desc: 'Soluto molecular orgánico no electrolito.' },
      fds: { ppe: 'Uso escolar seguro', firstAid: 'Inocuo', storage: 'Lugar seco alejado de humedad.' }
    },
    sand: {
      id: 'sand',
      name: 'Arena de sílice',
      formula: 'SiO₂',
      molarMass: 60.08,
      density: 2.65,
      ph: 7.0,
      state: 'solid',
      color: '#D4B996',
      sga: { icon: '🛡️', code: 'SGA00', name: 'Sólido Insoluble', desc: 'Partículas minerales insolubles ideales para técnicas de filtración y mezclas heterogéneas.' },
      fds: { ppe: 'Evitar inhalación de polvos finos', firstAid: 'Lavar con agua en caso de contacto ocular', storage: 'Recipiente cerrado.' }
    },
    oil: {
      id: 'oil',
      name: 'Aceite vegetal',
      formula: 'Triglicéridos',
      molarMass: 885.4,
      density: 0.92,
      ph: 7.0,
      state: 'liquid',
      color: 'rgba(250, 204, 21, 0.65)',
      sga: { icon: '🛡️', code: 'SGA00', name: 'Inmiscible', desc: 'Líquido no polar inmiscible con el agua, empleado en decantación y cálculo de densidad.' },
      fds: { ppe: 'Delantal y guantes', firstAid: 'Lavar con agua y jabón', storage: 'Lugar fresco protegido de la luz.' }
    },
    ethanol: {
      id: 'ethanol',
      name: 'Alcohol Etílico (Etanol 96%)',
      formula: 'C₂H₅OH',
      molarMass: 46.07,
      density: 0.789,
      ph: 7.33,
      state: 'liquid',
      color: 'rgba(224, 242, 254, 0.4)',
      sga: { icon: '🔥', code: 'SGA02', name: 'Líquido Inflamable', desc: 'Peligro de ignición. Mantener alejado de mecheros y fuentes de calor sin supervisión.' },
      fds: { ppe: 'Lentes, guantes y campana de extracción opcional', firstAid: 'En caso de inhalación salir al aire fresco', storage: 'Armario de reactivos inflamables con ventilación.' }
    },
    vinegar: {
      id: 'vinegar',
      name: 'Vinagre (Ácido Acético diluido ~5%)',
      formula: 'CH₃COOH (ac)',
      molarMass: 60.05,
      density: 1.01,
      ka: 1.8e-5,
      ph: 2.87,
      state: 'liquid',
      color: 'rgba(254, 240, 138, 0.35)',
      sga: { icon: '⚠️', code: 'SGA07', name: 'Atención / Irritante', desc: 'Ácido débil de uso cotidiano para prácticas de equilibrio químico y neutralización.' },
      fds: { ppe: 'Lentes de seguridad', firstAid: 'Lavar con agua corriente en piel u ojos', storage: 'Frasco ámbar bien cerrado.' }
    },
    nahco3: {
      id: 'nahco3',
      name: 'Bicarbonato de Sodio',
      formula: 'NaHCO₃',
      molarMass: 84.01,
      density: 2.20,
      ph: 8.3,
      state: 'solid',
      color: '#FFFFFF',
      sga: { icon: '🛡️', code: 'SGA00', name: 'Sal Básica', desc: 'Reactivo alcalino suave. Produce efervescencia con ácidos liberando CO₂ gaseoso.' },
      fds: { ppe: 'Lentes y espátula', firstAid: 'Inocuo en contacto breve', storage: 'Ambiente seco.' }
    },
    hcl: {
      id: 'hcl',
      name: 'Ácido Clorhídrico (HCl 0.1 M)',
      formula: 'HCl (ac)',
      molarMass: 36.46,
      density: 1.01,
      ph: 1.0,
      concentration: 0.10,
      state: 'liquid',
      color: 'rgba(239, 68, 68, 0.15)',
      sga: { icon: '⚠️🧪', code: 'SGA05', name: 'Corrosivo Fuerte', desc: 'Provoca quemaduras graves en piel y lesiones oculares. Manejo estricto con pipeta.' },
      fds: { ppe: 'Mandil, guantes de nitrilo, lentes cerrados', firstAid: 'Lavar 15 minutos en ducha lavaojos de emergencia', storage: 'Gabinete de ácidos resistentes.' }
    },
    naoh: {
      id: 'naoh',
      name: 'Hidróxido de Sodio (NaOH 0.1 M)',
      formula: 'NaOH (ac)',
      molarMass: 40.00,
      density: 1.02,
      ph: 13.0,
      concentration: 0.10,
      state: 'liquid',
      color: 'rgba(59, 130, 246, 0.12)',
      sga: { icon: '⚠️🧪', code: 'SGA05', name: 'Corrosivo Fuerte', desc: 'Base cáustica fuerte. Causa quemaduras profundas y ataque tisular.' },
      fds: { ppe: 'Mandil, guantes de nitrilo, lentes herméticos', firstAid: 'Enjuague inmediato con agua neutralizante', storage: 'Frascos plásticos herméticos (ataca vidrio en altas concentraciones).' }
    },
    phenolphthalein: {
      id: 'phenolphthalein',
      name: 'Indicador Fenolftaleína (1% alc.)',
      formula: 'C₂₀H₁₄O₄',
      molarMass: 318.32,
      density: 0.85,
      ph: 7.0,
      state: 'liquid',
      color: 'rgba(255, 255, 255, 0.1)',
      sga: { icon: '⚠️', code: 'SGA08', name: 'Atención', desc: 'Indicador de viraje ácido-base: incoloro (pH < 8.2) a rosa fucsia vibrante (pH 8.2 - 10.0).' },
      fds: { ppe: 'Lentes y dosificador gotero', firstAid: 'Lavar con agua corriente', storage: 'Frasco gotero protegido de la luz.' }
    },
    cuso4: {
      id: 'cuso4',
      name: 'Sulfato de Cobre Pentahidratado',
      formula: 'CuSO₄·5H₂O',
      molarMass: 249.68,
      density: 2.28,
      ph: 4.0,
      state: 'solid',
      color: '#0284C7',
      sga: { icon: '⚠️🐟', code: 'SGA09', name: 'Nocivo para Organismos Acuáticos', desc: 'Cristales azules para reacciones de precipitación, cristalización y desplazamiento.' },
      fds: { ppe: 'Guantes de nitrilo y lentes', firstAid: 'No verter en desagües escolares directamente', storage: 'Contenedor etiquetado especial de residuos pesados.' }
    }
  };

  // ==========================================
  // 3. INSTRUMENTAL VIRTUAL DE LABORATORIO (14)
  // ==========================================
  const INSTRUMENTS_DB = {
    beaker: {
      id: 'beaker',
      name: 'Vaso de precipitados (250 mL)',
      category: 'Contención',
      capacityMl: 250,
      precision: '± 5%',
      icon: '🥛',
      desc: 'Preparación de disoluciones, mezclas y observación de efervescencia.'
    },
    graduated_cylinder: {
      id: 'graduated_cylinder',
      name: 'Probeta graduada (100 mL)',
      category: 'Medición rápida',
      capacityMl: 100,
      precision: '± 0.5 mL',
      icon: '📏',
      desc: 'Medición rápida de volúmenes y cálculo de densidad por desplazamiento de Arquímedes.'
    },
    erlenmeyer: {
      id: 'erlenmeyer',
      name: 'Matraz Erlenmeyer (250 mL)',
      category: 'Titulación y reacción',
      capacityMl: 250,
      precision: '± 5%',
      icon: '⚗️',
      desc: 'Ideal para titulación volumétrica con agitación orbital sin salpicaduras.'
    },
    test_tubes: {
      id: 'test_tubes',
      name: 'Tubos de ensayo con gradilla',
      category: 'Microescala',
      capacityMl: 20,
      precision: 'Aproximada',
      icon: '🧪',
      desc: 'Ensayos a pequeña escala de solubilidad, precipitación y colorimetría.'
    },
    pipette: {
      id: 'pipette',
      name: 'Pipeta graduada con propipeta',
      category: 'Transferencia exacta',
      capacityMl: 10,
      precision: '± 0.05 mL',
      icon: '💉',
      desc: 'Extracción de alícuotas con propipeta virtual de goma para seguridad.'
    },
    burette: {
      id: 'burette',
      name: 'Bureta graduada (50 mL)',
      category: 'Volumétrico de precisión',
      capacityMl: 50,
      precision: '± 0.02 mL',
      icon: '🧊',
      desc: 'Dosificación gota a gota con llave de teflón y zoom óptico al menisco cóncavo.'
    },
    digital_balance: {
      id: 'digital_balance',
      name: 'Balanza analítica digital',
      category: 'Gravimétrico',
      capacityMl: null,
      precision: '± 0.01 g',
      icon: '⚖️',
      desc: 'Medición de masa con función de tarado rápido (TARA) para recipientes vacíos.'
    },
    digital_thermometer: {
      id: 'digital_thermometer',
      name: 'Termómetro digital (-20 a 150 °C)',
      category: 'Medición física',
      capacityMl: null,
      precision: '± 0.1 °C',
      icon: '🌡️',
      desc: 'Monitoreo de curvas térmicas, ebullición y reacciones exotérmicas.'
    },
    ph_meter: {
      id: 'ph_meter',
      name: 'pH-metro digital y tiras reactivas',
      category: 'Análisis electroquímico',
      capacityMl: null,
      precision: '± 0.01 pH',
      icon: '📟',
      desc: 'Sonda sumergible con lectura de pH (0 - 14) y viraje visual de tiras tornasol.'
    },
    bunsen_burner: {
      id: 'bunsen_burner',
      name: 'Mechero Bunsen regulable',
      category: 'Térmico',
      capacityMl: null,
      precision: 'Llama azul no luminosa',
      icon: '🔥',
      desc: 'Suministro de calor con control de entrada de aire y temperatura de llama.'
    },
    filter_funnel: {
      id: 'filter_funnel',
      name: 'Embudo con papel de filtro',
      category: 'Separación gravitatoria',
      capacityMl: 100,
      precision: 'Cualitativa',
      icon: '🌪️',
      desc: 'Separación de suspensiones heterogéneas (retención de arena y paso de filtrado).'
    },
    distillation_apparatus: {
      id: 'distillation_apparatus',
      name: 'Equipo de destilación simple',
      category: 'Separación térmica',
      capacityMl: 250,
      precision: 'Fraccional',
      icon: '🔬',
      desc: 'Balón de destilación, termómetro de vapores y condensador refrigerante Liebig.'
    },
    centrifuge: {
      id: 'centrifuge',
      name: 'Centrífuga de laboratorio',
      category: 'Separación centrífuga',
      capacityMl: 60,
      precision: '3000 RPM',
      icon: '⚙️',
      desc: 'Separación rápida de fases por gradiente de aceleración centrífuga.'
    },
    mortar_pestle: {
      id: 'mortar_pestle',
      name: 'Mortero y pistilo de porcelana',
      category: 'Mecánico',
      capacityMl: null,
      precision: 'Granulométrica',
      icon: '🥣',
      desc: 'Pulverización y trituración de sólidos para acelerar la velocidad de disolución.'
    }
  };

  // ==========================================
  // 4. REGISTRO DE TELEMETRÍA EXPERIMENTAL (JSONB)
  // ==========================================
  let telemetryLog = [];
  let telemetryStartTime = Date.now();

  function logTelemetry(action, target, value, details = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      elapsedSeconds: parseFloat(((Date.now() - telemetryStartTime) / 1000).toFixed(1)),
      action,
      target,
      value,
      details
    };
    telemetryLog.push(entry);
    return entry;
  }

  function resetTelemetry() {
    telemetryLog = [];
    telemetryStartTime = Date.now();
  }

  function getTelemetryJSONB() {
    return {
      version: '2.0-Fleming',
      sessionDate: new Date().toISOString(),
      totalEvents: telemetryLog.length,
      events: [...telemetryLog]
    };
  }

  // ==========================================
  // 5. MÓDULOS CIENTÍFICOS ESPECIALIZADOS
  // ==========================================

  /**
   * Módulo 01: Química y magnitudes (Densidad y Arquímedes)
   */
  function calculateDensity(massG, initialVolMl, finalVolMl) {
    if (finalVolMl <= initialVolMl || massG <= 0) {
      return { success: false, error: 'El volumen final debe ser mayor al inicial y la masa positiva.' };
    }
    const displacedVolume = finalVolMl - initialVolMl;
    const density = massG / displacedVolume;
    return {
      success: true,
      massG: parseFloat(massG.toFixed(2)),
      displacedVolumeMl: parseFloat(displacedVolume.toFixed(2)),
      densityGml: parseFloat(density.toFixed(3)),
      densityKgm3: parseFloat((density * 1000).toFixed(1))
    };
  }

  /**
   * Módulo 04 & 05: Estructura atómica, Núcleo y Configuración Electrónica (Moeller)
   */
  function buildAtom(protons, neutrons, electrons) {
    const z = Math.max(0, parseInt(protons, 10));
    const n = Math.max(0, parseInt(neutrons, 10));
    const e = Math.max(0, parseInt(electrons, 10));
    const massNumber = z + n;
    const netCharge = z - e;

    let elementMatch = null;
    for (const sym in ELEMENTS_DB) {
      if (ELEMENTS_DB[sym].z === z) {
        elementMatch = ELEMENTS_DB[sym];
        break;
      }
    }

    let ionType = 'Neutro';
    if (netCharge > 0) ionType = `Catión (+${netCharge})`;
    else if (netCharge < 0) ionType = `Anión (${netCharge})`;

    // Estabilidad nuclear aproximada (relación N/Z)
    let stability = 'Inestable';
    if (z === 0) {
      stability = 'No es un átomo';
    } else if (z === 1) {
      stability = (n <= 1) ? 'Estable' : 'Radiactivo (Tritio)';
    } else {
      const ratio = n / z;
      if (ratio >= 0.9 && ratio <= 1.5) stability = 'Estable';
      else stability = 'Isótopo Radiactivo Inestable';
    }

    return {
      z,
      a: massNumber,
      neutrons: n,
      electrons: e,
      charge: netCharge,
      ionType,
      stability,
      element: elementMatch || { symbol: 'X', name: 'Elemento Sintético / Desconocido', mass: massNumber }
    };
  }

  // Generador de Configuración Electrónica por Regla del Serrucho / Moeller
  const MOELLER_ORDER = [
    { sub: '1s', max: 2, n: 1, l: 0 },
    { sub: '2s', max: 2, n: 2, l: 0 },
    { sub: '2p', max: 6, n: 2, l: 1 },
    { sub: '3s', max: 2, n: 3, l: 0 },
    { sub: '3p', max: 6, n: 3, l: 1 },
    { sub: '4s', max: 2, n: 4, l: 0 },
    { sub: '3d', max: 10, n: 3, l: 2 },
    { sub: '4p', max: 6, n: 4, l: 1 },
    { sub: '5s', max: 2, n: 5, l: 0 },
    { sub: '4d', max: 10, n: 4, l: 2 },
    { sub: '5p', max: 6, n: 5, l: 1 },
    { sub: '6s', max: 2, n: 6, l: 0 },
    { sub: '4f', max: 14, n: 4, l: 3 },
    { sub: '5d', max: 10, n: 5, l: 2 },
    { sub: '6p', max: 6, n: 6, l: 1 },
    { sub: '7s', max: 2, n: 7, l: 0 }
  ];

  function getElectronConfiguration(z) {
    if (z <= 0) return { fullConfig: 'Sin electrones', orbitals: [], quantumNumbers: null };
    let remaining = z;
    const orbitals = [];
    let lastOrbital = null;
    let electronsInLast = 0;

    for (const step of MOELLER_ORDER) {
      if (remaining <= 0) break;
      const count = Math.min(remaining, step.max);
      orbitals.push({
        subshell: step.sub,
        electrons: count,
        n: step.n,
        l: step.l
      });
      lastOrbital = step;
      electronsInLast = count;
      remaining -= count;
    }

    const fullConfig = orbitals.map(o => `${o.subshell}<sup>${o.electrons}</sup>`).join(' ');

    // Números cuánticos para el último electrón (n, l, ml, ms)
    let ml = 0;
    let ms = '+1/2';
    if (lastOrbital) {
      const l = lastOrbital.l;
      const capPerMl = 2;
      const mlSlots = (2 * l) + 1; // e.g. l=1 => 3 slots: -1, 0, +1
      const slotIndex = (electronsInLast - 1) % mlSlots;
      ml = -l + slotIndex;
      ms = electronsInLast > mlSlots ? '-1/2' : '+1/2';
    }

    return {
      z,
      fullConfig,
      plainConfig: orbitals.map(o => `${o.subshell}${o.electrons}`).join(' '),
      orbitals,
      quantumNumbers: {
        n: lastOrbital ? lastOrbital.n : 1,
        l: lastOrbital ? lastOrbital.l : 0,
        ml: ml,
        ms: ms
      }
    };
  }

  /**
   * Módulo 07: Enlace Químico y Regla de Pauling
   */
  function evaluateChemicalBond(elemKey1, elemKey2) {
    const el1 = ELEMENTS_DB[elemKey1];
    const el2 = ELEMENTS_DB[elemKey2];
    if (!el1 || !el2) return null;

    const deltaEN = Math.abs(el1.en - el2.en);
    const roundedDelta = parseFloat(deltaEN.toFixed(2));

    let bondType = '';
    let category = '';
    let description = '';
    let dipole = '';

    // Metálico si ambos son metales alcalinos / alcalinotérreos / transición
    const isMetal1 = el1.block === 's' && el1.group <= 2 || el1.block === 'd';
    const isMetal2 = el2.block === 's' && el2.group <= 2 || el2.block === 'd';

    if (isMetal1 && isMetal2) {
      bondType = 'Enlace Metálico';
      category = 'metallic';
      description = 'Mar de electrones deslocalizados entre cationes metálicos con alta conductividad.';
      dipole = 'Deslocalizado uniforme';
    } else if (roundedDelta >= 2.0) {
      bondType = 'Enlace Iónico';
      category = 'ionic';
      const cation = el1.en < el2.en ? el1 : el2;
      const anion = el1.en >= el2.en ? el1 : el2;
      description = `Transferencia total de electrones: ${cation.name} cede electrones formando catión (+) y ${anion.name} los acepta formando anión (-).`;
      dipole = `${cation.symbol}⁺ --- ${anion.symbol}⁻`;
    } else if (roundedDelta > 0.4) {
      bondType = 'Enlace Covalente Polar';
      category = 'covalent-polar';
      const moreElectronegative = el1.en > el2.en ? el1 : el2;
      const lessElectronegative = el1.en <= el2.en ? el1 : el2;
      description = `Los electrones se comparten de manera asimétrica; el átomo más electronegativo (${moreElectronegative.name}) atrae mayor densidad electrónica generando dipolos.`;
      dipole = `${lessElectronegative.symbol} (δ⁺) → ${moreElectronegative.symbol} (δ⁻)`;
    } else {
      bondType = 'Enlace Covalente Apolar (No Polar)';
      category = 'covalent-nonpolar';
      description = 'Compartición equitativa o casi simétrica de pares de electrones sin separación de carga significativa.';
      dipole = 'Sin momento dipolar neto (μ ≈ 0)';
    }

    return {
      el1,
      el2,
      deltaEN: roundedDelta,
      bondType,
      category,
      description,
      dipole
    };
  }

  /**
   * Módulo 08: Formulación y Nomenclatura Inorgánica
   */
  const NOMENCLATURE_CATALOG = [
    {
      formula: 'FeO',
      type: 'Óxido Básico',
      traditional: 'Óxido ferroso',
      stock: 'Óxido de hierro(II)',
      iupac: 'Monóxido de hierro',
      reaction: '2Fe + O₂ → 2FeO'
    },
    {
      formula: 'Fe2O3',
      displayFormula: 'Fe₂O₃',
      type: 'Óxido Básico',
      traditional: 'Óxido férrico',
      stock: 'Óxido de hierro(III)',
      iupac: 'Trióxido de dihierro',
      reaction: '4Fe + 3O₂ → 2Fe₂O₃'
    },
    {
      formula: 'CO2',
      displayFormula: 'CO₂',
      type: 'Óxido Ácido (Anhídrido)',
      traditional: 'Anhídrido carbónico',
      stock: 'Óxido de carbono(IV)',
      iupac: 'Dióxido de carbono',
      reaction: 'C + O₂ → CO₂'
    },
    {
      formula: 'NaOH',
      displayFormula: 'NaOH',
      type: 'Hidróxido (Base)',
      traditional: 'Sosa cáustica / Hidróxido sódico',
      stock: 'Hidróxido de sodio',
      iupac: 'Hidróxido de sodio',
      reaction: 'Na₂O + H₂O → 2NaOH'
    },
    {
      formula: 'Ca(OH)2',
      displayFormula: 'Ca(OH)₂',
      type: 'Hidróxido (Base)',
      traditional: 'Cal apagada / Hidróxido cálcico',
      stock: 'Hidróxido de calcio',
      iupac: 'Dihidróxido de calcio',
      reaction: 'CaO + H₂O → Ca(OH)₂'
    },
    {
      formula: 'HCl',
      displayFormula: 'HCl',
      type: 'Hidrácido / Ácido fuerte',
      traditional: 'Ácido clorhídrico',
      stock: 'Cloruro de hidrógeno',
      iupac: 'Cloruro de hidrógeno',
      reaction: 'H₂ + Cl₂ → 2HCl'
    },
    {
      formula: 'H2SO4',
      displayFormula: 'H₂SO₄',
      type: 'Oxácido fuerte',
      traditional: 'Ácido sulfúrico',
      stock: 'Sulfato(VI) de hidrógeno',
      iupac: 'Tetraoxosulfato(VI) de hidrógeno',
      reaction: 'SO₃ + H₂O → H₂SO₄'
    },
    {
      formula: 'NaCl',
      displayFormula: 'NaCl',
      type: 'Sal Haloidea neutra',
      traditional: 'Cloruro sódico',
      stock: 'Cloruro de sodio',
      iupac: 'Monocloruro de sodio',
      reaction: 'HCl + NaOH → NaCl + H₂O'
    },
    {
      formula: 'CuSO4',
      displayFormula: 'CuSO₄',
      type: 'Oxisal neutra',
      traditional: 'Sulfato cúprico',
      stock: 'Sulfato de cobre(II)',
      iupac: 'Tetraoxosulfato de cobre(II)',
      reaction: 'CuO + H₂SO₄ → CuSO₄ + H₂O'
    }
  ];

  /**
   * Módulo 09: Reacciones Químicas y Fenomenología
   */
  const REACTIONS_DB = [
    {
      id: 'rx-syn-nacl',
      name: 'Síntesis de Sal Común',
      type: 'Síntesis (Combinación)',
      equation: '2Na(s) + Cl₂(g) → 2NaCl(s)',
      reactants: ['Na', 'Cl'],
      heatRequired: true,
      deltaH: -411.1, // kJ/mol (Exotérmica)
      phenomenon: {
        visual: 'Llama amarilla intensa y formación de cristales blancos de sal.',
        gasReleased: false,
        tempChange: '+45 °C'
      }
    },
    {
      id: 'rx-water',
      name: 'Formación de Agua',
      type: 'Síntesis (Combinación)',
      equation: '2H₂(g) + O₂(g) → 2H₂O(l)',
      reactants: ['H', 'O'],
      heatRequired: false,
      deltaH: -285.8, // kJ/mol
      phenomenon: {
        visual: 'Vapor de agua que condensa en rocío líquido en las paredes del matraz.',
        gasReleased: false,
        tempChange: '+30 °C'
      }
    },
    {
      id: 'rx-neutral-hcl-naoh',
      name: 'Neutralización Ácido-Base',
      type: 'Doble Desplazamiento',
      equation: 'HCl(ac) + NaOH(ac) → NaCl(ac) + H₂O(l)',
      reactants: ['HCl', 'NaOH'],
      heatRequired: false,
      deltaH: -57.3,
      phenomenon: {
        visual: 'Viraje transparente a pH 7.0 neutro con liberación moderada de calor.',
        gasReleased: false,
        tempChange: '+4.5 °C'
      }
    },
    {
      id: 'rx-effervescence',
      name: 'Efervescencia de Bicarbonato y Vinagre',
      type: 'Descomposición y Desplazamiento',
      equation: 'CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂(g)↑',
      reactants: ['CH3COOH', 'NaHCO3'],
      heatRequired: false,
      deltaH: +15.2, // Endotérmica
      phenomenon: {
        visual: 'Intenso burbujeo y desprendimiento vigoroso de gas CO₂.',
        gasReleased: true,
        tempChange: '-3.2 °C'
      }
    },
    {
      id: 'rx-precip-copper',
      name: 'Precipitación de Hidróxido de Cobre',
      type: 'Doble Desplazamiento (Precipitación)',
      equation: 'CuSO₄(ac) + 2NaOH(ac) → Cu(OH)₂(s)↓ + Na₂SO₄(ac)',
      reactants: ['CuSO4', 'NaOH'],
      heatRequired: false,
      deltaH: -32.0,
      phenomenon: {
        visual: 'Formación inmediata de precipitado gelatinoso azul celeste brillante en el fondo.',
        gasReleased: false,
        tempChange: '+2.0 °C'
      }
    }
  ];

  /**
   * Módulo 10: Estequiometría Cuantitativa
   */
  function calculateStoichiometry(molesA, molesB, ratioA, ratioB, molarMassA, molarMassB, molarMassProd, ratioProd) {
    const requiredB = (molesA * ratioB) / ratioA;
    let limiting = '';
    let excess = '';
    let maxMolesProd = 0;
    let excessLeftMoles = 0;

    if (molesB >= requiredB) {
      limiting = 'Reactivo A';
      excess = 'Reactivo B';
      maxMolesProd = (molesA * ratioProd) / ratioA;
      excessLeftMoles = molesB - requiredB;
    } else {
      limiting = 'Reactivo B';
      excess = 'Reactivo A';
      maxMolesProd = (molesB * ratioProd) / ratioB;
      const requiredA = (molesB * ratioA) / ratioB;
      excessLeftMoles = molesA - requiredA;
    }

    const theoreticalMassG = maxMolesProd * molarMassProd;
    return {
      limiting,
      excess,
      maxMolesProd: parseFloat(maxMolesProd.toFixed(4)),
      excessLeftMoles: parseFloat(excessLeftMoles.toFixed(4)),
      theoreticalMassG: parseFloat(theoreticalMassG.toFixed(3)),
      avogadroMolecules: (maxMolesProd * 6.022e23).toExponential(3)
    };
  }

  /**
   * Módulo 11: Disoluciones, pH y Titulación Volumétrica Analítica (ChemEngine Core)
   * Modelo analítico estequiométrico: HCl (0.1 M, V_acid) titulado con NaOH (0.1 M, V_base)
   */
  function calculateTitrationStep(vAcidMl, cAcidM, vBaseAddedMl, cBaseM, indicator = 'phenolphthalein') {
    const vAcidL = vAcidMl / 1000;
    const vBaseL = vBaseAddedMl / 1000;
    const totalVolL = vAcidL + vBaseL;

    const initialMolesAcid = vAcidL * cAcidM;
    const addedMolesBase = vBaseL * cBaseM;

    let ph = 7.0;
    let stage = '';

    const deltaMoles = initialMolesAcid - addedMolesBase;
    const eqVolumeMl = (initialMolesAcid / cBaseM) * 1000;

    if (deltaMoles > 1e-7) {
      // Exceso de ácido antes del punto de equivalencia
      const hConc = deltaMoles / totalVolL;
      ph = -Math.log10(Math.max(1e-14, hConc));
      stage = 'Antes del punto de equivalencia (Ácido en exceso)';
    } else if (Math.abs(deltaMoles) <= 1e-7) {
      // Punto exacto de equivalencia
      ph = 7.00;
      stage = 'PUNTO DE EQUIVALENCIA EXACTO (Neutralización total)';
    } else {
      // Exceso de base después del punto de equivalencia
      const excessBaseMoles = Math.abs(deltaMoles);
      const ohConc = excessBaseMoles / totalVolL;
      const poh = -Math.log10(Math.max(1e-14, ohConc));
      ph = 14.0 - poh;
      stage = 'Pasado el punto de equivalencia (Base en exceso)';
    }

    // Acotar pH entre 0 y 14
    ph = Math.max(0.0, Math.min(14.0, ph));

    // Viraje de fenolftaleína (incoloro a rosa fucsia entre 8.2 y 10.0)
    let indicatorColor = 'rgba(255, 255, 255, 0.05)';
    let pinkIntensity = 0;
    if (ph < 8.2) {
      indicatorColor = 'rgba(255, 255, 255, 0.05)';
      pinkIntensity = 0;
    } else if (ph >= 8.2 && ph <= 10.0) {
      pinkIntensity = (ph - 8.2) / (10.0 - 8.2);
      indicatorColor = `rgba(244, 63, 94, ${0.25 + pinkIntensity * 0.65})`;
    } else {
      pinkIntensity = 1.0;
      indicatorColor = 'rgba(225, 29, 72, 0.9)';
    }

    return {
      vAcidMl,
      vBaseAddedMl: parseFloat(vBaseAddedMl.toFixed(2)),
      eqVolumeMl: parseFloat(eqVolumeMl.toFixed(2)),
      ph: parseFloat(ph.toFixed(2)),
      stage,
      pinkIntensity,
      indicatorColor,
      isEquivalent: Math.abs(vBaseAddedMl - eqVolumeMl) < 0.2
    };
  }

  /**
   * Módulo 12 & 13: Química del Carbono y Modelado Molecular
   */
  const ORGANIC_MOLECULES = {
    methane: {
      name: 'Metano',
      formula: 'CH₄',
      type: 'Alcano',
      hybridization: 'sp³',
      geometry: 'Tetraédrica',
      bondAngle: '109.5°',
      sigmaBonds: 4,
      piBonds: 0,
      smiles: 'C',
      pubchemCid: 297,
      description: 'Hidrocarburo más simple. Cuatro enlaces covalentes sigma idénticos orientados hacia los vértices de un tetraedro regular.'
    },
    ethane: {
      name: 'Etano',
      formula: 'C₂H₆',
      type: 'Alcano',
      hybridization: 'sp³',
      geometry: 'Tetraédrica en cada C',
      bondAngle: '109.5°',
      sigmaBonds: 7,
      piBonds: 0,
      smiles: 'CC',
      pubchemCid: 6324,
      description: 'Alcano saturado con libre rotación alrededor del enlace simple carbono-carbono.'
    },
    ethene: {
      name: 'Eteno (Etileno)',
      formula: 'C₂H₄',
      type: 'Alqueno',
      hybridization: 'sp²',
      geometry: 'Trigonal plana',
      bondAngle: '120°',
      sigmaBonds: 5,
      piBonds: 1,
      smiles: 'C=C',
      pubchemCid: 6325,
      description: 'Presencia de enlace doble (1 enlace sigma + 1 enlace pi perpendicular), estructura plana rígida sin libre rotación.'
    },
    ethyne: {
      name: 'Etino (Acetileno)',
      formula: 'C₂H₂',
      type: 'Alquino',
      hybridization: 'sp',
      geometry: 'Lineal',
      bondAngle: '180°',
      sigmaBonds: 3,
      piBonds: 2,
      smiles: 'C#C',
      pubchemCid: 6326,
      description: 'Enlace triple (1 enlace sigma axial + 2 enlaces pi ortogonales) con geometría colineal de alta reactividad.'
    },
    ethanol: {
      name: 'Etanol',
      formula: 'C₂H₅OH',
      type: 'Alcohol primario',
      hybridization: 'sp³ (C y O)',
      geometry: 'Angular en el grupo -OH',
      bondAngle: '104.5° (C-O-H)',
      sigmaBonds: 8,
      piBonds: 0,
      smiles: 'CCO',
      pubchemCid: 702,
      description: 'Presencia del grupo funcional hidroxilo (-OH) que confiere alta polaridad y formación de puentes de hidrógeno.'
    },
    acetic_acid: {
      name: 'Ácido Acético',
      formula: 'CH₃COOH',
      type: 'Ácido carboxílico',
      hybridization: 'sp² (carbono carboxílico)',
      geometry: 'Trigonal plana en -COOH',
      bondAngle: '120°',
      sigmaBonds: 7,
      piBonds: 1,
      smiles: 'CC(=O)O',
      pubchemCid: 176,
      description: 'Grupo carboxilo (-COOH) con resonancia electrónica y capacidad de donar protones H⁺ en medio acuoso.'
    }
  };

  // ==========================================
  // 6. RÚBRICA FORMATIVA VIGESIMAL (0 - 20)
  // ==========================================
  function evaluateProceduralRubric(practiceConfig, sessionTelemetry) {
    let score = 0;
    const rubricDetails = [];

    // Criterio 1: Selección de instrumentos y bioseguridad SGA (0 - 3 pts)
    const hasReadSGA = sessionTelemetry.some(e => e.action === 'read_sga' || e.action === 'consult_fds');
    const usedProperGlassware = sessionTelemetry.some(e => e.action === 'select_instrument' && (e.target === 'erlenmeyer' || e.target === 'burette'));
    let crit1 = 0;
    if (hasReadSGA) crit1 += 1.5;
    if (usedProperGlassware) crit1 += 1.5;
    crit1 = Math.min(3.0, crit1);
    rubricDetails.push({
      criteria: '1. Selección de instrumentos y bioseguridad SGA',
      maxScore: 3.0,
      score: crit1,
      feedback: hasReadSGA 
        ? 'Revisó correctamente los pictogramas SGA y seleccionó cristalería adecuada.' 
        : 'Omitió la consulta de la ficha SGA antes de manipular el reactivo corrosivo.'
    });

    // Criterio 2: Procedimiento experimental y técnica (0 - 5 pts)
    const purgedBurette = sessionTelemetry.some(e => e.action === 'purge_burette');
    const dropByDrop = sessionTelemetry.some(e => e.action === 'titration_drop' || e.action === 'fine_dosage');
    const mixedProperly = sessionTelemetry.some(e => e.action === 'stir_flask');
    let crit2 = 0;
    if (purgedBurette) crit2 += 2.0;
    if (dropByDrop) crit2 += 2.0;
    if (mixedProperly) crit2 += 1.0;
    crit2 = Math.min(5.0, crit2);
    rubricDetails.push({
      criteria: '2. Procedimiento experimental y técnica de dosificación',
      maxScore: 5.0,
      score: crit2,
      feedback: purgedBurette && dropByDrop 
        ? 'Excelente técnica: purga de bureta realizada y dosificación controlada gota a gota en el punto final.' 
        : 'Debe recordar siempre purgar la bureta para eliminar burbujas de aire y dosificar gota a gota.'
    });

    // Criterio 3: Mediciones y toma de datos (0 - 4 pts)
    const checkedMeniscus = sessionTelemetry.some(e => e.action === 'inspect_meniscus');
    const taredBalance = sessionTelemetry.some(e => e.action === 'tare_balance');
    let crit3 = 0;
    if (checkedMeniscus) crit3 += 2.5;
    if (taredBalance) crit3 += 1.5;
    crit3 = Math.min(4.0, crit3);
    rubricDetails.push({
      criteria: '3. Mediciones y toma de datos (Menisco y Balanza)',
      maxScore: 4.0,
      score: crit3,
      feedback: checkedMeniscus 
        ? 'Alineó la vista a la tangente del menisco cóncavo para una lectura exacta del volumen.' 
        : 'No realizó la lectura óptica ampliada del menisco de la probeta/bureta.'
    });

    // Criterio 4: Resultados y estequiometría (0 - 5 pts)
    const endVolume = sessionTelemetry.find(e => e.action === 'finish_titration')?.value || 25.0;
    const targetVolume = practiceConfig?.targetVolume || 25.0;
    const errorMargin = Math.abs(endVolume - targetVolume) / targetVolume;
    let crit4 = 5.0;
    if (errorMargin <= 0.02) crit4 = 5.0;
    else if (errorMargin <= 0.05) crit4 = 4.0;
    else if (errorMargin <= 0.10) crit4 = 3.0;
    else if (errorMargin <= 0.20) crit4 = 1.5;
    else crit4 = 0.5;

    rubricDetails.push({
      criteria: '4. Exactitud cuantitativa de resultados y estequiometría',
      maxScore: 5.0,
      score: crit4,
      feedback: `Margen de error experimental obtenido: ${(errorMargin * 100).toFixed(1)}% (Tolerancia aceptada: ± 5%).`
    });

    // Criterio 5: Conocimiento científico y fundamentación (0 - 3 pts)
    const theoreticalAnswers = sessionTelemetry.find(e => e.action === 'theory_submission')?.value || { correct: 2, total: 3 };
    const crit5 = parseFloat(((theoreticalAnswers.correct / theoreticalAnswers.total) * 3.0).toFixed(1));
    rubricDetails.push({
      criteria: '5. Conocimiento científico y fundamentación teórica',
      maxScore: 3.0,
      score: crit5,
      feedback: `Respondió satisfactoriamente ${theoreticalAnswers.correct} de ${theoreticalAnswers.total} preguntas conceptuales.`
    });

    // Calificación Vigesimal Total (0 - 20)
    score = rubricDetails.reduce((sum, item) => sum + item.score, 0);
    score = Math.min(20, Math.max(0, parseFloat(score.toFixed(1))));

    return {
      vigesimalScore: score,
      letterGrade: score >= 17 ? 'AD (Logro Destacado)' : score >= 14 ? 'A (Logro Esperado)' : score >= 11 ? 'B (En Proceso)' : 'C (En Inicio)',
      details: rubricDetails,
      evaluatedAt: new Date().toISOString()
    };
  }

  // ==========================================
  // API PÚBLICA DE CHEMENENGINE
  // ==========================================
  return {
    elements: ELEMENTS_DB,
    reagents: REAGENTS_DB,
    instruments: INSTRUMENTS_DB,
    nomenclatures: NOMENCLATURE_CATALOG,
    reactions: REACTIONS_DB,
    organicMolecules: ORGANIC_MOLECULES,

    // Métodos experimentales
    logTelemetry,
    resetTelemetry,
    getTelemetryJSONB,
    calculateDensity,
    buildAtom,
    getElectronConfiguration,
    evaluateChemicalBond,
    calculateStoichiometry,
    calculateTitrationStep,
    evaluateProceduralRubric
  };
})();

// Exportación universal (Navegador y Node/ESM si aplica)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChemEngine;
}
if (typeof window !== 'undefined') {
  window.ChemEngine = ChemEngine;
}
