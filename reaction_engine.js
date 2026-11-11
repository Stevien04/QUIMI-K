/**
 * QUIMI-K: ReactionEngine (Núcleo de Dominio - Arquitectura Hexagonal)
 * Basado en las especificaciones de FD03 y FD04 (AthomReactChamber).
 * Implementa el cálculo de electronegatividad en escala de Pauling:
 * ΔEN = |EN1 - EN2|
 * Clasificación:
 * - ΔEN >= 2.0 => Enlace Iónico
 * - 0.4 < ΔEN < 2.0 => Enlace Covalente Polar
 * - ΔEN <= 0.4 => Enlace Covalente Apolar
 */

const ReactionEngine = {
  // Datos científicos estandarizados (con compatibilidad de caché PubChem)
  elements: {
    H: { symbol: 'H', name: 'Hidrógeno', z: 1, en: 2.20, radius: 37, valence: 1, color: '#FFFFFF', mass: 1.008, state: 'gas', group: 'No metal' },
    Li: { symbol: 'Li', name: 'Litio', z: 3, en: 0.98, radius: 152, valence: 1, color: '#CC80FF', mass: 6.94, state: 'solid', group: 'Alcalino' },
    C: { symbol: 'C', name: 'Carbono', z: 6, en: 2.55, radius: 77, valence: 4, color: '#334155', mass: 12.011, state: 'solid', group: 'No metal' },
    N: { symbol: 'N', name: 'Nitrógeno', z: 7, en: 3.04, radius: 75, valence: 3, color: '#3B82F6', mass: 14.007, state: 'gas', group: 'No metal' },
    O: { symbol: 'O', name: 'Oxígeno', z: 8, en: 3.44, radius: 73, valence: 2, color: '#EF4444', mass: 15.999, state: 'gas', group: 'No metal' },
    F: { symbol: 'F', name: 'Flúor', z: 9, en: 3.98, radius: 71, valence: 1, color: '#10B981', mass: 18.998, state: 'gas', group: 'Halógeno' },
    Na: { symbol: 'Na', name: 'Sodio', z: 11, en: 0.93, radius: 186, valence: 1, color: '#8B5CF6', mass: 22.990, state: 'solid', group: 'Alcalino' },
    Mg: { symbol: 'Mg', name: 'Magnesio', z: 12, en: 1.31, radius: 160, valence: 2, color: '#6EE7B7', mass: 24.305, state: 'solid', group: 'Alcalinotérreo' },
    Al: { symbol: 'Al', name: 'Aluminio', z: 13, en: 1.61, radius: 143, valence: 3, color: '#CBD5E1', mass: 26.982, state: 'solid', group: 'Metaloide' },
    Si: { symbol: 'Si', name: 'Silicio', z: 14, en: 1.90, radius: 118, valence: 4, color: '#F59E0B', mass: 28.085, state: 'solid', group: 'Metaloide' },
    P: { symbol: 'P', name: 'Fósforo', z: 15, en: 2.19, radius: 110, valence: 3, color: '#F97316', mass: 30.974, state: 'solid', group: 'No metal' },
    S: { symbol: 'S', name: 'Azufre', z: 16, en: 2.58, radius: 102, valence: 2, color: '#EAB308', mass: 32.06, state: 'solid', group: 'No metal' },
    Cl: { symbol: 'Cl', name: 'Cloro', z: 17, en: 3.16, radius: 99, valence: 1, color: '#22C55E', mass: 35.453, state: 'gas', group: 'Halógeno' },
    K: { symbol: 'K', name: 'Potasio', z: 19, en: 0.82, radius: 227, valence: 1, color: '#A855F7', mass: 39.098, state: 'solid', group: 'Alcalino' },
    Ca: { symbol: 'Ca', name: 'Calcio', z: 20, en: 1.00, radius: 197, valence: 2, color: '#38BDF8', mass: 40.078, state: 'solid', group: 'Alcalinotérreo' },
    Fe: { symbol: 'Fe', name: 'Hierro', z: 26, en: 1.83, radius: 126, valence: 3, color: '#94A3B8', mass: 55.845, state: 'solid', group: 'Transición' },
    Cu: { symbol: 'Cu', name: 'Cobre', z: 29, en: 1.90, radius: 128, valence: 2, color: '#FB923C', mass: 63.546, state: 'solid', group: 'Transición' },
    Zn: { symbol: 'Zn', name: 'Zinc', z: 30, en: 1.65, radius: 134, valence: 2, color: '#A1A1AA', mass: 65.38, state: 'solid', group: 'Transición' },
    Br: { symbol: 'Br', name: 'Bromo', z: 35, en: 2.96, radius: 114, valence: 1, color: '#991B1B', mass: 79.904, state: 'liquid', group: 'Halógeno' },
    I: { symbol: 'I', name: 'Yodo', z: 53, en: 2.66, radius: 133, valence: 1, color: '#7E22CE', mass: 126.90, state: 'solid', group: 'Halógeno' }
  },

  // Base de datos de reacciones curadas según FD03 y FD06
  reactions: [
    {
      id: 'reaction-nacl',
      title: 'Síntesis de Cloruro de Sodio (Sal Común)',
      equation: '2Na(s) + Cl₂(g) → 2NaCl(s)',
      reactant1: 'Na',
      reactant2: 'Cl',
      expectedProduct: 'NaCl',
      productName: 'Cloruro de Sodio',
      en1: 0.93,
      en2: 3.16,
      heatRequired: true,
      description: 'El Sodio cede un electrón de valencia al Cloro. Gran diferencia de electronegatividad genera una transferencia completa de electrones.',
      safetyNote: 'Reacción exotérmica fuerte. En laboratorio real desprende calor y luz intensa.'
    },
    {
      id: 'reaction-h2o',
      title: 'Formación de Molécula de Agua',
      equation: '2H₂(g) + O₂(g) → 2H₂O(l)',
      reactant1: 'H',
      reactant2: 'O',
      expectedProduct: 'H₂O',
      productName: 'Agua',
      en1: 2.20,
      en2: 3.44,
      heatRequired: false,
      description: 'Los átomos de Hidrógeno y Oxígeno comparten pares de electrones de manera desigual debido a la mayor electronegatividad del Oxígeno.',
      safetyNote: 'Reacción con desprendimiento energético.'
    },
    {
      id: 'reaction-neutralization',
      title: 'Neutralización Ácido-Base (HCl + NaOH)',
      equation: 'HCl(ac) + NaOH(ac) → NaCl(ac) + H₂O(l)',
      reactant1: 'Na',
      reactant2: 'Cl',
      expectedProduct: 'NaCl + H₂O',
      productName: 'Salmuera Neutra',
      en1: 0.93,
      en2: 3.16,
      heatRequired: false,
      description: 'El ion hidrógeno (H⁺) neutraliza el hidróxido (OH⁻) formando agua neutra y sal disuelta con viraje de pH.',
      safetyNote: 'Manejar ácidos y bases con pipeta y lentes de protección.'
    }
  ],

  // Calcula la diferencia de electronegatividad (Pauling) y clasifica el enlace
  evaluateBond(elemA, elemB) {
    if (!elemA || !elemB) return null;
    const deltaEN = Math.abs(elemA.en - elemB.en);
    const roundedDelta = parseFloat(deltaEN.toFixed(2));

    let bondType = '';
    let category = '';
    let explanation = '';

    if (roundedDelta >= 2.0) {
      bondType = 'Iónico';
      category = 'ionic';
      explanation = `ΔEN = ${roundedDelta} (≥ 2.0). Ocurre transferencia neta de electrones: ${elemA.en < elemB.en ? elemA.name : elemB.name} actúa como catión (+) y ${elemA.en > elemB.en ? elemA.name : elemB.name} como anión (-).`;
    } else if (roundedDelta > 0.4) {
      bondType = 'Covalente Polar';
      category = 'covalent-polar';
      explanation = `ΔEN = ${roundedDelta} (entre 0.4 y 2.0). Los electrones se comparten de forma asimétrica, generando dipolos eléctricos parciales (δ+ y δ-).`;
    } else {
      bondType = 'Covalente Apolar (No Polar)';
      category = 'covalent-nonpolar';
      explanation = `ΔEN = ${roundedDelta} (≤ 0.4). La distribución de la densidad electrónica es prácticamente equitativa entre los dos átomos.`;
    }

    return {
      deltaEN: roundedDelta,
      bondType,
      category,
      explanation,
      elements: [elemA, elemB]
    };
  },

  // Combina dos elementos cualesquiera seleccionados por el estudiante y predice su enlace, fórmula y estructura 3D
  combineElements(symA, symB) {
    const elA = this.elements[symA] || this.elements['H'];
    const elB = this.elements[symB] || this.elements['O'];

    const deltaEN = parseFloat(Math.abs(elA.en - elB.en).toFixed(2));
    let bondType = '';
    let category = '';
    let explanation = '';

    if (deltaEN >= 2.0) {
      bondType = 'Enlace Iónico';
      category = 'ionic';
      explanation = `ΔEN = ${deltaEN} (≥ 2.0). Hay una transferencia neta de electrones: ${elA.en < elB.en ? elA.name : elB.name} actúa como catión metálico (+) y ${elA.en > elB.en ? elA.name : elB.name} como anión no metálico (-). Se forma una red cristalina iónica.`;
    } else if (deltaEN > 0.4) {
      bondType = 'Covalente Polar';
      category = 'covalent-polar';
      explanation = `ΔEN = ${deltaEN} (entre 0.4 y 2.0). Los electrones se comparten pero son atraídos con mayor fuerza hacia ${elA.en > elB.en ? elA.name : elB.name} debido a su mayor electronegatividad, generando dipolos eléctricos parciales (δ+ y δ-).`;
    } else {
      bondType = (symA === symB) ? 'Covalente Apolar Puro (Diatómico)' : 'Covalente Apolar (No Polar)';
      category = 'covalent-nonpolar';
      explanation = `ΔEN = ${deltaEN} (≤ 0.4). La densidad electrónica se distribuye de manera simétrica y equitativa entre los dos núcleos atómicos.`;
    }

    const pair = [symA, symB].sort().join('-');
    const knownCompounds = {
      'Cl-Na': { formula: 'NaCl', name: 'Cloruro de Sodio (Sal Común)', pubchem: 'sodium chloride', geo: 'Red Cúbica FCC', mass: 58.44 },
      'H-O': { formula: 'H₂O', name: 'Agua', pubchem: 'water', geo: 'Angular (104.5°)', mass: 18.015 },
      'C-O': { formula: 'CO₂', name: 'Dióxido de Carbono', pubchem: 'carbon dioxide', geo: 'Lineal (180.0°)', mass: 44.01 },
      'C-H': { formula: 'CH₄', name: 'Metano', pubchem: 'methane', geo: 'Tetraédrica (109.5°)', mass: 16.04 },
      'H-N': { formula: 'NH₃', name: 'Amoníaco', pubchem: 'ammonia', geo: 'Pirámide Trigonal (107.8°)', mass: 17.03 },
      'Cl-H': { formula: 'HCl', name: 'Cloruro de Hidrógeno (Ác. Clorhídrico)', pubchem: 'hydrogen chloride', geo: 'Lineal diatómica', mass: 36.46 },
      'Ca-O': { formula: 'CaO', name: 'Óxido de Calcio (Cal Viva)', pubchem: 'calcium oxide', geo: 'Red Cúbica Iónica', mass: 56.08 },
      'Mg-O': { formula: 'MgO', name: 'Óxido de Magnesio', pubchem: 'magnesium oxide', geo: 'Red Cristalina Iónica', mass: 40.30 },
      'Fe-O': { formula: 'Fe₂O₃', name: 'Óxido Férrico (Herrumbre)', pubchem: 'iron oxide', geo: 'Red Trigonal Corindón', mass: 159.69 },
      'Cu-S': { formula: 'CuS', name: 'Sulfuro de Cobre (Covellita)', pubchem: 'copper sulfide', geo: 'Red Hexagonal', mass: 95.61 },
      'H-S': { formula: 'H₂S', name: 'Sulfuro de Hidrógeno', pubchem: 'hydrogen sulfide', geo: 'Angular (92.1°)', mass: 34.08 },
      'F-H': { formula: 'HF', name: 'Fluoruro de Hidrógeno', pubchem: 'hydrogen fluoride', geo: 'Lineal diatómica', mass: 20.01 },
      'Cl-K': { formula: 'KCl', name: 'Cloruro de Potasio', pubchem: 'potassium chloride', geo: 'Red Cúbica Iónica', mass: 74.55 },
      'O-Si': { formula: 'SiO₂', name: 'Dióxido de Silicio (Sílice / Cuarzo)', pubchem: 'silicon dioxide', geo: 'Red Tetraédrica Continua', mass: 60.08 },
      'Cl-Cl': { formula: 'Cl₂', name: 'Gas Cloro Diatómico', pubchem: 'chlorine', geo: 'Lineal diatómica', mass: 70.90 },
      'H-H': { formula: 'H₂', name: 'Gas Hidrógeno Diatómico', pubchem: 'hydrogen', geo: 'Lineal diatómica', mass: 2.016 },
      'O-O': { formula: 'O₂', name: 'Gas Oxígeno Diatómico', pubchem: 'oxygen', geo: 'Lineal diatómica doble', mass: 31.998 },
      'N-N': { formula: 'N₂', name: 'Gas Nitrógeno Diatómico', pubchem: 'nitrogen', geo: 'Lineal diatómica triple', mass: 28.014 },
      'Br-H': { formula: 'HBr', name: 'Bromuro de Hidrógeno', pubchem: 'hydrogen bromide', geo: 'Lineal diatómica', mass: 80.91 },
      'H-I': { formula: 'HI', name: 'Yoduro de Hidrógeno', pubchem: 'hydrogen iodide', geo: 'Lineal diatómica', mass: 127.91 },
      'Al-O': { formula: 'Al₂O₃', name: 'Óxido de Aluminio (Alúmina)', pubchem: 'aluminium oxide', geo: 'Red Corindón', mass: 101.96 },
      'O-Zn': { formula: 'ZnO', name: 'Óxido de Zinc (Wurtzita)', pubchem: 'zinc oxide', geo: 'Red Wurtzita Hexagonal', mass: 81.38 },
      'C-Cl': { formula: 'CCl₄', name: 'Tetracloruro de Carbono', pubchem: 'carbon tetrachloride', geo: 'Tetraédrica (109.5°)', mass: 153.82 }
    };

    let comp = knownCompounds[pair];
    if (!comp) {
      const vA = elA.valence || 1;
      const vB = elB.valence || 1;
      comp = {
        formula: `${elA.symbol}${vB > 1 ? vB : ''}${elB.symbol}${vA > 1 ? vA : ''}`,
        name: `Compuesto de ${elA.name} y ${elB.name}`,
        pubchem: `${elA.name} ${elB.name}`,
        geo: deltaEN >= 2.0 ? 'Red Cristalina Iónica' : 'Geometría Covalente Molecular',
        mass: parseFloat((elA.mass * vB + elB.mass * vA).toFixed(2))
      };
    }

    return {
      elementA: elA,
      elementB: elB,
      deltaEN,
      bondType,
      category,
      explanation,
      compound: comp
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ReactionEngine;
}
if (typeof window !== 'undefined') {
  window.ReactionEngine = ReactionEngine;
}
