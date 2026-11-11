/**
 * ============================================================================
 * 📱 app.js - Controlador Principal del Laboratorio Virtual Integral de Química
 * Colegio Alexander Fleming - Tacna, Perú (2026)
 * ============================================================================
 */

const App = (function () {
  'use strict';

  // Instancias de simulación
  let labBench = null;
  let kineticSim = null;
  let atomicSim = null;
  let separationSim = null;
  let molecular3DSim = null;

  // Estado de Práctica
  let currentPracticeConfig = {
    id: 'practica-titulacion-01',
    title: 'Titulación de HCl con NaOH 0.1 M y Viraje de Fenolftaleína',
    targetVolume: 25.0,
    tolerance: 0.05,
    acidVol: 25.0,
    acidConc: 0.10,
    baseConc: 0.10
  };

  // Sonidos sintéticos
  let audioCtx = null;
  function playBeep(freq = 600, duration = 0.08) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  // =========================================================================
  // 1. INICIALIZACIÓN
  // =========================================================================
  function init() {
    console.log('🧪 Iniciando Laboratorio Virtual Integral de Química...');

    // Inicializar Mesa Interactiva
    labBench = new SimulationCanvas.InteractiveLabBench('canvasLabBench', 'canvasMeniscusZoom', 'canvasTitrationGraph');
    kineticSim = new SimulationCanvas.ParticleKineticSimulation('canvasKineticParticles');
    atomicSim = new SimulationCanvas.AtomicModelVisualizer('canvasAtomicModel');
    separationSim = new SimulationCanvas.MixtureSeparationSimulation('canvasSeparation');
    molecular3DSim = new SimulationCanvas.Molecular3DViewer('canvasMolecular3D');

    // Iniciar bucle de mesa
    labBench.start();

    // Renderizar catálogos
    renderReagentsShelf();
    renderInstrumentsRack();
    renderPeriodicTable();
    renderCurriculumModule(1);

    // Bucle para sincronizar sensores en la barra lateral
    setInterval(updateDigitalSensorsUI, 120);

    // Registro de telemetría inicial
    ChemEngine.logTelemetry('session_start', 'lab_platform', 'Fleming-2026', { status: 'Interactive Workbench Active' });
    refreshTelemetryUI();
  }

  // =========================================================================
  // 2. NAVEGACIÓN ENTRE PESTAÑAS
  // =========================================================================
  function switchMainTab(tabId) {
    playBeep(480, 0.05);
    document.querySelectorAll('.tab-view').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');

    const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    if (tabId === 'tab-lab-bench') {
      labBench.start();
    } else {
      labBench.stop();
    }

    if (tabId === 'tab-curriculum-13') {
      const activeMod = document.querySelector('.curr-subtab-btn.active')?.dataset?.mod || 1;
      renderCurriculumModule(parseInt(activeMod, 10));
    }

    if (tabId === 'tab-molecular-3d') {
      molecular3DSim.start();
    } else {
      molecular3DSim.stop();
    }

    ChemEngine.logTelemetry('navigation_switch_tab', tabId, 0);
  }

  // =========================================================================
  // 3. REACTIVOS QUÍMICOS Y TRASVASE
  // =========================================================================
  function renderReagentsShelf() {
    const container = document.getElementById('reagentsShelf');
    if (!container) return;
    container.innerHTML = '';

    Object.values(ChemEngine.reagents).forEach(r => {
      const card = document.createElement('div');
      card.className = 'reagent-card';
      card.title = `Haga clic para verter ${r.name} en el recipiente seleccionado de la mesa`;
      card.innerHTML = `
        <div class="reagent-icon-badge">${r.sga.icon}</div>
        <div class="reagent-meta">
          <div class="reagent-name">${r.name}</div>
          <div class="reagent-formula">${r.formula}</div>
        </div>
      `;
      card.onclick = () => onReagentClick(r.id);
      container.appendChild(card);
    });
  }

  function onReagentClick(reagentId) {
    playBeep(520, 0.08);
    const r = ChemEngine.reagents[reagentId];
    if (!r) return;

    if (!labBench.selectedVessel && labBench.vessels.length > 0) {
      labBench.selectedVessel = labBench.vessels[0];
    }

    if (!labBench.selectedVessel) {
      // Si no hay recipientes, colocar uno automáticamente
      const v = labBench.addVesselToBench('beaker');
      labBench.addReagentToVessel(v, reagentId, 25);
    } else {
      const amount = (r.state === 'solid') ? 5.0 : 25.0;
      labBench.addReagentToVessel(labBench.selectedVessel, reagentId, amount);
    }

    updateDigitalSensorsUI();
    refreshTelemetryUI();
  }

  // =========================================================================
  // 4. INSTRUMENTAL VIRTUAL (COLOCAR EN LA MESA)
  // =========================================================================
  function renderInstrumentsRack() {
    const container = document.getElementById('instrumentsRack');
    if (!container) return;
    container.innerHTML = '';

    Object.values(ChemEngine.instruments).forEach(inst => {
      const item = document.createElement('div');
      item.className = 'tool-rack-item';
      item.title = `Haga clic para colocar ${inst.name} en la mesa de experimentación`;
      item.innerHTML = `
        <div class="tool-icon">${inst.icon}</div>
        <div class="tool-text">
          <div class="tool-name">${inst.name}</div>
          <div class="tool-cat">${inst.category} • ${inst.precision}</div>
        </div>
      `;
      item.onclick = () => onInstrumentClick(inst.id);
      container.appendChild(item);
    });
  }

  function onInstrumentClick(instId) {
    playBeep(650, 0.06);

    switch (instId) {
      case 'beaker':
        labBench.addVesselToBench('beaker');
        break;
      case 'erlenmeyer':
        labBench.addVesselToBench('erlenmeyer');
        break;
      case 'graduated_cylinder':
        labBench.addVesselToBench('cylinder');
        break;
      case 'test_tubes':
        labBench.addVesselToBench('tube');
        break;
      case 'bunsen_burner':
        toggleBunsenBurner();
        break;
      case 'digital_balance':
        tareBalance();
        break;
      case 'burette':
        titrationPurgeBurette();
        break;
      default:
        labBench.showToast(`🧰 ${instId.toUpperCase()} activo en la mesa.`);
    }

    refreshTelemetryUI();
  }

  // =========================================================================
  // 5. ACCIONES DIRECTAS EN LA MESA
  // =========================================================================
  function addVesselAction(type) {
    playBeep(700, 0.05);
    labBench.addVesselToBench(type);
    refreshTelemetryUI();
  }

  function pourSelectedAction() {
    playBeep(600, 0.06);
    if (!labBench.selectedVessel) {
      labBench.showToast('⚠️ Seleccione primero el recipiente que desea verter.');
      return;
    }
    const target = labBench.vessels.find(v => v !== labBench.selectedVessel);
    if (!target) {
      labBench.showToast('⚠️ Coloque otro recipiente en la mesa para poder trasvasar.');
      return;
    }
    labBench.startPouring(labBench.selectedVessel, target, 25);
    refreshTelemetryUI();
  }

  function clearSelectedVessel() {
    playBeep(400, 0.08);
    if (!labBench.selectedVessel) return;
    const v = labBench.selectedVessel;
    v.contents = {
      water: 0, hcl: 0, naoh: 0, vinegar: 0, nahco3: 0,
      nacl: 0, sand: 0, oil: 0, ethanol: 0, cuso4: 0, phenolphthalein: 0
    };
    v.temperature = 22.5;
    v.bubbles = [];
    labBench.showToast(`🗑️ ${v.name} vaciado y lavado.`);
    updateDigitalSensorsUI();
    refreshTelemetryUI();
  }

  function removeSelectedVessel() {
    playBeep(350, 0.1);
    if (!labBench.selectedVessel) return;
    const idx = labBench.vessels.indexOf(labBench.selectedVessel);
    if (idx !== -1) {
      const removed = labBench.vessels.splice(idx, 1)[0];
      labBench.selectedVessel = labBench.vessels[0] || null;
      labBench.showToast(`❌ ${removed.name} retirado de la mesa.`);
    }
    updateDigitalSensorsUI();
    refreshTelemetryUI();
  }

  function titrationDripToggle() {
    playBeep(600, 0.05);
    labBench.buretteStand.isDripping = !labBench.buretteStand.isDripping;
    const btn = document.getElementById('btnTitrationDrip');
    if (btn) {
      if (labBench.buretteStand.isDripping) {
        btn.innerHTML = '⏸️ Pausar Flujo de NaOH';
        btn.classList.add('btn-active-flow');
      } else {
        btn.innerHTML = '💧 Abrir Llave de Bureta (Flujo Continuo)';
        btn.classList.remove('btn-active-flow');
      }
    }
    labBench.showToast(labBench.buretteStand.isDripping ? '💧 Flujo de NaOH activado.' : '⏸️ Flujo detenido.');
    updateDigitalSensorsUI();
    refreshTelemetryUI();
  }

  function titrationAddDrop() {
    playBeep(920, 0.04);
    if (labBench.buretteStand.volumeAddedMl < 50.0) {
      labBench.buretteStand.volumeAddedMl = Math.min(50.0, labBench.buretteStand.volumeAddedMl + 0.05);

      const tipX = labBench.buretteStand.tipX;
      const tipY = labBench.buretteStand.tipY;
      const receivingVessel = labBench.vessels.find(v => (
        tipX >= v.x && tipX <= v.x + v.width &&
        v.y >= tipY && v.y <= tipY + 120
      ));

      if (receivingVessel) {
        receivingVessel.contents.naoh += 0.05;
        labBench.recordTitrationStep(receivingVessel);
      }
      ChemEngine.logTelemetry('titration_drop', 'fine_dosage', labBench.buretteStand.volumeAddedMl);
      labBench.showToast(`💉 Gota dosificada (+0.05 mL NaOH).`);
    }
    updateDigitalSensorsUI();
    refreshTelemetryUI();
  }

  function titrationPurgeBurette() {
    playBeep(550, 0.08);
    labBench.buretteStand.isPurged = true;
    labBench.showToast('✅ Purga de aire de la bureta realizada con éxito.');
    ChemEngine.logTelemetry('purge_burette', 'burette_tip', 0);
    refreshTelemetryUI();
  }

  function toggleBunsenBurner() {
    labBench.bunsen.isOn = !labBench.bunsen.isOn;
    playBeep(labBench.bunsen.isOn ? 750 : 350, 0.1);
    labBench.showToast(labBench.bunsen.isOn ? '🔥 Mechero Bunsen encendido.' : '💨 Mechero Bunsen apagado.');
    ChemEngine.logTelemetry('toggle_bunsen', 'bunsen_burner', labBench.bunsen.isOn ? 'ON' : 'OFF');
    updateDigitalSensorsUI();
    refreshTelemetryUI();
  }

  function tareBalance() {
    playBeep(880, 0.07);
    labBench.balance.tareOffset = labBench.balance.currentMass;
    labBench.showToast('⚖️ Balanza analítica tarada a 0.00 g.');
    ChemEngine.logTelemetry('tare_balance', 'digital_balance', 0.00);
    updateDigitalSensorsUI();
    refreshTelemetryUI();
  }

  function inspectMeniscusAction() {
    playBeep(780, 0.06);
    ChemEngine.logTelemetry('inspect_meniscus', 'meniscus_zoom_lens', labBench.buretteStand.volumeAddedMl, {
      alignedTangent: true,
      meniscusType: 'Cóncavo'
    });
    labBench.showToast(`🔍 Menisco inspeccionado en tangente inferior: ${labBench.buretteStand.volumeAddedMl.toFixed(2)} mL.`);
    refreshTelemetryUI();
  }

  function stirFlaskAction() {
    playBeep(440, 0.08);
    if (labBench.selectedVessel) {
      labBench.selectedVessel.isStirring = !labBench.selectedVessel.isStirring;
      labBench.showToast(`🌀 Agitación magnética ${labBench.selectedVessel.isStirring ? 'activada' : 'pausada'} en ${labBench.selectedVessel.name}.`);
      ChemEngine.logTelemetry('stir_flask', labBench.selectedVessel.id, 1);
    }
    refreshTelemetryUI();
  }

  function finishTitrationPractice() {
    const vAdded = labBench.buretteStand.volumeAddedMl;
    const receivingFlask = labBench.vessels[0];
    const finalPh = receivingFlask ? labBench.getVesselPH(receivingFlask) : 7.0;

    ChemEngine.logTelemetry('finish_titration', 'practice_submission', vAdded, {
      finalPh,
      targetEqVol: currentPracticeConfig.targetVolume
    });

    const rubricResult = ChemEngine.evaluateProceduralRubric(currentPracticeConfig, ChemEngine.getTelemetryJSONB().events);
    showEvaluationReportModal(rubricResult);
    refreshTelemetryUI();
  }

  // =========================================================================
  // 6. SENSORES DIGITALES DE LA BARRA DERECHA
  // =========================================================================
  function updateDigitalSensorsUI() {
    if (!labBench) return;

    // Balanza
    const netMass = Math.max(0, labBench.balance.currentMass - labBench.balance.tareOffset);
    const balanceElem = document.getElementById('sensorBalanceDisplay');
    if (balanceElem) balanceElem.innerText = `${netMass.toFixed(2)} g`;

    // pH-metro y Termómetro
    const activeVessel = labBench.selectedVessel || labBench.vessels[0];
    const phElem = document.getElementById('sensorPhDisplay');
    const tempElem = document.getElementById('sensorTempDisplay');

    if (activeVessel) {
      const ph = labBench.getVesselPH(activeVessel);
      if (phElem) phElem.innerText = ph.toFixed(2);
      if (tempElem) tempElem.innerText = `${activeVessel.temperature.toFixed(1)} °C`;
    } else {
      if (phElem) phElem.innerText = '7.00';
      if (tempElem) tempElem.innerText = '22.5 °C';
    }
  }

  // =========================================================================
  // 7. TEMARIO CURRICULAR (13 MÓDULOS)
  // =========================================================================
  function renderCurriculumModule(modNumber) {
    playBeep(500, 0.04);
    document.querySelectorAll('.curr-subtab-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.mod, 10) === modNumber);
    });

    const container = document.getElementById('curriculumModuleContent');
    if (!container) return;

    kineticSim.stop();
    atomicSim.stop();
    separationSim.stop();

    switch (modNumber) {
      case 1:
        container.innerHTML = `
          <div class="curr-module-card">
            <h3>⚖️ Módulo 01: Química y Magnitudes (Densidad por Arquímedes)</h3>
            <p>Determine la densidad de un sólido por desplazamiento de volumen en una probeta.</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 1rem; border-radius: 8px;">
                <label>Masa del sólido (g):</label>
                <input type="number" id="inpDensityMass" class="form-control" value="54.0" step="0.1">
                <label style="margin-top: 0.5rem;">Volumen Inicial de Agua (mL):</label>
                <input type="number" id="inpDensityV1" class="form-control" value="50.0" step="0.5">
                <label style="margin-top: 0.5rem;">Volumen Final Sumergido (mL):</label>
                <input type="number" id="inpDensityV2" class="form-control" value="70.0" step="0.5">
                <button class="btn btn-primary" style="margin-top: 1rem; width: 100%;" onclick="App.runDensityCalc()">📐 Calcular Densidad</button>
              </div>
              <div id="densityResultBox" style="background: #EFF6FF; border: 1px solid #BFDBFE; padding: 1rem; border-radius: 8px;">
                <h4 style="margin: 0; color: #1E40AF;">Resultado de Densidad</h4>
                <p style="font-size: 0.85rem; color: #3B82F6; margin-top: 0.5rem;">Presione calcular para evaluar.</p>
              </div>
            </div>
          </div>
        `;
        break;

      case 2:
        container.innerHTML = `
          <div class="curr-module-card">
            <h3>🌡️ Módulo 02: Materia y Cinética de Partículas 2D</h3>
            <p>Observe cómo la energía térmica altera los estados de la materia.</p>
            <div style="display: grid; grid-template-columns: 1fr 280px; gap: 1rem; margin-top: 1rem;">
              <canvas id="canvasKineticParticles" width="460" height="260" style="width: 100%; height: 260px; background: #0F172A; border-radius: 8px;"></canvas>
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 1rem; border-radius: 8px;">
                <label>Temperatura: <strong id="lblKineticTemp">25.0 °C</strong></label>
                <input type="range" id="sliderKineticTemp" min="-50" max="180" value="25" style="width: 100%; margin: 0.75rem 0;" oninput="App.updateKineticTemp(this.value)">
                <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                  <button class="btn btn-secondary" onclick="App.updateKineticTemp(-30)">❄️ Sólido (-30 °C)</button>
                  <button class="btn btn-secondary" onclick="App.updateKineticTemp(25)">💧 Líquido (25 °C)</button>
                  <button class="btn btn-secondary" onclick="App.updateKineticTemp(130)">💨 Gas (130 °C)</button>
                </div>
              </div>
            </div>
          </div>
        `;
        kineticSim = new SimulationCanvas.ParticleKineticSimulation('canvasKineticParticles');
        kineticSim.start();
        break;

      case 3:
        container.innerHTML = `
          <div class="curr-module-card">
            <h3>🌪️ Módulo 03: Separación de Mezclas</h3>
            <p>Filtración de suspensiones heterogéneas sólido-líquido.</p>
            <div style="display: grid; grid-template-columns: 1fr 240px; gap: 1rem; margin-top: 1rem;">
              <canvas id="canvasSeparation" width="460" height="280" style="width: 100%; height: 280px; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px;"></canvas>
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 1rem; border-radius: 8px;">
                <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="App.startSeparationAction()">▶️ Iniciar Filtrado</button>
                <button class="btn btn-secondary" style="width: 100%; margin-top: 0.5rem;" onclick="App.resetSeparationAction()">🔄 Reiniciar</button>
              </div>
            </div>
          </div>
        `;
        separationSim = new SimulationCanvas.MixtureSeparationSimulation('canvasSeparation');
        separationSim.start();
        break;

      case 4:
        container.innerHTML = `
          <div class="curr-module-card">
            <h3>⚛️ Módulo 04: Estructura Atómica e Isótopos (Bohr)</h3>
            <div style="display: grid; grid-template-columns: 1fr 280px; gap: 1rem; margin-top: 1rem;">
              <canvas id="canvasAtomicModel" width="460" height="280" style="width: 100%; height: 280px; background: #0B1120; border-radius: 8px;"></canvas>
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 1rem; border-radius: 8px; font-size: 0.85rem;">
                <label>🔴 Protones (Z): <strong id="lblProtons">6</strong></label>
                <input type="range" id="sliderProtons" min="1" max="18" value="6" style="width: 100%;" oninput="App.updateAtomBuilder()">
                <label style="margin-top: 0.5rem; display: block;">⚪ Neutrones (N): <strong id="lblNeutrons">6</strong></label>
                <input type="range" id="sliderNeutrons" min="0" max="22" value="6" style="width: 100%;" oninput="App.updateAtomBuilder()">
                <label style="margin-top: 0.5rem; display: block;">🔵 Electrones (e⁻): <strong id="lblElectrons">6</strong></label>
                <input type="range" id="sliderElectrons" min="1" max="18" value="6" style="width: 100%;" oninput="App.updateAtomBuilder()">
              </div>
            </div>
          </div>
        `;
        atomicSim = new SimulationCanvas.AtomicModelVisualizer('canvasAtomicModel');
        atomicSim.start();
        break;

      case 5:
        container.innerHTML = `
          <div class="curr-module-card">
            <h3>⚡ Módulo 05: Zona Extranuclear & Moeller</h3>
            <select id="selMoellerElement" class="form-control" style="width: 240px; margin: 1rem 0;" onchange="App.updateMoellerModule(this.value)">
              ${Object.values(ChemEngine.elements).map(e => `<option value="${e.z}">${e.name} (${e.symbol}, Z=${e.z})</option>`).join('')}
            </select>
            <div id="moellerOutput" style="background: #F8FAFC; border: 1px solid #CBD5E1; padding: 1rem; border-radius: 8px;"></div>
          </div>
        `;
        updateMoellerModule(6);
        break;

      case 6:
        container.innerHTML = `
          <div class="curr-module-card">
            <h3>📊 Módulo 06: Tabla Periódica Interactiva</h3>
            <div id="periodicTableCurriculumContainer" style="overflow-x: auto; margin-top: 1rem;"></div>
          </div>
        `;
        renderPeriodicTable('periodicTableCurriculumContainer');
        break;

      case 7:
        container.innerHTML = `
          <div class="curr-module-card">
            <h3>🔗 Módulo 07: Enlace Químico y Regla de Pauling</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
              <select id="selBondEl1" class="form-control" onchange="App.runBondEvaluation()">
                <option value="Na">Sodio (Na) - EN: 0.93</option>
                <option value="H">Hidrógeno (H) - EN: 2.20</option>
                <option value="C">Carbono (C) - EN: 2.55</option>
              </select>
              <select id="selBondEl2" class="form-control" onchange="App.runBondEvaluation()">
                <option value="Cl">Cloro (Cl) - EN: 3.16</option>
                <option value="O">Oxígeno (O) - EN: 3.44</option>
                <option value="F">Flúor (F) - EN: 3.98</option>
              </select>
            </div>
            <div id="bondResultBox" style="margin-top: 1rem; padding: 1rem; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px;"></div>
          </div>
        `;
        runBondEvaluation();
        break;

      case 8:
        container.innerHTML = `
          <div class="curr-module-card">
            <h3>🏷️ Módulo 08: Funciones Inorgánicas (IUPAC, Stock, Tradicional)</h3>
            <table class="report-table" style="margin-top: 1rem;">
              <thead>
                <tr><th>Fórmula</th><th>Función</th><th>Tradicional</th><th>Stock</th><th>IUPAC</th></tr>
              </thead>
              <tbody>
                ${ChemEngine.nomenclatures.map(n => `
                  <tr>
                    <td><strong>${n.displayFormula || n.formula}</strong></td>
                    <td>${n.type}</td>
                    <td>${n.traditional}</td>
                    <td>${n.stock}</td>
                    <td>${n.iupac}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
        break;

      case 9:
        container.innerHTML = `
          <div class="curr-module-card">
            <h3>💥 Módulo 09: Reacciones Químicas y Fenomenología</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
              ${ChemEngine.reactions.map(r => `
                <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 1rem;">
                  <h4 style="margin: 0; color: #1E40AF;">${r.name}</h4>
                  <div style="background: #F1F5F9; padding: 0.5rem; font-family: monospace; font-weight: bold; margin: 0.5rem 0;">${r.equation}</div>
                  <p style="font-size: 0.8rem; color: #334155;">${r.phenomenon.visual}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        break;

      case 10:
        container.innerHTML = `
          <div class="curr-module-card">
            <h3>🧮 Módulo 10: Estequiometría Cuantitativa</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
              <div style="background: #F8FAFC; border: 1px solid #CBD5E1; padding: 1rem; border-radius: 8px;">
                <label>Moles de H₂:</label>
                <input type="number" id="inpStoichMolesA" class="form-control" value="4.0" step="0.5">
                <label style="margin-top: 0.5rem;">Moles de O₂:</label>
                <input type="number" id="inpStoichMolesB" class="form-control" value="1.5" step="0.5">
                <button class="btn btn-primary" style="margin-top: 1rem; width: 100%;" onclick="App.runStoichiometryCalc()">📊 Calcular</button>
              </div>
              <div id="stoichResultBox" style="background: #EFF6FF; border: 1px solid #BFDBFE; padding: 1rem; border-radius: 8px;"></div>
            </div>
          </div>
        `;
        runStoichiometryCalc();
        break;

      case 11:
      case 12:
      case 13:
        container.innerHTML = `
          <div class="curr-module-card">
            <h3>🔬 Módulo ${modNumber}: Modelado e Hibridación</h3>
            <p>Utilice la mesa de trabajo o el visor 3D para experimentar con estos conceptos.</p>
            <button class="btn btn-primary" style="margin-top: 1rem;" onclick="App.switchMainTab('tab-molecular-3d')">🌐 Ir a Visor Molecular 3D</button>
          </div>
        `;
        break;
    }
  }

  // Cálculos curriculares
  function runDensityCalc() {
    playBeep(700, 0.05);
    const m = parseFloat(document.getElementById('inpDensityMass').value);
    const v1 = parseFloat(document.getElementById('inpDensityV1').value);
    const v2 = parseFloat(document.getElementById('inpDensityV2').value);
    const res = ChemEngine.calculateDensity(m, v1, v2);
    const box = document.getElementById('densityResultBox');
    if (!box) return;
    if (!res.success) {
      box.innerHTML = `<p style="color: #DC2626;">${res.error}</p>`;
      return;
    }
    box.innerHTML = `
      <h4 style="margin: 0; color: #1E40AF;">Resultado Arquímedes</h4>
      <div style="font-size: 0.85rem; margin-top: 0.5rem;">
        • ΔV: ${res.displacedVolumeMl} mL<br>
        • Densidad: <strong style="color: #1D4ED8;">${res.densityGml} g/cm³</strong> (${res.densityKgm3} kg/m³)
      </div>
    `;
    ChemEngine.logTelemetry('density_calc', 'archimedes', res.densityGml);
    refreshTelemetryUI();
  }

  function updateKineticTemp(t) {
    const num = parseFloat(t);
    const lbl = document.getElementById('lblKineticTemp');
    if (lbl) lbl.innerText = `${num.toFixed(1)} °C`;
    if (kineticSim) kineticSim.setTemperature(num);
  }

  function startSeparationAction() {
    if (separationSim) separationSim.startSeparation();
  }

  function resetSeparationAction() {
    if (separationSim) separationSim.reset();
  }

  function updateAtomBuilder() {
    const p = parseInt(document.getElementById('sliderProtons').value, 10);
    const n = parseInt(document.getElementById('sliderNeutrons').value, 10);
    const e = parseInt(document.getElementById('sliderElectrons').value, 10);
    document.getElementById('lblProtons').innerText = p;
    document.getElementById('lblNeutrons').innerText = n;
    document.getElementById('lblElectrons').innerText = e;
    if (atomicSim) atomicSim.setComposition(p, n, e);
  }

  function updateMoellerModule(z) {
    const data = ChemEngine.getElectronConfiguration(parseInt(z, 10));
    const box = document.getElementById('moellerOutput');
    if (box) {
      box.innerHTML = `
        <div style="font-size: 1.1rem; font-family: monospace; font-weight: bold; margin-bottom: 0.5rem;">${data.fullConfig}</div>
        <div style="font-size: 0.85rem; color: #475569;">Último electrón: n=${data.quantumNumbers.n}, l=${data.quantumNumbers.l}, ml=${data.quantumNumbers.ml}, ms=${data.quantumNumbers.ms}</div>
      `;
    }
  }

  function runBondEvaluation() {
    const el1 = document.getElementById('selBondEl1')?.value || 'Na';
    const el2 = document.getElementById('selBondEl2')?.value || 'Cl';
    const res = ChemEngine.evaluateChemicalBond(el1, el2);
    const box = document.getElementById('bondResultBox');
    if (box && res) {
      box.innerHTML = `
        <strong>ΔEN: ${res.deltaEN}</strong> — <span style="color: #2563EB; font-weight: bold;">${res.bondType}</span>
        <p style="font-size: 0.82rem; margin-top: 0.4rem;">${res.description}</p>
      `;
    }
  }

  function runStoichiometryCalc() {
    const a = parseFloat(document.getElementById('inpStoichMolesA')?.value || 4.0);
    const b = parseFloat(document.getElementById('inpStoichMolesB')?.value || 1.5);
    const res = ChemEngine.calculateStoichiometry(a, b, 2, 1, 2.016, 31.998, 18.015, 2);
    const box = document.getElementById('stoichResultBox');
    if (box) {
      box.innerHTML = `
        <h4 style="margin: 0; color: #1E40AF;">Balance</h4>
        <div style="font-size: 0.85rem; margin-top: 0.4rem;">
          • Reactivo Limitante: <strong>${res.limiting === 'Reactivo A' ? 'H₂' : 'O₂'}</strong><br>
          • H₂O Formada: <strong>${res.maxMolesProd} mol (${res.theoreticalMassG} g)</strong>
        </div>
      `;
    }
  }

  function renderPeriodicTable(containerId = 'periodicTableGridContainer') {
    const c = document.getElementById(containerId);
    if (!c) return;
    let html = '<div class="ptable-grid">';
    Object.values(ChemEngine.elements).forEach(elem => {
      html += `
        <div class="ptable-cell block-${elem.block}" title="${elem.name} (Z=${elem.z})">
          <span class="pt-z">${elem.z}</span>
          <span class="pt-sym">${elem.symbol}</span>
          <span class="pt-mass">${elem.mass.toFixed(1)}</span>
        </div>
      `;
    });
    html += '</div>';
    c.innerHTML = html;
  }

  // =========================================================================
  // 8. ASISTENTE DOCENTE Y PLANTILLAS
  // =========================================================================
  function loadTeacherTemplate(tplId) {
    playBeep(650, 0.05);
    const box = document.getElementById('teacherPreviewContent');
    if (tplId === 'titration') {
      currentPracticeConfig.title = 'Titulación Ácido-Base de HCl con NaOH 0.1 M';
      if (box) box.innerHTML = '<strong>Plantilla 1:</strong> Titulación volumétrica analítica de 25 mL HCl con viraje de fenolftaleína.';
    } else if (tplId === 'density') {
      currentPracticeConfig.title = 'Determinación de Densidad de Sólidos (Arquímedes)';
      if (box) box.innerHTML = '<strong>Plantilla 2:</strong> Tarado de probeta y cálculo de masa/volumen de cilindro desconocido.';
    } else if (tplId === 'separation') {
      currentPracticeConfig.title = 'Separación Gravitatoria por Filtración';
      if (box) box.innerHTML = '<strong>Plantilla 3:</strong> Separación de arena insoluble y agua mediante embudo y filtro.';
    } else {
      currentPracticeConfig.title = 'Modelado Molecular 3D de Hidrocarburos';
      if (box) box.innerHTML = '<strong>Plantilla 4:</strong> Construcción espacial de enlaces sigma/pi y ángulos de hibridación.';
    }
  }

  function randomizeReagentsAntiCheat() {
    playBeep(800, 0.06);
    const randomVol = parseFloat((20 + Math.random() * 10).toFixed(1));
    currentPracticeConfig.targetVolume = randomVol;
    if (labBench.vessels[0]) {
      labBench.vessels[0].contents.hcl = randomVol;
    }
    labBench.showToast(`🎲 Reactivos aleatorizados: Volumen de ác. requerido = ${randomVol} mL.`);
    refreshTelemetryUI();
  }

  // =========================================================================
  // 9. TELEMETRÍA JSONB Y RÚBRICA
  // =========================================================================
  function refreshTelemetryUI() {
    const tbody = document.getElementById('telemetryTableBody');
    if (!tbody) return;
    const data = ChemEngine.getTelemetryJSONB();
    tbody.innerHTML = '';
    data.events.slice(-12).reverse().forEach(ev => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="font-family: monospace; font-size: 0.75rem;">+${ev.elapsedSeconds}s</td>
        <td><strong>${ev.action}</strong></td>
        <td>${ev.target}</td>
        <td>${typeof ev.value === 'object' ? JSON.stringify(ev.value) : ev.value}</td>
      `;
      tbody.appendChild(row);
    });

    const pre = document.getElementById('telemetryJsonPreview');
    if (pre) pre.innerText = JSON.stringify(data, null, 2);
  }

  function downloadTelemetryJSON() {
    playBeep(750, 0.05);
    const data = ChemEngine.getTelemetryJSONB();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telemetria_quimica_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function showEvaluationReportModal(rubric) {
    playBeep(900, 0.12);
    const modal = document.getElementById('modalReport');
    if (!modal) return;
    document.getElementById('reportScoreDisplay').innerText = `${rubric.vigesimalScore} / 20`;
    document.getElementById('reportLetterGrade').innerText = rubric.letterGrade;
    const tbody = document.getElementById('reportRubricBody');
    tbody.innerHTML = '';
    rubric.details.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.criteria}</strong></td>
        <td style="text-align: center;"><span class="badge-score">${item.score} / ${item.maxScore}</span></td>
        <td style="font-size: 0.82rem; color: #334155;">${item.feedback}</td>
      `;
      tbody.appendChild(tr);
    });
    modal.style.display = 'flex';
  }

  function closeReportModal() {
    const modal = document.getElementById('modalReport');
    if (modal) modal.style.display = 'none';
  }

  function select3DMolecule(key) {
    if (molecular3DSim) molecular3DSim.setMolecule(key);
  }

  return {
    init,
    switchMainTab,
    addVesselAction,
    pourSelectedAction,
    clearSelectedVessel,
    removeSelectedVessel,
    titrationDripToggle,
    titrationAddDrop,
    titrationPurgeBurette,
    toggleBunsenBurner,
    tareBalance,
    inspectMeniscusAction,
    stirFlaskAction,
    finishTitrationPractice,
    renderCurriculumModule,
    runDensityCalc,
    updateKineticTemp,
    startSeparationAction,
    resetSeparationAction,
    updateAtomBuilder,
    updateMoellerModule,
    runBondEvaluation,
    runStoichiometryCalc,
    select3DMolecule,
    loadTeacherTemplate,
    randomizeReagentsAntiCheat,
    downloadTelemetryJSON,
    closeReportModal
  };
})();

window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
