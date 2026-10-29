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
    H: { symbol: 'H', name: 'Hidrógeno', z: 1, en: 2.20, radius: 37, color: '#FFFFFF', mass: 1.008, state: 'gas' },
    O: { symbol: 'O', name: 'Oxígeno', z: 8, en: 3.44, radius: 73, color: '#EF4444', mass: 15.999, state: 'gas' },
    Na: { symbol: 'Na', name: 'Sodio', z: 11, en: 0.93, radius: 186, color: '#8B5CF6', mass: 22.990, state: 'solid' },
    Cl: { symbol: 'Cl', name: 'Cloro', z: 17, en: 3.16, radius: 99, color: '#22C55E', mass: 35.453, state: 'gas' },
    C: { symbol: 'C', name: 'Carbono', z: 6, en: 2.55, radius: 77, color: '#334155', mass: 12.011, state: 'solid' },
    N: { symbol: 'N', name: 'Nitrógeno', z: 7, en: 3.04, radius: 75, color: '#3B82F6', mass: 14.007, state: 'gas' }
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
  }
};
