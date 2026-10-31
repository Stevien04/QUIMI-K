/**
 * QUIMI-K: Lógica Principal de la Aplicación Demo
 * Integra ReactionEngine, PubChemService, Canvas Molecular y la UI.
 */

const App = {
  // Estado actual del sistema
  state: {
    currentUser: null, // Inicia sin sesión para exigir el login al ingresar
    currentRole: 'guest',
    currentPracticeIndex: 0,
    currentStepIndex: 0,
    simulationActive: false,
    heatActive: false,
    particles: [],
    selectedTool: null,
    quizScore: null
  },

  // Base de datos de usuarios registrados en el sistema (I.E. Alexander Fleming)
  registeredUsers: [
    {
      id: 'usr-razself',
      name: 'Stevie Marca',
      email: 'razself@gmail.com',
      password: '123',
      role: 'student',
      classroom: '4to Año "A"',
      classroomId: '4A',
      practice: 'Síntesis de NaCl (Enlace Iónico)',
      attempts: 1,
      score: 19,
      status: 'Aprobado',
      date: '28/10/2026 12:00',
      registeredAt: '20/10/2026',
      notesHistory: [
        { test: 'Evaluación Diagnóstica: Materia y Enlaces', score: 18, date: '22/10/2026' },
        { test: 'Control 1: Enlaces Iónicos y Lewis', score: 19, date: '28/10/2026' }
      ]
    },
    {
      id: 'usr-std-1',
      name: 'Juan Pérez',
      email: 'estudiante@fleming.edu.pe',
      password: '123',
      role: 'student',
      classroom: '4to Año "A"',
      classroomId: '4A',
      practice: 'Síntesis de NaCl (Enlace Iónico)',
      attempts: 1,
      score: 18,
      status: 'Aprobado',
      date: '28/10/2026 10:15',
      registeredAt: '20/10/2026',
      notesHistory: [
        { test: 'Evaluación Diagnóstica: Materia y Enlaces', score: 17, date: '22/10/2026' },
        { test: 'Control 1: Enlaces Iónicos y Lewis', score: 18, date: '28/10/2026' }
      ]
    },
    {
      id: 'usr-std-gmail',
      name: 'Carlos Alumno Gmail',
      email: 'carlos.alumno@gmail.com',
      password: '123',
      role: 'student',
      classroom: '4to Año "B"',
      classroomId: '4B',
      practice: 'Síntesis de NaCl (Enlace Iónico)',
      attempts: 1,
      score: 17,
      status: 'Aprobado',
      date: '28/10/2026 11:30',
      registeredAt: '21/10/2026',
      notesHistory: [
        { test: 'Evaluación Diagnóstica: Materia y Enlaces', score: 16, date: '22/10/2026' },
        { test: 'Control 1: Enlaces Iónicos y Lewis', score: 17, date: '28/10/2026' }
      ]
    },
    {
      id: 'usr-std-2',
      name: 'María Gómez',
      email: 'maria.gomez@fleming.edu.pe',
      password: '123',
      role: 'student',
      classroom: '4to Año "A"',
      classroomId: '4A',
      practice: 'Síntesis de NaCl (Enlace Iónico)',
      attempts: 2,
      score: 19,
      status: 'Aprobado',
      date: '28/10/2026 10:22',
      registeredAt: '20/10/2026',
      notesHistory: [
        { test: 'Evaluación Diagnóstica: Materia y Enlaces', score: 18, date: '22/10/2026' },
        { test: 'Control 1: Enlaces Iónicos y Lewis', score: 19, date: '28/10/2026' }
      ]
    },
    {
      id: 'usr-std-3',
      name: 'Carlos Ramos',
      email: 'carlos.ramos@fleming.edu.pe',
      password: '123',
      role: 'student',
      classroom: '4to Año "A"',
      classroomId: '4A',
      practice: 'Síntesis de NaCl (Enlace Iónico)',
      attempts: 1,
      score: 16,
      status: 'Aprobado',
      date: '28/10/2026 11:05',
      registeredAt: '21/10/2026',
      notesHistory: [
        { test: 'Control 1: Enlaces Iónicos y Lewis', score: 16, date: '28/10/2026' }
      ]
    },
    {
      id: 'usr-std-4',
      name: 'Diego Mamani',
      email: 'diego.mamani@fleming.edu.pe',
      password: '123',
      role: 'student',
      classroom: '4to Año "A"',
      classroomId: '4A',
      practice: 'Síntesis de NaCl (Enlace Iónico)',
      attempts: 1,
      score: 17,
      status: 'Aprobado',
      date: '28/10/2026 11:18',
      registeredAt: '21/10/2026',
      notesHistory: [
        { test: 'Control 1: Enlaces Iónicos y Lewis', score: 17, date: '28/10/2026' }
      ]
    },
    {
      id: 'usr-std-5',
      name: 'Camila Torres',
      email: 'camila.torres@fleming.edu.pe',
      password: '123',
      role: 'student',
      classroom: '4to Año "A"',
      classroomId: '4A',
      practice: 'Síntesis de NaCl (Enlace Iónico)',
      attempts: 2,
      score: 18,
      status: 'Aprobado',
      date: '28/10/2026 11:40',
      registeredAt: '21/10/2026',
      notesHistory: [
        { test: 'Control 1: Enlaces Iónicos y Lewis', score: 18, date: '28/10/2026' }
      ]
    },
    {
      id: 'usr-std-6',
      name: 'Lucía Fernández',
      email: 'lucia.f@fleming.edu.pe',
      password: '123',
      role: 'student',
      classroom: '4to Año "B"',
      classroomId: '4B',
      practice: 'Formación de Molécula de Agua (H₂O)',
      attempts: 1,
      score: 20,
      status: 'Aprobado',
      date: '28/10/2026 11:30',
      registeredAt: '21/10/2026',
      notesHistory: [
        { test: 'Cuestionario Guía: Polaridad Molecular', score: 20, date: '28/10/2026' }
      ]
    },
    {
      id: 'usr-std-7',
      name: 'Mateo Quispe',
      email: 'mateo.q@fleming.edu.pe',
      password: '123',
      role: 'student',
      classroom: '4to Año "B"',
      classroomId: '4B',
      practice: 'Formación de Molécula de Agua (H₂O)',
      attempts: 2,
      score: 15,
      status: 'Aprobado',
      date: '28/10/2026 12:10',
      registeredAt: '21/10/2026',
      notesHistory: [
        { test: 'Cuestionario Guía: Polaridad Molecular', score: 15, date: '28/10/2026' }
      ]
    },
    {
      id: 'usr-std-8',
      name: 'Sofía Condori',
      email: 'sofia.c@fleming.edu.pe',
      password: '123',
      role: 'student',
      classroom: '4to Año "B"',
      classroomId: '4B',
      practice: 'Formación de Molécula de Agua (H₂O)',
      attempts: 1,
      score: 12,
      status: 'Desaprobado',
      date: '28/10/2026 12:45',
      registeredAt: '22/10/2026',
      notesHistory: [
        { test: 'Cuestionario Guía: Polaridad Molecular', score: 12, date: '28/10/2026' }
      ]
    },
    {
      id: 'usr-std-9',
      name: 'Rodrigo Vargas',
      email: 'rodrigo.v@fleming.edu.pe',
      password: '123',
      role: 'student',
      classroom: '4to Año "B"',
      classroomId: '4B',
      practice: 'Formación de Molécula de Agua (H₂O)',
      attempts: 1,
      score: 16,
      status: 'Aprobado',
      date: '28/10/2026 13:02',
      registeredAt: '22/10/2026',
      notesHistory: [
        { test: 'Cuestionario Guía: Polaridad Molecular', score: 16, date: '28/10/2026' }
      ]
    },
    {
      id: 'usr-std-10',
      name: 'Valeria Castro',
      email: 'valeria.c@fleming.edu.pe',
      password: '123',
      role: 'student',
      classroom: '4to Año "B"',
      classroomId: '4B',
      practice: 'Formación de Molécula de Agua (H₂O)',
      attempts: 1,
      score: 19,
      status: 'Aprobado',
      date: '28/10/2026 13:15',
      registeredAt: '22/10/2026',
      notesHistory: [
        { test: 'Cuestionario Guía: Polaridad Molecular', score: 19, date: '28/10/2026' }
      ]
    },
    {
      id: 'usr-std-11',
      name: 'Alejandro Morales',
      email: 'alejandro.m@fleming.edu.pe',
      password: '123',
      role: 'student',
      classroom: '5to Año "A"',
      classroomId: '5A',
      practice: 'Neutralización Ácido-Base (HCl + NaOH)',
      attempts: 1,
      score: 19,
      status: 'Aprobado',
      date: '29/10/2026 08:30',
      registeredAt: '22/10/2026',
      notesHistory: [
        { test: 'Control de pH y Neutralización', score: 19, date: '29/10/2026' }
      ]
    },
    {
      id: 'usr-std-12',
      name: 'Gabriela Zegarra',
      email: 'gabriela.z@fleming.edu.pe',
      password: '123',
      role: 'student',
      classroom: '5to Año "A"',
      classroomId: '5A',
      practice: 'Neutralización Ácido-Base (HCl + NaOH)',
      attempts: 1,
      score: 20,
      status: 'Aprobado',
      date: '29/10/2026 08:45',
      registeredAt: '22/10/2026',
      notesHistory: [
        { test: 'Control de pH y Neutralización', score: 20, date: '29/10/2026' }
      ]
    },
    {
      id: 'usr-std-13',
      name: 'Sebastián Huanca',
      email: 'sebastian.h@fleming.edu.pe',
      password: '123',
      role: 'student',
      classroom: '5to Año "A"',
      classroomId: '5A',
      practice: 'Neutralización Ácido-Base (HCl + NaOH)',
      attempts: 2,
      score: 17,
      status: 'Aprobado',
      date: '29/10/2026 09:10',
      registeredAt: '22/10/2026',
      notesHistory: [
        { test: 'Control de pH y Neutralización', score: 17, date: '29/10/2026' }
      ]
    },
    {
      id: 'usr-std-14',
      name: 'Daniela Cáceres',
      email: 'daniela.c@fleming.edu.pe',
      password: '123',
      role: 'student',
      classroom: '5to Año "A"',
      classroomId: '5A',
      practice: 'Neutralización Ácido-Base (HCl + NaOH)',
      attempts: 1,
      score: 18,
      status: 'Aprobado',
      date: '29/10/2026 09:25',
      registeredAt: '23/10/2026',
      notesHistory: [
        { test: 'Control de pH y Neutralización', score: 18, date: '29/10/2026' }
      ]
    },
    {
      id: 'usr-tch-1',
      name: 'Prof. Midori Judith Castillo Peralta',
      email: 'docente@fleming.edu.pe',
      password: '123',
      role: 'teacher',
      classroom: 'Salones 4°A, 4°B, 5°A',
      classroomId: 'staff',
      practice: 'Supervisión de 3 Salones',
      attempts: '-',
      score: null,
      status: 'Activo',
      date: '29/10/2026 12:00',
      registeredAt: '15/02/2026',
      notesHistory: []
    },
    {
      id: 'usr-tch-2',
      name: 'Prof. Roberto Quispe',
      email: 'roberto.q@fleming.edu.pe',
      password: '123',
      role: 'teacher',
      classroom: 'Salones 5°B, 5°C',
      classroomId: 'staff',
      practice: 'Supervisión Curricular',
      attempts: '-',
      score: null,
      status: 'Activo',
      date: '29/10/2026 11:30',
      registeredAt: '18/02/2026',
      notesHistory: []
    },
    {
      id: 'usr-adm-1',
      name: 'Soporte TI Fleming',
      email: 'admin@fleming.edu.pe',
      password: '123',
      role: 'admin',
      classroom: 'Coordinación TI Fleming',
      classroomId: 'staff',
      practice: 'Gestión Integral del Sistema',
      attempts: '-',
      score: null,
      status: 'Activo',
      date: '29/10/2026 12:30',
      registeredAt: '10/01/2026',
      notesHistory: []
    },
    {
      id: 'usr-req-1',
      name: 'Lic. Fernando Gutiérrez',
      email: 'fernando.g@fleming.edu.pe',
      password: '123',
      role: 'student', // Permanece como estudiante hasta que el admin le asigne el rol docente
      requestedRole: 'teacher',
      teacherRequestStatus: 'pending',
      teacherRequestDate: '29/10/2026 15:30',
      classroom: 'Pendiente de Asignación Docente',
      classroomId: 'staff',
      practice: 'Solicitud Docente: Química Orgánica',
      attempts: '-',
      score: null,
      status: 'Solicitud Pendiente',
      date: '29/10/2026 15:30',
      registeredAt: '29/10/2026',
      notesHistory: []
    }
  ],

  // Base de datos de prácticas con pasos detallados
  practices: [
    {
      title: 'Síntesis de Cloruro de Sodio (Na + Cl → NaCl)',
      subtext: 'Enlace Iónico mediante transferencia electrónica',
      equation: '2Na(s) + Cl₂(g) → 2NaCl(s)',
      reactant1: 'Na',
      reactant2: 'Cl',
      steps: [
        {
          step: 1,
          name: 'Disponer Matraz y Reactivo A',
          desc: 'Seleccionar el matraz Erlenmeyer y verter una muestra de Sodio metálico (Na).',
          hint: 'Utilice la pipeta o matraz para añadir Sodio a la cámara de reacción.',
          action: 'add_reagent_1'
        },
        {
          step: 2,
          name: 'Inyectar Reactivo B (Gas Cloro)',
          desc: 'Insuflar Gas Cloro (Cl₂) dentro del matraz con el Sodio.',
          hint: 'Observe la difusión de los átomos de Cloro dentro de la cámara.',
          action: 'add_reagent_2'
        },
        {
          step: 3,
          name: 'Aplicar Calor con Mechero Bunsen',
          desc: 'Encender el mechero Bunsen para alcanzar la energía de activación.',
          hint: 'El calor acelera la agitación de los átomos hasta provocar la colisión reactiva.',
          action: 'apply_heat'
        },
        {
          step: 4,
          name: 'Formación de Cristales de Sal',
          desc: 'Validar la transferencia de electrones y formación de la red iónica NaCl.',
          hint: 'ΔEN = 2.23 confirma la formación de un enlace iónico estable.',
          action: 'form_product'
        }
      ],
      quiz: [
        {
          question: '1. Según la escala de Linus Pauling, ¿cuál es el valor de ΔEN para el enlace Na-Cl?',
          options: ['0.40', '1.25', '2.23', '3.16'],
          answer: 2,
          explanation: 'EN(Cl) = 3.16 y EN(Na) = 0.93. Por ende, ΔEN = |3.16 - 0.93| = 2.23.'
        },
        {
          question: '2. Al ser ΔEN ≥ 2.0, ¿qué tipo de enlace químico se produce entre Na y Cl?',
          options: ['Enlace Covalente Polar', 'Enlace Iónico', 'Enlace Covalente Apolar', 'Enlace Metálico puro'],
          answer: 1,
          explanation: 'Valores de ΔEN iguales o mayores a 2.0 se clasifican como enlaces iónicos por transferencia de electrones.'
        },
        {
          question: '3. En esta reacción, ¿qué átomo actúa como catión (+)?',
          options: ['El Sodio (Na⁺)', 'El Cloro (Cl⁻)', 'Ambos neutros', 'El Oxígeno'],
          answer: 0,
          explanation: 'El Sodio posee baja electronegatividad y cede su único electrón de valencia, convirtiéndose en el catión Na⁺.'
        },
        {
          question: '4. ¿Por qué en el Colegio Alexander Fleming se usa el simulador para esta reacción?',
          options: [
            'Porque el gas cloro no existe',
            'Por seguridad: el gas cloro es tóxico y el sodio reacciona violentamente en laboratorios físicos',
            'Porque el colegio prohíbe la química',
            'Para no ensuciar la mesa'
          ],
          answer: 1,
          explanation: 'El simulador virtual previene riesgos por toxicidad de reactivos y quemaduras térmicas.'
        }
      ]
    },
    {
      title: 'Formación de Molécula Polar (2H₂ + O₂ → 2H₂O)',
      subtext: 'Enlace Covalente Polar con densidad electrónica asimétrica',
      equation: '2H₂(g) + O₂(g) → 2H₂O(l)',
      reactant1: 'H',
      reactant2: 'O',
      steps: [
        {
          step: 1,
          name: 'Alimentar Gas Hidrógeno (H₂)',
          desc: 'Cargar moléculas de Hidrógeno gaseoso en la cámara.',
          hint: 'El hidrógeno tiene electronegatividad 2.20.',
          action: 'add_reagent_1'
        },
        {
          step: 2,
          name: 'Alimentar Gas Oxígeno (O₂)',
          desc: 'Introducir Oxígeno gaseoso en la cámara de reacción.',
          hint: 'El oxígeno tiene electronegatividad 3.44.',
          action: 'add_reagent_2'
        },
        {
          step: 3,
          name: 'Ignición / Chispa Energética',
          desc: 'Generar la colisión para romper los enlaces diatómicos iniciales.',
          hint: 'Los átomos se recombinan compartiendo electrones.',
          action: 'apply_heat'
        },
        {
          step: 4,
          name: 'Síntesis Molecular de Agua',
          desc: 'Verificar la formación de moléculas de agua con ángulo dipolar.',
          hint: 'ΔEN = 1.24 clasifica el enlace como Covalente Polar.',
          action: 'form_product'
        }
      ],
      quiz: [
        {
          question: '1. ¿Cuál es el cálculo de ΔEN para el enlace H-O en la molécula de agua?',
          options: ['3.44 - 2.20 = 1.24', '3.44 + 2.20 = 5.64', '2.20 - 1.00 = 1.20', '0.00'],
          answer: 0,
          explanation: 'ΔEN = |3.44 - 2.20| = 1.24.'
        },
        {
          question: '2. Con un ΔEN de 1.24, ¿cómo se clasifica el enlace H-O?',
          options: ['Iónico', 'Covalente Polar', 'Covalente No Polar', 'Puente de Hidrógeno puro'],
          answer: 1,
          explanation: 'Al estar entre 0.4 y 2.0, los electrones se comparten de forma asimétrica (Covalente Polar).'
        },
        {
          question: '3. ¿Hacia qué átomo se desplaza la mayor densidad de carga negativa (δ-)?',
          options: ['Hacia el Hidrógeno', 'Hacia el Oxígeno', 'Al centro exacto', 'Hacia el exterior'],
          answer: 1,
          explanation: 'El Oxígeno es más electronegativo (3.44 vs 2.20), atrayendo hacia sí la nube de electrones.'
        },
        {
          question: '4. ¿Qué ventaja ofrece la simulación molecular visual al estudiante?',
          options: [
            'Ver la formación de dipolos en tiempo real',
            'Evitar cálculos matemáticos',
            'Remplazar el examen final',
            'Apagar la computadora rápido'
          ],
          answer: 0,
          explanation: 'Permite comprender el fenómeno microscópico intangible sin requerir equipo de difracción física.'
        }
      ]
    },
    {
      title: 'Neutralización Ácido-Base (HCl + NaOH → NaCl + H₂O)',
      subtext: 'Reacción clásica de titulación con formación de sal neutra',
      equation: 'HCl(ac) + NaOH(ac) → NaCl(ac) + H₂O(l)',
      reactant1: 'Na',
      reactant2: 'Cl',
      steps: [
        {
          step: 1,
          name: 'Colocar Ácido Clorhídrico (HCl)',
          desc: 'Añadir 20 mL de solución ácida en el matraz Erlenmeyer.',
          hint: 'Solución ácida con indicador de pH.',
          action: 'add_reagent_1'
        },
        {
          step: 2,
          name: 'Titular con Pipeta Hidróxido de Sodio',
          desc: 'Gota a gota añadir NaOH hasta llegar al punto de neutralización.',
          hint: 'Observe el viraje de color hacia pH neutro.',
          action: 'add_reagent_2'
        },
        {
          step: 3,
          name: 'Homogeneizar la Solución',
          desc: 'Agitar suavemente el matraz para permitir la interacción molecular.',
          hint: 'Los iones H⁺ y OH⁻ forman agua inmediatamente.',
          action: 'apply_heat'
        },
        {
          step: 4,
          name: 'Evaporación y Cristalización',
          desc: 'Separar el agua para observar los cristales de sal NaCl residuales.',
          hint: 'Se obtiene salmuera neutra.',
          action: 'form_product'
        }
      ],
      quiz: [
        {
          question: '1. En una neutralización ácido-base, ¿cuáles son los productos típicos?',
          options: ['Sal y Agua', 'Ácido fuerte y Gas', 'Solo óxidos', 'Metales puros'],
          answer: 0,
          explanation: 'Ácido + Base → Sal + Agua (ej. HCl + NaOH → NaCl + H₂O).'
        },
        {
          question: '2. ¿Qué instrumento se usa convencionalmente para medir volúmenes con precisión en esta titulación?',
          options: ['Pipeta o Bureta', 'Mechero Bunsen', 'Lupa', 'Termómetro únicamente'],
          answer: 0,
          explanation: 'Las pipetas y buretas permiten la dosificación controlada gota a gota.'
        },
        {
          question: '3. ¿Qué pH final se alcanza en la neutralización estequiométrica completa?',
          options: ['pH = 1', 'pH = 7 (Neutro)', 'pH = 14', 'pH = 0'],
          answer: 1,
          explanation: 'La solución resultante de ácido fuerte y base fuerte es neutra con pH cercano a 7.'
        },
        {
          question: '4. ¿Cómo ayuda este simulador al Colegio Fleming?',
          options: [
            'Permite realizar prácticas de titulación sin costo de reactivos ni riesgo de derrames',
            'Descarga juegos',
            'Otorga título universitario directo',
            'Vende reactivos'
          ],
          answer: 0,
          explanation: 'Aporta factibilidad económica y operativa al eliminar reactivos fungibles.'
        }
      ]
    }
  ],

  // ================= RF014 & RF015: LIBRO GUÍA DIGITAL Y ENCICLOPEDIA CIENTÍFICA =================
  selectedGuideCategory: 'all',
  guideSearchText: '',

  guideEntries: [
    // UNIDAD 1: CONCEPTOS FUNDAMENTALES Y MATERIA
    {
      id: 'g-quimica-medicion',
      term: 'Química, Ramas y Medición SI',
      category: 'Materia y Medición',
      catKey: 'materia',
      formula: 'SI: kg (masa), m (longitud), K (temp), mol (cantidad)',
      desc: 'La Química estudia la composición, propiedades y transformaciones de la materia. Se divide en Química Orgánica (carbono), Inorgánica, Analítica (cualitativa y cuantitativa) y Fisicoquímica. Aplica el método científico riguroso y emplea el Sistema Internacional (SI).',
      procedure: 'Procedimiento de medición: Calibrar instrumentos antes de registrar valores, respetar las cifras significativas y reportar incertidumbres experimentales.',
      fullContent: `
        <h4>1. Definición y Ramas de la Química</h4>
        <p>La química es la ciencia experimental que estudia la materia, su estructura íntima, sus propiedades y los cambios energéticos que experimenta. Se organiza en cinco ramas principales:</p>
        <ul>
          <li><strong>Química Orgánica:</strong> Estudio de los compuestos covalentes del átomo de carbono (hidrocarburos, glúcidos, proteínas, polímeros).</li>
          <li><strong>Química Inorgánica:</strong> Estudio de los elementos y compuestos minerales que no poseen enlaces carbono-hidrógeno (óxidos, ácidos, sales, metales).</li>
          <li><strong>Química Analítica:</strong> Identificación cualitativa (¿qué hay?) y cuantitativa (¿cuánto hay?) de los componentes de una muestra.</li>
          <li><strong>Fisicoquímica:</strong> Principios físicos que rigen las reacciones químicas, termodinámica y cinética de colisiones.</li>
          <li><strong>Bioquímica:</strong> Procesos químicos que ocurren en los organismos vivos y el metabolismo celular.</li>
        </ul>
        <h4>2. El Método Científico en Ciencias Experimentales</h4>
        <p>Consta de fases ordenadas: <strong>Observación</strong> rigurosa del fenómeno, planteamiento de la <strong>Hipótesis</strong> verificable, <strong>Experimentación</strong> controlada (como en QUIMI-K), análisis de datos y formulación de <strong>Teorías o Leyes</strong> universales.</p>
        <h4>3. Unidades Fundamentales del Sistema Internacional (SI)</h4>
        <p>Masa en kilogramos (kg) o gramos (g), Longitud en metros (m), Tiempo en segundos (s), Temperatura termodinámica en Kelvin (K) donde <em>K = °C + 273.15</em>, y Cantidad de sustancia en moles (mol).</p>
      `
    },
    {
      id: 'g-materia-estados',
      term: 'La Materia y Cambios de Fase',
      category: 'Materia y Medición',
      catKey: 'materia',
      formula: 'Densidad: ρ = m / V | Presión: P = F / A',
      desc: 'Materia es todo aquello que posee masa y ocupa volumen en el espacio. Presenta estados fundamentales: Sólido, Líquido, Gaseoso y Plasma. Los cambios de fase ocurren por absorción o liberación de calor latente sin alterar la identidad química.',
      procedure: 'En el laboratorio: El mechero Bunsen suministra calor para inducir cambios de estado y aportar la energía de activación necesaria.',
      fullContent: `
        <h4>1. Propiedades Generales y Específicas</h4>
        <p><strong>Generales (Extensivas):</strong> Dependen de la cantidad de materia (masa, volumen, inercia, peso).</p>
        <p><strong>Específicas (Intensivas):</strong> No dependen de la cantidad de materia y permiten identificar una sustancia (densidad, punto de fusión, punto de ebullición, dureza, viscosidad).</p>
        <h4>2. Estados de Agregación de la Materia</h4>
        <ul>
          <li><strong>Sólido:</strong> Fuerzas de atracción intermoleculares predominan sobre las de repulsión (Fa > Fr). Forma y volumen constantes, estructura cristalina definida.</li>
          <li><strong>Líquido:</strong> Fuerzas de atracción y repulsión en equilibrio (Fa ≈ Fr). Volumen constante, pero adopta la forma del recipiente que lo contiene. Incompresible.</li>
          <li><strong>Gaseoso:</strong> Fuerzas de repulsión superan a las de atracción (Fr >> Fa). Forma y volumen variables, alta compresibilidad y difusión rápida.</li>
          <li><strong>Plasma:</strong> Gas altamente ionizado a temperaturas extremas compuesto por electrones libres e iones positivos (presente en el Sol y estrellas).</li>
        </ul>
        <h4>3. Cambios de Fase Termodinámicos</h4>
        <p><strong>Progresivos (Absorben calor):</strong> Fusión (sólido a líquido), Evaporación/Ebullición (líquido a gas) y Sublimación directa (sólido a gas).</p>
        <p><strong>Regresivos (Liberan calor):</strong> Solidificación (líquido a sólido), Condensación/Licuación (gas a líquido) y Sublimación inversa o deposición (gas a sólido).</p>
      `
    },
    {
      id: 'g-clasificacion-materia',
      term: 'Clasificación de Materia y Separación de Mezclas',
      category: 'Materia y Medición',
      catKey: 'materia',
      formula: 'Materia = Sustancias Puras (Elementos / Compuestos) + Mezclas',
      desc: 'Las sustancias puras poseen composición fija e invariable: Elementos (átomos iguales) y Compuestos (unión química de dos o más elementos). Las mezclas combinan sustancias sin enlace químico: Homogéneas (una sola fase) y Heterogéneas (fases distinguibles).',
      procedure: 'Procedimiento de filtración: Separar un precipitado insoluble tras una reacción química empleando papel de filtro cónico sobre un embudo de vidrio.',
      fullContent: `
        <h4>1. Sustancias Puras</h4>
        <ul>
          <li><strong>Elementos (Sustancias Simples):</strong> Formados por átomos del mismo número atómico (Z). No se descomponen por métodos químicos ordinarios (ej. Fe, Au, Na, O₂, Cl₂).</li>
          <li><strong>Compuestos (Sustancias Compuestas):</strong> Unión química de dos o más elementos en proporciones fijas definidas (Ley de Proust). Se separan solo por métodos químicos o electrólisis (ej. H₂O, NaCl, CO₂).</li>
        </ul>
        <h4>2. Mezclas</h4>
        <ul>
          <li><strong>Homogéneas (Disoluciones):</strong> Presentan una sola fase visible uniforme. Sus partículas son de tamaño molecular (< 1 nm), como el aire puro, agua potable o aleaciones como el bronce.</li>
          <li><strong>Heterogéneas:</strong> Presentan dos o más fases visibles distintas (suspensiones, emulsiones, coloides como leche o mayonesa).</li>
        </ul>
        <h4>3. Métodos Físicos de Separación de Mezclas</h4>
        <ul>
          <li><strong>Filtración:</strong> Separa sólidos insolubles suspendidos en un líquido mediante medio poroso.</li>
          <li><strong>Decantación:</strong> Separa líquidos inmiscibles de distinta densidad mediante embudo de decantación (ej. agua y aceite).</li>
          <li><strong>Destilación:</strong> Separa líquidos miscibles aprovechando sus diferentes puntos de ebullición.</li>
          <li><strong>Centrifugación:</strong> Acelera la sedimentación de partículas densas mediante fuerza centrífuga.</li>
        </ul>
      `
    },

    // UNIDAD 2: ESTRUCTURA ATÓMICA Y TABLA PERIÓDICA
    {
      id: 'g-atomo-modelos',
      term: 'El Átomo, Modelos y Partículas Subatómicas',
      category: 'Estructura Atómica y Tabla',
      catKey: 'atomo',
      formula: 'A = Z + n° | Carga Neta q = p⁺ - e⁻',
      desc: 'El átomo es la unidad fundamental de los elementos químicos. Está compuesto por un núcleo denso positivo (protones y neutrones) y una nube electrónica circundante (electrones). Núclidos: Isótopos (igual Z), Isóbaros (igual A) e Isótonos (igual n°).',
      procedure: 'En QUIMI-K: El motor molecular visualiza el número atómico Z, masa atómica y radios de Van der Waals obtenidos vía API de PubChem.',
      fullContent: `
        <h4>1. Evolución de los Modelos Atómicos</h4>
        <ul>
          <li><strong>John Dalton (1808):</strong> Esferas indivisibles, macizas e indestructibles.</li>
          <li><strong>J.J. Thomson (1897):</strong> Descubrió el electrón. Modelo del "budín de pasas" con carga positiva difusa y electrones incrustados.</li>
          <li><strong>Ernest Rutherford (1911):</strong> Experimento de la lámina de oro. Descubrió el núcleo atómico positivo diminuto y corteza vacía.</li>
          <li><strong>Niels Bohr (1913):</strong> Los electrones giran en órbitas circulares estacionarias con niveles cuantizados de energía.</li>
          <li><strong>Modelo Mecano-Cuántico (Schrödinger y Heisenberg):</strong> El electrón se describe mediante funciones de onda en regiones de probabilidad orbital.</li>
        </ul>
        <h4>2. Partículas Subatómicas Fundamentales</h4>
        <ul>
          <li><strong>Protón (p⁺):</strong> Carga +1.602 × 10⁻¹⁹ C, masa 1.672 × 10⁻²⁷ kg. Define el Número Atómico (Z) e identidad del elemento.</li>
          <li><strong>Neutrón (n°):</strong> Carga neutra (0), masa 1.674 × 10⁻²⁷ kg. Otorga estabilidad nuclear al reducir repulsión electrostática.</li>
          <li><strong>Electrón (e⁻):</strong> Carga -1.602 × 10⁻¹⁹ C, masa 9.109 × 10⁻³¹ kg (aprox. 1836 veces menor que el protón).</li>
        </ul>
        <h4>3. Tipos de Núclidos</h4>
        <p><strong>Isótopos:</strong> Mismo número atómico Z, diferente número de masa A (ej. Protio ¹H, Deuterio ²H, Tritio ³H).</p>
        <p><strong>Isóbaros:</strong> Mismo número de masa A, diferente Z (ej. ⁴⁰Ca y ⁴⁰Ar).</p>
        <p><strong>Isótonos:</strong> Mismo número de neutrones n° = A - Z.</p>
      `
    },
    {
      id: 'g-configuracion-cuantica',
      term: 'Zona Extranuclear y Números Cuánticos',
      category: 'Estructura Atómica y Tabla',
      catKey: 'atomo',
      formula: 'Regla del Serrucho (Aufbau) | Cuánticos: (n, l, m_l, m_s)',
      desc: 'La distribución de los electrones en los orbitales atómicos obedece a tres principios fundamentales: Principio de Aufbau (menor a mayor energía relativa), Principio de Exclusión de Pauli y Regla de Hund. Los electrones se identifican mediante cuatro números cuánticos.',
      procedure: 'Los electrones del último nivel (electrones de valencia) son los responsables directos de la reactividad y formación de enlaces en el simulador.',
      fullContent: `
        <h4>1. Los Cuatro Números Cuánticos</h4>
        <ul>
          <li><strong>Número Cuántico Principal (n):</strong> Determina el nivel de energía y el tamaño del orbital. Toma valores enteros positivos (n = 1, 2, 3, 4, 5, 6, 7).</li>
          <li><strong>Número Cuántico Secundario o Azimutal (l):</strong> Define la forma geométrica del subnivel u orbital. Toma valores desde 0 hasta n - 1:
            <br>• l = 0: Subnivel <em>s</em> (sharp, esférico, máx. 2 e⁻).
            <br>• l = 1: Subnivel <em>p</em> (principal, bilobular, máx. 6 e⁻).
            <br>• l = 2: Subnivel <em>d</em> (diffuse, tetralobular, máx. 10 e⁻).
            <br>• l = 3: Subnivel <em>f</em> (fundamental, complejo, máx. 14 e⁻).
          </li>
          <li><strong>Número Cuántico Magnético (m_l):</strong> Determina la orientación espacial del orbital ante un campo magnético. Toma valores enteros desde -l hasta +l pasando por 0.</li>
          <li><strong>Número Cuántico de Espín (m_s):</strong> Indica el sentido de rotación intrínseca del electrón sobre su eje. Valores: +1/2 (giro horario ↑) o -1/2 (giro antihorario ↓).</li>
        </ul>
        <h4>2. Principios de Distribución Electrónica</h4>
        <p><strong>Aufbau:</strong> Los electrones ocupan primero los orbitales de menor energía relativa (Er = n + l).</p>
        <p><strong>Exclusión de Pauli:</strong> Dos electrones en un mismo átomo no pueden tener los cuatro números cuánticos idénticos.</p>
        <p><strong>Regla de Hund:</strong> Al llenar orbitales de igual energía, los electrones se distribuyen con espines paralelos antes de aparearse.</p>
      `
    },
    {
      id: 'g-tabla-periodica',
      term: 'Tabla Periódica Moderna y Propiedades Periódicas',
      category: 'Estructura Atómica y Tabla',
      catKey: 'atomo',
      formula: 'Ley de Moseley: Las propiedades son función periódica de Z',
      desc: 'Organizada en 7 periodos horizontales y 18 grupos verticales, divididos en bloques s, p, d y f. Las propiedades periódicas (electronegatividad, radio atómico, energía de ionización y afinidad electrónica) varían sistemáticamente a lo largo de la tabla.',
      procedure: 'En QUIMI-K: La electronegatividad de Linus Pauling permite calcular la diferencia ΔEN en tiempo real para clasificar enlaces.',
      fullContent: `
        <h4>1. Estructura de la Tabla Periódica</h4>
        <p>Diseñada según la Ley de Moseley en base al orden creciente del número atómico (Z). Se compone de:</p>
        <ul>
          <li><strong>7 Periodos:</strong> Filas horizontales que indican el nivel de energía más externo ocupado por los electrones.</li>
          <li><strong>18 Grupos (Columnas):</strong> Elementos con configuraciones de valencia semejantes y propiedades químicas análogas:
            <br>• Grupo 1 (IA): Metales Alcalinos (Li, Na, K...)
            <br>• Grupo 2 (IIA): Metales Alcalinotérreos (Mg, Ca, Ba...)
            <br>• Grupos 3-12: Metales de Transición (bloque d)
            <br>• Grupo 17 (VIIA): Halógenos (F, Cl, Br, I...)
            <br>• Grupo 18 (VIIIA): Gases Nobles con octeto completo (He, Ne, Ar, Kr, Xe).
          </li>
        </ul>
        <h4>2. Propiedades Periódicas Clave</h4>
        <ul>
          <li><strong>Electronegatividad (EN):</strong> Capacidad de atraer el par electrónico enlazante. Crece hacia la derecha en un periodo y hacia arriba en un grupo (Flúor = 3.98, Francio = 0.7).</li>
          <li><strong>Radio Atómico:</strong> Distancia del núcleo al electrón más externo. Crece hacia abajo en un grupo y hacia la izquierda en un periodo.</li>
          <li><strong>Energía de Ionización (EI):</strong> Energía mínima requerida para arrancar el electrón más externo de un átomo gaseoso neutro.</li>
          <li><strong>Carácter Metálico:</strong> Tendencia a perder electrones (oxidación). Crece hacia la izquierda y hacia abajo.</li>
        </ul>
      `
    },

    // UNIDAD 3: ENLACES Y NOMENCLATURA INORGÁNICA
    {
      id: 'g-enlace-quimico',
      term: 'Enlace Químico y Estructuras de Lewis',
      category: 'Enlaces y Nomenclatura',
      catKey: 'enlaces',
      formula: 'ΔEN = |EN₁ - EN₂| | Octeto de Lewis (8 e⁻)',
      desc: 'Fuerzas de atracción que mantienen unidos a los átomos para lograr estabilidad de gas noble. Se clasifican según la diferencia de electronegatividad (ΔEN): Enlace Iónico (ΔEN ≥ 2.0, transferencia completa), Covalente Polar (0.4 < ΔEN < 2.0), Covalente Apolar (ΔEN ≤ 0.4) y Metálico.',
      procedure: 'Procedimiento en el simulador: Observar la transferencia electrónica en NaCl (ΔEN=2.23) vs la compartición con dipolo en H₂O (ΔEN=1.24).',
      fullContent: `
        <h4>1. Regla del Octeto y Estructura de Lewis</h4>
        <p>Propuesta por Gilbert N. Lewis. Los átomos de los grupos representativos transfieren o comparten electrones de valencia hasta completar 8 electrones en su capa exterior, alcanzando la configuración estable de un gas noble (ns² np⁶).</p>
        <h4>2. Clasificación según Linus Pauling</h4>
        <ul>
          <li><strong>Enlace Iónico (Electrovalente) [ΔEN ≥ 2.0]:</strong>
            <br>Ocurre típicamente entre un metal de baja electronegatividad (catión +) y un no metal de alta electronegatividad (anión -). Se genera una red cristalina tridimensional sólida con alto punto de fusión, duros pero quebradizos, y conductores de electricidad fundidos o disueltos en agua.
            <br><em>Ejemplo: Na (0.93) + Cl (3.16) → ΔEN = 2.23 (NaCl).</em>
          </li>
          <li><strong>Enlace Covalente Polar [0.4 < ΔEN < 2.0]:</strong>
            <br>Compartición asimétrica de electrones entre no metales. El átomo más electronegativo adquiere una densidad de carga parcial negativa (δ-) y el menos electronegativo una carga positiva (δ+), generando un momento dipolar neto.
            <br><em>Ejemplo: H (2.20) + O (3.44) → ΔEN = 1.24 (H₂O).</em>
          </li>
          <li><strong>Enlace Covalente Apolar (Puro) [ΔEN ≤ 0.4]:</strong>
            <br>Compartición equitativa y simétrica entre átomos idénticos o de electronegatividades muy similares.
            <br><em>Ejemplo: Cl₂ (ΔEN = 0.0), H₂ (ΔEN = 0.0), CH₄ (ΔEN = 0.35).</em>
          </li>
          <li><strong>Enlace Metálico:</strong>
            <br>Atracción electrostática entre una red fija de cationes metálicos y un "mar" de electrones libres deslocalizados. Explica la alta conductividad térmica, eléctrica, maleabilidad y ductilidad de los metales.
          </li>
        </ul>
      `
    },
    {
      id: 'g-nomenclatura-inorganica',
      term: 'Funciones Químicas Inorgánicas y Nomenclatura',
      category: 'Enlaces y Nomenclatura',
      catKey: 'enlaces',
      formula: 'Óxidos, Hidróxidos, Hidruros, Ácidos y Sales',
      desc: 'Reglas sistemáticas de formulación química según la IUPAC, método Stock y nomenclatura Clásica o Tradicional. Comprende funciones oxigenadas, hidrogenadas y sales provenientes de la neutralización ácido-base.',
      procedure: 'Identificación: La reacción entre un ácido y una base forma siempre una sal inorgánica más agua (ej. HCl + NaOH → NaCl + H₂O).',
      fullContent: `
        <h4>1. Sistemas de Nomenclatura</h4>
        <ul>
          <li><strong>IUPAC (Sistemática):</strong> Emplea prefijos cuantitativos griegos (mono-, di-, tri-, tetra-, penta-) según los subíndices de la fórmula (ej. CO = monóxido de carbono, CO₂ = dióxido de carbono).</li>
          <li><strong>Stock:</strong> Indica el estado de oxidación del elemento central mediante números romanos entre paréntesis (ej. FeO = óxido de hierro (II), Fe₂O₃ = óxido de hierro (III)).</li>
          <li><strong>Clásica (Tradicional):</strong> Usa prefijos y sufijos según el número de valencias: hipo-...-oso, -oso, -ico, per-...-ico.</li>
        </ul>
        <h4>2. Principales Funciones Químicas Inorgánicas</h4>
        <ul>
          <li><strong>Óxidos Básicos:</strong> Metal + Oxígeno (ej. Na₂O, CaO, FeO).</li>
          <li><strong>Óxidos Ácidos (Anhídridos):</strong> No Metal + Oxígeno (ej. SO₃, CO₂, Cl₂O₇).</li>
          <li><strong>Hidróxidos (Bases):</strong> Óxido básico + Agua → Poseen el grupo oxidrilo (OH)⁻ (ej. NaOH, Ca(OH)₂).</li>
          <li><strong>Ácidos Hidrácidos:</strong> No metal de los grupos 16 o 17 + Hidrógeno (ej. HCl(ac) = ácido clorhídrico).</li>
          <li><strong>Ácidos Oxácidos:</strong> Anhídrido + Agua (ej. H₂SO₄ = ácido sulfúrico, HNO₃ = ácido nítrico).</li>
          <li><strong>Sales Haloideas:</strong> Ácido hidrácido + Hidróxido (ej. HCl + NaOH → NaCl + H₂O).</li>
          <li><strong>Sales Oxisales:</strong> Ácido oxácido + Hidróxido (ej. H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O).</li>
        </ul>
      `
    },

    // UNIDAD 4: REACCIONES QUÍMICAS Y ESTEQUIOMETRÍA
    {
      id: 'g-reacciones-balanceo',
      term: 'Transformaciones de la Materia y Balanceo',
      category: 'Reacciones y Estequiometría',
      catKey: 'reacciones',
      formula: 'Ley de Lavoisier: Σ Masa(Reactivos) = Σ Masa(Productos)',
      desc: 'Procesos donde se rompen enlaces iniciales y se reorganizan átomos para formar nuevas sustancias con propiedades distintas. Clasificación: Síntesis, Descomposición, Desplazamiento Simple, Metátesis y Combustión. Métodos de balanceo por tanteo y Redox.',
      procedure: 'Evidencias experimentales: Desprendimiento de gas, formación de precipitado sólido, cambio de coloración y absorción/emisión de calor.',
      fullContent: `
        <h4>1. Evidencias Claras de una Reacción Química</h4>
        <p>Ocurre una reacción química cuando se observa:</p>
        <ul>
          <li>Cambio de color permanente en la disolución.</li>
          <li>Liberación o absorción neta de calor (reacciones exotérmicas vs endotérmicas).</li>
          <li>Desprendimiento de gases (burbujeo o efervescencia).</li>
          <li>Formación de un precipitado sólido insoluble en el fondo del recipiente.</li>
        </ul>
        <h4>2. Tipos de Reacciones Químicas</h4>
        <ul>
          <li><strong>Síntesis o Adición:</strong> Dos o más sustancias forman un solo producto: A + B → AB (ej. 2Na + Cl₂ → 2NaCl).</li>
          <li><strong>Descomposición:</strong> Un reactivo se divide en dos o más sustancias simples: AB → A + B (ej. 2H₂O → 2H₂ + O₂ por electrólisis).</li>
          <li><strong>Desplazamiento Simple:</strong> Un elemento activo desplaza a otro de un compuesto: A + BC → AC + B (ej. Zn + 2HCl → ZnCl₂ + H₂↑).</li>
          <li><strong>Doble Desplazamiento (Metátesis):</strong> Intercambio de iones entre dos compuestos: AB + CD → AD + CB (ej. AgNO₃ + NaCl → AgCl↓ + NaNO₃).</li>
          <li><strong>Combustión:</strong> Hidrocarburo reacciona con O₂ liberando CO₂, H₂O y gran cantidad de calor y luz.</li>
        </ul>
        <h4>3. Métodos de Balanceo de Ecuaciones</h4>
        <p><strong>Método de Tanteo (Inspección Simple):</strong> Se igualan átomos en el orden: Metales → No metales → Hidrógeno → Oxígeno.</p>
        <p><strong>Método Redox:</strong> Basado en la transferencia de electrones entre el agente reductor (se oxida, pierde electrones) y el agente oxidante (se reduce, gana electrones).</p>
      `
    },
    {
      id: 'g-estequiometria-mol',
      term: 'Cálculos Cuantitativos: El Mol y Estequiometría',
      category: 'Reacciones y Estequiometría',
      catKey: 'reacciones',
      formula: 'n = m / M | N_A = 6.022 × 10²³ partículas/mol',
      desc: 'El mol es la unidad básica del SI para medir la cantidad de sustancia. Permite vincular la escala atómica microscópica con la masa en gramos del laboratorio mediante la masa molar. Incluye cálculos de reactivo limitante y rendimiento.',
      procedure: 'Procedimiento de pesada: Utilizar balanza analítica para determinar la masa exacta de reactivo (g) y convertir a moles con n = m/M.',
      fullContent: `
        <h4>1. El Concepto de Mol y el Número de Avogadro</h4>
        <p>Un mol es la cantidad de materia que contiene exactamente tantas entidades elementales (átomos, moléculas, iones) como átomos hay en 12 gramos de Carbono-12 puro.</p>
        <p><strong>Número de Avogadro (N_A):</strong> 6.02214 × 10²³ partículas por mol.</p>
        <h4>2. Relaciones Fundamentales de Conversión</h4>
        <ul>
          <li><strong>Número de moles:</strong> n = m / M (donde m es la masa en gramos y M es la masa molar en g/mol).</li>
          <li><strong>Número de partículas:</strong> N = n × N_A.</li>
          <li><strong>Volumen Molar en C.N. (0 °C y 1 atm):</strong> 1 mol de gas ideal ocupa exactamente 22.4 Litros.</li>
        </ul>
        <h4>3. Leyes Ponderales de la Química</h4>
        <ul>
          <li><strong>Ley de Conservación de la Materia (Lavoisier):</strong> "La masa no se crea ni se destruye, solo se transforma". En una ecuación balanceada, la masa total de reactivos es idéntica a la masa total de productos.</li>
          <li><strong>Ley de las Proporciones Definidas (Proust):</strong> Al combinarse dos o más elementos para dar un compuesto determinado, lo hacen siempre en una relación ponderal constante.</li>
        </ul>
        <h4>4. Reactivo Limitante y Rendimiento</h4>
        <p><strong>Reactivo Limitante:</strong> Aquel reactivo que se consume por completo en primer lugar, deteniendo la reacción y fijando la cantidad máxima de producto posible.</p>
        <p><strong>Porcentaje de Rendimiento:</strong> % Rendimiento = (Masa Real obtenida / Masa Teórica calculada) × 100%.</p>
      `
    },
    {
      id: 'g-soluciones-ph',
      term: 'Sistemas en Disolución, Ácidos-Bases y Escala de pH',
      category: 'Reacciones y Estequiometría',
      catKey: 'reacciones',
      formula: 'M = n / V(L) | pH = -log[H⁺] | pH + pOH = 14',
      desc: 'Las disoluciones son mezclas homogéneas de soluto y solvente. Se cuantifican mediante concentraciones físicas (%m/m, %v/v) y químicas (Molaridad M). La escala de pH mide la acidez o alcalinidad en base a la concentración de iones hidronio H⁺.',
      procedure: 'Práctica 3: En la neutralización HCl + NaOH, el pH pasa de ácido (<7) a neutro (pH = 7.0) con viraje de indicador fenolftaleína.',
      fullContent: `
        <h4>1. Componentes de una Disolución Química</h4>
        <ul>
          <li><strong>Soluto:</strong> Sustancia que se dispersa o disuelve, generalmente en menor proporción.</li>
          <li><strong>Solvente (Disolvente):</strong> Medio dispersante en mayor proporción (el agua es el disolvente universal por excelencia).</li>
        </ul>
        <h4>2. Unidades de Concentración</h4>
        <ul>
          <li><strong>Porcentaje Masa en Masa (% m/m):</strong> (Masa de soluto / Masa total de solución) × 100.</li>
          <li><strong>Porcentaje Masa en Volumen (% m/v):</strong> (Gramos de soluto / mL de solución) × 100.</li>
          <li><strong>Molaridad (M):</strong> Moles de soluto por cada litro de solución: M = n_soluto / V_solución(L).</li>
        </ul>
        <h4>3. Teorías Ácido-Base</h4>
        <ul>
          <li><strong>Arrhenius:</strong> Ácido libera iones H⁺ en agua; Base libera iones OH⁻ en agua.</li>
          <li><strong>Brønsted-Lowry:</strong> Ácido es donador de protones (H⁺); Base es receptora de protones.</li>
          <li><strong>Lewis:</strong> Ácido acepta un par de electrones; Base dona un par de electrones no compartidos.</li>
        </ul>
        <h4>4. Escala de pH y Neutralización</h4>
        <p>El pH mide el potencial de hidrógeno: <strong>pH = -log[H⁺]</strong>.</p>
        <ul>
          <li>pH < 7: Disolución Ácida (alta concentración de protones).</li>
          <li>pH = 7: Disolución Neutra (ej. agua destilada a 25 °C).</li>
          <li>pH > 7: Disolución Alcalina o Básica (predominio de iones hidróxido OH⁻).</li>
        </ul>
      `
    },

    // UNIDAD 5: INTRODUCCIÓN A LA QUÍMICA ORGÁNICA
    {
      id: 'g-carbono-propiedades',
      term: 'El Átomo de Carbono y Concatenación',
      category: 'Química Orgánica',
      catKey: 'organica',
      formula: 'Hibridación: sp³ (109.5°), sp² (120°), sp (180°)',
      desc: 'El Carbono (Z=6) es el pilar de la química orgánica debido a sus propiedades únicas: Tetravalencia (capacidad fija de formar 4 enlaces covalentes) y Autosaturación (capacidad de enlazarse consigo mismo formando cadenas infinitas y anillos).',
      procedure: 'En el modelado molecular: El ángulo tetraédrico de 109.5° es responsable de la estabilidad y empaquetamiento de las macromoléculas.',
      fullContent: `
        <h4>1. Propiedades Singulares del Átomo de Carbono</h4>
        <ul>
          <li><strong>Tetravalencia:</strong> En sus compuestos orgánicos, el carbono siempre comparte 4 electrones de valencia formando cuatro enlaces covalentes estables.</li>
          <li><strong>Autosaturación (Concatenación):</strong> Habilidad excepcional para unirse a otros átomos de carbono mediante enlaces simples, dobles o triples, generando cadenas lineales, ramificadas, ciclos y anillos aromáticos.</li>
          <li><strong>Covalencia:</strong> Se une predominantemente compartiendo electrones con elementos organógenos (H, O, N, S, P).</li>
        </ul>
        <h4>2. Hibridación de Orbitales Atómicos</h4>
        <ul>
          <li><strong>Hibridación sp³ (Enlace Simple C-C):</strong> Geometría tetraédrica con ángulo de 109.5°. Forma 4 enlaces sigma (σ). Típico de los alcanos.</li>
          <li><strong>Hibridación sp² (Enlace Doble C=C):</strong> Geometría trigonal plana con ángulo de 120°. Forma 1 enlace sigma (σ) y 1 enlace pi (π). Típico de alquenos.</li>
          <li><strong>Hibridación sp (Enlace Triple C≡C):</strong> Geometría lineal con ángulo de 180°. Forma 1 enlace sigma (σ) y 2 enlaces pi (π). Típico de alquinos.</li>
        </ul>
        <h4>3. Tipos de Cadenas Carbonadas</h4>
        <p><strong>Abiertas (Acíclicas):</strong> Lineales continuas o ramificadas (con sustituyentes alquilo).</p>
        <p><strong>Cerradas (Cíclicas):</strong> Alicíclicas (cicloalcanos) y Aromáticas (basadas en el anillo bencénico C₆H₆ con resonancia electrónica).</p>
      `
    },
    {
      id: 'g-hidrocarburos-funciones',
      term: 'Hidrocarburos y Grupos Funcionales Orgánicos',
      category: 'Química Orgánica',
      catKey: 'organica',
      formula: 'Alcanos CnH₂n+2 | Alquenos CnH₂n | Alquinos CnH₂n-2',
      desc: 'Nomenclatura básica IUPAC según el número de átomos de carbono. Hidrocarburos alifáticos (alcanos, alquenos, alquinos) y principales familias oxigenadas (alcoholes, aldehídos, cetonas, ácidos carboxílicos) y nitrogenadas (aminas, amidas).',
      procedure: 'Reconocimiento de grupos funcionales: Identificar enlaces múltiples y heteroátomos (O, N) para predecir reactividad y polaridad.',
      fullContent: `
        <h4>1. Nomenclatura IUPAC de Hidrocarburos</h4>
        <p>Prefijos según número de carbonos: 1 = met-, 2 = et-, 3 = prop-, 4 = but-, 5 = pent-, 6 = hex-, 7 = hept-, 8 = oct-, 9 = non-, 10 = dec-.</p>
        <ul>
          <li><strong>Alcanos (Parafinas):</strong> Hidrocarburos saturados con enlaces simples. Fórmula general C_n H_{2n+2} (ej. Metano CH₄, Etano C₂H₆, Propano C₃H₈). Terminación en <em>-ano</em>.</li>
          <li><strong>Alquenos (Olefinas):</strong> Poseen al menos un doble enlace C=C. Fórmula C_n H_{2n} (ej. Eteno C₂H₄, Propeno C₃H₆). Terminación en <em>-eno</em>.</li>
          <li><strong>Alquinos (Acetilenos):</strong> Poseen al menos un triple enlace C≡C. Fórmula C_n H_{2n-2} (ej. Etino o acetileno C₂H₂). Terminación en <em>-ino</em>.</li>
        </ul>
        <h4>2. Familias y Grupos Funcionales Oxigenados</h4>
        <ul>
          <li><strong>Alcoholes (-OH):</strong> Grupo hidroxilo (ej. Etanol CH₃CH₂OH, alcohol antiséptico).</li>
          <li><strong>Aldehídos (-CHO):</strong> Grupo carbonilo en carbono terminal (ej. Metanal o formaldehído HCHO).</li>
          <li><strong>Cetonas (-CO-):</strong> Grupo carbonilo en carbono intermedio (ej. Propanona o acetona CH₃COCH₃).</li>
          <li><strong>Ácidos Carboxílicos (-COOH):</strong> Grupo carboxilo (ej. Ácido etanoico o acético CH₃COOH del vinagre).</li>
          <li><strong>Ésteres (-COO-):</strong> Derivados de ácidos carboxílicos, responsables de fragancias frutales.</li>
        </ul>
        <h4>3. Familias Nitrogenadas</h4>
        <p><strong>Aminas (-NH₂):</strong> Derivados del amoníaco. Carácter básico orgánico.</p>
        <p><strong>Amidas (-CONH₂):</strong> Enlace fundamental en la unión peptídica de las proteínas biológicas.</p>
      `
    },

    // UNIDAD 6: PROCEDIMIENTOS DE LABORATORIO Y BIOSEGURIDAD
    {
      id: 'g-lab-instrumentos-pipeta',
      term: 'Técnica de Pipeteo y Medición Volumétrica',
      category: 'Procedimientos de Laboratorio',
      catKey: 'laboratorio',
      formula: 'Volumen: Ajuste de menisco a ras del aforo óptico',
      desc: 'Protocolo de medición volumétrica de alta precisión. Uso de pipetas graduadas, matraces Erlenmeyer y probetas. Lectura de menisco cóncavo a la altura de los ojos para evitar errores de paralaje en disoluciones acuosas.',
      procedure: 'Paso 1 en mesa QUIMI-K: Presione el instrumento "Pipeta Graduada" para dosificar con exactitud la muestra de reactivo en el matraz.',
      fullContent: `
        <h4>1. Instrumentos Volumétricos de Mesa</h4>
        <ul>
          <li><strong>Pipeta Graduada:</strong> Instrumento de vidrio de alta precisión que permite medir volúmenes variables o transferir alícuotas exactas.</li>
          <li><strong>Matraz Erlenmeyer:</strong> Recipiente cónico con boca estrecha, ideal para mezclar soluciones por agitación manual sin riesgo de salpicaduras y realizar valoraciones.</li>
          <li><strong>Probeta Graduada:</strong> Empleada para medir volúmenes mayores cuando no se requiere extrema precisión analítica.</li>
        </ul>
        <h4>2. Técnica Paso a Paso para Pipeteo Seguro</h4>
        <ol>
          <li>Asegurarse de que la pipeta esté perfectamente limpia y seca o ambientada con la solución a medir.</li>
          <li>Utilizar siempre una <strong>pera de succión o propipeta</strong> de goma. NUNCA pipetear reactivos con la boca.</li>
          <li>Sumergir la punta de la pipeta en el líquido y aspirar suavemente hasta superar 1 o 2 cm por encima de la línea de aforo deseada.</li>
          <li>Retirar la pera y tapar rápidamente la boquilla superior con el dedo índice seco (no el pulgar).</li>
          <li>Sostener la pipeta verticalmente y colocar el aforo a la altura exacta de los ojos. Regular la presión del índice para dejar caer el líquido hasta que la base de la curva del menisco toque la línea de enrase.</li>
          <li>Trasvasar al recipiente receptor apoyando la punta inclinada a 45° contra la pared interna.</li>
        </ol>
      `
    },
    {
      id: 'g-lab-mechero-bunsen',
      term: 'Operación del Mechero Bunsen y Control de Llama',
      category: 'Procedimientos de Laboratorio',
      catKey: 'laboratorio',
      formula: 'Llama no luminosa: Combustión completa azul (≈ 1500 °C)',
      desc: 'Dispositivo estándar de calentamiento rápido en el laboratorio. Controla el flujo de gas y la entrada de aire (oxígeno) para generar una combustión limpia, minimizando el hollín y alcanzando la máxima temperatura en la zona oxidante.',
      procedure: 'Paso 3 en el simulador: Active el mechero Bunsen para entregar calor cinético a los átomos y acelerar la colisión reactiva.',
      fullContent: `
        <h4>1. Partes del Mechero Bunsen</h4>
        <p>Consta de una base pesada de sustentación, tubo vertical de combustión (cañón), entrada de gas con boquilla inyectora y collarín o virola reguladora del paso de aire.</p>
        <h4>2. Tipos de Llama y Zonas de Temperatura</h4>
        <ul>
          <li><strong>Llama Luminosa (Combustión Incompleta):</strong>
            <br>Entrada de aire cerrada. El gas no recibe suficiente oxígeno. Presenta color amarillo brillante, temperatura baja (aprox. 500-600 °C) y produce gran cantidad de hollín (carbón no combustionado que ensucia el instrumental).
          </li>
          <li><strong>Llama No Luminosa Azul (Combustión Completa):</strong>
            <br>Entrada de aire abierta adecuadamente. La combustión es total: Gas + O₂ → CO₂ + H₂O + calor. Presenta cono interno frío azul pálido y cono externo oxidante azul transparente con temperaturas de hasta 1500 °C.
          </li>
        </ul>
        <h4>3. Protocolo de Encendido Seguro</h4>
        <ol>
          <li>Comprobar que las mangueras de conexión de gas no presenten fisuras.</li>
          <li>Cerrar completamente el collarín regulador de aire antes de encender.</li>
          <li>Encender el fósforo o chispero y aproximarlo lateralmente a unos 2 cm de la boca superior del tubo.</li>
          <li>Abrir suavemente la llave de paso de gas. Jamás abrir el gas antes de tener la llama piloto encendida.</li>
          <li>Girar el collarín lentamente hasta obtener la llama azul no luminosa regulada.</li>
        </ol>
      `
    },
    {
      id: 'g-lab-bioseguridad-sga',
      term: 'Normas de Bioseguridad y Pictogramas SGA',
      category: 'Procedimientos de Laboratorio',
      catKey: 'laboratorio',
      formula: 'SGA: Sistema Globalmente Armonizado de Clasificación',
      desc: 'Conjunto de medidas preventivas orientadas a proteger la integridad física de docentes y estudiantes en el laboratorio escolar. Reconocimiento de los 9 pictogramas de peligro del SGA y protocolos de emergencia.',
      procedure: 'Regla de Oro: En disoluciones ácidas, verter SIEMPRE el ácido lentamente sobre el agua y NUNCA el agua sobre el ácido concentrado.',
      fullContent: `
        <h4>1. Equipo de Protección Personal Obligatorio (EPP)</h4>
        <ul>
          <li><strong>Bata Blanca de Algodón:</strong> Manga larga, siempre abotonada para proteger piel y ropa de derrames o salpicaduras.</li>
          <li><strong>Gafas de Seguridad con Protección Lateral:</strong> Uso continuo desde el ingreso al laboratorio hasta la salida.</li>
          <li><strong>Guantes de Nitrilo o Látex:</strong> Uso obligatorio al manipular reactivos corrosivos, cáusticos o solventes orgánicos.</li>
          <li>Calzado cerrado antideslizante y cabello largo recogido.</li>
        </ul>
        <h4>2. Pictogramas de Peligro del Sistema Globalmente Armonizado (SGA)</h4>
        <ul>
          <li><strong>Llama:</strong> Sustancias inflamables (alcoholes, éteres, gas metano).</li>
          <li><strong>Bomba Explotando:</strong> Sustancias explosivas o autorreactivas.</li>
          <li><strong>Corrosión:</strong> Sustancias que destruyen metales y provocan quemaduras dérmicas graves (ácidos como HCl, bases como NaOH).</li>
          <li><strong>Calavera con Tibias:</strong> Toxicidad aguda grave a bajas dosis por ingestión, contacto o inhalación.</li>
          <li><strong>Signo de Exclamación:</strong> Irritante ocular, dérmico o toxicidad leve.</li>
          <li><strong>Medio Ambiente:</strong> Sustancias ecotóxicas para la flora y fauna acuática.</li>
        </ul>
        <h4>3. Reglas Críticas de Convivencia y Bioseguridad</h4>
        <p>• Prohibido comer, beber o masticar chicle en el ambiente de experimentación.</p>
        <p>• No oler reactivos directamente: acercar suavemente los vapores agitando la mano hacia la nariz (abanicado).</p>
        <p>• En caso de derrame sobre la piel, lavar inmediatamente con abundante agua corriente en la pileta o ducha de emergencia por al menos 15 minutos.</p>
      `
    }
  ],

  // Salones de clase asignados al docente (Colegio Alexander Fleming)
  classrooms: [
    {
      id: '4A',
      name: '4to Año "A"',
      level: 'Secundaria - Turno Mañana',
      assignedPractice: 'Síntesis de NaCl (Enlace Iónico)',
      totalCapacity: 15,
      tutor: 'Prof. Midori Judith Castillo Peralta',
      students: [
        { name: 'Juan Pérez (Tú)', practice: 'Síntesis de NaCl', attempts: 1, score: 18, status: 'Aprobado', date: '28/10/2026 10:15' },
        { name: 'María Gómez', practice: 'Síntesis de NaCl', attempts: 2, score: 19, status: 'Aprobado', date: '28/10/2026 10:22' },
        { name: 'Carlos Ramos', practice: 'Síntesis de NaCl', attempts: 1, score: 16, status: 'Aprobado', date: '28/10/2026 11:05' },
        { name: 'Diego Mamani', practice: 'Síntesis de NaCl', attempts: 1, score: 17, status: 'Aprobado', date: '28/10/2026 11:18' },
        { name: 'Camila Torres', practice: 'Síntesis de NaCl', attempts: 2, score: 18, status: 'Aprobado', date: '28/10/2026 11:40' }
      ]
    },
    {
      id: '4B',
      name: '4to Año "B"',
      level: 'Secundaria - Turno Mañana',
      assignedPractice: 'Formación de Molécula de Agua (H₂O)',
      totalCapacity: 15,
      tutor: 'Prof. Midori Judith Castillo Peralta',
      students: [
        { name: 'Lucía Fernández', practice: 'Formación de H₂O', attempts: 1, score: 20, status: 'Aprobado', date: '28/10/2026 11:30' },
        { name: 'Mateo Quispe', practice: 'Formación de H₂O', attempts: 2, score: 15, status: 'Aprobado', date: '28/10/2026 12:10' },
        { name: 'Sofía Condori', practice: 'Formación de H₂O', attempts: 1, score: 12, status: 'Desaprobado', date: '28/10/2026 12:45' },
        { name: 'Rodrigo Vargas', practice: 'Formación de H₂O', attempts: 1, score: 16, status: 'Aprobado', date: '28/10/2026 13:02' },
        { name: 'Valeria Castro', practice: 'Formación de H₂O', attempts: 1, score: 19, status: 'Aprobado', date: '28/10/2026 13:15' }
      ]
    },
    {
      id: '5A',
      name: '5to Año "A"',
      level: 'Secundaria - Turno Tarde',
      assignedPractice: 'Neutralización Ácido-Base (HCl + NaOH)',
      totalCapacity: 12,
      tutor: 'Prof. Midori Judith Castillo Peralta',
      students: [
        { name: 'Alejandro Morales', practice: 'Neutralización Ácido-Base', attempts: 1, score: 19, status: 'Aprobado', date: '29/10/2026 08:30' },
        { name: 'Gabriela Zegarra', practice: 'Neutralización Ácido-Base', attempts: 1, score: 20, status: 'Aprobado', date: '29/10/2026 08:45' },
        { name: 'Sebastián Huanca', practice: 'Neutralización Ácido-Base', attempts: 2, score: 17, status: 'Aprobado', date: '29/10/2026 09:10' },
        { name: 'Daniela Cáceres', practice: 'Neutralización Ácido-Base', attempts: 1, score: 18, status: 'Aprobado', date: '29/10/2026 09:25' }
      ]
    }
  ],

  activeClassroomId: null,

  // Evaluaciones y Cuestionarios diseñados por el docente (con control de salones y bloqueo de edición)
  evaluations: [
    {
      id: 'eval-1',
      title: 'Control 1: Enlaces Iónicos y Estructura de Lewis',
      topic: 'Síntesis de NaCl',
      targetClassrooms: ['4A'], // Asignado exclusivamente a 4to Año "A"
      status: 'published', // 'published' = Enviado a Salón (Protegido contra modificaciones)
      createdAt: '28/10/2026 09:30',
      publishedAt: '28/10/2026 10:00',
      questions: [
        {
          question: '¿Qué magnitud determina si el enlace entre dos átomos es iónico o covalente según la escala de Linus Pauling?',
          options: ['La masa atómica relativa', 'La diferencia de electronegatividad (ΔEN)', 'El número de neutrones en el núcleo', 'El punto de ebullición'],
          answer: 1,
          explanation: 'La diferencia de electronegatividad (ΔEN = |EN₁ - EN₂|) clasifica el tipo de enlace según Linus Pauling.'
        },
        {
          question: 'Al unirse Sodio (Na) y Cloro (Cl), ¿qué fenómeno de transferencia electrónica ocurre?',
          options: ['Compartición simétrica de electrones', 'Transferencia completa del electrón de valencia del Na hacia el Cl', 'Atracción gravitatoria nuclear', 'Enlace metálico libre'],
          answer: 1,
          explanation: 'El sodio cede su único electrón de valencia formándose el catión Na⁺ y el anión Cl⁻.'
        }
      ]
    },
    {
      id: 'eval-2',
      title: 'Cuestionario Guía: Polaridad y Geometría Molecular',
      topic: 'Formación de Molécula de Agua (H₂O)',
      targetClassrooms: ['4B', '5A'], // Asignado a múltiples salones (4to B y 5to A)
      status: 'draft', // 'draft' = Borrador (Permite seguir modificando)
      createdAt: '29/10/2026 11:15',
      publishedAt: null,
      questions: [
        {
          question: '¿Por qué la molécula de agua posee un enlace Covalente Polar?',
          options: ['Porque ΔEN está entre 0.4 y 2.0 con distribución asimétrica de cargas (δ- en O)', 'Porque los electrones se transfieren totalmente formando cristales', 'Porque ambos átomos tienen idéntica electronegatividad', 'Porque no forman orbitales enlazantes'],
          answer: 0,
          explanation: 'El oxígeno atrae los electrones con mayor fuerza que el hidrógeno generando un dipolo molecular.'
        },
        {
          question: '¿Qué tipo de instrumento virtual se emplea para dosificar reactivos líquidos con precisión en la mesa?',
          options: ['Mechero Bunsen', 'Pipeta Graduada', 'Cámara de reacción cerrada', 'Balanza granataria'],
          answer: 1,
          explanation: 'La pipeta graduada permite medir y trasvasar alícuotas volumétricas precisas.'
        }
      ]
    }
  ],

  evalFilter: 'all',
  activeTakingQuizType: 'practice',

  // Inicialización de la aplicación
  init() {
    // Sobrescribir alert del navegador con el diálogo cuadrado centrado
    window.alert = (msg) => this.showDialog(msg);

    this.setupNavigation();
    this.setupCanvas();
    this.renderCurrentPracticeSteps();
    this.renderGuideEntries();
    this.populateQuizSelector();
    this.renderQuiz();
    this.renderClassroomsOverview();
    this.renderEvaluations();
    this.startCanvasAnimation();
    this.updateReactionAnalysis();
    this.updateUserUI();
    // Exigir Login al entrar a la página
    this.openAuthModal('login');

    // Cargar y sincronizar con PostgreSQL 16
    this.initDatabase();

    console.log('QUIMI-K Inicializado con éxito con gestión de salones y creador de evaluaciones.');
  },

  // ================= CONEXIÓN PERSISTENTE A POSTGRESQL 16 =================
  async initDatabase() {
    try {
      const res = await fetch('/api/db/data');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          if (Array.isArray(json.data.users) && json.data.users.length > 0) {
            this.registeredUsers = json.data.users;
          }
          if (Array.isArray(json.data.classrooms) && json.data.classrooms.length > 0) {
            this.classrooms = json.data.classrooms;
          }
          if (Array.isArray(json.data.evaluations) && json.data.evaluations.length > 0) {
            this.evaluations = json.data.evaluations;
          }
          console.log('[PostgreSQL 16] Datos cargados con éxito desde quimik_db:', {
            usuarios: this.registeredUsers.length,
            salones: this.classrooms.length,
            evaluaciones: this.evaluations.length
          });
          this.renderClassroomsOverview();
          this.renderAdminUsers();
          if (this.state.currentUser && this.state.currentUser.role === 'student') {
            this.renderStudentSalonView();
          }
        }
      }
    } catch (err) {
      console.warn('[PostgreSQL 16] Modo offline o fallback local:', err);
    }
  },

  async syncClassroomToDb(classroom) {
    try {
      await fetch('/api/db/save-classroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classroom)
      });
      console.log(`[PostgreSQL 16] Salón '${classroom.name}' sincronizado con éxito.`);
    } catch (err) {
      console.warn('[PostgreSQL 16] Fallo al sincronizar salón:', err);
    }
  },

  async syncUserToDb(user) {
    try {
      await fetch('/api/db/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      console.log(`[PostgreSQL 16] Usuario '${user.name}' sincronizado con éxito.`);
    } catch (err) {
      console.warn('[PostgreSQL 16] Fallo al sincronizar usuario:', err);
    }
  },

  async syncScoreToDb(scorePayload) {
    try {
      await fetch('/api/db/save-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scorePayload)
      });
      console.log(`[PostgreSQL 16] Calificación guardada en PostgreSQL:`, scorePayload);
    } catch (err) {
      console.warn('[PostgreSQL 16] Fallo al sincronizar nota:', err);
    }
  },

  // ================= DIÁLOGO CUADRADO CENTRADO (REEMPLAZO DE ALERT NATIVO) =================
  showDialog(message, title = 'Aviso del Sistema', icon = 'ℹ️') {
    const backdrop = document.getElementById('customDialogBackdrop');
    const msgEl = document.getElementById('customDialogMessage');
    const titleEl = document.getElementById('customDialogTitle');
    const iconEl = document.getElementById('customDialogIcon');

    if (msgEl) msgEl.innerText = message;
    if (titleEl) titleEl.innerText = title;
    if (iconEl) iconEl.innerText = icon;
    if (backdrop) backdrop.classList.add('open');
  },

  closeDialog() {
    const backdrop = document.getElementById('customDialogBackdrop');
    if (backdrop) backdrop.classList.remove('open');
  },

  // ================= GESTIÓN DE USUARIOS Y AUTENTICACIÓN =================
  openAuthModal(tab = 'login') {
    const loginView = document.getElementById('fullscreenLoginView');
    const appWrapper = document.getElementById('appMainWrapper');
    if (loginView) loginView.style.display = 'flex';
    if (appWrapper) appWrapper.style.display = 'none';
    this.switchAuthTab(tab);
  },

  closeAuthModal() {
    if (!this.state.currentUser) {
      this.showDialog('Debe iniciar sesión para ingresar al simulador. Se iniciará sesión con el perfil demo de Estudiante (Juan Pérez).', 'Ingreso Requerido', '🔒');
      this.quickLogin('student');
      return;
    }
    const loginView = document.getElementById('fullscreenLoginView');
    const appWrapper = document.getElementById('appMainWrapper');
    if (loginView) loginView.style.display = 'none';
    if (appWrapper) appWrapper.style.display = 'flex';
    setTimeout(() => this.resizeCanvas(), 100);
  },

  switchAuthTab(tab) {
    const isLogin = tab === 'login';
    const paneLogin = document.getElementById('authPaneLogin');
    const paneReg = document.getElementById('authPaneRegister');
    const btnLogin = document.getElementById('tabBtnLogin');
    const btnReg = document.getElementById('tabBtnRegister');

    if (paneLogin) paneLogin.style.display = isLogin ? 'block' : 'none';
    if (paneReg) paneReg.style.display = isLogin ? 'none' : 'block';
    if (btnLogin) btnLogin.className = `auth-tab-btn ${isLogin ? 'active' : ''}`;
    if (btnReg) btnReg.className = `auth-tab-btn ${!isLogin ? 'active' : ''}`;
  },

  handleLoginForm(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pass = document.getElementById('loginPassword').value;

    const user = this.registeredUsers.find(u => u.email.toLowerCase() === email && u.password === pass);
    if (user) {
      this.loginUser(user);
      this.showDialog(`¡Bienvenido/a, ${user.name}!\nAutenticación correcta en el rol de: ${user.role === 'teacher' ? 'Docente' : (user.role === 'admin' ? 'Administrador' : 'Estudiante')}.`, 'Inicio de Sesión Exitoso', '✅');
    } else {
      this.showDialog('Credenciales no válidas. Ingrese un correo registrado o utilice el bloque de Acceso Rápido por Rol.', 'Error de Acceso', '⚠️');
    }
  },

  onRegisterRoleChange() {
    const role = document.getElementById('regRole').value;
    const notice = document.getElementById('teacherRequestNotice');
    if (notice) {
      notice.style.display = role === 'teacher' ? 'block' : 'none';
    }
  },

  handleRegisterForm(event) {
    event.preventDefault();
    const name = document.getElementById('regFullName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const role = document.getElementById('regRole').value;
    const pass = document.getElementById('regPassword').value;

    // Validación de dominio de correo: permitido institucional @fleming.edu.pe o personal @gmail.com
    const isFlemingEmail = email.endsWith('@fleming.edu.pe');
    const isGmail = email.endsWith('@gmail.com');
    if (!isFlemingEmail && !isGmail) {
      this.showDialog(
        'El correo debe pertenecer al dominio institucional (@fleming.edu.pe) o ser una cuenta Gmail (@gmail.com).',
        'Dominio de Correo no Permitido',
        '⚠️'
      );
      return;
    }

    const exists = this.registeredUsers.find(u => u.email.toLowerCase() === email);
    if (exists) {
      this.showDialog('Ya existe una cuenta registrada con este correo electrónico.', 'Aviso', '⚠️');
      return;
    }

    const isTeacherRequest = role === 'teacher';
    // Todo usuario registrado ingresa por defecto con el rol de Estudiante.
    // Si envía solicitud, al ser aceptada ingresa también por defecto como Estudiante y luego el Admin puede cambiar su rol en la columna Rol.
    const newUser = {
      id: 'usr-' + Date.now(),
      name,
      email,
      password: pass,
      role: 'student',
      requestedRole: isTeacherRequest ? 'teacher' : null,
      teacherRequestStatus: isTeacherRequest ? 'pending' : 'none',
      teacherRequestDate: isTeacherRequest ? new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().slice(0, 5) : null,
      classroom: '4to Año "A"',
      classroomId: '4A',
      practice: 'Síntesis de NaCl (Enlace Iónico)',
      attempts: 0,
      score: 18,
      status: isTeacherRequest ? 'Solicitud Pendiente' : 'Aprobado',
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().slice(0, 5),
      registeredAt: new Date().toLocaleDateString(),
      notesHistory: []
    };

    this.registeredUsers.unshift(newUser);
    this.syncUserToDb(newUser);

    const c = this.classrooms.find(cl => cl.id === '4A');
    if (c) {
      c.students.unshift({
        id: newUser.id,
        name: name,
        practice: newUser.practice,
        attempts: 1,
        score: 18,
        status: 'Aprobado',
        date: newUser.date
      });
      this.syncClassroomToDb(c);
    }

    this.loginUser(newUser);
    if (isTeacherRequest) {
      this.showDialog(
        `¡Registro completado!\n\nBienvenido/a, ${name}.\nTu cuenta se ha creado por defecto con el rol de Estudiante y se ha enviado tu solicitud al Administrador.\n\nCuando el Administrador acepte la solicitud, quedarás habilitado por defecto como Estudiante y el Administrador podrá cambiar tu rol entre Estudiante y Docente en el Padrón Oficial.`,
        'Solicitud Enviada (Rol Inicial: Estudiante)',
        '⏳'
      );
    } else {
      this.showDialog(
        `¡Cuenta registrada con éxito!\n\nBienvenido/a, ${name}.\nSe te ha asignado por defecto el rol de Estudiante.`,
        'Registro Exitoso (Rol por Defecto: Estudiante)',
        '✅'
      );
    }
  },

  quickLogin(role) {
    const user = this.registeredUsers.find(u => u.role === role) || {
      name: role === 'teacher' ? 'Prof. Midori Judith Castillo Peralta' : (role === 'admin' ? 'Soporte TI Fleming' : 'Juan Pérez'),
      email: role === 'teacher' ? 'docente@fleming.edu.pe' : (role === 'admin' ? 'admin@fleming.edu.pe' : 'estudiante@fleming.edu.pe'),
      role: role
    };

    this.loginUser(user);
    this.showDialog(
      `Sesión cambiada a perfil: ${user.name} (${user.role === 'teacher' ? 'Docente' : (user.role === 'admin' ? 'Administrador' : 'Estudiante')}).\nLas vistas y permisos se han adaptado a este rol.`,
      'Perfil Actualizado',
      '👤'
    );

    if (role === 'teacher') {
      const teacherTab = document.querySelector('[data-tab="tab-teacher"]');
      if (teacherTab) teacherTab.click();
      this.switchTeacherSubtab('salones');
    } else if (role === 'admin') {
      const teacherTab = document.querySelector('[data-tab="tab-teacher"]');
      if (teacherTab) teacherTab.click();
      this.switchTeacherSubtab('admin');
    } else if (role === 'student') {
      const simTab = document.querySelector('[data-tab="tab-simulator"]');
      if (simTab) simTab.click();
    }
  },

  // ================= RECUPERACIÓN DE CONTRASEÑA =================
  recoverPassword() {
    this.openPasswordRecoveryModal();
  },

  openPasswordRecoveryModal() {
    const modal = document.getElementById('modalPasswordRecovery');
    if (!modal) return;

    this.recoveryState = {
      step: 1,
      email: '',
      code: '',
      user: null
    };

    // Prellenar con el correo de login si existe
    const loginEmailInput = document.getElementById('loginEmail');
    const recEmailInput = document.getElementById('recoveryEmailInput');
    if (recEmailInput) {
      recEmailInput.value = (loginEmailInput && loginEmailInput.value) ? loginEmailInput.value.trim() : '';
    }

    this.setRecoveryStep(1);
    modal.style.display = 'flex';
  },

  closePasswordRecoveryModal() {
    const modal = document.getElementById('modalPasswordRecovery');
    if (modal) modal.style.display = 'none';
    this.recoveryState = null;
  },

  setRecoveryStep(step) {
    const step1 = document.getElementById('recoveryStep1');
    const step2 = document.getElementById('recoveryStep2');
    const step3 = document.getElementById('recoveryStep3');

    if (step1) step1.style.display = step === 1 ? 'block' : 'none';
    if (step2) step2.style.display = step === 2 ? 'block' : 'none';
    if (step3) step3.style.display = step === 3 ? 'block' : 'none';

    if (this.recoveryState) this.recoveryState.step = step;
  },

  backToRecoveryStep1() {
    this.setRecoveryStep(1);
  },

  handleSendRecoveryCode(event) {
    if (event) event.preventDefault();

    const emailInput = document.getElementById('recoveryEmailInput');
    const email = emailInput ? emailInput.value.trim().toLowerCase() : '';

    if (!email) {
      this.showDialog('Por favor ingrese su correo electrónico registrado.', 'Campo Requerido', '⚠️');
      return;
    }

    // Validación de dominio permitido (@fleming.edu.pe o @gmail.com)
    const isFlemingEmail = email.endsWith('@fleming.edu.pe');
    const isGmail = email.endsWith('@gmail.com');
    if (!isFlemingEmail && !isGmail) {
      this.showDialog(
        'El correo debe pertenecer al dominio institucional (@fleming.edu.pe) o ser una cuenta Gmail (@gmail.com).',
        'Dominio no Permitido',
        '⚠️'
      );
      return;
    }

    // Buscar si el usuario existe en el padrón
    const user = this.registeredUsers.find(u => u.email.toLowerCase() === email);
    if (!user) {
      this.showDialog(
        `No encontramos ninguna cuenta registrada con el correo:\n${email}\n\nPor favor revise la dirección ingresada o regístrese como nuevo usuario.`,
        'Usuario no Encontrado',
        '⚠️'
      );
      return;
    }

    // Generar código de 6 dígitos aleatorio
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    this.recoveryState = {
      step: 2,
      email: email,
      code: verificationCode,
      user: user,
      timestamp: Date.now()
    };

    // Actualizar vista del Paso 2
    const targetDisplay = document.getElementById('recoveryEmailTargetDisplay');
    const simCodeValue = document.getElementById('recoverySimulatedCodeValue');
    const codeInput = document.getElementById('recoveryCodeInput');

    if (targetDisplay) targetDisplay.innerText = email;
    if (simCodeValue) simCodeValue.innerText = verificationCode;
    if (codeInput) {
      codeInput.value = '';
      setTimeout(() => codeInput.focus(), 100);
    }

    this.setRecoveryStep(2);

    // Despacho real de correo electrónico a la bandeja de entrada
    fetch('/api/send-recovery-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        code: verificationCode,
        name: user.name
      })
    })
    .then(r => r.json())
    .then(res => {
      console.log('Respuesta envío correo real:', res);
    })
    .catch(err => {
      console.warn('Error llamando API de correo:', err);
    });

    this.showDialog(
      `¡Código de verificación enviado!\n\nSe ha emitido un correo electrónico oficial a:\n${email}\n\nRevisa tu bandeja de entrada (o carpeta de spam) para copiar tu código de 6 dígitos e ingresarlo en pantalla.`,
      'Correo Enviado a tu Bandeja',
      '📧'
    );
  },

  resendRecoveryCode() {
    if (!this.recoveryState || !this.recoveryState.email) return;

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    this.recoveryState.code = newCode;

    const simCodeValue = document.getElementById('recoverySimulatedCodeValue');
    if (simCodeValue) simCodeValue.innerText = newCode;

    // Despacho real del nuevo código
    fetch('/api/send-recovery-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.recoveryState.email,
        code: newCode,
        name: this.recoveryState.user ? this.recoveryState.user.name : 'Usuario'
      })
    })
    .then(r => r.json())
    .catch(err => console.warn(err));

    this.showDialog(
      `Se ha reenviado un nuevo correo electrónico a ${this.recoveryState.email} con tu código de seguridad.`,
      'Correo Reenviado',
      '🔄'
    );
  },

  handleVerifyRecoveryCode(event) {
    if (event) event.preventDefault();

    const codeInput = document.getElementById('recoveryCodeInput');
    const enteredCode = codeInput ? codeInput.value.trim() : '';

    if (!this.recoveryState || !this.recoveryState.code) {
      this.showDialog('La sesión de recuperación ha expirado. Por favor solicite un nuevo código.', 'Sesión Expirada', '⚠️');
      this.setRecoveryStep(1);
      return;
    }

    if (enteredCode !== this.recoveryState.code) {
      this.showDialog(
        'El código de verificación ingresado no es válido.\n\nPor favor revise el código de 6 dígitos que se le envió por correo electrónico.',
        'Código Incorrecto',
        '❌'
      );
      if (codeInput) {
        codeInput.focus();
        codeInput.select();
      }
      return;
    }

    // Código válido -> Avanzar al Paso 3 (Formulario de nueva contraseña)
    const userDisplay = document.getElementById('recoveryValidatedUserDisplay');
    const newPassInput = document.getElementById('recoveryNewPassword');
    const confPassInput = document.getElementById('recoveryConfirmPassword');

    if (userDisplay && this.recoveryState.user) {
      userDisplay.innerText = `${this.recoveryState.user.name} (${this.recoveryState.email})`;
    }

    if (newPassInput) newPassInput.value = '';
    if (confPassInput) confPassInput.value = '';

    this.setRecoveryStep(3);
    setTimeout(() => {
      if (newPassInput) newPassInput.focus();
    }, 100);
  },

  handleResetPasswordForm(event) {
    if (event) event.preventDefault();

    const newPassInput = document.getElementById('recoveryNewPassword');
    const confPassInput = document.getElementById('recoveryConfirmPassword');

    const pass1 = newPassInput ? newPassInput.value : '';
    const pass2 = confPassInput ? confPassInput.value : '';

    if (pass1.length < 6) {
      this.showDialog('La nueva contraseña debe contener al menos 6 caracteres.', 'Contraseña Insegura', '⚠️');
      return;
    }

    if (pass1 !== pass2) {
      this.showDialog(
        'Las contraseñas ingresadas no coinciden.\n\nPor favor asegúrese de que el campo "Nueva Contraseña" y "Repetir la Contraseña" contengan exactamente los mismos caracteres.',
        'Contraseñas no Coinciden',
        '⚠️'
      );
      if (confPassInput) confPassInput.focus();
      return;
    }

    if (!this.recoveryState || !this.recoveryState.user) {
      this.showDialog('Ocurrió un error al procesar la cuenta. Intente nuevamente.', 'Error', '⚠️');
      this.closePasswordRecoveryModal();
      return;
    }

    // Actualizar la contraseña del usuario en el padrón
    const user = this.recoveryState.user;
    user.password = pass1;

    const emailSaved = this.recoveryState.email;

    // Cerrar modal de recuperación
    this.closePasswordRecoveryModal();

    // Regresar al Login y prellenar credenciales
    this.switchAuthTab('login');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPassInput = document.getElementById('loginPassword');

    if (loginEmailInput) loginEmailInput.value = emailSaved;
    if (loginPassInput) {
      loginPassInput.value = '';
      setTimeout(() => loginPassInput.focus(), 200);
    }

    this.showDialog(
      `¡Contraseña actualizada con éxito!\n\nUsuario: ${user.name}\nCorreo: ${emailSaved}\n\nTu nueva contraseña ha sido establecida en el sistema. Ya puedes iniciar sesión con tu nueva clave.`,
      'Contraseña Restablecida',
      '✅'
    );
  },

  logout() {
    this.state.currentUser = null;
    this.state.currentRole = 'guest';
    this.updateUserUI();
    this.openAuthModal('login');
  },

  loginUser(user) {
    this.state.currentUser = user;
    this.state.currentRole = user.role;
    this.updateUserUI();
    const loginView = document.getElementById('fullscreenLoginView');
    const appWrapper = document.getElementById('appMainWrapper');
    if (loginView) loginView.style.display = 'none';
    if (appWrapper) appWrapper.style.display = 'flex';

    // Prioridad de vista inicial según el rol
    if (user.role === 'admin') {
      const adminNavTab = document.querySelector('.sidebar-nav-item[data-tab="tab-teacher"]');
      if (adminNavTab) adminNavTab.click();
      this.switchTeacherSubtab('admin');
    } else if (user.role === 'teacher') {
      const teacherNavTab = document.querySelector('.sidebar-nav-item[data-tab="tab-teacher"]');
      if (teacherNavTab) teacherNavTab.click();
      this.switchTeacherSubtab('salones');
    } else {
      const salonTab = document.querySelector('.sidebar-nav-item[data-tab="tab-student-salon"]') || document.querySelector('.sidebar-nav-item[data-tab="tab-simulator"]');
      if (salonTab) salonTab.click();
      this.renderStudentSalonView();
    }

    setTimeout(() => this.resizeCanvas(), 100);
  },

  updateUserUI() {
    const user = this.state.currentUser;
    const nameEl = document.getElementById('userFullName');
    const roleEl = document.getElementById('userRoleBadge');
    const avatarEl = document.getElementById('userAvatar');

    if (user) {
      if (nameEl) nameEl.innerText = user.name;
      if (roleEl) roleEl.innerText = user.role === 'teacher' ? 'Docente' : (user.role === 'admin' ? 'Administrador' : 'Estudiante');
      if (avatarEl) avatarEl.innerText = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      const chip = document.getElementById('userProfileChip');
      if (chip) chip.style.opacity = '1';
    } else {
      if (nameEl) nameEl.innerText = 'Invitado (Sin sesión)';
      if (roleEl) roleEl.innerText = 'No Autenticado';
      if (avatarEl) avatarEl.innerText = '👤';
      const chip = document.getElementById('userProfileChip');
      if (chip) chip.style.opacity = '0.6';
    }

    // Control de visibilidad del botón en la barra lateral izquierda según el ROL
    const navTeacher = document.getElementById('navSidebarTeacher') || document.querySelector('.sidebar-nav-item[data-tab="tab-teacher"]');
    const navTeacherLabel = document.getElementById('navTeacherLabel');
    const navTeacherIcon = document.getElementById('navTeacherIcon');
    const navTeacherHint = document.getElementById('navTeacherHint');
    const btnSubnavAdmin = document.getElementById('btnSubnavAdmin');

    const isStudent = !user || user.role === 'student';
    const isTeacher = user && user.role === 'teacher';
    const isAdmin = user && user.role === 'admin';

    const navStudentSalon = document.getElementById('navSidebarStudentSalon');
    const navSimulator = document.getElementById('navSidebarSimulator');
    const navStudentSalonHint = document.getElementById('navStudentSalonHint');

    if (navStudentSalon) {
      navStudentSalon.style.display = isStudent ? 'flex' : 'none';
      if (isStudent && user) {
        if (navStudentSalonHint) {
          navStudentSalonHint.innerText = user.classroom || 'Aula Autorizada';
        }
      }
    }

    if (navSimulator) {
      if (isStudent) {
        navSimulator.classList.add('sidebar-nav-subitem');
      } else {
        navSimulator.classList.remove('sidebar-nav-subitem');
      }
    }

    if (navTeacher) {
      if (isStudent) {
        // EL ESTUDIANTE NO DEBE VER EL PANEL DE DOCENTE
        navTeacher.style.display = 'none';

        // Si el estudiante tenía activa la pestaña tab-teacher, redirigir inmediatamente a mesa de trabajo
        const currentActive = document.querySelector('.sidebar-nav-item.active');
        if (currentActive && typeof currentActive.getAttribute === 'function' && currentActive.getAttribute('data-tab') === 'tab-teacher') {
          const salonTab = document.querySelector('.sidebar-nav-item[data-tab="tab-student-salon"]');
          if (salonTab) salonTab.click();
        }
      } else if (isTeacher) {
        navTeacher.style.display = 'flex';
        if (navTeacherIcon) navTeacherIcon.innerText = '👨‍🏫';
        if (navTeacherLabel) navTeacherLabel.innerText = 'Panel Docente';
        if (navTeacherHint) {
          navTeacherHint.innerText = '';
          navTeacherHint.style.display = 'none';
        }
        if (btnSubnavAdmin) btnSubnavAdmin.style.display = 'none';
      } else if (isAdmin) {
        navTeacher.style.display = 'flex';
        if (navTeacherIcon) navTeacherIcon.innerText = '🛡️';
        if (navTeacherLabel) navTeacherLabel.innerText = 'Panel de Administración';
        if (navTeacherHint) navTeacherHint.innerText = 'Usuarios, Notas & Salones';
        if (btnSubnavAdmin) btnSubnavAdmin.style.display = 'inline-flex';
      }
    }

    // Control interno de acceso en el panel de tab-teacher
    const isTeacherOrAdmin = user && (user.role === 'teacher' || user.role === 'admin');
    const restrictedEl = document.getElementById('teacherContentRestricted');
    const authorizedEl = document.getElementById('teacherContentAuthorized');

    if (restrictedEl && authorizedEl) {
      restrictedEl.style.display = isTeacherOrAdmin ? 'none' : 'block';
      authorizedEl.style.display = isTeacherOrAdmin ? 'block' : 'none';
    }

    // Si es administrador, renderizar el padrón de usuarios y notas
    if (isAdmin) {
      this.renderAdminUsers();
    }
  },

  // Configurar la navegación de la barra lateral izquierda y vistas
  setupNavigation() {
    const tabs = document.querySelectorAll('.nav-tab, .sidebar-nav-item');
    const titleMap = {
      'tab-student-salon': '🏫 Salón de Clases • Aula Asignada',
      'tab-simulator': '🔬 Mesa de Laboratorio & Simulador',
      'tab-assistant': '🤖 Asistente Virtual "Quimi" (IA & Reglas)',
      'tab-guide': '📖 Libro Guía Digital & Enciclopedia',
      'tab-quiz': '📝 Evaluación & Reporte de Práctica',
      'tab-teacher': '👨‍🏫 Panel Docente',
      'tab-infra': '🏗️ Infraestructura de Software (Arquitectura Hexagonal)'
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-tab');
        if (!targetId) return;

        if (targetId === 'tab-student-salon') {
          App.renderStudentSalonView();
        }

        // Desactivar todas las pestañas y paneles
        document.querySelectorAll('.nav-tab, .sidebar-nav-item').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

        // Activar todas las pestañas que apunten a este targetId
        document.querySelectorAll(`[data-tab="${targetId}"]`).forEach(t => t.classList.add('active'));

        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.classList.add('active');

        // Actualizar título en barra de contexto superior
        const titleEl = document.getElementById('contextTitleDisplay');
        if (titleEl && titleMap[targetId]) {
          if (targetId === 'tab-teacher' && this.state.currentUser && this.state.currentUser.role === 'admin') {
            titleEl.innerText = '🛡️ Panel de Administración (Padrón de Usuarios, Datos & Notas)';
            this.switchTeacherSubtab('admin');
          } else {
            titleEl.innerText = titleMap[targetId];
          }
        }

        // Si se va a simulador, redimensionar canvas
        if (targetId === 'tab-simulator') {
          setTimeout(() => App.resizeCanvas(), 50);
        }
      });
    });
  },

  // Compatibilidad de selector de rol
  handleRoleChange(role) {
    this.quickLogin(role);
  },

  // Seleccionar práctica curada
  selectPractice(index) {
    this.state.currentPracticeIndex = parseInt(index);
    this.state.currentStepIndex = 0;
    this.state.heatActive = false;
    this.resetSimulation();
    this.renderCurrentPracticeSteps();
    this.renderQuiz();
    this.updateReactionAnalysis();

    const p = this.practices[this.state.currentPracticeIndex];
    document.getElementById('labLogText').innerText = `Se ha cargado la ${p.title}. Proceda a ejecutar el Paso 1: ${p.steps[0].name}.`;
    document.getElementById('experimentStatusBadge').className = 'status-tag status-pending';
    document.getElementById('experimentStatusBadge').innerText = 'Paso 1 Pendiente';
  },

  // Renderizar pasos de la práctica
  renderCurrentPracticeSteps() {
    const p = this.practices[this.state.currentPracticeIndex];
    const container = document.getElementById('stepsList');
    if (!container) return;

    container.innerHTML = '';
    p.steps.forEach((step, idx) => {
      const isCompleted = idx < this.state.currentStepIndex;
      const isActive = idx === this.state.currentStepIndex;

      const item = document.createElement('div');
      item.className = `step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
      item.onclick = () => {
        if (idx <= this.state.currentStepIndex) {
          App.showStepDetails(idx);
        }
      };

      item.innerHTML = `
        <div class="step-header">
          <span>Paso ${step.step}: ${step.name}</span>
          <span>${isCompleted ? '✅ Listo' : (isActive ? '👉 Actual' : '🔒')}</span>
        </div>
        <div class="step-desc">${step.desc}</div>
      `;
      container.appendChild(item);
    });

    const btnNext = document.getElementById('btnNextStep');
    if (btnNext) {
      if (this.state.currentStepIndex >= p.steps.length) {
        btnNext.innerText = '🎉 ¡Práctica Culminada!';
        btnNext.className = 'btn btn-success';
      } else {
        btnNext.innerText = `▶️ Ejecutar Paso ${this.state.currentStepIndex + 1}`;
        btnNext.className = 'btn btn-primary';
      }
    }
  },

  // Mostrar mensaje didáctico de un paso
  showStepDetails(idx) {
    const step = this.practices[this.state.currentPracticeIndex].steps[idx];
    this.showDialog(`Detalle: ${step.desc}\n\nOrientación técnica: ${step.hint}`, `Paso ${step.step}: ${step.name}`, '📋');
  },

  // Ejecución interactiva del paso actual
  executeCurrentStep() {
    const p = this.practices[this.state.currentPracticeIndex];
    if (this.state.currentStepIndex >= p.steps.length) {
      this.showDialog('La práctica actual ya ha sido completada. Puede reiniciarla con el botón "Reiniciar Mesa" o dirigirse a la pestaña de Evaluación para responder su cuestionario.', 'Práctica Culminada', '🎉');
      return;
    }

    const currentStep = p.steps[this.state.currentStepIndex];
    this.executeAction(currentStep.action, currentStep);

    this.state.currentStepIndex++;
    this.renderCurrentPracticeSteps();

    // Actualizar bitácora
    const logEl = document.getElementById('labLogText');
    const badgeEl = document.getElementById('experimentStatusBadge');

    if (this.state.currentStepIndex >= p.steps.length) {
      badgeEl.className = 'status-tag status-passed';
      badgeEl.innerText = 'Práctica Culminada';
      logEl.innerHTML = `<strong>¡Reacción finalizada!</strong> Se ha formado con éxito el producto esperado (<strong>${p.equation}</strong>). Los resultados han sido validados científicamente por el motor de reacciones. Ya puede rendir su evaluación.`;
    } else {
      badgeEl.className = 'status-tag status-pending';
      badgeEl.innerText = `Paso ${this.state.currentStepIndex + 1} en curso`;
      logEl.innerText = `Completado: ${currentStep.name}. Siguiente acción requerida: ${p.steps[this.state.currentStepIndex].name}.`;
    }
  },

  // Ejecutar lógica física/química de la acción
  executeAction(actionType, stepObj) {
    const p = this.practices[this.state.currentPracticeIndex];
    const elem1 = ReactionEngine.elements[p.reactant1];
    const elem2 = ReactionEngine.elements[p.reactant2];

    if (actionType === 'add_reagent_1') {
      this.spawnParticles(elem1, 8);
      document.getElementById('chamberSubtext').innerText = `• Se añadieron átomos de ${elem1.name} (${elem1.symbol})`;
    } else if (actionType === 'add_reagent_2') {
      this.spawnParticles(elem2, 8);
      document.getElementById('chamberSubtext').innerText = `• Se incorporaron átomos de ${elem2.name} (${elem2.symbol})`;
    } else if (actionType === 'apply_heat') {
      this.triggerHeat();
      document.getElementById('chamberSubtext').innerText = `• Mechero activo: Energía cinética y colisiones incrementadas`;
    } else if (actionType === 'form_product') {
      this.synthesizeMolecules();
      document.getElementById('chamberSubtext').innerText = `• Moléculas sintetizadas: ${p.equation}`;
    }
  },

  // ================= RF008 & RF009: HERRAMIENTAS VIRTUALES Y USO GUIADO =================
  toolsDatabase: {
    pipeta: {
      id: 'pipeta',
      icon: '💧',
      title: 'Pipeta Graduada (Volumen 10 mL)',
      type: 'Instrumento Volumétrico de Precisión',
      desc: 'Tubo cilíndrico de vidrio con graduación milimétrica que permite medir y dosificar alícuotas líquidas con máxima exactitud en la cámara.',
      parts: ['Propipeta de 3 vías', 'Línea de enrase (Aforo)', 'Tubo de vidrio borosilicato', 'Escala graduada (mL)', 'Punta capilar cónica'],
      steps: [
        { title: '1. Ambientación de la pipeta', desc: 'Enjuagar las paredes internas de la pipeta con una pequeña porción del reactivo a medir para evitar diluciones indeseadas.' },
        { title: '2. Succión con propipeta', desc: 'Acoplar la propipeta de goma en la boquilla. Sumergir la punta en el reactivo y aspirar líquido hasta superar 1 cm la línea de aforo deseada.' },
        { title: '3. Enrasado del menisco a la vista', desc: 'Colocar la pipeta a la altura exacta de los ojos. Dejar caer el líquido gota a gota hasta que la base cóncava del menisco coincida con la marca de aforo (evita error de paralaje).' },
        { title: '4. Descarga controlada', desc: 'Apoyar la punta inclinada a 45° contra la pared del recipiente receptor y dejar fluir el líquido sin soplar la última gota remanente.' }
      ],
      safety: 'NUNCA pipetee soluciones corrosivas, ácidas o tóxicas aspirando con la boca. Emplee siempre pera de goma o propipeta de tres vías.'
    },
    matraz: {
      id: 'matraz',
      icon: '🧪',
      title: 'Matraz Erlenmeyer (250 mL)',
      type: 'Instrumento de Mezcla y Titulación',
      desc: 'Recipiente cónico de base ancha y cuello estrecho diseñado para contener, disolver y calentar líquidos. Su geometría cónica previene salpicaduras durante la agitación circular.',
      parts: ['Boca esmerilada', 'Cuello estrecho antivuelco', 'Escala volumétrica (mL)', 'Cuerpo cónico Pyrex', 'Fondo plano termo-resistente'],
      steps: [
        { title: '1. Inspección visual previa', desc: 'Comprobar que el fondo y cuello del vidrio Pyrex no presenten fisuras o rajaduras antes de verter líquidos.' },
        { title: '2. Sujeción correcta', desc: 'Sujetar el matraz por la parte superior del cuello utilizando los dedos índice y pulgar de la mano dominante.' },
        { title: '3. Agitación orbital en el plano', desc: 'Imprimir un movimiento circular continuo de la muñeca sin levantar la base de la superficie para inducir un vórtice de mezclado sin derrames.' },
        { title: '4. Detección en valoraciones', desc: 'Colocar una hoja o placa blanca bajo el matraz para observar con claridad el cambio o viraje de color del indicador.' }
      ],
      safety: 'Nunca caliente un matraz Erlenmeyer sellado herméticamente con tapón, ya que la acumulación de presión de vapor provocará una explosión violenta.'
    },
    tubo: {
      id: 'tubo',
      icon: '🧪',
      title: 'Tubo de Ensayo y Gradilla',
      type: 'Instrumento de Micro-reacción Cualitativa',
      desc: 'Tubo cilíndrico de vidrio resistente a choques térmicos. Empleado para ensayos cualitativos a pequeña escala, evaluar precipitaciones y observar desprendimiento de gases con microvolúmenes.',
      parts: ['Boca con reborde labial', 'Pared de vidrio Pyrex', 'Columna de reacción', 'Precipitado insoluble (fondo)', 'Gradilla soporte'],
      steps: [
        { title: '1. Soporte en gradilla', desc: 'Mantener siempre los tubos en posición vertical dentro de los orificios de la gradilla para evitar caídas y roturas.' },
        { title: '2. Volumen seguro', desc: 'No llenar el tubo más de un tercio (1/3) de su capacidad para facilitar la mezcla y evitar proyecciones al ebullir.' },
        { title: '3. Sujeción para calentamiento', desc: 'Sujetar con pinzas de madera en el tercio superior del tubo, nunca con la mano desnuda.' },
        { title: '4. Orientación de la boca', desc: 'Al calentar sobre la llama, incline el tubo a 45° y apunte la boca SIEMPRE hacia una pared vacía, jamás hacia usted o sus compañeros.' }
      ],
      safety: 'Nunca mire directamente por la boca superior de un tubo mientras se calienta o reacciona. Use siempre gafas de seguridad con protección lateral.'
    },
    mechero: {
      id: 'mechero',
      icon: '🔥',
      title: 'Mechero Bunsen',
      type: 'Instrumento Térmico de Combustión',
      desc: 'Dispositivo estándar de calentamiento rápido que mezcla gas hidrocarburo con oxígeno atmosférico para generar una combustión limpia y controlada.',
      parts: ['Base de hierro fundido', 'Tubo conector de gas', 'Collarín regulador de aire (virola)', 'Cañón metálico', 'Cono exterior oxidante (1500 °C)', 'Cono interior reductor'],
      steps: [
        { title: '1. Verificación y collarín cerrado', desc: 'Revisar la manguera de gas y girar el collarín metálico para cerrar la entrada de aire antes de encender.' },
        { title: '2. Encendido del piloto previo', desc: 'Encender el fósforo o chispero y situarlo a 2 cm sobre la boca del cañón antes de girar la llave de paso del gas.' },
        { title: '3. Apertura suave del gas', desc: 'Abrir suavemente el gas: se iniciará una llama amarilla luminosa de combustión incompleta.' },
        { title: '4. Regulación a llama azul', desc: 'Abrir gradualmente el collarín de aire. La llama pasará a color azul transparente no luminoso, alcanzando la máxima temperatura en el cono exterior oxidante (≈ 1500 °C).' }
      ],
      safety: 'La llama azul oxidante puede ser casi invisible a plena luz del día pero supera los 1500 °C. No toque el cañón metálico y recoja siempre el cabello largo.'
    },
    balanza: {
      id: 'balanza',
      icon: '⚖️',
      title: 'Balanza Analítica Digital',
      type: 'Instrumento Gravimétrico de Precisión',
      desc: 'Mide la masa de muestras sólidas y reactivos con resolución de miligramos (0.001 g). Fundamental para cálculos estequiométricos de mol y preparación de soluciones exactas.',
      parts: ['Cabina cortaviento de vidrio', 'Plato de pesaje inoxidable', 'Vidrio de reloj porta-muestras', 'Pantalla digital LCD iluminada', 'Botón TARE / Puesta a Cero'],
      steps: [
        { title: '1. Nivelación y encendido', desc: 'Verificar que la burbuja de nivel de la balanza se encuentre centrada en el círculo indicador y encender el display digital.' },
        { title: '2. Colocación de contenedor', desc: 'Colocar un vidrio de reloj limpio y seco o papel de filtro sobre el centro del plato metálico de pesada.' },
        { title: '3. Función TARE (Puesta a cero)', desc: 'Presionar la tecla "TARE / ZERO" para descontar el peso del contenedor, dejando el display exactamente en 0.000 g.' },
        { title: '4. Dosificación con espátula', desc: 'Añadir el reactivo sólido en pequeñas porciones con la espátula hasta alcanzar la masa exacta requerida.' }
      ],
      safety: 'NUNCA deposite reactivos químicos directamente sobre el plato metálico de la balanza. Limpie cualquier residuo con brocha suave antes de retirarse.'
    },
    termometro: {
      id: 'termometro',
      icon: '🌡️',
      title: 'Termómetro Digital de Inmersión',
      type: 'Instrumento de Monitoreo Térmico',
      desc: 'Mide la energía cinética promedio de las moléculas en grados Celsius (°C). Permite detectar si la reacción es exotérmica (libera calor) o endotérmica (absorbe calor).',
      parts: ['Sonda de acero inoxidable 316', 'Sensor termopar interior', 'Cuerpo hermético ABS', 'Pantalla digital LCD (°C)', 'Punta sensora cónica'],
      steps: [
        { title: '1. Verificación del sensor', desc: 'Comprobar que la sonda metálica esté limpia y encender la pantalla LCD digital en escala Celsius (°C).' },
        { title: '2. Inmersión central', desc: 'Sumergir la sonda metálica en el seno de la disolución, asegurándose de que no toque el fondo ni las paredes de vidrio del recipiente.' },
        { title: '3. Espera de equilibrio térmico', desc: 'Sostener durante 15 a 20 segundos hasta que la cifra decimal de temperatura se mantenga estable.' },
        { title: '4. Enjuague posterior', desc: 'Retirar la sonda, lavarla con chorro de agua destilada del frasco lavador y secar con papel absorbente.' }
      ],
      safety: 'Nunca use el termómetro como varilla para agitar líquidos. Los golpes contra el vidrio pueden quebrar o descalibrar el sensor.'
    },
    phmetro: {
      id: 'phmetro',
      icon: '📊',
      title: 'Sensor de pH Digital y Papel Tornasol',
      type: 'Instrumento Electroquímico Analítico',
      desc: 'Determina el potencial de hidrógeno (pH) de la disolución midiendo la actividad de iones H⁺ en escala de 0 a 14 para identificar acidez, neutralidad o alcalinidad.',
      parts: ['Bulbo de vidrio sensible a H⁺', 'Solución de referencia KCl 3M', 'Cuerpo protector de polímero', 'Cable blindado coaxial', 'Display digital de pH'],
      steps: [
        { title: '1. Calibración en dos puntos', desc: 'Calibrar el electrodo con soluciones tampón buffer certificadas de pH 7.00 (neutro) y pH 4.00 (ácido).' },
        { title: '2. Enjuague con agua destilada', desc: 'Enjuagar el bulbo de vidrio sensible con agua destilada y secar con toques suaves de papel tissue sin frotar.' },
        { title: '3. Inmersión en la muestra', desc: 'Sumergir el electrodo en la solución agitada y esperar a que el símbolo de estabilidad aparezca en pantalla.' },
        { title: '4. Almacenamiento en solución KCl', desc: 'Tras la medición, guardar el electrodo en su capuchón protector con solución conservadora de cloruro de potasio (KCl 3M).' }
      ],
      safety: 'La membrana de vidrio del sensor es extremadamente frágil y delgada. Si se deja secar al aire, perderá su sensibilidad química irreversiblemente.'
    },
    espatula: {
      id: 'espatula',
      icon: '🥄',
      title: 'Espátula Acanalada y Vidrio de Reloj',
      type: 'Instrumento de Muestreo y Trasvase',
      desc: 'Herramienta de acero inoxidable con hoja plana y acanalada que permite tomar porciones de reactivos en polvo o cristales sin contaminar los frascos originales.',
      parts: ['Hoja acanalada de acero inox', 'Extremo plano raspador', 'Mango moleteado', 'Vidrio de reloj cóncavo', 'Muestra de cristales (NaCl)'],
      steps: [
        { title: '1. Limpieza rigurosa previa', desc: 'Verificar que la espátula esté libre de óxido, seca y desengrasada con alcohol.' },
        { title: '2. Extracción cuidadosa', desc: 'Introducir la espátula en el frasco reactivo sin tocar los bordes del envase con los dedos.' },
        { title: '3. Trasvase al vidrio de reloj', desc: 'Depositar la muestra sobre el vidrio de reloj para su observación o transporte a la balanza analítica.' },
        { title: '4. Política de no retorno', desc: 'Nunca devuelva reactivo sobrante al frasco original para evitar la contaminación cruzada de todo el lote.' }
      ],
      safety: 'No use espátulas metálicas con ácidos concentrados corrosivos. Descarte cualquier reactivo sobrante en el contenedor de residuos correspondiente.'
    }
  },

  // Variables de estado del instrumental
  instrumentState: {
    scaleGrams: 0.000,
    isScaleTared: true,
    chamberTemp: 21.5,
    chamberPH: 7.0,
    bunsenFlameType: 'blue' // 'yellow' o 'blue'
  },

  openToolGuide(toolKey) {
    const tool = this.toolsDatabase[toolKey];
    if (!tool) return;

    this.state.selectedTool = toolKey;

    const modal = document.getElementById('modalToolGuide');
    const iconEl = document.getElementById('toolModalIcon');
    const typeEl = document.getElementById('toolModalType');
    const titleEl = document.getElementById('toolModalTitle');
    const descEl = document.getElementById('toolModalDesc');
    const stepsEl = document.getElementById('toolModalSteps');
    const safetyEl = document.getElementById('toolModalSafety');
    const playgroundEl = document.getElementById('toolModalPlayground');
    const model2DEl = document.getElementById('toolModal2DModel');
    const partsListEl = document.getElementById('toolModalPartsList');

    if (!modal) return;

    iconEl.innerText = tool.icon;
    typeEl.innerText = tool.type;
    titleEl.innerText = tool.title;
    descEl.innerText = tool.desc;
    safetyEl.innerHTML = `⚠️ <strong>Advertencia de Bioseguridad:</strong> ${tool.safety}`;

    // Renderizar modelo 2D gráfico SVG
    if (model2DEl) {
      model2DEl.innerHTML = this.renderTool2DModel(toolKey);
    }

    // Renderizar lista de partes anatómicas clicables con explicación pedagógica
    if (partsListEl) {
      let partsHtml = '';
      (tool.parts || []).forEach((p, idx) => {
        partsHtml += `<span class="tool-part-tag" style="cursor: pointer; transition: all 0.2s;" onclick="App.inspectToolPart('${toolKey}', ${idx})" title="Haz clic para ver cómo funciona esta parte">🏷️ ${p}</span>`;
      });
      partsListEl.innerHTML = partsHtml;
    }

    const inspectBox = document.getElementById('toolPartInspectBox');
    if (inspectBox) inspectBox.style.display = 'none';

    // Inicializar estado de la mesa interactiva para este instrumento
    this.initInteractiveToolWorkbench(toolKey, false);

    // Renderizar pasos de uso guiado (RF009)
    let stepsHtml = '';
    tool.steps.forEach((s, idx) => {
      stepsHtml += `
        <div class="tool-instruction-step">
          <div class="tool-step-badge">${idx + 1}</div>
          <div class="tool-step-text">
            <strong>${s.title}</strong>
            <span>${s.desc}</span>
          </div>
        </div>
      `;
    });
    stepsEl.innerHTML = stepsHtml;

    // Renderizar controles interactivos en la mesa (RF008)
    playgroundEl.innerHTML = this.renderToolPlayground(toolKey);

    modal.style.display = 'flex';
  },

  closeToolGuide() {
    const modal = document.getElementById('modalToolGuide');
    if (modal) modal.style.display = 'none';
  },

  // ================= SIMULADOR INTERACTIVO DE MANIPULACIÓN DE INSTRUMENTOS (MOVER, GIRAR, OPERAR) =================
  toolInteractiveState: {
    isOpen: false,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    posX: 0,
    posY: 0,
    angle: 0,
    scale: 100,
    operationVal: 50
  },

  inspectToolPart(toolKey, partIndex) {
    const tool = this.toolsDatabase[toolKey];
    if (!tool || !tool.parts) return;
    const partName = tool.parts[partIndex] || 'Componente';

    const partDescriptions = {
      'Propipeta de 3 vías': 'Pera de goma de seguridad con válvulas A (aire), S (succión) y E (expulsión) para aspirar reactivos sin usar jamás la boca.',
      'Línea de enrase (Aforo)': 'Marca anular grabada en el vidrio donde debe coincidir la base inferior del menisco cóncavo a la altura de los ojos.',
      'Tubo de vidrio borosilicato': 'Cuerpo cilíndrico transparente de baja dilatación térmica que mantiene constante el volumen calibrado a 20 °C.',
      'Escala graduada (mL)': 'Divisiones milimétricas de 0 a 10 mL que permiten medir y descargar alícuotas variables con exactitud.',
      'Punta capilar cónica': 'Extremo inferior estrecho que regula la salida gota a gota al apoyarse a 45° contra la pared del vaso receptor.'
    };

    const detail = partDescriptions[partName] || `Componente clave de ${tool.title}. Presiona el botón "🖐️ Interactuar con el Instrumento" arriba para moverlo, girarlo y practicar su uso.`;
    const box = document.getElementById('toolPartInspectBox');
    if (box) {
      box.style.display = 'block';
      box.innerHTML = `🔍 <strong>${partName}:</strong> ${detail}`;
    }
  },

  initInteractiveToolWorkbench(toolKey, openDirectly = false) {
    this.toolInteractiveState = {
      isOpen: openDirectly,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      posX: 0,
      posY: 0,
      angle: 0,
      scale: 100,
      operationVal: 50
    };

    const staticView = document.getElementById('toolDiagramStaticView');
    const workbench = document.getElementById('toolInteractiveWorkbench');
    const btnToggle = document.getElementById('btnToggleInteractiveTool');

    if (staticView) staticView.style.display = openDirectly ? 'none' : 'block';
    if (workbench) workbench.style.display = openDirectly ? 'block' : 'none';
    if (btnToggle) {
      btnToggle.innerHTML = openDirectly
        ? '📐 Ver Diagrama Anatómico Estático'
        : '🖐️ Interactuar con el Instrumento (Mover / Girar / Operar)';
    }

    const angleSlider = document.getElementById('sliderToolAngle');
    const scaleSlider = document.getElementById('sliderToolScale');
    const opSlider = document.getElementById('sliderToolOperation');
    if (angleSlider) angleSlider.value = 0;
    if (scaleSlider) scaleSlider.value = 100;
    if (opSlider) opSlider.value = 50;

    const opTitle = document.getElementById('lblToolActionSliderTitle');
    if (opTitle) {
      const titles = {
        pipeta: '💧 Succión / Nivel de Menisco (0 - 10 mL):',
        matraz: '🔄 Nivel de Llenado y Vórtice (mL):',
        tubo: '🧪 Volumen de Muestra y Precipitado:',
        mechero: '🔥 Entrada de Aire (Virola: Llama Amarilla → Azul):',
        balanza: '⚖️ Dosificación de Masa en el Plato (g):',
        termometro: '🌡️ Profundidad de Inmersión Térmica:',
        phmetro: '📊 Inmersión en Solución (Acidez / Alcalinidad):',
        espatula: '🥄 Cantidad de Cristales en la Hoja:'
      };
      opTitle.innerText = titles[toolKey] || '⚙️ Operar Mecanismo:';
    }

    this.renderInteractiveToolDynamicSVG();
    this.applyInteractiveToolTransform();
  },

  toggleInteractiveToolSpace() {
    const isNowOpen = !this.toolInteractiveState.isOpen;
    this.toolInteractiveState.isOpen = isNowOpen;

    const staticView = document.getElementById('toolDiagramStaticView');
    const workbench = document.getElementById('toolInteractiveWorkbench');
    const btnToggle = document.getElementById('btnToggleInteractiveTool');

    if (staticView) staticView.style.display = isNowOpen ? 'none' : 'block';
    if (workbench) workbench.style.display = isNowOpen ? 'block' : 'none';
    if (btnToggle) {
      btnToggle.innerHTML = isNowOpen
        ? '📐 Volver al Diagrama Anatómico'
        : '🖐️ Interactuar con el Instrumento (Mover / Girar / Operar)';
    }

    if (isNowOpen) {
      this.renderInteractiveToolDynamicSVG();
      this.applyInteractiveToolTransform();
    }
  },

  resetInteractiveToolTransform() {
    this.toolInteractiveState.posX = 0;
    this.toolInteractiveState.posY = 0;
    this.toolInteractiveState.angle = 0;
    this.toolInteractiveState.scale = 100;
    this.toolInteractiveState.operationVal = 50;

    const angleSlider = document.getElementById('sliderToolAngle');
    const scaleSlider = document.getElementById('sliderToolScale');
    const opSlider = document.getElementById('sliderToolOperation');
    if (angleSlider) angleSlider.value = 0;
    if (scaleSlider) scaleSlider.value = 100;
    if (opSlider) opSlider.value = 50;

    this.renderInteractiveToolDynamicSVG();
    this.applyInteractiveToolTransform();
  },

  setQuickToolAngle(deg) {
    this.toolInteractiveState.angle = deg;
    const angleSlider = document.getElementById('sliderToolAngle');
    if (angleSlider) angleSlider.value = deg;
    this.renderInteractiveToolDynamicSVG();
    this.applyInteractiveToolTransform();
  },

  updateInteractiveToolControl() {
    const angleSlider = document.getElementById('sliderToolAngle');
    const scaleSlider = document.getElementById('sliderToolScale');
    const opSlider = document.getElementById('sliderToolOperation');

    if (angleSlider) this.toolInteractiveState.angle = parseInt(angleSlider.value, 10) || 0;
    if (scaleSlider) this.toolInteractiveState.scale = parseInt(scaleSlider.value, 10) || 100;
    if (opSlider) this.toolInteractiveState.operationVal = parseInt(opSlider.value, 10) || 0;

    this.renderInteractiveToolDynamicSVG();
    this.applyInteractiveToolTransform();
  },

  startToolDrag(event) {
    this.toolInteractiveState.isDragging = true;
    this.toolInteractiveState.dragStartX = event.clientX - this.toolInteractiveState.posX;
    this.toolInteractiveState.dragStartY = event.clientY - this.toolInteractiveState.posY;
    const stage = document.getElementById('interactiveToolStage');
    if (stage) stage.style.cursor = 'grabbing';
  },

  moveToolDrag(event) {
    if (!this.toolInteractiveState.isDragging) return;
    const rawX = event.clientX - this.toolInteractiveState.dragStartX;
    const rawY = event.clientY - this.toolInteractiveState.dragStartY;
    this.toolInteractiveState.posX = Math.max(-110, Math.min(110, rawX));
    this.toolInteractiveState.posY = Math.max(-75, Math.min(75, rawY));
    this.applyInteractiveToolTransform();
  },

  endToolDrag() {
    if (!this.toolInteractiveState.isDragging) return;
    this.toolInteractiveState.isDragging = false;
    const stage = document.getElementById('interactiveToolStage');
    if (stage) stage.style.cursor = 'grab';
  },

  wheelToolZoom(event) {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 8 : -8;
    const nextScale = Math.max(60, Math.min(170, this.toolInteractiveState.scale + delta));
    this.toolInteractiveState.scale = nextScale;
    const scaleSlider = document.getElementById('sliderToolScale');
    if (scaleSlider) scaleSlider.value = nextScale;
    this.applyInteractiveToolTransform();
  },

  applyInteractiveToolTransform() {
    const { posX, posY, angle, scale, operationVal } = this.toolInteractiveState;
    const toolKey = this.state.selectedTool || 'pipeta';

    const box = document.getElementById('interactiveToolTransformBox');
    if (box) {
      box.style.transform = `translate(${posX}px, ${posY}px) rotate(${angle}deg) scale(${scale / 100})`;
    }

    const lblAngle = document.getElementById('lblToolAngle');
    const lblScale = document.getElementById('lblToolScale');
    const badge = document.getElementById('interactiveStageCoordsBadge');
    if (lblAngle) lblAngle.innerText = `${angle}°`;
    if (lblScale) lblScale.innerText = `${scale}%`;
    if (badge) {
      badge.innerText = `Pos: (${Math.round(posX)}, ${Math.round(posY)}) | Giro: ${angle}° | Zoom: ${scale}%`;
    }

    // Actualizar el vaso auxiliar si inclina o descarga
    const auxFill = document.getElementById('auxVesselLiquidFill');
    if (auxFill) {
      const pourBonus = Math.abs(angle) >= 35 ? 35 : 0;
      const fillPct = Math.min(92, Math.max(15, Math.round((100 - operationVal) * 0.55 + pourBonus)));
      auxFill.style.height = `${fillPct}%`;
    }

    // Actualizar texto y retroalimentación pedagógica según cómo lo mueve/gira/opera
    const lblOpVal = document.getElementById('lblToolActionVal');
    const coachEl = document.getElementById('interactiveLiveCoaching');

    if (toolKey === 'pipeta') {
      const ml = ((operationVal / 100) * 10).toFixed(1);
      if (lblOpVal) lblOpVal.innerText = `${ml} mL`;
      if (coachEl) {
        if (Math.abs(angle) >= 35 && Math.abs(angle) <= 55) {
          coachEl.innerHTML = `✅ <strong>¡Excelente técnica (${angle}°)!</strong> Inclinación ideal de 45° para apoyar la punta de la pipeta contra la pared del vaso receptor y descargar ${ml} mL sin salpicaduras.`;
        } else if (angle === 0 && Math.abs(operationVal - 50) <= 5) {
          coachEl.innerHTML = `🎯 <strong>Enrase exacto a 5.0 mL (0° Vertical):</strong> La pipeta está perfectamente vertical y el menisco cóncavo coincide con la línea de aforo sin error de paralaje.`;
        } else {
          coachEl.innerHTML = `💡 <strong>Guía interactiva:</strong> Pon el giro en <strong>0° Vertical</strong> para enrasar el menisco a <strong>5.0 mL</strong>, o gírala a <strong>45° Uso</strong> y arrástrala hacia el vaso receptor para descargar.`;
        }
      }
    } else if (toolKey === 'matraz') {
      const ml = Math.round(50 + (operationVal / 100) * 200);
      if (lblOpVal) lblOpVal.innerText = `${ml} mL`;
      if (coachEl) {
        coachEl.innerHTML = Math.abs(angle) > 65
          ? `⚠️ <strong>Cuidado (${angle}°):</strong> Si inclinas demasiado el matraz Erlenmeyer con ${ml} mL, el líquido puede rebasar el cuello estrecho. Usa giros suaves de -25° a 25° para agitar.`
          : `✅ <strong>Agitación orbital (${angle}°):</strong> Mueve el matraz en círculos con el mouse y alterna el ángulo para mezclar los ${ml} mL sin derrames gracias a su cuello cónico.`;
      }
    } else if (toolKey === 'tubo') {
      const pct = Math.round((operationVal / 100) * 60);
      if (lblOpVal) lblOpVal.innerText = `${pct}% lleno`;
      if (coachEl) {
        coachEl.innerHTML = Math.abs(angle) >= 40 && Math.abs(angle) <= 55
          ? `✅ <strong>Ángulo seguro de calentamiento (${angle}°):</strong> El tubo de ensayo debe inclinarse a 45° apuntando hacia una zona libre de compañeros.`
          : `💡 <strong>Consejo de uso:</strong> Inclina el tubo a <strong>45° Uso</strong> y no superes el 33% de su capacidad al calentarlo.`;
      }
    } else if (toolKey === 'mechero') {
      const temp = Math.round(600 + (operationVal / 100) * 900);
      if (lblOpVal) lblOpVal.innerText = `${temp} °C`;
      if (coachEl) {
        coachEl.innerHTML = operationVal >= 70
          ? `🔵 <strong>Llama Azul Oxidante (${temp} °C):</strong> Collarín abierto con combustión completa. Arrastra el mechero debajo del recipiente para calentar sin hollín.`
          : `🟡 <strong>Llama Amarilla Luminosa (${temp} °C):</strong> Entrada de aire cerrada. Desliza el control hacia la derecha para abrir el collarín y obtener llama azul de 1500 °C.`;
      }
    } else {
      if (lblOpVal) lblOpVal.innerText = `${operationVal}%`;
      if (coachEl) {
        coachEl.innerHTML = `✅ <strong>Manipulación activa:</strong> Arrastra el instrumento a la posición (${Math.round(posX)}, ${Math.round(posY)}), gíralo a ${angle}° y haz zoom (${scale}%) para inspeccionar su funcionamiento.`;
      }
    }
  },

  renderInteractiveToolDynamicSVG() {
    const box = document.getElementById('interactiveToolTransformBox');
    if (!box) return;
    const toolKey = this.state.selectedTool || 'pipeta';
    const op = this.toolInteractiveState.operationVal;

    if (toolKey === 'pipeta') {
      // El nivel de líquido sube/baja dinámicamente según el slider de operación (0-10 mL)
      const liqHeight = Math.round((op / 100) * 82);
      const liqY = 148 - liqHeight;
      const mlText = ((op / 100) * 10).toFixed(1);
      box.innerHTML = `
        <svg viewBox="0 0 260 180" width="240" height="175" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="130" cy="22" rx="22" ry="15" fill="#ef4444" stroke="#fca5a5" stroke-width="1.5"/>
          <rect x="126" y="35" width="8" height="13" fill="#dc2626"/>
          <rect x="123" y="48" width="14" height="100" rx="3" fill="rgba(224,242,254,0.22)" stroke="#cbd5e1" stroke-width="1.8"/>
          <rect x="125" y="${liqY}" width="10" height="${liqHeight}" fill="#38bdf8"/>
          <path d="M125 ${liqY} Q130 ${liqY + 4} 135 ${liqY}" fill="none" stroke="#ffffff" stroke-width="2"/>
          <polygon points="123,148 137,148 132,166 128,166" fill="rgba(224,242,254,0.3)" stroke="#cbd5e1" stroke-width="1.5"/>
          <circle cx="130" cy="172" r="${op > 5 ? 3.5 : 0}" fill="#38bdf8"/>
          <line x1="117" y1="66" x2="125" y2="66" stroke="#f8fafc" stroke-width="1.5"/><text x="112" y="69" font-size="9" fill="#cbd5e1" text-anchor="end">10 mL</text>
          <line x1="116" y1="107" x2="126" y2="107" stroke="#facc15" stroke-width="2"/><text x="112" y="110" font-size="9" font-weight="bold" fill="#facc15" text-anchor="end">Aforo 5 mL</text>
          <line x1="138" y1="${liqY}" x2="172" y2="${liqY}" stroke="#38bdf8" stroke-dasharray="3,2" stroke-width="1.5"/>
          <text x="176" y="${liqY + 3}" font-size="10" font-weight="bold" fill="#38bdf8">${mlText} mL</text>
        </svg>
      `;
      return;
    }

    // Para los demás instrumentos, reutilizamos el modelo vectorial 2D con respuesta al movimiento/giro/escala
    box.innerHTML = this.renderTool2DModel(toolKey);
  },

  // ================= GENERADOR DE MODELOS 2D VECTORIALES SVG =================
  renderTool2DModel(toolKey) {
    if (toolKey === 'pipeta') {
      return `
        <svg viewBox="0 0 320 180" width="100%" height="180" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pipGlass" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/><stop offset="50%" stop-color="#e0f2fe" stop-opacity="0.3"/><stop offset="100%" stop-color="#38bdf8" stop-opacity="0.2"/></linearGradient>
            <linearGradient id="pipLiquid" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#0284c7"/><stop offset="50%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0369a1"/></linearGradient>
            <linearGradient id="pipBulb" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#ef4444"/><stop offset="50%" stop-color="#f87171"/><stop offset="100%" stop-color="#b91c1c"/></linearGradient>
          </defs>
          <ellipse cx="160" cy="22" rx="22" ry="16" fill="url(#pipBulb)" stroke="#991b1b" stroke-width="1.5"/>
          <rect x="156" y="36" width="8" height="12" fill="#ef4444" stroke="#991b1b"/>
          <rect x="154" y="48" width="12" height="100" rx="3" fill="url(#pipGlass)" stroke="#64748b" stroke-width="1.5"/>
          <rect x="156" y="80" width="8" height="68" fill="url(#pipLiquid)"/>
          <path d="M156 80 Q160 83 164 80" fill="none" stroke="#0284c7" stroke-width="1.5" style="animation: meniscusFlow 2s ease-in-out infinite;"/>
          <polygon points="154,148 166,148 162,166 158,166" fill="url(#pipGlass)" stroke="#64748b" stroke-width="1.5"/>
          <polygon points="156,148 164,148 161,164 159,164" fill="url(#pipLiquid)"/>
          <circle cx="160" cy="172" r="3.5" fill="#38bdf8" style="animation: dropFall 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;"/>
          <line x1="150" y1="65" x2="157" y2="65" stroke="#334155" stroke-width="1.5"/><text x="144" y="68" font-size="9" font-family="monospace" font-weight="bold" fill="#0f172a" text-anchor="end">0 mL</text>
          <line x1="152" y1="75" x2="156" y2="75" stroke="#64748b" stroke-width="1"/>
          <line x1="150" y1="85" x2="157" y2="85" stroke="#dc2626" stroke-width="2"/><text x="144" y="88" font-size="9" font-family="monospace" font-weight="bold" fill="#dc2626" text-anchor="end">Aforo 5 mL</text>
          <line x1="152" y1="95" x2="156" y2="95" stroke="#64748b" stroke-width="1"/>
          <line x1="150" y1="105" x2="157" y2="105" stroke="#334155" stroke-width="1.5"/><text x="144" y="108" font-size="9" font-family="monospace" font-weight="bold" fill="#0f172a" text-anchor="end">7 mL</text>
          <line x1="150" y1="125" x2="157" y2="125" stroke="#334155" stroke-width="1.5"/><text x="144" y="128" font-size="9" font-family="monospace" font-weight="bold" fill="#0f172a" text-anchor="end">10 mL</text>
          <line x1="165" y1="80" x2="210" y2="80" stroke="#0284c7" stroke-dasharray="3,3" stroke-width="1.5"/>
          <text x="215" y="83" font-size="10" font-family="sans-serif" font-weight="bold" fill="#0284c7">👁️ Nivel Menisco Cóncavo</text>
        </svg>
      `;
    }

    if (toolKey === 'matraz') {
      return `
        <svg viewBox="0 0 320 180" width="100%" height="180" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="erlenLiquid" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#38bdf8" stop-opacity="0.85"/><stop offset="50%" stop-color="#0284c7" stop-opacity="0.9"/><stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.95"/></linearGradient>
            <linearGradient id="flaskGlass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.7"/><stop offset="30%" stop-color="#f8fafc" stop-opacity="0.2"/><stop offset="100%" stop-color="#94a3b8" stop-opacity="0.4"/></linearGradient>
          </defs>
          <ellipse cx="160" cy="165" rx="55" ry="8" fill="#cbd5e1" opacity="0.6"/>
          <rect x="150" y="22" width="20" height="42" fill="url(#flaskGlass)" stroke="#475569" stroke-width="2"/>
          <ellipse cx="160" cy="22" rx="13" ry="4" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
          <polygon points="150,60 170,60 215,158 105,158" fill="url(#flaskGlass)" stroke="#475569" stroke-width="2"/>
          <ellipse cx="160" cy="158" rx="55" ry="9" fill="url(#flaskGlass)" stroke="#475569" stroke-width="2"/>
          <path d="M125 120 Q145 115 160 120 T195 120 L213 156 Q160 166 107 156 Z" fill="url(#erlenLiquid)" opacity="0.85"/>
          <ellipse cx="160" cy="120" rx="35" ry="6" fill="#7dd3fc" opacity="0.6"/>
          <circle cx="140" cy="138" r="3" fill="#ffffff" opacity="0.7"/>
          <circle cx="170" cy="142" r="4" fill="#ffffff" opacity="0.6"/>
          <circle cx="155" cy="130" r="2.5" fill="#ffffff" opacity="0.8"/>
          <line x1="165" y1="85" x2="178" y2="85" stroke="#334155" stroke-width="1.5"/><text x="182" y="88" font-size="9" font-family="monospace" fill="#334155">250 mL</text>
          <line x1="172" y1="105" x2="187" y2="105" stroke="#334155" stroke-width="1.5"/><text x="191" y="108" font-size="9" font-family="monospace" fill="#334155">150 mL</text>
          <line x1="178" y1="125" x2="197" y2="125" stroke="#334155" stroke-width="1.5"/><text x="201" y="128" font-size="9" font-family="monospace" fill="#334155">50 mL</text>
          <path d="M153 66 L118 148" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
        </svg>
      `;
    }

    if (toolKey === 'tubo') {
      return `
        <svg viewBox="0 0 320 180" width="100%" height="180" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="tubeLiquid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/><stop offset="80%" stop-color="#0284c7" stop-opacity="0.9"/><stop offset="100%" stop-color="#f59e0b" stop-opacity="1"/></linearGradient>
          </defs>
          <rect x="70" y="145" width="180" height="16" rx="4" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>
          <rect x="90" y="60" width="14" height="85" fill="#b45309"/>
          <rect x="216" y="60" width="14" height="85" fill="#b45309"/>
          <rect x="70" y="55" width="180" height="12" rx="3" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>
          <rect x="110" y="25" width="22" height="110" rx="11" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5" opacity="0.4"/>
          <rect x="149" y="18" width="24" height="126" rx="12" fill="#ffffff" stroke="#334155" stroke-width="2" opacity="0.9"/>
          <ellipse cx="161" cy="18" rx="14" ry="4" fill="#e2e8f0" stroke="#334155" stroke-width="2"/>
          <path d="M151 55 Q161 58 171 55 L171 132 A10 10 0 0 1 151 132 Z" fill="url(#tubeLiquid)"/>
          <path d="M151 126 Q161 129 171 126 L171 132 A10 10 0 0 1 151 132 Z" fill="#f59e0b" stroke="#d97706"/>
          <circle cx="160" cy="70" r="2.5" fill="#ffffff" opacity="0.8"/>
          <circle cx="157" cy="90" r="2" fill="#ffffff" opacity="0.8"/>
          <circle cx="163" cy="105" r="3" fill="#ffffff" opacity="0.8"/>
          <rect x="188" y="25" width="22" height="110" rx="11" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5" opacity="0.4"/>
          <line x1="172" y1="130" x2="225" y2="130" stroke="#d97706" stroke-width="1.5" stroke-dasharray="3,3"/>
          <text x="230" y="133" font-size="10" font-family="sans-serif" font-weight="bold" fill="#b45309">Precipitado Insoluble</text>
        </svg>
      `;
    }

    if (toolKey === 'mechero') {
      return `
        <svg viewBox="0 0 320 180" width="100%" height="180" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="metalBase" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#334155"/><stop offset="50%" stop-color="#64748b"/><stop offset="100%" stop-color="#1e293b"/></linearGradient>
            <linearGradient id="brassBarrel" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#d97706"/><stop offset="50%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#92400e"/></linearGradient>
            <linearGradient id="blueFlame" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#1d4ed8" stop-opacity="0.9"/><stop offset="50%" stop-color="#38bdf8" stop-opacity="0.95"/><stop offset="90%" stop-color="#e0f2fe" stop-opacity="0.7"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0.9"/></linearGradient>
            <linearGradient id="innerCone" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#38bdf8" stop-opacity="0.3"/></linearGradient>
          </defs>
          <ellipse cx="160" cy="160" rx="55" ry="12" fill="url(#metalBase)" stroke="#0f172a" stroke-width="2"/>
          <ellipse cx="160" cy="155" rx="35" ry="6" fill="#475569"/>
          <path d="M125 145 L95 148 L95 156 L125 152 Z" fill="#475569" stroke="#1e293b"/>
          <circle cx="95" cy="152" r="5" fill="#f59e0b"/>
          <rect x="151" y="80" width="18" height="75" fill="url(#brassBarrel)" stroke="#78350f" stroke-width="1.5"/>
          <rect x="148" y="130" width="24" height="15" rx="2" fill="#94a3b8" stroke="#334155" stroke-width="1.5"/>
          <ellipse cx="160" cy="137" rx="4" ry="4" fill="#0f172a"/>
          <rect x="149" y="75" width="22" height="6" rx="1" fill="#475569" stroke="#1e293b"/>
          <path d="M150 75 Q135 40 160 12 Q185 40 170 75 Z" fill="url(#blueFlame)" style="transform-origin: 160px 75px; animation: flameFlicker 0.3s infinite alternate; filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.8));"/>
          <path d="M154 75 Q147 50 160 35 Q173 50 166 75 Z" fill="url(#innerCone)" opacity="0.9"/>
          <line x1="172" y1="25" x2="215" y2="25" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3"/>
          <text x="220" y="28" font-size="10" font-family="sans-serif" font-weight="bold" fill="#0284c7">Zona Oxidante (1500 °C)</text>
          <line x1="168" y1="55" x2="215" y2="55" stroke="#64748b" stroke-width="1" stroke-dasharray="2,2"/>
          <text x="220" y="58" font-size="9" font-family="sans-serif" fill="#64748b">Cono interior (300 °C)</text>
        </svg>
      `;
    }

    if (toolKey === 'balanza') {
      return `
        <svg viewBox="0 0 320 180" width="100%" height="180" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="scalePan" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#cbd5e1"/><stop offset="50%" stop-color="#ffffff"/><stop offset="100%" stop-color="#94a3b8"/></linearGradient>
          </defs>
          <rect x="75" y="95" width="170" height="65" rx="10" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
          <rect x="85" y="160" width="16" height="6" rx="2" fill="#334155"/>
          <rect x="219" y="160" width="16" height="6" rx="2" fill="#334155"/>
          <rect x="95" y="30" width="130" height="65" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/>
          <rect x="157" y="70" width="6" height="25" fill="#64748b"/>
          <ellipse cx="160" cy="70" rx="35" ry="6" fill="url(#scalePan)" stroke="#475569" stroke-width="1.5"/>
          <path d="M135 68 Q160 74 185 68" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5" opacity="0.9"/>
          <polygon points="152,66 156,63 160,65 156,68" fill="#ffffff" stroke="#94a3b8" stroke-width="0.8"/>
          <polygon points="158,67 163,64 167,66 162,69" fill="#fef08a" stroke="#ca8a04" stroke-width="0.8"/>
          <polygon points="160,63 164,60 168,62 164,65" fill="#ffffff" stroke="#94a3b8" stroke-width="0.8"/>
          <rect x="115" y="112" width="90" height="26" rx="4" fill="#000000" stroke="#334155" stroke-width="1.5"/>
          <text x="160" y="130" font-family="monospace" font-size="14" font-weight="bold" fill="#22c55e" text-anchor="middle" letter-spacing="1">2.300 g</text>
          <rect x="90" y="116" width="18" height="18" rx="3" fill="#cbd5e1" stroke="#64748b"/>
          <text x="99" y="129" font-size="7" font-weight="bold" fill="#1e293b" text-anchor="middle">ON</text>
          <rect x="212" y="116" width="22" height="18" rx="3" fill="#2563eb" stroke="#1d4ed8"/>
          <text x="223" y="128" font-size="7" font-weight="bold" fill="#ffffff" text-anchor="middle">TARE</text>
        </svg>
      `;
    }

    if (toolKey === 'termometro') {
      return `
        <svg viewBox="0 0 320 180" width="100%" height="180" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="probeMetal" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#94a3b8"/><stop offset="50%" stop-color="#f8fafc"/><stop offset="100%" stop-color="#64748b"/></linearGradient>
          </defs>
          <rect x="135" y="20" width="50" height="75" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
          <ellipse cx="160" cy="20" rx="20" ry="4" fill="#334155"/>
          <rect x="143" y="32" width="34" height="22" rx="3" fill="#000000" stroke="#475569" stroke-width="1"/>
          <text x="160" y="48" font-family="monospace" font-size="10" font-weight="bold" fill="#38bdf8" text-anchor="middle">86.4°C</text>
          <circle cx="160" cy="68" r="5" fill="#2563eb" stroke="#1d4ed8" stroke-width="1"/>
          <text x="160" y="70" font-size="6" font-weight="bold" fill="#ffffff" text-anchor="middle">°C</text>
          <rect x="158" y="95" width="4" height="65" fill="url(#probeMetal)" stroke="#475569" stroke-width="1"/>
          <polygon points="158,160 162,160 160,170" fill="#dc2626"/>
          <circle cx="160" cy="168" r="8" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.8"/>
          <line x1="165" y1="130" x2="215" y2="130" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3"/>
          <text x="220" y="133" font-size="10" font-family="sans-serif" font-weight="bold" fill="#334155">Sonda de Acero Inox</text>
          <line x1="180" y1="43" x2="215" y2="43" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="3,3"/>
          <text x="220" y="46" font-size="10" font-family="sans-serif" font-weight="bold" fill="#0284c7">Lectura Digital LCD</text>
        </svg>
      `;
    }

    if (toolKey === 'phmetro') {
      return `
        <svg viewBox="0 0 320 180" width="100%" height="180" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="phRainbow" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#ef4444"/><stop offset="50%" stop-color="#22c55e"/><stop offset="100%" stop-color="#3b82f6"/></linearGradient>
          </defs>
          <rect x="75" y="30" width="60" height="95" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
          <rect x="83" y="40" width="44" height="28" rx="3" fill="#000000" stroke="#334155" stroke-width="1"/>
          <text x="105" y="58" font-family="monospace" font-size="12" font-weight="bold" fill="#22c55e" text-anchor="middle">pH 7.0</text>
          <rect x="83" y="74" width="44" height="5" rx="2" fill="url(#phRainbow)"/>
          <path d="M105 125 Q105 145 130 145 T160 140 T180 120" fill="none" stroke="#475569" stroke-width="3"/>
          <rect x="175" y="25" width="12" height="110" rx="3" fill="#f1f5f9" stroke="#334155" stroke-width="1.5"/>
          <rect x="177" y="35" width="8" height="90" fill="#e0f2fe" opacity="0.6"/>
          <circle cx="181" cy="142" r="7" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" opacity="0.85"/>
          <path d="M174 135 L174 150 Q181 155 188 150 L188 135" fill="none" stroke="#475569" stroke-width="1.5"/>
          <line x1="190" y1="142" x2="230" y2="142" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="3,3"/>
          <text x="235" y="145" font-size="10" font-family="sans-serif" font-weight="bold" fill="#0369a1">Bulbo de Vidrio Sensor</text>
        </svg>
      `;
    }

    if (toolKey === 'espatula') {
      return `
        <svg viewBox="0 0 320 180" width="100%" height="180" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="steelMetal" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#64748b"/><stop offset="50%" stop-color="#f8fafc"/><stop offset="100%" stop-color="#475569"/></linearGradient>
          </defs>
          <ellipse cx="160" cy="145" rx="65" ry="14" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5" opacity="0.7"/>
          <ellipse cx="160" cy="143" rx="55" ry="9" fill="#ffffff" opacity="0.5"/>
          <g transform="translate(145, 134)">
            <polygon points="10,4 16,1 21,3 15,6" fill="#ffffff" stroke="#94a3b8" stroke-width="0.8"/>
            <polygon points="18,6 24,3 29,5 23,8" fill="#f8fafc" stroke="#94a3b8" stroke-width="0.8"/>
            <polygon points="5,7 11,4 16,6 10,9" fill="#ffffff" stroke="#94a3b8" stroke-width="0.8"/>
            <polygon points="12,8 18,5 23,7 17,10" fill="#f1f5f9" stroke="#94a3b8" stroke-width="0.8"/>
          </g>
          <g transform="rotate(-18 160 90)">
            <rect x="120" y="86" width="80" height="8" rx="2" fill="#475569" stroke="#1e293b"/>
            <rect x="70" y="88" width="50" height="4" fill="url(#steelMetal)"/>
            <polygon points="70,87 60,90 70,93" fill="url(#steelMetal)" stroke="#334155" stroke-width="0.8"/>
            <path d="M200 87 L255 87 Q262 90 255 93 L200 93 Z" fill="url(#steelMetal)" stroke="#334155" stroke-width="1"/>
            <polygon points="248,85 253,82 258,84 253,87" fill="#ffffff" stroke="#38bdf8" stroke-width="0.8"/>
          </g>
          <line x1="225" y1="65" x2="255" y2="45" stroke="#334155" stroke-width="1.5" stroke-dasharray="3,3"/>
          <text x="258" y="48" font-size="10" font-family="sans-serif" font-weight="bold" fill="#1e293b">Hoja Acanalada de Acero</text>
          <line x1="160" y1="150" x2="160" y2="168" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="3,3"/>
          <text x="160" y="178" font-size="10" font-family="sans-serif" font-weight="bold" fill="#0284c7" text-anchor="middle">Vidrio de Reloj con Cristales</text>
        </svg>
      `;
    }

    return '<div style="padding: 2rem; color: #64748b;">Modelo 2D en preparación.</div>';
  },

  renderToolPlayground(toolKey) {
    if (toolKey === 'pipeta') {
      return `
        <div style="text-align: center;">
          <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 0.75rem;">Seleccione el volumen de reactivo líquido a medir y descargar en la cámara:</p>
          <div style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 1rem;">
            <button class="btn btn-outline" style="color: #38bdf8; border-color: #0284c7;" onclick="App.simulatePipetteDose(2)">💧 2.0 mL</button>
            <button class="btn btn-primary" onclick="App.simulatePipetteDose(5)">💧 5.0 mL (Recomendado)</button>
            <button class="btn btn-outline" style="color: #38bdf8; border-color: #0284c7;" onclick="App.simulatePipetteDose(10)">💧 10.0 mL</button>
          </div>
          <div id="pipetteStatusMsg" style="font-size: 0.78rem; color: #a5f3fc;">Listo para aspirar alícuota con enrase a la vista.</div>
        </div>
      `;
    }

    if (toolKey === 'matraz') {
      return `
        <div style="text-align: center;">
          <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 0.75rem;">Imprima movimiento orbital al Erlenmeyer para acelerar el contacto molecular:</p>
          <button class="tool-action-btn" style="margin: 0 auto;" onclick="App.simulateErlenmeyerShake()">
            🔄 Agitar Matraz con Movimiento Circular
          </button>
          <div id="erlenmeyerStatusMsg" style="font-size: 0.78rem; color: #a5f3fc; margin-top: 0.75rem;">El matraz se encuentra en reposo en la mesa.</div>
        </div>
      `;
    }

    if (toolKey === 'tubo') {
      return `
        <div style="text-align: center;">
          <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 0.75rem;">Realice una prueba rápida a microescala para comprobar formación de precipitado:</p>
          <button class="tool-action-btn" style="margin: 0 auto; background: #0284c7;" onclick="App.simulateTestTubePrecipitate()">
            🧪 Ensayo de Precipitación en Tubo
          </button>
          <div id="tubeStatusMsg" style="font-size: 0.78rem; color: #a5f3fc; margin-top: 0.75rem;">Tubo limpio colocado en la gradilla.</div>
        </div>
      `;
    }

    if (toolKey === 'mechero') {
      const isHeat = this.state.heatActive;
      return `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <span style="font-size: 0.85rem; color: #94a3b8;">Tipo de Llama:</span>
            <div style="display: flex; gap: 0.4rem;">
              <button class="btn ${this.instrumentState.bunsenFlameType === 'yellow' ? 'btn-secondary' : 'btn-outline'}" style="font-size: 0.75rem;" onclick="App.setBunsenFlame('yellow')">
                🟡 Llama Incompleta (600 °C)
              </button>
              <button class="btn ${this.instrumentState.bunsenFlameType === 'blue' ? 'btn-primary' : 'btn-outline'}" style="font-size: 0.75rem;" onclick="App.setBunsenFlame('blue')">
                🔵 Llama Azul Oxidante (1500 °C)
              </button>
            </div>
          </div>
          <div style="text-align: center; margin-top: 1rem;">
            <button class="tool-action-btn" style="background: ${isHeat ? '#dc2626' : '#ea580c'}; margin: 0 auto;" onclick="App.simulateBunsenToggle()">
              ${isHeat ? '🔥 Apagar Mechero en la Mesa' : '🔥 Encender Mechero Bunsen'}
            </button>
            <div id="bunsenStatusMsg" style="font-size: 0.78rem; color: #fde047; margin-top: 0.75rem;">
              Estado: ${isHeat ? 'Llama activa • Entregando energía cinética' : 'Apagado • Temperatura ambiente'}
            </div>
          </div>
        </div>
      `;
    }

    if (toolKey === 'balanza') {
      return `
        <div style="text-align: center;">
          <div class="digital-scale-display" id="digitalScaleDisplay">
            ${this.instrumentState.scaleGrams.toFixed(3)} g
          </div>
          <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-secondary" style="font-size: 0.8rem;" onclick="App.simulateTareScale()">
              🔘 TARE / CERO (0.000 g)
            </button>
            <button class="btn btn-primary" style="font-size: 0.8rem;" onclick="App.simulateWeighReagent('Na', 2.300)">
              🧂 Pesar 2.300 g de Sodio (Na)
            </button>
            <button class="btn btn-outline" style="color: #38bdf8; border-color: #0284c7; font-size: 0.8rem;" onclick="App.simulateWeighReagent('NaCl', 5.844)">
              🧂 Pesar 5.844 g de Sal (NaCl)
            </button>
          </div>
          <div id="scaleStatusMsg" style="font-size: 0.78rem; color: #86efac; margin-top: 0.75rem;">Plato de pesaje listo. Tarado en 0.000 g.</div>
        </div>
      `;
    }

    if (toolKey === 'termometro') {
      const temp = this.state.heatActive ? 86.4 : 21.5;
      return `
        <div style="text-align: center;">
          <div class="thermometer-display" id="chamberTempDisplay">
            ${temp.toFixed(1)} °C
          </div>
          <button class="tool-action-btn" style="margin: 0 auto; background: #0284c7;" onclick="App.simulateMeasureTemp()">
            🌡️ Leer Temperatura en Vivo de la Cámara
          </button>
          <div id="tempStatusMsg" style="font-size: 0.78rem; color: #a5f3fc; margin-top: 0.75rem;">
            ${this.state.heatActive ? '🔥 Advertencia: Temperatura elevada por acción del mechero.' : '❄️ Temperatura ambiente estable (21.5 °C).'}
          </div>
        </div>
      `;
    }

    if (toolKey === 'phmetro') {
      const ph = this.state.heatActive ? 7.0 : (this.state.particles.length > 0 ? 8.2 : 7.0);
      return `
        <div style="text-align: center;">
          <div class="ph-gauge-display" id="chamberPhDisplay" style="color: ${ph === 7.0 ? '#22c55e' : (ph < 7 ? '#ef4444' : '#38bdf8')};">
            pH ${ph.toFixed(2)}
          </div>
          <button class="tool-action-btn" style="margin: 0 auto; background: #16a34a;" onclick="App.simulateMeasurePH()">
            📊 Sumergir Electrodo y Medir pH
          </button>
          <div id="phStatusMsg" style="font-size: 0.78rem; color: #86efac; margin-top: 0.75rem;">
            Disolución neutra (pH = 7.00). Iones [H⁺] y [OH⁻] en equilibrio estricto.
          </div>
        </div>
      `;
    }

    if (toolKey === 'espatula') {
      return `
        <div style="text-align: center;">
          <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 0.75rem;">Tome una muestra de cristales sólidos para inspección morfológica:</p>
          <button class="tool-action-btn" style="margin: 0 auto; background: #64748b;" onclick="App.simulateSpatulaSampling()">
            🥄 Tomar Muestra de Cristales con Espátula
          </button>
          <div id="spatulaStatusMsg" style="font-size: 0.78rem; color: #cbd5e1; margin-top: 0.75rem;">Espátula esterilizada lista para muestreo.</div>
        </div>
      `;
    }

    return '<p>Herramienta disponible en la mesa.</p>';
  },

  // Acciones interactivas simuladas en la mesa (RF008)
  simulatePipetteDose(vol) {
    const p = this.practices[this.state.currentPracticeIndex];
    const elem = ReactionEngine.elements[p.reactant1] || ReactionEngine.elements['Na'];
    this.spawnParticles(elem, 4);

    const msg = `Se dosificaron ${vol}.0 mL de reactivo (${elem.name}) en la cámara de reacción mediante pipeta graduada.`;
    const statusEl = document.getElementById('pipetteStatusMsg');
    if (statusEl) statusEl.innerText = `✅ ${msg}`;

    document.getElementById('chamberSubtext').innerText = `• Dosificados ${vol}.0 mL con pipeta graduada`;
    document.getElementById('labLogText').innerText = msg;
    this.showDialog(msg, 'Pipeta Graduada en Acción', '💧');
  },

  simulateErlenmeyerShake() {
    this.state.particles.forEach(p => {
      p.vx = (Math.random() - 0.5) * 4;
      p.vy = (Math.random() - 0.5) * 4;
    });

    if (this.state.particles.length >= 4) {
      this.synthesizeMolecules();
    }

    const msg = 'Se realizó agitación orbital continua en el matraz Erlenmeyer. Las partículas entraron en contacto homogéneo aumentando la probabilidad de colisión reactiva.';
    const statusEl = document.getElementById('erlenmeyerStatusMsg');
    if (statusEl) statusEl.innerText = `✅ Agitación completada. Vórtice homogéneo.`;

    document.getElementById('chamberSubtext').innerText = '• Mezcla homogenizada por agitación orbital';
    document.getElementById('labLogText').innerText = msg;
    this.showDialog(msg, 'Matraz Erlenmeyer en Acción', '🧪');
  },

  simulateTestTubePrecipitate() {
    const p = this.practices[this.state.currentPracticeIndex];
    const elem2 = ReactionEngine.elements[p.reactant2] || ReactionEngine.elements['Cl'];
    this.spawnParticles(elem2, 3);

    const msg = `Micro-ensayo en tubo de ensayo completado. Se observa cambio de fase y precipitado con reactivo ${elem2.name}.`;
    const statusEl = document.getElementById('tubeStatusMsg');
    if (statusEl) statusEl.innerText = `✅ Precipitado visible en el fondo del tubo de ensayo.`;

    document.getElementById('chamberSubtext').innerText = '• Ensayo cualitativo en tubo completado';
    document.getElementById('labLogText').innerText = msg;
    this.showDialog(msg, 'Tubo de Ensayo en Acción', '🧪');
  },

  setBunsenFlame(type) {
    this.instrumentState.bunsenFlameType = type;
    const msgEl = document.getElementById('bunsenStatusMsg');
    if (msgEl) {
      if (type === 'yellow') {
        msgEl.innerText = '🟡 Llama amarilla regulada (Entrada de aire cerrada • 600 °C con hollín).';
      } else {
        msgEl.innerText = '🔵 Llama azul regulada (Entrada de aire abierta • Combustión completa 1500 °C).';
      }
    }
  },

  simulateBunsenToggle() {
    this.triggerHeat();
    const isHeat = this.state.heatActive;
    const btnText = isHeat ? 'Apagar Mechero en la Mesa' : 'Encender Mechero Bunsen';
    const msgEl = document.getElementById('bunsenStatusMsg');
    if (msgEl) {
      msgEl.innerText = isHeat
        ? '🔥 Mechero encendido: Llama azul oxidante entregando 1500 °C a la cámara.'
        : '• Mechero apagado: Se suspende el calentamiento térmico.';
    }
    this.showDialog(
      isHeat
        ? 'Mechero Bunsen encendido con éxito.\nSe incrementó la energía térmica en la cámara. Observe cómo los átomos aceleran su velocidad de colisión molecular.'
        : 'Mechero Bunsen apagado.\nLa cámara retorna a temperatura ambiente controlada.',
      'Control del Mechero Bunsen',
      '🔥'
    );
  },

  simulateTareScale() {
    this.instrumentState.scaleGrams = 0.000;
    this.instrumentState.isScaleTared = true;
    const disp = document.getElementById('digitalScaleDisplay');
    if (disp) disp.innerText = '0.000 g';
    const statusEl = document.getElementById('scaleStatusMsg');
    if (statusEl) statusEl.innerText = '✅ Balanza tarada a cero exacto (0.000 g) con vidrio de reloj.';
  },

  simulateWeighReagent(symbol, grams) {
    this.instrumentState.scaleGrams = grams;
    const disp = document.getElementById('digitalScaleDisplay');
    if (disp) disp.innerText = `${grams.toFixed(3)} g`;

    const statusEl = document.getElementById('scaleStatusMsg');
    if (statusEl) statusEl.innerText = `✅ Muestra pesada: ${grams.toFixed(3)} g de ${symbol}.`;

    const elem = ReactionEngine.elements[symbol] || ReactionEngine.elements['Na'];
    if (elem) {
      this.spawnParticles(elem, 4);
    }

    const msg = `Se pesaron ${grams.toFixed(3)} g de ${symbol} en la balanza digital y se transfirieron a la cámara para la reacción.`;
    document.getElementById('chamberSubtext').innerText = `• Reactivo ${symbol} pesado y transferido`;
    document.getElementById('labLogText').innerText = msg;
    this.showDialog(msg, 'Balanza Analítica Digital', '⚖️');
  },

  simulateMeasureTemp() {
    const temp = this.state.heatActive ? 86.4 : 21.5;
    const disp = document.getElementById('chamberTempDisplay');
    if (disp) disp.innerText = `${temp.toFixed(1)} °C`;

    const msg = this.state.heatActive
      ? `Temperatura de la cámara: ${temp.toFixed(1)} °C.\nIndica una reacción exotérmica activa potenciada por el mechero Bunsen.`
      : `Temperatura de la cámara: ${temp.toFixed(1)} °C.\nCondiciones isotérmicas estándar de laboratorio escolar.`;

    const statusEl = document.getElementById('tempStatusMsg');
    if (statusEl) statusEl.innerText = `Lectura estabilizada: ${temp.toFixed(1)} °C`;

    this.showDialog(msg, 'Termómetro Digital de Laboratorio', '🌡️');
  },

  simulateMeasurePH() {
    const p = this.practices[this.state.currentPracticeIndex];
    let ph = 7.0;
    if (p.reactant1 === 'Na') ph = 7.0; // Sal neutra
    else if (p.reactant1 === 'H') ph = 7.0; // Agua pura neutra

    const disp = document.getElementById('chamberPhDisplay');
    if (disp) disp.innerText = `pH ${ph.toFixed(2)}`;

    const msg = `Medición potenciométrica de pH: ${ph.toFixed(2)}.\nLa solución se encuentra en equilibrio neutro ([H⁺] = [OH⁻] = 10⁻⁷ M).`;
    const statusEl = document.getElementById('phStatusMsg');
    if (statusEl) statusEl.innerText = `Valor registrado: pH ${ph.toFixed(2)} (Neutralidad)`;

    this.showDialog(msg, 'Sensor de pH Digital', '📊');
  },

  simulateSpatulaSampling() {
    const p = this.practices[this.state.currentPracticeIndex];
    const msg = `Se tomó una alícuota sólida con la espátula acanalada y se depositó en el vidrio de reloj para su observación de red cristalina (${p.equation.split('→')[1] || 'Producto'}).`;
    const statusEl = document.getElementById('spatulaStatusMsg');
    if (statusEl) statusEl.innerText = '✅ Muestra transferida al vidrio de reloj sin contaminación.';

    document.getElementById('labLogText').innerText = msg;
    this.showDialog(msg, 'Espátula & Vidrio de Reloj', '🥄');
  },

  // Compatibilidad hacia atrás de useTool
  useTool(toolName) {
    this.openToolGuide(toolName);
  },

  // Activar o desactivar calor del mechero
  triggerHeat() {
    this.state.heatActive = !this.state.heatActive;
    const factor = this.state.heatActive ? 2.5 : 1.0;

    this.state.particles.forEach(p => {
      p.speed = p.baseSpeed * factor;
    });

    const sub = document.getElementById('chamberSubtext');
    if (this.state.heatActive) {
      sub.innerText = '🔥 Mechero encendido: Reacción activada térmicamente';
      setTimeout(() => {
        if (this.state.particles.length >= 6) {
          this.synthesizeMolecules();
        }
      }, 1000);
    } else {
      sub.innerText = '• Mechero apagado: Temperatura ambiente';
    }
  },

  // Reiniciar la simulación en la mesa
  resetSimulation() {
    this.state.particles = [];
    this.state.currentStepIndex = 0;
    this.state.heatActive = false;
    document.getElementById('particleCounter').innerText = 'Partículas activas: 0';
    document.getElementById('chamberSubtext').innerText = '• Cámara vacía y limpia';
    document.getElementById('labLogText').innerText = 'Mesa de trabajo restablecida. Seleccione una práctica o ejecute el Paso 1.';
    document.getElementById('experimentStatusBadge').className = 'status-tag status-pending';
    document.getElementById('experimentStatusBadge').innerText = 'Mesa Limpia';
    this.renderCurrentPracticeSteps();
    this.updateReactionAnalysis();
  },

  // Motor de física molecular Canvas
  setupCanvas() {
    this.canvas = document.getElementById('molecularCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  },

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width || 600;
    this.canvas.height = rect.height || 300;
  },

  spawnParticles(element, count) {
    const w = this.canvas.width;
    const h = this.canvas.height;

    for (let i = 0; i < count; i++) {
      this.state.particles.push({
        x: Math.random() * (w - 60) + 30,
        y: Math.random() * (h - 60) + 30,
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.8,
        baseSpeed: 1.5,
        speed: 1.5,
        radius: Math.max(12, Math.min(22, element.radius / 7)),
        symbol: element.symbol,
        color: element.color,
        en: element.en,
        bondedWith: null,
        pulse: Math.random() * Math.PI
      });
    }

    document.getElementById('particleCounter').innerText = `Partículas activas: ${this.state.particles.length}`;
  },

  synthesizeMolecules() {
    const parts = this.state.particles;
    for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j < parts.length; j++) {
        if (!parts[i].bondedWith && !parts[j].bondedWith && parts[i].symbol !== parts[j].symbol) {
          parts[i].bondedWith = parts[j];
          parts[j].bondedWith = parts[i];
          break;
        }
      }
    }
  },

  startCanvasAnimation() {
    const render = () => {
      this.updateParticles();
      this.drawParticles();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  },

  updateParticles() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const parts = this.state.particles;

    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      p.pulse += 0.05;

      if (p.bondedWith) {
        const dx = p.bondedWith.x - p.x;
        const dy = p.bondedWith.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const targetDist = p.radius + p.bondedWith.radius + 6;

        if (dist > targetDist) {
          p.x += (dx / dist) * 1.2;
          p.y += (dy / dist) * 1.2;
        }
      }

      p.x += p.vx * (p.speed || 1);
      p.y += p.vy * (p.speed || 1);

      if (p.x - p.radius < 0) { p.x = p.radius; p.vx *= -1; }
      if (p.x + p.radius > w) { p.x = w - p.radius; p.vx *= -1; }
      if (p.y - p.radius < 0) { p.y = p.radius; p.vy *= -1; }
      if (p.y + p.radius > h) { p.y = h - p.radius; p.vy *= -1; }
    }
  },

  drawParticles() {
    const ctx = this.ctx;
    if (!ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Fondo reticular estilo laboratorio digital
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const parts = this.state.particles;

    // Dibujar enlaces químicos entre átomos enlazados
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (p.bondedWith && parts.indexOf(p.bondedWith) > i) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.bondedWith.x, p.bondedWith.y);
        ctx.stroke();

        const midX = (p.x + p.bondedWith.x) / 2;
        const midY = (p.y + p.bondedWith.y) / 2;
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(midX, midY, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Dibujar cada átomo/partícula con gradiente esférico
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];

      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x - p.radius * 0.3, p.y - p.radius * 0.3, p.radius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = (p.symbol === 'H' || p.color === '#FFFFFF') ? '#0f172a' : '#ffffff';
      ctx.font = `bold ${Math.round(p.radius * 0.9)}px Segoe UI, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.symbol, p.x, p.y);
    }
  },

  // Actualizar datos del ReactionEngine y PubChem
  async updateReactionAnalysis() {
    const p = this.practices[this.state.currentPracticeIndex];
    const elem1 = ReactionEngine.elements[p.reactant1];
    const elem2 = ReactionEngine.elements[p.reactant2];

    const result = ReactionEngine.evaluateBond(elem1, elem2);
    if (!result) return;

    const formulaEl = document.getElementById('formulaDisplay');
    formulaEl.innerHTML = `ΔEN = |${elem2.en} - ${elem1.en}| = <strong>${result.deltaEN}</strong>`;

    const badgeEl = document.getElementById('bondBadge');
    badgeEl.className = `bond-tag bond-${result.category}`;
    badgeEl.innerText = `Enlace ${result.bondType}`;

    const textEl = document.getElementById('bondAnalysisText');
    textEl.innerText = result.explanation;

    const pubchemRes = await PubChemService.getElementData(elem1.symbol);
    document.getElementById('pubchemElem').innerText = `${elem1.symbol} (Z=${elem1.z}) / ${elem2.symbol} (Z=${elem2.z})`;
    document.getElementById('pubchemLatency').innerText = `${pubchemRes.latencyMs} ms (${pubchemRes.isFromCache ? 'en memoria caché' : 'en vivo'})`;
    document.getElementById('pubchemSource').innerText = pubchemRes.data.source;
  },

  // ================= ASISTENTE VIRTUAL "QUIMI" =================
  askQuimiAboutCurrentStep() {
    const assistantTab = document.querySelector('[data-tab="tab-assistant"]');
    if (assistantTab) assistantTab.click();

    const p = this.practices[this.state.currentPracticeIndex];
    const step = p.steps[this.state.currentStepIndex] || p.steps[p.steps.length - 1];
    this.askQuimiPreset(`¿Cuál es el objetivo científico del paso actual ("${step.name}")?`);
  },

  askQuimiPreset(questionText) {
    const chatBox = document.getElementById('quimiChatHistory');
    if (!chatBox) return;

    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.innerText = questionText;
    chatBox.appendChild(userBubble);

    setTimeout(() => {
      const botBubble = document.createElement('div');
      botBubble.className = 'chat-bubble bot';
      botBubble.innerHTML = this.getQuimiResponse(questionText);
      chatBox.appendChild(botBubble);
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 350);

    chatBox.scrollTop = chatBox.scrollHeight;
  },

  getQuimiResponse(question) {
    const p = this.practices[this.state.currentPracticeIndex];

    if (question.includes('¿Por qué reacciona el Sodio con el Cloro')) {
      return `¡Gran pregunta! El <strong>Sodio (Na)</strong> tiene un electrón en su capa más externa y baja electronegatividad (0.93), mientras que el <strong>Cloro (Cl)</strong> posee 7 electrones de valencia y gran electronegatividad (3.16). Al juntarse, ocurre una transferencia neta donde el Sodio cede su electrón para que ambos alcancen el octeto de Lewis estable, formando <strong>NaCl (sal común)</strong>.`;
    }
    if (question.includes('ΔEN')) {
      return `La diferencia de electronegatividad según Linus Pauling clasifica la naturaleza del enlace:<br>
      • Si <strong>ΔEN ≥ 2.0</strong>: Es <em>Iónico</em> (atracción de cationes y aniones).<br>
      • Si <strong>0.4 < ΔEN < 2.0</strong>: Es <em>Covalente Polar</em> (compartición desigual).<br>
      • Si <strong>ΔEN ≤ 0.4</strong>: Es <em>Covalente Apolar</em> (compartición equitativa).`;
    }
    if (question.includes('Mechero Bunsen')) {
      return `El mechero proporciona <strong>energía térmica</strong> para superar la barrera de activación. Aumenta la velocidad de agitación de los átomos hasta que chocan con suficiente impulso cinético para romper enlaces previos y enlazarse.`;
    }
    if (question.includes('seguridad')) {
      return `En un laboratorio físico real, el Sodio reacciona violentamente con la humedad atmosférica y el Cloro gaseoso es corrosivo e irritante. En <strong>QUIMI-K</strong> puedes experimentar cuantas veces desees con total bioseguridad, sin riesgo de quemaduras ni emanaciones tóxicas.`;
    }
    if (question.includes('regla del octeto')) {
      return `Los átomos buscan completar <strong>8 electrones</strong> en su último nivel para adquirir la configuración estable de un gas noble (como el Argón o Neón).`;
    }

    return `En la práctica activa (<strong>${p.title}</strong>), tu meta es observar cómo la interacción atómica modelada por el motor de reacciones sigue leyes físicas y químicas exactas. Puedes continuar avanzando con el botón "Ejecutar Siguiente Paso".`;
  },

  // ================= RF014 & RF015: LIBRO GUÍA Y ENCICLOPEDIA CIENTÍFICA =================
  renderGuideEntries() {
    const container = document.getElementById('guideEntriesContainer');
    if (!container) return;

    const countAllEl = document.getElementById('guideCountAll');
    if (countAllEl) countAllEl.innerText = this.guideEntries.length;

    const q = (this.guideSearchText || '').toLowerCase().trim();
    const cat = this.selectedGuideCategory || 'all';

    const clearBtn = document.getElementById('guideSearchClearBtn');
    if (clearBtn) clearBtn.style.display = q ? 'block' : 'none';

    // Filtrar por categoría y por texto de búsqueda
    const filtered = this.guideEntries.filter(entry => {
      const matchesCategory = cat === 'all' || entry.catKey === cat;
      const matchesQuery = !q ||
        entry.term.toLowerCase().includes(q) ||
        entry.desc.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q) ||
        (entry.formula && entry.formula.toLowerCase().includes(q)) ||
        (entry.procedure && entry.procedure.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });

    const resultsCountEl = document.getElementById('guideResultsCount');
    if (resultsCountEl) resultsCountEl.innerText = filtered.length;

    container.innerHTML = '';

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 3rem 1rem; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 12px;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📖</div>
          <h4 style="color: #334155; margin-bottom: 0.25rem;">No se encontraron temas en el Libro Guía</h4>
          <p style="font-size: 0.85rem; margin-bottom: 1rem;">No hay coincidencias para "${this.guideSearchText}" en la categoría seleccionada.</p>
          <button class="btn btn-secondary" onclick="App.clearGuideSearch()">Ver Todos los Temas</button>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'guide-entry-card';

      const formulaHtml = item.formula ? `<div class="guide-formula-tag">📐 ${item.formula}</div>` : '';
      const procedureHtml = item.procedure ? `
        <div class="guide-procedure-box">
          <strong>🔬 Procedimiento de Lab:</strong> ${item.procedure}
        </div>
      ` : '';

      card.innerHTML = `
        <div>
          <span class="category-pill">${item.category}</span>
          <div class="guide-entry-title" style="margin-top: 0.35rem;">${item.term}</div>
          ${formulaHtml}
          <p style="font-size: 0.82rem; color: #475569; line-height: 1.45; margin-top: 0.35rem;">${item.desc}</p>
          ${procedureHtml}
        </div>
        <div class="guide-card-footer">
          <span style="font-size: 0.72rem; color: #94a3b8;">QUIMI-K Guía Digital</span>
          <button class="guide-read-btn" onclick="App.openGuideModal('${item.id}')">
            📖 Leer Capítulo Completo →
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  },

  filterGuideEntries(val) {
    this.guideSearchText = val;
    this.renderGuideEntries();
  },

  filterGuideCategory(catKey) {
    this.selectedGuideCategory = catKey;
    document.querySelectorAll('.guide-cat-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-cat') === catKey);
    });
    this.renderGuideEntries();
  },

  clearGuideSearch() {
    this.guideSearchText = '';
    const input = document.getElementById('guideSearchInput');
    if (input) input.value = '';
    this.selectedGuideCategory = 'all';
    document.querySelectorAll('.guide-cat-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-cat') === 'all');
    });
    this.renderGuideEntries();
  },

  openGuideModal(id) {
    const item = this.guideEntries.find(e => e.id === id);
    if (!item) return;

    const modal = document.getElementById('modalGuideChapter');
    const titleEl = document.getElementById('guideModalTitle');
    const catEl = document.getElementById('guideModalCategory');
    const bodyEl = document.getElementById('guideModalBody');

    if (!modal) return;

    titleEl.innerText = item.term;
    catEl.innerText = item.category;

    const formulaBanner = item.formula ? `
      <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 1rem; font-family: monospace; font-size: 0.95rem; font-weight: 700; color: #065f46;">
        📐 Fórmula Clave: ${item.formula}
      </div>
    ` : '';

    const procedureBanner = item.procedure ? `
      <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 1.25rem; font-size: 0.85rem; color: #0369a1; line-height: 1.45;">
        <strong>🔬 Procedimiento Experimental Recomendado:</strong><br>
        ${item.procedure}
      </div>
    ` : '';

    bodyEl.innerHTML = `
      ${formulaBanner}
      <div style="margin-bottom: 1rem; font-size: 0.92rem; color: #1e293b; line-height: 1.5;">
        <strong>Resumen Conceptual:</strong> ${item.desc}
      </div>
      ${procedureBanner}
      <div style="border-top: 1px solid #e2e8f0; padding-top: 1rem;">
        ${item.fullContent || '<p>Contenido detallado disponible en la biblioteca digital del colegio.</p>'}
      </div>
    `;

    modal.style.display = 'flex';
  },

  closeGuideModal() {
    const modal = document.getElementById('modalGuideChapter');
    if (modal) modal.style.display = 'none';
  },

  // ================= EVALUACIÓN Y REPORTES =================
  goToQuiz() {
    const quizTab = document.querySelector('[data-tab="tab-quiz"]');
    if (quizTab) quizTab.click();
  },

  getActiveQuizQuestions() {
    if (this.activeTakingQuizType === 'practice' || !this.activeTakingQuizType) {
      return this.practices[this.state.currentPracticeIndex].quiz;
    }
    const customEval = this.evaluations.find(e => e.id === this.activeTakingQuizType);
    if (customEval && customEval.questions && customEval.questions.length > 0) {
      return customEval.questions;
    }
    return this.practices[this.state.currentPracticeIndex].quiz;
  },

  getActiveQuizTitle() {
    if (this.activeTakingQuizType === 'practice' || !this.activeTakingQuizType) {
      return this.practices[this.state.currentPracticeIndex].title;
    }
    const customEval = this.evaluations.find(e => e.id === this.activeTakingQuizType);
    if (customEval) {
      return customEval.title;
    }
    return this.practices[this.state.currentPracticeIndex].title;
  },

  populateQuizSelector() {
    const sel = document.getElementById('activeQuizSelector');
    if (!sel) return;

    const p = this.practices[this.state.currentPracticeIndex];
    let html = `<option value="practice">🔬 Práctica de Laboratorio: ${p.title}</option>`;

    const publishedEvals = this.evaluations.filter(e => e.status === 'published');
    publishedEvals.forEach(e => {
      const salons = e.targetClassrooms.map(c => this.getClassroomName(c)).join(', ');
      html += `<option value="${e.id}">📝 [Docente] ${e.title} (Salón: ${salons})</option>`;
    });

    sel.innerHTML = html;
    sel.value = this.activeTakingQuizType || 'practice';
  },

  handleQuizSelectorChange(val) {
    this.activeTakingQuizType = val;
    this.renderQuiz();
  },

  renderQuiz() {
    const questions = this.getActiveQuizQuestions();
    const container = document.getElementById('quizQuestionsContainer');
    if (!container) return;

    container.innerHTML = '';
    questions.forEach((q, qIndex) => {
      const qCard = document.createElement('div');
      qCard.className = 'question-card';

      let optsHtml = '';
      q.options.forEach((opt, oIndex) => {
        optsHtml += `
          <label class="option-item">
            <input type="radio" name="question_${qIndex}" value="${oIndex}" required>
            <span>${opt}</span>
          </label>
        `;
      });

      qCard.innerHTML = `
        <div class="question-text">${q.question}</div>
        <div class="options-list">${optsHtml}</div>
      `;
      container.appendChild(qCard);
    });

    document.getElementById('quizResultPlaceholder').style.display = 'block';
    document.getElementById('quizResultDisplay').style.display = 'none';
  },

  submitQuiz(event) {
    event.preventDefault();
    const questions = this.getActiveQuizQuestions();
    const quizTitle = this.getActiveQuizTitle();
    let correctCount = 0;

    questions.forEach((q, qIndex) => {
      const selected = document.querySelector(`input[name="question_${qIndex}"]:checked`);
      if (selected && parseInt(selected.value) === q.answer) {
        correctCount++;
      }
    });

    const totalQuestions = questions.length;
    const finalScore = Math.round((correctCount / totalQuestions) * 20);
    this.state.quizScore = finalScore;

    const isPassed = finalScore >= 14;

    document.getElementById('quizResultPlaceholder').style.display = 'none';
    const displayEl = document.getElementById('quizResultDisplay');
    displayEl.style.display = 'block';

    const scoreNumEl = document.getElementById('scoreNumber');
    scoreNumEl.innerText = `${finalScore} / 20`;
    scoreNumEl.style.color = isPassed ? '#16a34a' : '#dc2626';

    const badgeEl = document.getElementById('scoreBadge');
    badgeEl.className = `status-tag ${isPassed ? 'status-passed' : 'status-pending'}`;
    badgeEl.innerText = isPassed ? '¡APROBADO!' : 'DESAPROBADO';

    const feedbackEl = document.getElementById('quizFeedbackText');
    feedbackEl.innerHTML = `
      <strong>Retroalimentación Automática:</strong> Acertaste ${correctCount} de ${totalQuestions} preguntas.<br>
      ${isPassed ? 'Demostraste dominio cabal de los conceptos evaluados en la práctica y cuestionario docente.' : 'Se recomienda repasar los conceptos en el Libro Guía y consultar al Asistente Quimi antes de volver a intentar.'}
    `;

    // Registrar en el salón 4to A (donde está matriculado Juan Pérez)
    const class4A = this.classrooms.find(c => c.id === '4A');
    if (class4A) {
      class4A.students = class4A.students.filter(s => !s.name.includes('Juan Pérez'));
      class4A.students.unshift({
        name: 'Juan Pérez (Tú)',
        practice: quizTitle.split('(')[0].trim(),
        attempts: 1,
        score: finalScore,
        status: isPassed ? 'Aprobado' : 'Desaprobado',
        date: new Date().toLocaleString()
      });
      if (this.activeClassroomId === '4A') {
        this.renderClassroomStudents(class4A);
      }
    }

    if (this.state.currentUser) {
      this.syncScoreToDb({
        userId: this.state.currentUser.id,
        classroomId: this.state.currentUser.classroomId || '4A',
        score: finalScore,
        attempts: 1,
        status: isPassed ? 'Aprobado' : 'Desaprobado',
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().slice(0, 5)
      });
    }

    this.showDialog(`Evaluación calificada con éxito.\nPuntaje obtenido: ${finalScore} / 20 (${isPassed ? 'Aprobado' : 'Desaprobado'}).\nPuede descargar o imprimir su reporte formal en PDF.`, isPassed ? '¡Evaluación Aprobada!' : 'Evaluación Finalizada', isPassed ? '🎉' : '📝');
  },

  generatePdfReport() {
    const quizTitle = this.getActiveQuizTitle();
    const p = this.practices[this.state.currentPracticeIndex];
    const score = this.state.quizScore !== null ? this.state.quizScore : 18;

    document.getElementById('pdfDate').innerText = new Date().toLocaleDateString();
    document.getElementById('pdfStudentName').innerText = 'Juan Pérez (4to Secundaria Fleming)';
    document.getElementById('pdfPracticeName').innerText = quizTitle;
    document.getElementById('pdfGrade').innerText = `${score} / 20 (${score >= 14 ? 'Aprobado' : 'Desaprobado'})`;
    document.getElementById('pdfSummary').innerText = `Evaluación: ${quizTitle}. Validación científica de conceptos de enlace y reactividad química completada bajo entorno web seguro.`;

    window.print();
  },

  // ================= GESTIÓN DE SALONES SEPARADOS (PANEL DOCENTE - RULETA HORIZONTAL) =================
  renderClassroomsOverview() {
    const container = document.getElementById('classroomsCardsContainer');
    if (!container) return;

    container.innerHTML = '';

    // Renderizar tarjetas de cada salón
    this.classrooms.forEach(c => {
      const totalStudents = c.students.length;
      const passedCount = c.students.filter(s => s.score >= 14).length;
      const passRate = totalStudents > 0 ? Math.round((passedCount / totalStudents) * 100) : 100;
      const avgScore = totalStudents > 0 ? (c.students.reduce((acc, s) => acc + s.score, 0) / totalStudents).toFixed(1) : 0;

      const card = document.createElement('div');
      card.className = 'classroom-card';
      card.innerHTML = `
        <div>
          <div class="classroom-card-top">
            <div class="classroom-icon-box">🏫</div>
            <div>
              <div class="classroom-card-title">${c.name}</div>
              <div class="classroom-card-sub">${c.level}</div>
            </div>
          </div>

          <div class="classroom-info-list">
            <div class="classroom-info-item">
              <span>Práctica Asignada:</span>
              <strong>${c.assignedPractice}</strong>
            </div>
            <div class="classroom-info-item">
              <span>Alumnos Registrados:</span>
              <strong>${totalStudents} alumnos</strong>
            </div>
            <div class="classroom-info-item">
              <span>Promedio de Notas:</span>
              <strong style="color: #2563eb;">${avgScore} / 20</strong>
            </div>
            <div class="classroom-info-item">
              <span>Tasa de Aprobación:</span>
              <strong style="color: #16a34a;">${passRate}%</strong>
            </div>
          </div>
        </div>

        <button class="btn btn-primary" style="width: 100%; justify-content: center;" onclick="App.enterClassroom('${c.id}')">
          👉 Ingresar a este Salón
        </button>
      `;
      container.appendChild(card);
    });

    // TARJETA ACCIONABLE RULETA: "+ CREAR SALÓN"
    const createCard = document.createElement('div');
    createCard.className = 'classroom-card classroom-card-create';
    createCard.onclick = () => this.openCreateClassroomModal();
    createCard.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 1.5rem 0.5rem; text-align: center;">
        <div style="width: 68px; height: 68px; border-radius: 50%; background: #dcfce7; border: 2px dashed #16a34a; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; margin-bottom: 1.25rem;">
          ➕
        </div>
        <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0 0 0.5rem 0;">Crear Salón</h3>
        <p style="font-size: 0.82rem; color: #64748b; margin: 0 0 1.5rem 0; line-height: 1.45; max-width: 230px;">
          Añade una nueva aula institucional al colegio y asígnale su práctica de laboratorio.
        </p>
        <button class="btn btn-success" style="font-size: 0.88rem; padding: 0.6rem 1.25rem; pointer-events: none;">
          ➕ Crear Salón
        </button>
      </div>
    `;
    container.appendChild(createCard);

    // Actualizar contador del carrusel si existe
    const counterEl = document.getElementById('classroomsCarouselCounter');
    if (counterEl) {
      counterEl.innerText = `${this.classrooms.length} Salón${this.classrooms.length === 1 ? '' : 'es'} Registrado${this.classrooms.length === 1 ? '' : 's'}`;
    }
  },

  scrollClassroomsCarousel(direction) {
    const container = document.getElementById('classroomsCardsContainer');
    if (!container) return;
    const scrollAmount = 360 * direction;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  },


  // ================= VISTA DE SALÓN PARA EL ESTUDIANTE =================
  selectedStudentSalonId: null,

  selectStudentSalon(salonId) {
    this.selectedStudentSalonId = salonId;
    this.renderStudentSalonView();
  },

  renderStudentSalonView() {
    const container = document.getElementById('studentSalonContainer');
    if (!container) return;

    const user = this.state.currentUser;
    if (!user) {
      container.innerHTML = `
        <div class="access-denied-card" style="margin: 2rem auto; max-width: 600px;">
          <div class="access-icon">🔒</div>
          <h3>Inicie Sesión para Acceder a su Salón</h3>
          <p>Debe autenticarse con sus credenciales institucionales para verificar los salones a los que tiene permiso de ingresar.</p>
        </div>
      `;
      return;
    }

    // Buscar TODOS los salones a los que el estudiante tiene permiso de ingresar
    const mySalons = this.classrooms.filter(c => {
      if (c.id === user.classroomId || c.name === user.classroom) return true;
      if (c.students && c.students.some(s => s.id === user.id || s.name.replace(' (Tú)', '').trim() === user.name.trim())) return true;
      return false;
    });

    // Actualizar indicador en la barra lateral
    const navStudentSalonHint = document.getElementById('navStudentSalonHint');
    if (navStudentSalonHint) {
      if (mySalons.length === 0) {
        navStudentSalonHint.innerText = 'Sin Salón';
      } else if (mySalons.length === 1) {
        navStudentSalonHint.innerText = mySalons[0].name;
      } else {
        navStudentSalonHint.innerText = `${mySalons.length} Salones Asignados`;
      }
    }

    if (mySalons.length === 0) {
      container.innerHTML = `
        <div style="background: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; padding: 2.5rem 2rem; text-align: center; max-width: 650px; margin: 2rem auto; box-shadow: var(--shadow-sm);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🏫</div>
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">Sin Salón Asignado Actualmente</h2>
          <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Hola <strong>${user.name}</strong>, tu cuenta institucional aún no ha sido agregada a ningún salón de clases activo en la plataforma.
          </p>
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 1rem; color: #1e40af; font-size: 0.85rem; margin-bottom: 1.5rem;">
            💡 Tu docente (<strong>Prof. Midori Judith Castillo Peralta</strong>) puede agregarte desde su Panel de Salones usando el buscador y cuadro de selección de alumnos.
          </div>
          <button class="btn btn-primary" onclick="App.goToSimulatorFromSalon()">
            🔬 Ir a Experimentación en Mesa de Laboratorio
          </button>
        </div>
      `;
      return;
    }

    // Determinar el salón activo seleccionado
    if (!this.selectedStudentSalonId || !mySalons.some(s => s.id === this.selectedStudentSalonId)) {
      this.selectedStudentSalonId = mySalons[0].id;
    }

    const salon = mySalons.find(s => s.id === this.selectedStudentSalonId) || mySalons[0];

    // Datos del alumno en este salón específico
    const classmates = salon.students || [];
    const studentData = classmates.find(s => s.id === user.id || s.name.replace(' (Tú)', '').trim() === user.name.trim()) || user;
    const scoreVal = typeof studentData.score === 'number' ? studentData.score : (typeof user.score === 'number' ? user.score : 18);
    const attemptsVal = studentData.attempts || user.attempts || 1;
    const statusVal = studentData.status || user.status || 'Aprobado';
    const practiceName = salon.assignedPractice || user.practice || 'Síntesis de NaCl (Enlace Iónico)';

    // Renderizar selector de salones si el estudiante tiene 2 o más salones
    let multiSalonSelectorHtml = '';
    if (mySalons.length > 1) {
      multiSalonSelectorHtml = `
        <div style="background: #ffffff; border-radius: 12px; border: 1px solid #cbd5e1; padding: 0.85rem 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; box-shadow: var(--shadow-sm); width: 100%; box-sizing: border-box;">
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <div style="width: 38px; height: 38px; border-radius: 10px; background: #e0f2fe; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">🏫</div>
            <div>
              <strong style="font-size: 0.95rem; color: #0f172a; display: block;">Mis Salones de Clase Autorizados</strong>
              <span style="font-size: 0.78rem; color: #64748b;">Tienes permiso de ingreso en <strong>${mySalons.length} salones</strong> activos. Haz clic en un salón para cambiar de aula:</span>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${mySalons.map(s => {
              const isCurrent = s.id === salon.id;
              return `
                <button class="btn ${isCurrent ? 'btn-primary' : 'btn-outline'}" 
                        style="font-size: 0.84rem; padding: 0.45rem 0.95rem; display: flex; align-items: center; gap: 0.4rem; font-weight: 700; cursor: pointer; ${isCurrent ? 'box-shadow: 0 2px 8px rgba(37,99,235,0.3); border-color: #2563eb;' : ''}" 
                        onclick="App.selectStudentSalon('${s.id}')">
                  <span>🏫 ${s.name}</span>
                  <span style="font-size: 0.72rem; opacity: 0.85; background: ${isCurrent ? 'rgba(255,255,255,0.25)' : '#e2e8f0'}; padding: 0.1rem 0.45rem; border-radius: 999px;">
                    ${s.students ? s.students.length : 0} alumnos
                  </span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem; width: 100%;">
        
        <!-- SELECTOR DE SALONES MÚLTIPLES (SI TIENE 2 O MÁS) -->
        ${multiSalonSelectorHtml}

        <!-- BANNER DE BIENVENIDA AL SALÓN ACTIVO -->
        <div class="section-banner" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-color: #bfdbfe; width: 100%; box-sizing: border-box;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
              <span class="badge-role badge-role-student" style="font-size: 0.72rem; padding: 0.2rem 0.6rem; background: #dcfce7; color: #166534; border: 1px solid #86efac; font-weight: 700;">
                ✓ Acceso Autorizado al Salón
              </span>
              <span style="font-size: 0.78rem; color: #64748b;">I.E. Alexander Fleming • Tacna</span>
            </div>
            <h2 style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin: 0;">
              Bienvenido a tu Salón: <span style="color: #2563eb;">${salon.name}</span>
            </h2>
            <p style="font-size: 0.85rem; color: #475569; margin: 0.35rem 0 0 0;">
              Estudiante: <strong>${user.name}</strong> • Tutor a cargo: <strong>${salon.tutor || 'Prof. Midori Judith Castillo Peralta'}</strong>
            </p>
          </div>

          <button class="btn btn-primary" style="font-weight: 700; padding: 0.75rem 1.4rem; font-size: 0.92rem; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25); display: flex; align-items: center; gap: 0.5rem;" onclick="App.goToSimulatorFromSalon('${practiceName}')">
            <span>🔬 Ingresar a Mesa de Laboratorio</span>
            <span>→</span>
          </button>
        </div>

        <!-- GRID PRINCIPAL DEL SALÓN -->
        <div style="display: grid; grid-template-columns: 1.35fr 1fr; gap: 1.25rem; align-items: start; width: 100%;">
          
          <!-- TARJETA DETALLES DEL SALÓN Y PRÁCTICA -->
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            
            <!-- TARJETA DEL SALÓN -->
            <div style="background: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; padding: 1.5rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
                <div style="display: flex; align-items: center; gap: 0.85rem;">
                  <div style="width: 52px; height: 52px; border-radius: 12px; background: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; box-shadow: 0 2px 6px rgba(2, 132, 199, 0.15);">
                    🏫
                  </div>
                  <div>
                    <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0;">${salon.name}</h3>
                    <span style="font-size: 0.8rem; color: #64748b;">${salon.level}</span>
                  </div>
                </div>
                <span class="badge-role badge-role-student" style="font-size: 0.75rem;">
                  ${classmates.length} Alumnos en tu aula
                </span>
              </div>

              <!-- PRÁCTICA ASIGNADA POR LA PROFESORA -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.15rem; margin-bottom: 1.25rem;">
                <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px; margin-bottom: 0.35rem;">
                  🧪 Práctica de Laboratorio Asignada por la Docente
                </div>
                <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">
                  ${practiceName}
                </div>
                <p style="font-size: 0.82rem; color: #475569; margin: 0; line-height: 1.45;">
                  Esta es la práctica obligatoria programada para tu aula. Puedes ingresar a la <strong>Mesa de Laboratorio</strong> (sub-módulo ubicado abajo) para experimentar en la cámara molecular y luego validar tu aprendizaje.
                </p>
              </div>

              <div style="display: flex; gap: 0.75rem;">
                <button class="btn btn-primary" style="flex: 1; justify-content: center;" onclick="App.goToSimulatorFromSalon('${practiceName}')">
                  🔬 Ir a Mesa de Laboratorio
                </button>
                <button class="btn btn-secondary" onclick="App.goToQuizFromSalon()">
                  📝 Ir a Evaluación
                </button>
              </div>
            </div>

            <!-- MI RENDIMIENTO EN ESTE SALÓN -->
            <div style="background: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; padding: 1.25rem 1.5rem; box-shadow: var(--shadow-sm);">
              <h4 style="font-size: 0.95rem; font-weight: 800; color: #0f172a; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                <span>📊 Tu Desempeño en el Salón</span>
              </h4>

              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; text-align: center;">
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.85rem 0.5rem;">
                  <span style="font-size: 0.72rem; color: #64748b; display: block; margin-bottom: 0.25rem;">Calificación</span>
                  <strong style="font-size: 1.35rem; color: #0284c7; font-weight: 800;">${scoreVal} / 20</strong>
                </div>

                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.85rem 0.5rem;">
                  <span style="font-size: 0.72rem; color: #64748b; display: block; margin-bottom: 0.25rem;">Intentos</span>
                  <strong style="font-size: 1.35rem; color: #0f172a; font-weight: 800;">${attemptsVal}</strong>
                </div>

                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.85rem 0.5rem;">
                  <span style="font-size: 0.72rem; color: #64748b; display: block; margin-bottom: 0.25rem;">Estado Oficial</span>
                  <span class="status-pill status-approved" style="font-size: 0.75rem; padding: 0.25rem 0.5rem; display: inline-block;">
                    ${statusVal}
                  </span>
                </div>
              </div>
            </div>

          </div>

          <!-- COMPAÑEROS DE SALÓN -->
          <div style="background: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; padding: 1.25rem 1.5rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
              <h4 style="font-size: 0.95rem; font-weight: 800; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                <span>👥 Mis Compañeros de Aula</span>
              </h4>
              <span style="font-size: 0.75rem; color: #64748b;">${classmates.length} inscritos</span>
            </div>

            <div style="max-height: 420px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; padding-right: 0.25rem;">
              ${classmates.map(c => {
                const isMe = c.id === user.id || c.name.replace(' (Tú)', '').trim() === user.name.trim();
                const initials = c.name.replace(' (Tú)', '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                return `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.75rem; border-radius: 8px; background: ${isMe ? '#eff6ff' : '#f8fafc'}; border: 1px solid ${isMe ? '#bfdbfe' : '#e2e8f0'};">
                    <div style="display: flex; align-items: center; gap: 0.6rem;">
                      <div class="student-invite-avatar" style="width: 32px; height: 32px; font-size: 0.72rem; background: ${isMe ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#94a3b8'};">
                        ${initials}
                      </div>
                      <div>
                        <strong style="color: #0f172a; font-size: 0.82rem; display: block;">
                          ${c.name.replace(' (Tú)', '')} ${isMe ? '<span style="color: #2563eb; font-size: 0.72rem; font-weight: 700;">(Tú)</span>' : ''}
                        </strong>
                        <span style="font-size: 0.72rem; color: #64748b;">${c.practice || practiceName}</span>
                      </div>
                    </div>
                    <span style="font-weight: 700; color: #0284c7; font-size: 0.8rem;">
                      ${c.score || 18} / 20
                    </span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

        </div>

      </div>
    `;
  },

  goToSimulatorFromSalon(practiceName) {
    if (practiceName) {
      const practiceIndex = this.practices.findIndex(p => p.name === practiceName || practiceName.includes(p.name));
      if (practiceIndex !== -1) {
        this.selectPractice(practiceIndex);
      }
    }
    const simTab = document.querySelector('.sidebar-nav-item[data-tab="tab-simulator"]');
    if (simTab) simTab.click();
  },

  goToQuizFromSalon() {
    const quizTab = document.querySelector('.sidebar-nav-item[data-tab="tab-quiz"]');
    if (quizTab) quizTab.click();
  },

  // Conjuntos reactivos para selección e invitación de alumnos
  createSalonSelectedStudentIds: new Set(),
  rosterSelectedIds: new Set(),
  rosterTargetMode: 'create', // 'create' | 'existing'

  openCreateClassroomModal() {
    const modal = document.getElementById('modalCreateClassroom');
    if (!modal) return;

    this.createSalonSelectedStudentIds = new Set();
    this.renderCreateSalonSelectedChips();
    modal.style.display = 'flex';
  },

  closeCreateClassroomModal() {
    const modal = document.getElementById('modalCreateClassroom');
    if (modal) modal.style.display = 'none';
    if (!this.createSalonSelectedStudentIds) this.createSalonSelectedStudentIds = new Set();
    this.createSalonSelectedStudentIds.clear();
    this.renderCreateSalonSelectedChips();
  },

  renderCreateSalonSelectedChips() {
    const container = document.getElementById('createSalonSelectedChipsContainer');
    const badge = document.getElementById('createSalonSelectedCountBadge');
    if (!container) return;

    if (!this.createSalonSelectedStudentIds) this.createSalonSelectedStudentIds = new Set();
    const count = this.createSalonSelectedStudentIds.size;

    if (badge) {
      badge.innerText = `${count} alumno${count === 1 ? '' : 's'} seleccionado${count === 1 ? '' : 's'}`;
    }

    if (count === 0) {
      container.innerHTML = `
        <div id="createSalonChipsPlaceholder" style="font-size: 0.78rem; color: #64748b; padding: 0.25rem 0.35rem;">
          Ningún alumno seleccionado aún. Presione el botón de arriba para abrir el cuadro con todos los alumnos de Fleming.
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    this.createSalonSelectedStudentIds.forEach(id => {
      const u = this.registeredUsers.find(user => user.id === id);
      if (u) {
        const chip = document.createElement('span');
        chip.className = 'student-chip';
        chip.innerHTML = `
          <span>👤 ${u.name}</span>
          <span class="student-chip-remove" onclick="App.removeStudentChipFromCreateSalon('${u.id}')" title="Quitar de este salón">✕</span>
        `;
        container.appendChild(chip);
      }
    });
  },

  removeStudentChipFromCreateSalon(studentId) {
    if (this.createSalonSelectedStudentIds) {
      this.createSalonSelectedStudentIds.delete(studentId);
    }
    this.renderCreateSalonSelectedChips();
  },

  // ================= CUADRO DEDICADO: SELECCIÓN DE ALUMNOS (BUSCADOR, FILTROS Y TABLA) =================
  openStudentSelectionModalForCreate() {
    this.rosterTargetMode = 'create';
    if (!this.createSalonSelectedStudentIds) this.createSalonSelectedStudentIds = new Set();
    this.rosterSelectedIds = new Set(this.createSalonSelectedStudentIds);

    const titleEl = document.getElementById('modalRosterTitle');
    const subEl = document.getElementById('modalRosterSubtitle');
    if (titleEl) titleEl.innerText = 'Seleccionar Alumnos de Fleming para el Nuevo Salón';
    if (subEl) subEl.innerText = 'Directorio Institucional • Busque y seleccione los alumnos a incorporar al nuevo salón';

    const searchInput = document.getElementById('modalRosterSearch');
    if (searchInput) searchInput.value = '';

    const filterSelect = document.getElementById('modalRosterClassFilter');
    if (filterSelect) filterSelect.value = 'all';

    this.renderRosterTable();
    const modal = document.getElementById('modalSelectStudentsRoster');
    if (modal) modal.style.display = 'flex';
  },

  openStudentSelectionModalForExistingSalon() {
    const c = this.classrooms.find(item => item.id === this.activeClassroomId);
    if (!c) return;

    this.rosterTargetMode = 'existing';
    this.rosterSelectedIds = new Set();

    const titleEl = document.getElementById('modalRosterTitle');
    const subEl = document.getElementById('modalRosterSubtitle');
    if (titleEl) titleEl.innerText = `Invitar Alumnos al Salón: ${c.name}`;
    if (subEl) subEl.innerText = `Directorio Institucional • Seleccione alumnos de Fleming para incorporarlos a ${c.name}`;

    const searchInput = document.getElementById('modalRosterSearch');
    if (searchInput) searchInput.value = '';

    const filterSelect = document.getElementById('modalRosterClassFilter');
    if (filterSelect) filterSelect.value = 'all';

    this.renderRosterTable();
    const modal = document.getElementById('modalSelectStudentsRoster');
    if (modal) modal.style.display = 'flex';
  },

  closeStudentSelectionModal() {
    const modal = document.getElementById('modalSelectStudentsRoster');
    if (modal) modal.style.display = 'none';
  },

  getRosterVisibleStudents() {
    const searchInput = document.getElementById('modalRosterSearch');
    const filterSelect = document.getElementById('modalRosterClassFilter');
    const searchText = searchInput ? searchInput.value.trim() : '';
    const classFilter = filterSelect ? filterSelect.value : 'all';

    const normSearch = searchText ? this.normalizeText(searchText) : '';
    let students = this.registeredUsers.filter(u => u.role === 'student' && u.teacherRequestStatus !== 'pending');

    if (this.rosterTargetMode === 'existing') {
      const c = this.classrooms.find(item => item.id === this.activeClassroomId);
      if (c && c.students) {
        const existingNames = new Set(c.students.map(s => s.name.replace(' (Tú)', '').trim()));
        students = students.filter(s => !existingNames.has(s.name.trim()));
      }
    }

    return students.filter(s => {
      // Filtro de búsqueda
      if (normSearch) {
        const matchName = this.normalizeText(s.name).includes(normSearch);
        const matchEmail = this.normalizeText(s.email).includes(normSearch);
        const matchClass = this.normalizeText(s.classroom || '').includes(normSearch);
        if (!matchName && !matchEmail && !matchClass) return false;
      }

      // Filtro de salón
      if (classFilter !== 'all') {
        if (classFilter === 'unassigned') {
          if (s.classroom && s.classroom !== 'Sin salón' && s.classroom !== 'General') return false;
        } else if (classFilter === '4A') {
          if (s.classroomId !== '4A' && (!s.classroom || !s.classroom.includes('4to Año "A"'))) return false;
        } else if (classFilter === '4B') {
          if (s.classroomId !== '4B' && (!s.classroom || !s.classroom.includes('4to Año "B"'))) return false;
        } else if (classFilter === '5A') {
          if (s.classroomId !== '5A' && (!s.classroom || !s.classroom.includes('5to Año "A"'))) return false;
        }
      }

      return true;
    });
  },

  renderRosterTable() {
    const tableBody = document.getElementById('modalRosterTableBody');
    const visibleCounter = document.getElementById('modalRosterCountVisible');
    const selectedCounter = document.getElementById('modalRosterCountSelected');
    const masterCheckbox = document.getElementById('modalRosterMasterCheckbox');
    if (!tableBody) return;

    if (!this.rosterSelectedIds) this.rosterSelectedIds = new Set();

    const visibleStudents = this.getRosterVisibleStudents();
    tableBody.innerHTML = '';

    if (visibleCounter) visibleCounter.innerText = visibleStudents.length;
    if (selectedCounter) {
      const totalSel = this.rosterSelectedIds.size;
      selectedCounter.innerText = `${totalSel} alumno${totalSel === 1 ? '' : 's'}`;
    }

    if (visibleStudents.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: #64748b; padding: 2rem;">
            No se encontraron alumnos con los criterios de búsqueda o filtro seleccionados.
          </td>
        </tr>
      `;
      if (masterCheckbox) {
        masterCheckbox.checked = false;
        masterCheckbox.indeterminate = false;
      }
      return;
    }

    let allChecked = true;
    let anyChecked = false;

    visibleStudents.forEach(s => {
      const isChecked = this.rosterSelectedIds.has(s.id);
      if (isChecked) anyChecked = true;
      else allChecked = false;

      const initials = s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      const row = document.createElement('tr');
      row.className = `roster-row ${isChecked ? 'selected' : ''}`;
      row.onclick = (e) => {
        if (e.target.tagName !== 'INPUT') {
          this.toggleRosterStudent(s.id);
        }
      };

      row.innerHTML = `
        <td style="padding: 0.65rem 0.85rem; text-align: center;">
          <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="App.toggleRosterStudent('${s.id}')" style="cursor: pointer; width: 16px; height: 16px;">
        </td>
        <td style="padding: 0.65rem 0.85rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div class="student-invite-avatar">${initials}</div>
            <div>
              <strong style="color: #0f172a; font-size: 0.85rem; display: block;">${s.name}</strong>
              <span style="font-size: 0.72rem; color: #64748b;">ID: ${s.id}</span>
            </div>
          </div>
        </td>
        <td style="padding: 0.65rem 0.85rem; color: #475569; font-size: 0.82rem;">
          ${s.email}
        </td>
        <td style="padding: 0.65rem 0.85rem;">
          <span class="badge-role ${s.classroom ? 'badge-role-student' : 'badge-role-guest'}" style="font-size: 0.73rem;">
            ${s.classroom || 'Sin salón asignado'}
          </span>
        </td>
        <td style="padding: 0.65rem 0.85rem; text-align: center;">
          <span style="font-weight: 700; color: #0284c7; font-size: 0.84rem;">
            ${typeof s.score === 'number' ? s.score : 18} / 20
          </span>
        </td>
        <td style="padding: 0.65rem 0.85rem; text-align: center;">
          <span style="font-size: 0.75rem; font-weight: 700; color: ${isChecked ? '#16a34a' : '#64748b'}; background: ${isChecked ? '#dcfce7' : '#f1f5f9'}; padding: 0.2rem 0.55rem; border-radius: 9999px; border: 1px solid ${isChecked ? '#86efac' : '#cbd5e1'};">
            ${isChecked ? '✓ Seleccionado' : '➕ Agregar'}
          </span>
        </td>
      `;

      tableBody.appendChild(row);
    });

    if (masterCheckbox) {
      masterCheckbox.checked = allChecked;
      masterCheckbox.indeterminate = !allChecked && anyChecked;
    }
  },

  toggleRosterStudent(studentId) {
    if (!this.rosterSelectedIds) this.rosterSelectedIds = new Set();
    if (this.rosterSelectedIds.has(studentId)) {
      this.rosterSelectedIds.delete(studentId);
    } else {
      this.rosterSelectedIds.add(studentId);
    }
    this.renderRosterTable();
  },

  toggleAllVisibleRosterStudents(select) {
    if (!this.rosterSelectedIds) this.rosterSelectedIds = new Set();
    const visible = this.getRosterVisibleStudents();
    visible.forEach(s => {
      if (select) this.rosterSelectedIds.add(s.id);
      else this.rosterSelectedIds.delete(s.id);
    });
    this.renderRosterTable();
  },

  toggleRosterMasterCheckbox(checked) {
    this.toggleAllVisibleRosterStudents(checked);
  },

  filterRosterStudents() {
    this.renderRosterTable();
  },

  confirmStudentSelectionModal() {
    if (!this.rosterSelectedIds) this.rosterSelectedIds = new Set();

    if (this.rosterTargetMode === 'create') {
      this.createSalonSelectedStudentIds = new Set(this.rosterSelectedIds);
      this.closeStudentSelectionModal();
      this.renderCreateSalonSelectedChips();
      return;
    }

    if (this.rosterTargetMode === 'existing') {
      const c = this.classrooms.find(item => item.id === this.activeClassroomId);
      if (!c) return;

      if (this.rosterSelectedIds.size === 0) {
        this.showDialog('Por favor seleccione al menos un alumno para invitar al salón.', 'Selección Requerida', '⚠️');
        return;
      }

      let addedCount = 0;
      this.rosterSelectedIds.forEach(id => {
        const u = this.registeredUsers.find(user => user.id === id);
        if (u) {
          c.students.push({
            id: u.id,
            name: u.name,
            practice: c.assignedPractice,
            attempts: typeof u.attempts === 'number' ? u.attempts : 1,
            score: typeof u.score === 'number' ? u.score : 17,
            status: u.status || 'Aprobado',
            date: u.date || (new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().slice(0, 5))
          });
          u.classroom = c.name;
          u.classroomId = c.id;
          u.practice = c.assignedPractice;
          addedCount++;
        }
      });

      this.closeStudentSelectionModal();
      this.renderClassroomStudents(c);
      this.renderClassroomsOverview();
      this.renderAdminUsers();
      this.syncClassroomToDb(c);

      this.showDialog(
        `¡Se incorporaron con éxito ${addedCount} estudiante${addedCount === 1 ? '' : 's'} a ${c.name}!

Los alumnos seleccionados ya aparecen registrados en el salón y asignados a la práctica: ${c.assignedPractice}.`,
        'Alumnos Incorporados al Salón',
        '✅'
      );
    }
  },

  handleCreateClassroom(event) {
    if (event) event.preventDefault();

    const nameInput = document.getElementById('newSalonName');
    const gradeInput = document.getElementById('newSalonGrade');
    const turnInput = document.getElementById('newSalonTurn');
    const practiceInput = document.getElementById('newSalonPractice');
    const tutorInput = document.getElementById('newSalonTutor');
    const capacityInput = document.getElementById('newSalonCapacity');

    const name = nameInput ? nameInput.value.trim() : '';
    const grade = gradeInput ? gradeInput.value : 'Secundaria';
    const turn = turnInput ? turnInput.value : 'Turno Mañana';
    const practice = practiceInput ? practiceInput.value : 'Síntesis de NaCl (Enlace Iónico)';
    const tutor = tutorInput ? tutorInput.value.trim() : 'Prof. Midori Judith Castillo Peralta';
    const capacity = capacityInput ? parseInt(capacityInput.value) || 20 : 20;

    if (!name) {
      this.showDialog('Por favor ingrese el nombre del salón.', 'Campo Requerido', '⚠️');
      return;
    }

    const newId = 'salon-' + Date.now().toString().slice(-4);
    
    // Obtener los alumnos seleccionados de Fleming
    const invitedStudentsList = [];
    if (!this.createSalonSelectedStudentIds) this.createSalonSelectedStudentIds = new Set();
    this.createSalonSelectedStudentIds.forEach(id => {
      const u = this.registeredUsers.find(user => user.id === id);
      if (u) {
        invitedStudentsList.push({
          id: u.id,
          name: u.name,
          practice: practice,
          attempts: typeof u.attempts === 'number' ? u.attempts : 1,
          score: typeof u.score === 'number' ? u.score : 17,
          status: u.status || 'Aprobado',
          date: u.date || (new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().slice(0, 5))
        });

        // Actualizar asignación del alumno en el padrón
        u.classroom = name;
        u.classroomId = newId;
        u.practice = practice;
      }
    });

    const newClassroom = {
      id: newId,
      name: name,
      level: `${grade} - ${turn}`,
      assignedPractice: practice,
      totalCapacity: capacity,
      tutor: tutor,
      students: invitedStudentsList
    };

    this.classrooms.push(newClassroom);
    this.syncClassroomToDb(newClassroom);
    this.closeCreateClassroomModal();
    this.renderClassroomsOverview();
    this.renderAdminUsers();

    // Limpiar formulario
    if (nameInput) nameInput.value = '';

    // Desplazar la ruleta horizontal suavemente hacia la nueva tarjeta
    setTimeout(() => {
      const container = document.getElementById('classroomsCardsContainer');
      if (container && typeof container.scrollTo === 'function') {
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
      }
    }, 250);

    const count = invitedStudentsList.length;
    this.showDialog(
      `¡Salón creado con éxito en la plataforma!

Salón: ${name}
Nivel y Turno: ${newClassroom.level}
Práctica Asignada: ${practice}
Tutor a Cargo: ${tutor}

👥 Alumnos Asignados de Fleming: ${count} alumno${count === 1 ? '' : 's'}.

El salón ya aparece disponible en la ruleta horizontal con la lista de sus alumnos listos para experimentar y ser calificados.`,
      'Salón Creado con Alumnos Asignados',
      '🏫'
    );
  },

  enterClassroom(classroomId) {
    const c = this.classrooms.find(item => item.id === classroomId);
    if (!c) return;

    this.activeClassroomId = classroomId;

    const overviewEl = document.getElementById('teacherSalonesOverview');
    const detailEl = document.getElementById('teacherSaloneDetail');
    if (overviewEl) overviewEl.style.display = 'none';
    if (detailEl) detailEl.style.display = 'block';

    // Actualizar encabezados
    document.getElementById('activeClassroomTitle').innerText = `${c.name} - ${c.level}`;
    document.getElementById('activeClassroomSub').innerText = `Práctica Activa: ${c.assignedPractice} • Tutor: ${c.tutor}`;
    document.getElementById('salonTableTitle').innerText = `👥 Lista de Alumnos: ${c.name}`;

    this.renderClassroomStudents(c);

    this.showDialog(`Has ingresado al Salón: ${c.name}.\nA continuación puedes revisar y calificar a los alumnos de esta aula.`, 'Salón Seleccionado', '🏫');
  },

  renderClassroomStudents(c) {
    const totalStudents = c.students.length;
    const passedCount = c.students.filter(s => s.score >= 14).length;
    const passRate = totalStudents > 0 ? Math.round((passedCount / totalStudents) * 100) : 100;
    const avgScore = totalStudents > 0 ? (c.students.reduce((acc, s) => acc + s.score, 0) / totalStudents).toFixed(1) : 0;

    // Métricas del salón
    document.getElementById('salonMetricStudents').innerText = totalStudents;
    document.getElementById('salonMetricPassing').innerText = `${passRate}%`;
    document.getElementById('salonMetricAverage').innerText = avgScore;
    document.getElementById('salonMetricCompleted').innerText = '100%';

    const tbody = document.getElementById('teacherTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    c.students.forEach(s => {
      const tr = document.createElement('tr');
      const isPass = s.score >= 14;

      tr.innerHTML = `
        <td><strong>${s.name}</strong></td>
        <td>${s.practice}</td>
        <td><span class="status-tag status-pending">${s.attempts}</span></td>
        <td><strong style="color: ${isPass ? '#16a34a' : '#dc2626'}">${s.score} / 20</strong></td>
        <td><span class="status-tag ${isPass ? 'status-passed' : 'status-pending'}">${s.status}</span></td>
        <td style="color: #64748b; font-size: 0.8rem;">${s.date}</td>
        <td>
          <button class="btn btn-secondary" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="App.showDialog('Estudiante: ${s.name}\\nSalón: ${c.name}\\nPráctica: ${s.practice}\\nCalificación: ${s.score}/20\\nFecha registrada: ${s.date}', 'Detalle de Intento', '📋')">
            🔍 Ver
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  backToSalonesOverview() {
    this.activeClassroomId = null;
    const overviewEl = document.getElementById('teacherSalonesOverview');
    const detailEl = document.getElementById('teacherSaloneDetail');
    if (overviewEl) overviewEl.style.display = 'block';
    if (detailEl) detailEl.style.display = 'none';
    this.renderClassroomsOverview();
  },

  assignPracticeToClassroom() {
    const c = this.classrooms.find(item => item.id === this.activeClassroomId);
    if (!c) return;

    // Alternar cíclicamente entre las prácticas curadas disponibles
    const practiceList = [
      'Síntesis de NaCl (Enlace Iónico)',
      'Formación de Molécula de Agua (H₂O)',
      'Neutralización Ácido-Base (HCl + NaOH)'
    ];
    const currentIndex = practiceList.indexOf(c.assignedPractice);
    const nextIndex = (currentIndex + 1) % practiceList.length;
    c.assignedPractice = practiceList[nextIndex];

    this.enterClassroom(this.activeClassroomId);
    this.showDialog(`Se asignó la práctica: "${c.assignedPractice}" a los alumnos de ${c.name}.`, 'Práctica Asignada al Salón', '✅');
  },

  exportTeacherReport() {
    const c = this.classrooms.find(item => item.id === this.activeClassroomId);
    const salonName = c ? c.name : 'General';
    this.showDialog(`Exportación completada con éxito.\nSe generó el Acta de Calificaciones oficial para el salón ${salonName} (Colegio Alexander Fleming).`, 'Acta de Notas Generada', '📊');
  },

  // ================= GESTIÓN DE EVALUACIONES Y CUESTIONARIOS DEL DOCENTE =================
  getClassroomName(id) {
    const found = this.classrooms.find(c => c.id === id);
    if (found) return found.name;
    const map = {
      '4A': '4to Año "A"',
      '4B': '4to Año "B"',
      '5A': '5to Año "A"'
    };
    return map[id] || id;
  },

  switchTeacherSubtab(tab) {
    const btnAdmin = document.getElementById('btnSubnavAdmin');
    const btnSalones = document.getElementById('btnSubnavSalones');
    const btnEvals = document.getElementById('btnSubnavEvals');

    const paneAdmin = document.getElementById('teacherPaneAdmin');
    const paneSalones = document.getElementById('teacherPaneSalones');
    const paneEvals = document.getElementById('teacherPaneEvaluations');

    if (btnAdmin) btnAdmin.className = `teacher-subnav-btn ${tab === 'admin' ? 'active' : ''}`;
    if (btnSalones) btnSalones.className = `teacher-subnav-btn ${tab === 'salones' ? 'active' : ''}`;
    if (btnEvals) btnEvals.className = `teacher-subnav-btn ${tab === 'evaluations' ? 'active' : ''}`;

    if (paneAdmin) paneAdmin.style.display = tab === 'admin' ? 'block' : 'none';
    if (paneSalones) paneSalones.style.display = tab === 'salones' ? 'block' : 'none';
    if (paneEvals) paneEvals.style.display = tab === 'evaluations' ? 'block' : 'none';

    if (tab === 'admin') {
      this.renderAdminUsers();
    } else if (tab === 'evaluations') {
      this.renderEvaluations(this.evalFilter);
    } else if (tab === 'salones') {
      this.renderClassroomsOverview();
    }
  },

  filterEvaluations(filter) {
    this.evalFilter = filter;
    this.renderEvaluations(filter);
  },

  renderEvaluations(filter = 'all') {
    const container = document.getElementById('evaluationsGridContainer');
    if (!container) return;

    const countAll = this.evaluations.length;
    const countDraft = this.evaluations.filter(e => e.status === 'draft').length;
    const countPublished = this.evaluations.filter(e => e.status === 'published').length;

    const elCountAll = document.getElementById('countEvalAll');
    const elCountDraft = document.getElementById('countEvalDraft');
    const elCountPublished = document.getElementById('countEvalPublished');
    if (elCountAll) elCountAll.innerText = countAll;
    if (elCountDraft) elCountDraft.innerText = countDraft;
    if (elCountPublished) elCountPublished.innerText = countPublished;

    let list = this.evaluations;
    if (filter === 'draft') list = list.filter(e => e.status === 'draft');
    if (filter === 'published') list = list.filter(e => e.status === 'published');

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: #64748b; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 12px;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📝</div>
          <h4 style="color: #334155; margin-bottom: 0.25rem;">No se encontraron evaluaciones con este filtro</h4>
          <p style="font-size: 0.82rem; margin-bottom: 1rem;">Cree un nuevo cuestionario y elija a qué salón o salones asignarlo.</p>
          <button class="btn btn-primary" onclick="App.openEvaluationEditor()">➕ Crear Nueva Evaluación</button>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    list.forEach(item => {
      const isPublished = item.status === 'published';
      const card = document.createElement('div');
      card.className = `eval-card ${isPublished ? 'published' : 'draft'}`;

      const classroomChips = item.targetClassrooms.map(cId => `<span class="salon-chip">🏫 ${this.getClassroomName(cId)}</span>`).join(' ');

      card.innerHTML = `
        <div>
          <div class="eval-header">
            <div>
              <div class="eval-title">${item.title}</div>
              <div class="eval-topic">🔬 Tema: <strong>${item.topic}</strong></div>
            </div>
            ${isPublished
              ? `<span class="status-pill-published" title="Esta evaluación ya no puede ser alterada">🔒 Enviado a Salón (Protegido)</span>`
              : `<span class="status-pill-draft" title="Puede modificar preguntas y salones cuantas veces requiera">📝 Borrador (Editable)</span>`
            }
          </div>

          <div class="eval-meta-row">
            <div>
              <span style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Salones Asignados:</span>
              <div class="eval-classrooms-list">${classroomChips}</div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
              <span>❓ <strong>${item.questions.length}</strong> preguntas</span>
              <span>📅 ${isPublished ? `Enviado: ${item.publishedAt}` : `Creado: ${item.createdAt}`}</span>
            </div>
          </div>
        </div>

        <div class="eval-actions-bar">
          ${isPublished
            ? `
              <button class="btn btn-outline" style="flex: 1; font-size: 0.75rem; padding: 0.35rem 0.5rem; justify-content: center; background: #f8fafc; color: #64748b; border-color: #cbd5e1;" onclick="App.attemptEditPublishedEvaluation('${item.id}')">
                🔒 Modificar (Bloqueado)
              </button>
              <button class="btn btn-primary" style="flex: 1; font-size: 0.75rem; padding: 0.35rem 0.5rem; justify-content: center;" onclick="App.openEvaluationViewer('${item.id}')">
                👀 Ver Cuestionario
              </button>
            `
            : `
              <button class="btn btn-secondary" style="flex: 1; font-size: 0.75rem; padding: 0.35rem 0.5rem; justify-content: center;" onclick="App.openEvaluationEditor('${item.id}')">
                ✏️ Modificar
              </button>
              <button class="btn btn-success" style="flex: 1; font-size: 0.75rem; padding: 0.35rem 0.5rem; justify-content: center;" onclick="App.confirmPublishEvaluation('${item.id}')">
                🚀 Enviar a Salón
              </button>
              <button class="btn btn-outline" style="font-size: 0.75rem; padding: 0.35rem 0.5rem; color: #ef4444; border-color: #fca5a5;" onclick="App.deleteEvaluation('${item.id}')" title="Eliminar borrador">
                🗑️
              </button>
            `
          }
        </div>
      `;
      container.appendChild(card);
    });
  },

  attemptEditPublishedEvaluation(evalId) {
    const item = this.evaluations.find(e => e.id === evalId);
    if (!item) return;

    const salonNames = item.targetClassrooms.map(c => this.getClassroomName(c)).join(', ');
    this.showDialog(
      `⚠️ Esta evaluación ya fue ENVIADA a los salones:\n${salonNames}\n\n🔒 Por integridad y transparencia académica de los alumnos que están resolviendo la prueba, las evaluaciones enviadas quedan protegidas contra cualquier tipo de modificación.\n\nSi necesita aplicar cambios, puede crear una nueva evaluación como borrador.`,
      'Evaluación Bloqueada',
      '🔒'
    );
  },

  openEvaluationEditor(evalId = null) {
    const modal = document.getElementById('modalEvaluationEditor');
    const formId = document.getElementById('editorEvalId');
    const formTitle = document.getElementById('editorEvalTitle');
    const formTopic = document.getElementById('editorEvalTopic');
    const modalTitle = document.getElementById('evalModalTitle');
    const modalSub = document.getElementById('evalModalSubtitle');
    const questionsContainer = document.getElementById('editorQuestionsList');

    if (!modal) return;

    questionsContainer.innerHTML = '';

    if (evalId) {
      const item = this.evaluations.find(e => e.id === evalId);
      if (!item) return;

      if (item.status === 'published') {
        this.attemptEditPublishedEvaluation(evalId);
        return;
      }

      formId.value = item.id;
      formTitle.value = item.title;
      formTopic.value = item.topic;
      modalTitle.innerText = 'Modificar Cuestionario (Borrador)';
      modalSub.innerText = 'Puede cambiar preguntas, alternativas y salones antes de enviarlo al aula.';

      // Marcar checkboxes correspondientes
      document.querySelectorAll('.salon-target-check').forEach(cb => {
        cb.checked = item.targetClassrooms.includes(cb.value);
      });

      // Cargar preguntas existentes
      item.questions.forEach(q => this.addQuestionToEditor(q));
    } else {
      formId.value = '';
      formTitle.value = '';
      formTopic.selectedIndex = 0;
      modalTitle.innerText = 'Crear Nueva Evaluación / Cuestionario';
      modalSub.innerText = 'Configure el título, los salones destino y las preguntas de evaluación.';

      // Marcar 4to A por defecto
      document.querySelectorAll('.salon-target-check').forEach(cb => {
        cb.checked = cb.value === '4A';
      });

      // Agregar 1 pregunta inicial de ejemplo
      this.addQuestionToEditor({
        question: '¿Qué tipo de enlace se forma cuando la diferencia de electronegatividad (ΔEN) es mayor a 2.0?',
        options: ['Enlace Iónico con transferencia electrónica', 'Enlace Covalente Polar', 'Enlace Covalente Apolar', 'Puente de Hidrógeno'],
        answer: 0,
        explanation: 'En la escala de Pauling, un valor ΔEN mayor o igual a 2.0 define un enlace de carácter iónico.'
      });
    }

    modal.style.display = 'flex';
  },

  closeEvaluationEditor() {
    const modal = document.getElementById('modalEvaluationEditor');
    if (modal) modal.style.display = 'none';
  },

  toggleSelectAllSalones() {
    const cbs = document.querySelectorAll('.salon-target-check');
    const allChecked = Array.from(cbs).every(cb => cb.checked);
    cbs.forEach(cb => cb.checked = !allChecked);
  },

  addQuestionToEditor(qData = null) {
    const container = document.getElementById('editorQuestionsList');
    if (!container) return;

    const qUid = 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const qCount = container.children.length + 1;

    const defaultQ = qData || {
      question: '',
      options: ['', '', '', ''],
      answer: 0,
      explanation: ''
    };

    const card = document.createElement('div');
    card.className = 'question-builder-card';
    card.id = qUid;

    let optionsHtml = '';
    const letters = ['A', 'B', 'C', 'D'];
    letters.forEach((let, i) => {
      const val = defaultQ.options[i] || '';
      const isChecked = defaultQ.answer === i ? 'checked' : '';
      optionsHtml += `
        <div class="question-option-row">
          <input type="radio" name="correct_for_${qUid}" value="${i}" class="question-option-radio eval-opt-correct" ${isChecked} title="Marcar como respuesta correcta">
          <strong style="font-size: 0.8rem; color: #475569; width: 18px;">${let})</strong>
          <input type="text" class="form-input eval-opt-text" style="padding: 0.35rem 0.6rem; font-size: 0.82rem;" placeholder="Escriba la opción ${let}..." value="${val}">
        </div>
      `;
    });

    card.innerHTML = `
      <div class="question-builder-header">
        <strong style="color: #1e293b; font-size: 0.88rem;">Pregunta <span class="q-index-num">${qCount}</span>:</strong>
        <button type="button" class="btn btn-outline" style="color: #ef4444; border-color: #fca5a5; font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="App.removeQuestionFromEditor('${qUid}')">
          🗑️ Eliminar
        </button>
      </div>

      <div style="margin-bottom: 0.65rem;">
        <label style="font-size: 0.75rem; color: #475569; font-weight: 600;">Enunciado de la Pregunta:</label>
        <textarea class="form-input eval-q-text" rows="2" style="font-size: 0.82rem; padding: 0.4rem 0.6rem;" placeholder="Escriba aquí la pregunta del cuestionario...">${defaultQ.question}</textarea>
      </div>

      <div style="margin-bottom: 0.65rem;">
        <label style="font-size: 0.75rem; color: #475569; font-weight: 600; display: block; margin-bottom: 0.25rem;">Alternativas (Seleccione el círculo de la opción correcta):</label>
        ${optionsHtml}
      </div>

      <div>
        <label style="font-size: 0.75rem; color: #475569; font-weight: 600;">Explicación / Retroalimentación al Estudiante:</label>
        <input type="text" class="form-input eval-q-exp" style="padding: 0.35rem 0.6rem; font-size: 0.8rem;" placeholder="Justificación científica de la respuesta correcta..." value="${defaultQ.explanation || ''}">
      </div>
    `;

    container.appendChild(card);
    this.updateQuestionNumbers();
  },

  removeQuestionFromEditor(qUid) {
    const card = document.getElementById(qUid);
    if (card) card.remove();
    this.updateQuestionNumbers();
  },

  updateQuestionNumbers() {
    const container = document.getElementById('editorQuestionsList');
    if (!container) return;

    const cards = container.querySelectorAll('.question-builder-card');
    cards.forEach((c, index) => {
      const numEl = c.querySelector('.q-index-num');
      if (numEl) numEl.innerText = index + 1;
    });

    const countEl = document.getElementById('editorQuestionsCount');
    if (countEl) countEl.innerText = cards.length;
  },

  saveEvaluation(isPublishing = false) {
    const idInput = document.getElementById('editorEvalId');
    const titleInput = document.getElementById('editorEvalTitle');
    const topicSelect = document.getElementById('editorEvalTopic');

    const title = titleInput ? titleInput.value.trim() : '';
    const topic = topicSelect ? topicSelect.value : 'General';

    if (!title) {
      this.showDialog('Por favor ingrese un título descriptivo para la evaluación.', 'Falta Título', '⚠️');
      if (titleInput) titleInput.focus();
      return;
    }

    // Salones seleccionados
    const checkedSalones = Array.from(document.querySelectorAll('.salon-target-check:checked')).map(cb => cb.value);
    if (checkedSalones.length === 0) {
      this.showDialog('Debe seleccionar al menos un salón de clases al cual asignar esta evaluación.', 'Seleccionar Salón', '⚠️');
      return;
    }

    // Leer preguntas
    const qCards = document.querySelectorAll('.question-builder-card');
    if (qCards.length === 0) {
      this.showDialog('El cuestionario debe contener al menos una pregunta.', 'Sin Preguntas', '⚠️');
      return;
    }

    const questions = [];
    for (let i = 0; i < qCards.length; i++) {
      const card = qCards[i];
      const qText = card.querySelector('.eval-q-text').value.trim();
      const optInputs = card.querySelectorAll('.eval-opt-text');
      const correctRadio = card.querySelector('.eval-opt-correct:checked');
      const expText = card.querySelector('.eval-q-exp').value.trim();

      if (!qText) {
        this.showDialog(`Por favor complete el enunciado de la Pregunta ${i + 1}.`, 'Pregunta Incompleta', '⚠️');
        return;
      }

      const options = [];
      for (let j = 0; j < optInputs.length; j++) {
        const optVal = optInputs[j].value.trim();
        if (!optVal) {
          this.showDialog(`Por favor complete la Opción ${String.fromCharCode(65 + j)} de la Pregunta ${i + 1}.`, 'Opción Incompleta', '⚠️');
          return;
        }
        options.push(optVal);
      }

      const answer = correctRadio ? parseInt(correctRadio.value) : 0;
      questions.push({
        question: qText,
        options: options,
        answer: answer,
        explanation: expText || 'Respuesta verificada según los fundamentos científicos del curso.'
      });
    }

    const salonNames = checkedSalones.map(s => this.getClassroomName(s)).join(', ');
    const existingId = idInput ? idInput.value : '';

    if (existingId) {
      // Modificar existente
      const existing = this.evaluations.find(e => e.id === existingId);
      if (existing) {
        if (existing.status === 'published') {
          this.attemptEditPublishedEvaluation(existingId);
          return;
        }
        existing.title = title;
        existing.topic = topic;
        existing.targetClassrooms = checkedSalones;
        existing.questions = questions;
        if (isPublishing) {
          existing.status = 'published';
          existing.publishedAt = new Date().toLocaleString();
        }
      }
    } else {
      // Crear nueva
      const newEval = {
        id: 'eval-' + Date.now(),
        title: title,
        topic: topic,
        targetClassrooms: checkedSalones,
        status: isPublishing ? 'published' : 'draft',
        createdAt: new Date().toLocaleString(),
        publishedAt: isPublishing ? new Date().toLocaleString() : null,
        questions: questions
      };
      this.evaluations.unshift(newEval);
    }

    this.closeEvaluationEditor();
    this.renderEvaluations(this.evalFilter);
    this.populateQuizSelector();

    if (isPublishing) {
      this.showDialog(
        `¡Evaluación enviada con éxito!\n\nAsignada a: ${salonNames}.\nPreguntas: ${questions.length}.\n\n🔒 Estado: ENVIADO A SALÓN (PROTEGIDO).\nEsta evaluación ahora está visible para los estudiantes del salón y ha quedado protegida contra modificaciones para garantizar la validez de las calificaciones.`,
        'Evaluación Enviada a Salón',
        '🚀'
      );
    } else {
      this.showDialog(
        `Cuestionario "${title}" guardado como BORRADOR.\n\nAsignado a: ${salonNames}.\nPreguntas guardadas: ${questions.length}.\n\n📝 Podrá seguir modificando las preguntas, opciones y salones en cualquier momento antes de enviarlo.`,
        'Borrador Guardado',
        '💾'
      );
    }
  },

  confirmPublishEvaluation(evalId) {
    const item = this.evaluations.find(e => e.id === evalId);
    if (!item) return;

    item.status = 'published';
    item.publishedAt = new Date().toLocaleString();

    this.renderEvaluations(this.evalFilter);
    this.populateQuizSelector();

    const salonNames = item.targetClassrooms.map(c => this.getClassroomName(c)).join(', ');
    this.showDialog(
      `¡La evaluación "${item.title}" ha sido ENVIADA al salón!\n\nSalones asignados: ${salonNames}.\n\n🔒 Estado: PROTEGIDO.\nA partir de este momento los alumnos pueden verla y resolverla en su módulo de evaluación, y ha quedado bloqueada contra modificaciones.`,
      'Evaluación Enviada a Salón',
      '🚀'
    );
  },

  deleteEvaluation(evalId) {
    const item = this.evaluations.find(e => e.id === evalId);
    if (!item) return;

    if (item.status === 'published') {
      this.showDialog('No es posible eliminar una evaluación que ya fue enviada a los salones y se encuentra en curso.', 'Acción no permitida', '⚠️');
      return;
    }

    this.evaluations = this.evaluations.filter(e => e.id !== evalId);
    this.renderEvaluations(this.evalFilter);
    this.populateQuizSelector();
    this.showDialog(`El borrador "${item.title}" fue eliminado exitosamente.`, 'Borrador Eliminado', '🗑️');
  },

  openEvaluationViewer(evalId) {
    const item = this.evaluations.find(e => e.id === evalId);
    if (!item) return;

    const modal = document.getElementById('modalEvaluationViewer');
    const titleEl = document.getElementById('viewerModalTitle');
    const subEl = document.getElementById('viewerModalSubtitle');
    const bodyEl = document.getElementById('viewerModalBody');

    if (!modal) return;

    titleEl.innerText = item.title;
    const salonNames = item.targetClassrooms.map(c => this.getClassroomName(c)).join(', ');
    subEl.innerText = `Tema: ${item.topic} • Salones: ${salonNames} • Publicado: ${item.publishedAt || item.createdAt}`;

    let html = '';
    const letters = ['A', 'B', 'C', 'D'];
    item.questions.forEach((q, index) => {
      let opts = '';
      q.options.forEach((opt, oIndex) => {
        const isCorrect = q.answer === oIndex;
        opts += `
          <div style="padding: 0.4rem 0.65rem; border-radius: 6px; margin-bottom: 0.3rem; font-size: 0.85rem; ${isCorrect ? 'background: #dcfce7; color: #15803d; font-weight: 700; border: 1px solid #86efac;' : 'background: #f8fafc; border: 1px solid #e2e8f0; color: #334155;'}">
            ${isCorrect ? '✅' : '⚪'} <strong>${letters[oIndex]})</strong> ${opt}
          </div>
        `;
      });

      html += `
        <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 1rem; margin-bottom: 1rem;">
          <strong style="color: #0f172a; font-size: 0.92rem; display: block; margin-bottom: 0.5rem;">${index + 1}. ${q.question}</strong>
          <div>${opts}</div>
          <div style="margin-top: 0.5rem; font-size: 0.78rem; background: #f1f5f9; padding: 0.4rem 0.7rem; border-radius: 6px; color: #475569;">
            💡 <strong>Explicación:</strong> ${q.explanation}
          </div>
        </div>
      `;
    });

    bodyEl.innerHTML = html;
    modal.style.display = 'flex';
  },

  closeEvaluationViewer() {
    const modal = document.getElementById('modalEvaluationViewer');
    if (modal) modal.style.display = 'none';
  },

  // ================= PANEL DE ADMINISTRACIÓN INSTITUCIONAL: AUDITORÍA DE USUARIOS Y NOTAS =================
  adminFilters: {
    search: '',
    role: 'all',
    salon: 'all'
  },

  normalizeText(str) {
    return (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  },

  filterAdminUsers() {
    const searchEl = document.getElementById('adminSearchInput');
    const roleEl = document.getElementById('adminRoleFilter');
    const salonEl = document.getElementById('adminSalonFilter');

    this.adminFilters.search = searchEl ? searchEl.value.trim() : '';
    this.adminFilters.role = (roleEl && roleEl.value) ? roleEl.value : 'all';
    this.adminFilters.salon = (salonEl && salonEl.value) ? salonEl.value : 'all';

    this.renderAdminUsers();
  },

  renderAdminUsers() {
    const tbody = document.getElementById('adminUsersTableBody');
    if (!tbody) return;

    const { search, role, salon } = this.adminFilters;
    const normSearch = this.normalizeText(search);

    // Filtrar lista
    const filtered = this.registeredUsers.filter(u => {
      // Filtro de búsqueda insensible a mayúsculas y tildes
      if (normSearch) {
        const matchName = this.normalizeText(u.name).includes(normSearch);
        const matchEmail = this.normalizeText(u.email).includes(normSearch);
        const matchClass = this.normalizeText(u.classroom).includes(normSearch);
        const matchPractice = this.normalizeText(u.practice).includes(normSearch);
        if (!matchName && !matchEmail && !matchClass && !matchPractice) return false;
      }

      // Filtro de rol
      if (role !== 'all' && u.role !== role) {
        return false;
      }

      // Filtro de salón
      if (salon !== 'all') {
        if (salon === 'staff' && u.role === 'student') return false;
        if (salon !== 'staff' && u.classroomId !== salon) return false;
      }

      return true;
    });

    // Actualizar métricas globales institucionales
    const totalUsers = this.registeredUsers.length;
    const students = this.registeredUsers.filter(u => u.role === 'student' && u.teacherRequestStatus !== 'pending');
    const totalStudents = students.length;
    const scoredStudents = students.filter(s => typeof s.score === 'number');
    const avgScore = scoredStudents.length > 0 
      ? (scoredStudents.reduce((acc, s) => acc + s.score, 0) / scoredStudents.length).toFixed(1) 
      : '0.0';
    const passedCount = scoredStudents.filter(s => s.score >= 14).length;
    const passingRate = scoredStudents.length > 0 
      ? ((passedCount / scoredStudents.length) * 100).toFixed(1) + '%' 
      : '0%';

    // Solicitudes de docente pendientes
    const pendingTeacherRequests = this.registeredUsers.filter(u => u.teacherRequestStatus === 'pending');
    const elPendingStat = document.getElementById('adminMetricPendingTeacherRequests');
    const elPendingCount = document.getElementById('adminPendingRequestsCount');
    const elRequestsList = document.getElementById('adminTeacherRequestsList');

    if (elPendingStat) elPendingStat.innerText = pendingTeacherRequests.length;
    if (elPendingCount) elPendingCount.innerText = `⏳ ${pendingTeacherRequests.length} Solicitud${pendingTeacherRequests.length === 1 ? '' : 'es'} Pendiente${pendingTeacherRequests.length === 1 ? '' : 's'}`;

    if (elRequestsList) {
      if (pendingTeacherRequests.length === 0) {
        elRequestsList.innerHTML = `
          <div style="font-size: 0.82rem; color: #15803d; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 0.65rem 1rem; border-radius: 8px;">
            ✅ <strong>Sin solicitudes pendientes:</strong> Todos los docentes registrados han sido validados.
          </div>
        `;
      } else {
        elRequestsList.innerHTML = pendingTeacherRequests.map(req => {
          const initials = req.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
          return `
            <div class="teacher-request-item">
              <div class="user-cell-flex">
                <div class="user-table-avatar" style="background: linear-gradient(135deg, #f59e0b, #d97706);">${initials}</div>
                <div>
                  <strong style="color: #0f172a; font-size: 0.88rem;">${req.name}</strong>
                  <div style="font-size: 0.75rem; color: #64748b;">${req.email} • 📅 Solicitud: ${req.teacherRequestDate || req.date}</div>
                </div>
              </div>
              <div style="display: flex; gap: 0.4rem; align-items: center;">
                <button class="btn btn-success" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;" onclick="App.acceptUserRequestAsStudent('${req.id}')">
                  ✅ Aceptar (Ingresa como Estudiante)
                </button>
                <button class="btn btn-outline" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; color: #ef4444; border-color: rgba(239, 68, 68, 0.4);" onclick="App.rejectTeacherRequest('${req.id}')">
                  ❌ Rechazar
                </button>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    const elTotal = document.getElementById('adminMetricTotalUsers');
    const elStudents = document.getElementById('adminMetricTotalStudents');
    const elAvg = document.getElementById('adminMetricAvgScore');
    const elPass = document.getElementById('adminMetricPassingRate');
    const elCountLabel = document.getElementById('adminTableCountLabel');

    if (elTotal) elTotal.innerText = totalUsers;
    if (elStudents) elStudents.innerText = totalStudents;
    if (elAvg) elAvg.innerText = avgScore;
    if (elPass) elPass.innerText = passingRate;
    if (elCountLabel) elCountLabel.innerText = `Mostrando ${filtered.length} de ${totalUsers} usuarios registrados`;

    // Renderizar filas
    tbody.innerHTML = '';
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: #64748b; padding: 2rem;">No se encontraron usuarios que coincidan con los filtros aplicados.</td></tr>`;
      return;
    }

    filtered.forEach(u => {
      const tr = document.createElement('tr');
      const initials = u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

      // Selector interactivo de Rol (Estudiante / Docente) directamente en la columna Rol
      let roleBadge = '';
      if (u.role === 'admin') {
        roleBadge = '<span class="badge-role badge-role-admin">🛡️ Administrador</span>';
      } else {
        const isTeacher = u.role === 'teacher';
        const pillBg = isTeacher ? '#fce7f3' : '#e0f2fe';
        const pillColor = isTeacher ? '#be185d' : '#0369a1';
        const pillBorder = isTeacher ? '#fbcfe8' : '#bae6fd';
        roleBadge = `
          <div style="display: inline-flex; flex-direction: column; align-items: flex-start; gap: 0.2rem;">
            <select
              id="roleSelect_${u.id}"
              onchange="App.promptQuickRoleChange('${u.id}', this.value)"
              title="Cambiar rol entre Estudiante y Docente"
              style="appearance: auto; cursor: pointer; font-weight: 700; font-size: 0.78rem; padding: 0.32rem 0.6rem; border-radius: 999px; background: ${pillBg}; color: ${pillColor}; border: 1.5px solid ${pillBorder}; outline: none; box-shadow: 0 1px 2px rgba(0,0,0,0.05);"
            >
              <option value="student" ${u.role === 'student' ? 'selected' : ''} style="background: #ffffff; color: #0f172a; font-weight: 600;">👨‍🎓 Estudiante</option>
              <option value="teacher" ${u.role === 'teacher' ? 'selected' : ''} style="background: #ffffff; color: #0f172a; font-weight: 600;">👩‍🏫 Docente</option>
            </select>
            ${u.teacherRequestStatus === 'pending' ? '<span style="font-size: 0.66rem; color: #b45309; font-weight: 700;">⏳ Solicitud Pendiente</span>' : ''}
          </div>
        `;
      }

      // Badge de calificación / nota
      let scoreBadge = '';
      if (typeof u.score === 'number') {
        let scoreClass = 'score-pill-high';
        if (u.score < 11) scoreClass = 'score-pill-low';
        else if (u.score < 14) scoreClass = 'score-pill-mid';
        scoreBadge = `<span class="score-pill ${scoreClass}">${u.score} / 20</span>`;
      } else {
        scoreBadge = `<span class="score-pill score-pill-none">${u.role === 'student' ? (u.teacherRequestStatus === 'pending' ? 'Postulante' : 'Pendiente') : 'Personal'}</span>`;
      }

      // Estado
      let statusBadge = '';
      if (u.teacherRequestStatus === 'pending') {
        statusBadge = '<span class="status-tag status-pending">En Validación</span>';
      } else if (u.status === 'Aprobado') {
        statusBadge = '<span class="status-tag status-passed">Aprobado</span>';
      } else if (u.status === 'Desaprobado') {
        statusBadge = '<span class="status-tag" style="background: #fee2e2; color: #b91c1c;">Desaprobado</span>';
      } else if (u.status === 'Pendiente') {
        statusBadge = '<span class="status-tag status-pending">Pendiente</span>';
      } else {
        statusBadge = '<span class="status-tag" style="background: #e0e7ff; color: #4338ca;">Activo</span>';
      }

      let actionButtons = '';
      if (u.teacherRequestStatus === 'pending') {
        actionButtons = `
          <button class="btn btn-primary" style="font-size: 0.72rem; padding: 0.2rem 0.45rem; background: #16a34a; border-color: #16a34a; margin-right: 0.25rem; white-space: nowrap;" onclick="App.acceptUserRequestAsStudent('${u.id}')" title="Aceptar Solicitud (Ingresa por defecto como Estudiante)">
            ✅ Aceptar
          </button>
          <button class="btn btn-outline" style="font-size: 0.72rem; padding: 0.2rem 0.45rem; margin-right: 0.25rem; white-space: nowrap;" onclick="App.openEditRoleModal('${u.id}')" title="Modificar Rol">
            ✏️ Rol
          </button>
          <button class="btn btn-secondary" style="font-size: 0.72rem; padding: 0.2rem 0.45rem; white-space: nowrap;" onclick="App.viewUserDetail('${u.id}')" title="Ver Ficha y Notas">
            👁️ Ficha
          </button>
        `;
      } else {
        actionButtons = `
          <button class="btn btn-outline" style="font-size: 0.72rem; padding: 0.2rem 0.45rem; margin-right: 0.25rem; white-space: nowrap;" onclick="App.openEditRoleModal('${u.id}')" title="Modificar Rol">
            ✏️ Rol
          </button>
          <button class="btn btn-secondary" style="font-size: 0.72rem; padding: 0.2rem 0.45rem; white-space: nowrap;" onclick="App.viewUserDetail('${u.id}')" title="Ver Ficha y Notas">
            👁️ Ficha
          </button>
        `;
      }

      tr.innerHTML = `
        <td>
          <div class="user-cell-flex">
            <div class="user-table-avatar">${initials}</div>
            <div>
              <strong style="color: #0f172a; display: block;">${u.name}</strong>
              <span style="font-size: 0.72rem; color: #64748b;">Reg: ${u.registeredAt || '2026'}</span>
            </div>
          </div>
        </td>
        <td style="font-size: 0.8rem; color: #475569;">${u.email}</td>
        <td>${roleBadge}</td>
        <td><strong>${u.classroom || 'General'}</strong></td>
        <td style="font-size: 0.8rem; color: #334155;">${u.practice || '-'}</td>
        <td style="text-align: center;"><span class="status-tag status-pending">${u.attempts !== undefined ? u.attempts : '-'}</span></td>
        <td>${scoreBadge}</td>
        <td>${statusBadge}</td>
        <td style="font-size: 0.75rem; color: #64748b;">${u.date || u.registeredAt || '-'}</td>
        <td>${actionButtons}</td>
      `;

      tbody.appendChild(tr);
    });
  },

  viewUserDetail(userId) {
    const user = this.registeredUsers.find(u => u.id === userId);
    if (!user) return;

    this.currentDetailUserId = userId;
    const modal = document.getElementById('modalUserDetail');
    if (!modal) return;

    const avatarEl = document.getElementById('detailUserAvatar');
    const nameEl = document.getElementById('detailUserName');
    const emailEl = document.getElementById('detailUserEmail');
    const roleEl = document.getElementById('detailUserRole');
    const salonEl = document.getElementById('detailUserSalon');
    const regEl = document.getElementById('detailUserRegisteredAt');
    const statusEl = document.getElementById('detailUserAccountStatus');

    const academicSec = document.getElementById('detailUserAcademicSection');
    const staffSec = document.getElementById('detailUserStaffSection');

    // Alerta de solicitud docente pendiente
    const reqAlert = document.getElementById('detailUserRequestAlert');
    const reqDateEl = document.getElementById('detailUserRequestDate');
    if (reqAlert) {
      if (user.teacherRequestStatus === 'pending') {
        reqAlert.style.display = 'block';
        if (reqDateEl) reqDateEl.innerText = `El usuario solicitó asignación al rol Docente el ${user.teacherRequestDate || user.date}. Solo el Administrador puede asignarle este rol.`;
      } else {
        reqAlert.style.display = 'none';
      }
    }

    if (avatarEl) avatarEl.innerText = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    if (nameEl) nameEl.innerText = user.name;
    if (emailEl) emailEl.innerText = user.email;
    if (salonEl) salonEl.innerText = user.classroom || 'Sin sección';
    if (regEl) regEl.innerText = user.registeredAt || '20/10/2026';
    if (statusEl) statusEl.innerHTML = `<span style="color: #15803d; font-weight: 700;">🟢 ${user.status || 'Activo'}</span>`;

    if (roleEl) {
      if (user.teacherRequestStatus === 'pending') {
        roleEl.innerHTML = '<span class="badge-role badge-role-pending">⏳ Solicitud Docente Pendiente</span>';
      } else if (user.role === 'student') {
        roleEl.innerHTML = '<span class="badge-role badge-role-student">👨‍🎓 Estudiante</span>';
      } else if (user.role === 'teacher') {
        roleEl.innerHTML = '<span class="badge-role badge-role-teacher">👩‍🏫 Docente</span>';
      } else {
        roleEl.innerHTML = '<span class="badge-role badge-role-admin">🛡️ Administrador</span>';
      }
    }

    if (user.role === 'student') {
      if (academicSec) academicSec.style.display = 'block';
      if (staffSec) staffSec.style.display = 'none';

      const scoreVal = document.getElementById('detailUserScoreVal');
      const scoreLevel = document.getElementById('detailUserScoreLevel');
      const attemptsVal = document.getElementById('detailUserAttemptsVal');
      const practiceEl = document.getElementById('detailUserPractice');
      const dateEl = document.getElementById('detailUserDate');
      const historyList = document.getElementById('detailUserHistoryList');

      const scoreNum = typeof user.score === 'number' ? user.score : null;
      if (scoreVal) scoreVal.innerText = scoreNum !== null ? `${scoreNum} / 20` : 'Sin nota';

      if (scoreLevel) {
        if (scoreNum >= 18) {
          scoreLevel.innerText = 'AD - Logro Destacado';
          scoreLevel.style.background = '#dcfce7';
          scoreLevel.style.color = '#15803d';
        } else if (scoreNum >= 14) {
          scoreLevel.innerText = 'A - Logro Esperado';
          scoreLevel.style.background = '#e0f2fe';
          scoreLevel.style.color = '#0369a1';
        } else if (scoreNum >= 11) {
          scoreLevel.innerText = 'B - En Proceso';
          scoreLevel.style.background = '#fef3c7';
          scoreLevel.style.color = '#b45309';
        } else if (scoreNum !== null) {
          scoreLevel.innerText = 'C - En Inicio';
          scoreLevel.style.background = '#fee2e2';
          scoreLevel.style.color = '#b91c1c';
        } else {
          scoreLevel.innerText = 'Pendiente de Evaluación';
          scoreLevel.style.background = '#f1f5f9';
          scoreLevel.style.color = '#64748b';
        }
      }

      if (attemptsVal) attemptsVal.innerText = user.attempts !== undefined ? user.attempts : '0';
      if (practiceEl) practiceEl.innerText = user.practice || 'Síntesis de NaCl (Enlace Iónico)';
      if (dateEl) dateEl.innerText = `Última sesión registrada: ${user.date || 'Reciente'}`;

      if (historyList) {
        const history = user.notesHistory && user.notesHistory.length > 0 ? user.notesHistory : [
          { test: 'Evaluación Diagnóstica: Materia y Enlace', score: Math.max(12, (scoreNum || 15) - 1), date: '22/10/2026', level: 'A' },
          { test: 'Práctica de Laboratorio: Simulación Molecular', score: scoreNum || 17, date: user.date || '28/10/2026', level: scoreNum >= 18 ? 'AD' : 'A' }
        ];

        historyList.innerHTML = history.map(h => `
          <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.45rem 0.65rem; border-radius: 6px; font-size: 0.78rem;">
            <div>
              <strong>${h.test}</strong>
              <div style="font-size: 0.7rem; color: #64748b;">📅 ${h.date}</div>
            </div>
            <div>
              <span class="score-pill ${h.score >= 14 ? 'score-pill-high' : 'score-pill-mid'}">${h.score} / 20</span>
            </div>
          </div>
        `).join('');
      }
    } else {
      if (academicSec) academicSec.style.display = 'none';
      if (staffSec) staffSec.style.display = 'block';

      const staffTitle = document.getElementById('detailStaffTitle');
      const staffDesc = document.getElementById('detailStaffDesc');
      if (user.role === 'teacher') {
        if (staffTitle) staffTitle.innerText = `👩‍🏫 Docente Titular: ${user.name}`;
        if (staffDesc) staffDesc.innerText = `Asignación: ${user.classroom} • A cargo de la supervisión curricular, rúbricas de evaluación y emisión de actas oficiales.`;
      } else {
        if (staffTitle) staffTitle.innerText = `🛡️ Administrador del Sistema: ${user.name}`;
        if (staffDesc) staffDesc.innerText = `Coordinación General de Tecnologías de la Información (TI). Privilegios completos para gestión de roles, cuentas y auditoría de notas.`;
      }
    }

    modal.style.display = 'flex';
  },

  closeUserDetailModal() {
    const modal = document.getElementById('modalUserDetail');
    if (modal) modal.style.display = 'none';
  },

  // ================= ACEPTACIÓN DE SOLICITUD (INGRESA POR DEFECTO COMO ESTUDIANTE) =================
  acceptUserRequestAsStudent(userId) {
    const user = this.registeredUsers.find(u => u.id === userId);
    if (!user) return;

    // Al aceptar la solicitud, el usuario ingresa por defecto con el rol de Estudiante.
    // El Administrador luego puede cambiar su rol a Docente o Estudiante desde la columna Rol de la tabla.
    user.role = 'student';
    user.teacherRequestStatus = 'approved';
    user.classroom = user.classroom && !user.classroom.includes('Pendiente') ? user.classroom : '4to Año "A"';
    user.classroomId = user.classroomId && user.classroomId !== 'staff' ? user.classroomId : '4A';
    user.practice = 'Síntesis de NaCl (Enlace Iónico)';
    user.status = 'Aprobado';
    user.attempts = typeof user.attempts === 'number' ? user.attempts : 1;
    user.score = typeof user.score === 'number' ? user.score : 18;

    this.syncUserToDb(user);

    if (this.currentDetailUserId === userId) {
      this.closeUserDetailModal();
    }

    this.renderAdminUsers();
    this.renderClassroomsOverview();

    this.showDialog(
      `¡Solicitud Aceptada!\n\nUsuario: ${user.name}\nRol asignado por defecto: 👨‍🎓 Estudiante\n\nAhora el usuario ya se encuentra habilitado en el Padrón Oficial. Si deseas designarlo como Docente, puedes cambiar su rol directamente en el selector de la columna "Rol" de la tabla y confirmar en la ventana emergente.`,
      'Solicitud Aceptada (Rol Inicial: Estudiante)',
      '✅'
    );
  },

  // ================= CAMBIO DIRECTO EN COLUMNA ROL CON VENTANA EMERGENTE DE CONFIRMACIÓN =================
  promptQuickRoleChange(userId, targetRole) {
    const user = this.registeredUsers.find(u => u.id === userId);
    if (!user) return;

    // Si seleccionó el mismo rol que ya tenía, no hacer nada
    if (user.role === targetRole) return;

    this.pendingQuickRoleUserId = userId;
    this.pendingQuickRoleValue = targetRole;

    const oldRoleLabel = user.role === 'teacher' ? '👩‍🏫 Docente' : '👨‍🎓 Estudiante';
    const newRoleLabel = targetRole === 'teacher' ? '👩‍🏫 Docente' : '👨‍🎓 Estudiante';

    const msgEl = document.getElementById('confirmRoleQuickMessage');
    if (msgEl) {
      msgEl.innerHTML = `¿Confirmas cambiar el rol del usuario <strong>${user.name}</strong> de <strong>${oldRoleLabel}</strong> a <strong>${newRoleLabel}</strong>?`;
    }

    const modal = document.getElementById('modalConfirmRoleQuickChange');
    if (modal) modal.style.display = 'flex';
  },

  cancelQuickRoleChange() {
    const userId = this.pendingQuickRoleUserId;
    const user = this.registeredUsers.find(u => u.id === userId);
    if (user) {
      const sel = document.getElementById(`roleSelect_${userId}`);
      if (sel) sel.value = user.role;
    }
    this.pendingQuickRoleUserId = null;
    this.pendingQuickRoleValue = null;
    const modal = document.getElementById('modalConfirmRoleQuickChange');
    if (modal) modal.style.display = 'none';
  },

  confirmQuickRoleChange() {
    const userId = this.pendingQuickRoleUserId;
    const targetRole = this.pendingQuickRoleValue;
    const user = this.registeredUsers.find(u => u.id === userId);

    const modal = document.getElementById('modalConfirmRoleQuickChange');
    if (modal) modal.style.display = 'none';

    if (!user || !targetRole) return;

    user.role = targetRole;
    if (user.teacherRequestStatus === 'pending') {
      user.teacherRequestStatus = targetRole === 'teacher' ? 'approved' : 'resolved';
    }

    if (targetRole === 'teacher') {
      user.classroom = 'Salones 4°A, 4°B, 5°A';
      user.classroomId = 'staff';
      user.practice = 'Supervisión Curricular y Calificaciones';
      user.attempts = '-';
      user.score = null;
      user.status = 'Activo';
    } else {
      user.classroom = '4to Año "A"';
      user.classroomId = '4A';
      user.practice = 'Síntesis de NaCl (Enlace Iónico)';
      user.attempts = 1;
      user.score = 18;
      user.status = 'Aprobado';
    }

    // Si es el usuario activo, sincronizar UI
    if (this.state.currentUser && this.state.currentUser.id === user.id) {
      this.state.currentUser.role = targetRole;
      this.state.currentRole = targetRole;
      this.updateUserUI();
    }

    this.syncUserToDb(user);
    this.pendingQuickRoleUserId = null;
    this.pendingQuickRoleValue = null;

    this.renderAdminUsers();
    this.renderClassroomsOverview();

    const roleLabel = targetRole === 'teacher' ? '👩‍🏫 Docente' : '👨‍🎓 Estudiante';
    this.showDialog(
      `¡Cambio de rol confirmado con éxito!\n\nUsuario: ${user.name}\nNuevo Rol asignado: ${roleLabel}\nAsignación: ${user.classroom}\n\nLos permisos de acceso han sido actualizados inmediatamente.`,
      'Rol Actualizado',
      '✅'
    );
  },

  // ================= ASIGNACIÓN DE ROL DOCENTE POR EL ADMINISTRADOR =================
  openAssignTeacherModal(userId) {
    const user = this.registeredUsers.find(u => u.id === userId);
    if (!user) return;

    this.pendingApprovalUserId = userId;
    const modal = document.getElementById('modalAdminAssignTeacher');
    const nameEl = document.getElementById('assignTeacherNameDisplay');
    const emailEl = document.getElementById('assignTeacherEmailDisplay');
    const dateEl = document.getElementById('assignTeacherDateDisplay');

    if (nameEl) nameEl.innerText = user.name;
    if (emailEl) emailEl.innerText = user.email;
    if (dateEl) dateEl.innerText = `Solicitud registrada: ${user.teacherRequestDate || user.date || 'Reciente'}`;

    if (modal) modal.style.display = 'flex';
  },

  closeAssignTeacherModal() {
    const modal = document.getElementById('modalAdminAssignTeacher');
    if (modal) modal.style.display = 'none';
    this.pendingApprovalUserId = null;
  },

  confirmAssignTeacherRole() {
    const userId = this.pendingApprovalUserId;
    const user = this.registeredUsers.find(u => u.id === userId);
    if (!user) return;

    const salonesSelect = document.getElementById('assignTeacherSalones');
    const subjectInput = document.getElementById('assignTeacherSubject');

    const assignedSalones = salonesSelect ? salonesSelect.value : 'Salones 4°A, 4°B, 5°A';
    const subject = subjectInput ? subjectInput.value.trim() : 'Ciencias Naturales y Química';

    // ASIGNAR ROL DOCENTE OFICIALMENTE TRAS APROBACIÓN DEL ADMIN
    user.role = 'teacher';
    user.teacherRequestStatus = 'approved';
    user.classroom = assignedSalones;
    user.classroomId = 'staff';
    user.practice = `Supervisión: ${subject}`;
    user.status = 'Activo';
    user.attempts = '-';
    user.score = null;

    if (this.currentDetailUserId === userId) {
      this.closeUserDetailModal();
    }

    this.closeAssignTeacherModal();
    this.renderAdminUsers();

    this.showDialog(
      `¡Rol de Docente Asignado Exitosamente!\n\nUsuario: ${user.name}\nRol: Docente Titular de Ciencias\nSalones asignados: ${assignedSalones}\n\nLa cuenta ha sido habilitada con acceso total al Panel Docente, gestión de cuestionarios y calificaciones.`,
      'Asignación Docente Confirmada',
      '✅'
    );
  },

  rejectTeacherRequest(userId) {
    const user = this.registeredUsers.find(u => u.id === userId);
    if (!user) return;

    user.teacherRequestStatus = 'rejected';
    user.status = 'Solicitud Rechazada';

    if (this.currentDetailUserId === userId) {
      this.closeUserDetailModal();
    }

    this.renderAdminUsers();

    this.showDialog(
      `La solicitud para el rol de Docente de ${user.name} ha sido rechazada.\n\nEl usuario mantendrá su acceso regular como Estudiante sin permisos docentes.`,
      'Solicitud Rechazada',
      'ℹ️'
    );
  },

  // ================= GESTIÓN Y MODIFICACIÓN DE ROLES (ADMIN) =================
  openEditRoleModal(userId) {
    const user = this.registeredUsers.find(u => u.id === userId);
    if (!user) return;

    this.currentEditRoleUserId = userId;
    const modal = document.getElementById('modalAdminEditRole');
    if (!modal) return;

    const avatarEl = document.getElementById('editRoleUserAvatar');
    const nameEl = document.getElementById('editRoleUserName');
    const emailEl = document.getElementById('editRoleUserEmail');
    const badgeEl = document.getElementById('editRoleCurrentBadge');
    const roleSelect = document.getElementById('editRoleSelect');
    const statusSelect = document.getElementById('editRoleStatusSelect');

    const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    if (avatarEl) avatarEl.innerText = initials;
    if (nameEl) nameEl.innerText = user.name;
    if (emailEl) emailEl.innerText = user.email;

    if (badgeEl) {
      if (user.role === 'admin') {
        badgeEl.className = 'badge-role badge-role-admin';
        badgeEl.innerText = '🛡️ Administrador';
      } else if (user.role === 'teacher') {
        badgeEl.className = 'badge-role badge-role-teacher';
        badgeEl.innerText = '👩‍🏫 Docente';
      } else {
        badgeEl.className = 'badge-role badge-role-student';
        badgeEl.innerText = user.teacherRequestStatus === 'pending' ? '⏳ Solicitud Docente' : '👨‍🎓 Estudiante';
      }
    }

    if (roleSelect) {
      roleSelect.value = user.role;
    }

    if (statusSelect) {
      statusSelect.value = user.status === 'Inactivo' ? 'Inactivo' : (user.status === 'Aprobado' ? 'Aprobado' : 'Activo');
    }

    this.updateEditRoleSalonOptions(user.role, user.classroom, user.classroomId);

    modal.style.display = 'flex';
  },

  closeEditRoleModal() {
    const modal = document.getElementById('modalAdminEditRole');
    if (modal) modal.style.display = 'none';
    this.currentEditRoleUserId = null;
  },

  onEditRoleChange() {
    const roleSelect = document.getElementById('editRoleSelect');
    if (!roleSelect) return;
    const targetRole = roleSelect.value;
    this.updateEditRoleSalonOptions(targetRole);
  },

  updateEditRoleSalonOptions(role, currentClassroom = '', currentClassroomId = '') {
    const salonSelect = document.getElementById('editRoleSalonSelect');
    if (!salonSelect) return;

    salonSelect.innerHTML = '';

    if (role === 'student') {
      const studentOptions = [
        { value: '4A', text: '4to Año "A" - Secundaria (Turno Mañana)' },
        { value: '4B', text: '4to Año "B" - Secundaria (Turno Tarde)' },
        { value: '5A', text: '5to Año "A" - Secundaria (Promoción)' }
      ];
      studentOptions.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.innerText = opt.text;
        if (currentClassroomId === opt.value || currentClassroom.includes(opt.value)) {
          option.selected = true;
        }
        salonSelect.appendChild(option);
      });
    } else if (role === 'teacher') {
      const teacherOptions = [
        { value: 'staff-all', text: 'Salones 4°A, 4°B, 5°A (Ciencias Naturales y Química)' },
        { value: 'staff-4A', text: 'Salón 4° Año "A" (Docente de Aula)' },
        { value: 'staff-4B', text: 'Salón 4° Año "B" (Docente de Aula)' },
        { value: 'staff-5A', text: 'Salón 5° Año "A" (Química Orgánica Avanzada)' },
        { value: 'staff-general', text: 'Plana Docente General (Ciencias)' }
      ];
      teacherOptions.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.innerText = opt.text;
        if (currentClassroom && currentClassroom.includes(opt.value.replace('staff-', ''))) {
          option.selected = true;
        }
        salonSelect.appendChild(option);
      });
    } else {
      const adminOptions = [
        { value: 'staff-admin', text: 'Administración General TI y Coordinación Fleming' },
        { value: 'staff-dir', text: 'Dirección Académica y Rectoría Institucional' }
      ];
      adminOptions.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.innerText = opt.text;
        salonSelect.appendChild(option);
      });
    }
  },

  confirmSaveUserRole() {
    const userId = this.currentEditRoleUserId;
    const user = this.registeredUsers.find(u => u.id === userId);
    if (!user) {
      this.closeEditRoleModal();
      return;
    }

    const roleSelect = document.getElementById('editRoleSelect');
    const salonSelect = document.getElementById('editRoleSalonSelect');
    const statusSelect = document.getElementById('editRoleStatusSelect');

    const newRole = roleSelect ? roleSelect.value : user.role;
    const newSalonVal = salonSelect ? salonSelect.value : '4A';
    const newStatus = statusSelect ? statusSelect.value : 'Activo';

    // Actualizar rol y estado
    user.role = newRole;
    user.status = newStatus;

    // Resolver solicitud pendiente si la hubiera
    if (user.teacherRequestStatus === 'pending') {
      user.teacherRequestStatus = newRole === 'teacher' ? 'approved' : 'resolved';
    }

    // Configurar salón, id de salón, práctica y notas según el nuevo rol
    if (newRole === 'student') {
      const salonMap = {
        '4A': '4to Año "A"',
        '4B': '4to Año "B"',
        '5A': '5to Año "A"'
      };
      user.classroom = salonMap[newSalonVal] || '4to Año "A"';
      user.classroomId = newSalonVal;
      if (!user.practice || user.practice.includes('Supervisión') || user.practice.includes('Gestión')) {
        user.practice = 'Síntesis de NaCl (Enlace Iónico)';
      }
      if (typeof user.score !== 'number') {
        user.score = 16;
        user.attempts = 1;
      }
    } else if (newRole === 'teacher') {
      const teacherMap = {
        'staff-all': 'Salones 4°A, 4°B, 5°A',
        'staff-4A': '4to Año "A"',
        'staff-4B': '4to Año "B"',
        'staff-5A': '5to Año "A"',
        'staff-general': 'Plana Docente de Ciencias'
      };
      user.classroom = teacherMap[newSalonVal] || 'Salones 4°A, 4°B, 5°A';
      user.classroomId = 'staff';
      user.practice = 'Supervisión Curricular y Calificaciones';
      user.attempts = '-';
      user.score = null;
    } else if (newRole === 'admin') {
      const adminMap = {
        'staff-admin': 'Administración General TI',
        'staff-dir': 'Dirección Académica Fleming'
      };
      user.classroom = adminMap[newSalonVal] || 'Administración General TI';
      user.classroomId = 'staff';
      user.practice = 'Gestión Integral del Sistema';
      user.attempts = '-';
      user.score = null;
    }

    // Si el usuario modificado es el usuario activo con sesión iniciada, sincronizar interfaz
    if (this.state.currentUser && this.state.currentUser.id === user.id) {
      this.state.currentUser.role = newRole;
      this.state.currentUser.classroom = user.classroom;
      this.state.currentUser.classroomId = user.classroomId;
      this.state.currentRole = newRole;
      this.updateUserUI();

      // Si fue cambiado a estudiante y estaba en la pestaña docente, redirigir al simulador
      if (newRole === 'student') {
        const simTab = document.querySelector('.sidebar-nav-item[data-tab="tab-simulator"]');
        if (simTab) simTab.click();
      }
    }

    // Si el modal de detalle del usuario estaba abierto, refrescarlo
    if (this.currentDetailUserId === user.id) {
      this.viewUserDetail(user.id);
    }

    this.syncUserToDb(user);

    this.closeEditRoleModal();
    this.renderAdminUsers();
    this.renderClassroomsOverview();

    const roleNameMap = {
      student: '👨‍🎓 Estudiante de Secundaria',
      teacher: '👩‍🏫 Docente Titular de Ciencias',
      admin: '🛡️ Administrador del Sistema'
    };

    this.showDialog(
      `El rol institucional del usuario ha sido modificado con éxito por el Administrador.\n\nUsuario: ${user.name}\nNuevo Rol: ${roleNameMap[newRole] || newRole}\nAsignación: ${user.classroom}\nEstado: ${user.status}\n\nLos permisos y accesos han sido actualizados en tiempo real.`,
      'Rol Modificado Exitosamente',
      '✅'
    );
  },

  printUserFile() {
    this.showDialog(
      'Ficha oficial generada en formato listo para impresión y archivo en Dirección Académica del Colegio Alexander Fleming.',
      'Ficha de Usuario Lista',
      '🖨️'
    );
  },

  openAdminCreateUserModal() {
    const modal = document.getElementById('modalAdminCreateUser');
    if (modal) modal.style.display = 'flex';
  },

  closeAdminCreateUserModal() {
    const modal = document.getElementById('modalAdminCreateUser');
    if (modal) modal.style.display = 'none';
  },

  onAdminRoleSelectChange() {
    const role = document.getElementById('adminNewUserRole').value;
    const salonSelect = document.getElementById('adminNewUserSalon');
    if (salonSelect) {
      if (role !== 'student') {
        salonSelect.value = 'staff';
      } else {
        salonSelect.value = '4A';
      }
    }
  },

  handleAdminCreateUser(event) {
    event.preventDefault();
    const name = document.getElementById('adminNewUserName').value.trim();
    const email = document.getElementById('adminNewUserEmail').value.trim().toLowerCase();
    const role = document.getElementById('adminNewUserRole').value;
    const salonVal = document.getElementById('adminNewUserSalon').value;
    const pass = document.getElementById('adminNewUserPass').value;

    const exists = this.registeredUsers.find(u => u.email.toLowerCase() === email);
    if (exists) {
      this.showDialog('Ya existe un usuario con este correo institucional.', 'Error de Registro', '⚠️');
      return;
    }

    const salonMap = {
      '4A': '4to Año "A"',
      '4B': '4to Año "B"',
      '5A': '5to Año "A"',
      'staff': role === 'teacher' ? 'Plana Docente' : 'Administración TI'
    };

    const newUser = {
      id: 'usr-' + Date.now(),
      name: name,
      email: email,
      password: pass,
      role: role,
      classroom: salonMap[salonVal] || '4to Año "A"',
      classroomId: salonVal,
      practice: role === 'student' ? 'Síntesis de NaCl (Enlace Iónico)' : 'Supervisión Institucional',
      attempts: role === 'student' ? 0 : '-',
      score: role === 'student' ? 17 : null,
      status: role === 'student' ? 'Aprobado' : 'Activo',
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().slice(0, 5),
      registeredAt: new Date().toLocaleDateString(),
      notesHistory: [
        { test: 'Evaluación Diagnóstica: Conceptos Fundamentales', score: 17, date: new Date().toLocaleDateString(), level: 'A' }
      ]
    };

    this.registeredUsers.unshift(newUser);
    this.syncUserToDb(newUser);

    // Si es estudiante, agregar también al salón correspondiente
    if (role === 'student') {
      const classroom = this.classrooms.find(c => c.id === salonVal);
      if (classroom) {
        classroom.students.push({
          name: name,
          practice: newUser.practice,
          attempts: 1,
          score: 17,
          status: 'Aprobado',
          date: newUser.date
        });
      }
    }

    this.closeAdminCreateUserModal();
    this.renderAdminUsers();
    this.renderClassroomsOverview();

    this.showDialog(
      `Usuario registrado con éxito en la plataforma QUIMI-K.\n\nNombre: ${name}\nRol: ${role === 'teacher' ? 'Docente' : (role === 'admin' ? 'Administrador' : 'Estudiante')}\nSalón / Área: ${newUser.classroom}\nCorreo: ${email}`,
      'Registro Institucional Completado',
      '✅'
    );
  },

  exportAdminUsersReport() {
    this.showDialog(
      `Padrón oficial consolidado de la I.E. Alexander Fleming (Tacna 2026).\n\nTotal usuarios registrados: ${this.registeredUsers.length}\nEstudiantes evaluados: ${this.registeredUsers.filter(u => u.role === 'student').length}\nPromedio institucional: 17.6 / 20\n\nEl documento oficial ha sido compilado y preparado para su firma y archivo académico.`,
      'Padrón General de Notas Generado',
      '📑'
    );
  }
};

// Iniciar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
