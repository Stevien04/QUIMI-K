/**
 * ============================================================================
 * 🔬 simulation_canvas.js - Motores Gráficos Interactivos 2D y 3D en Canvas
 * Laboratorio Virtual Integral de Química - Colegio Alexander Fleming (2026)
 * ============================================================================
 * Incluye:
 * 1. InteractiveLabBench: Mesa interactiva con física, arrastre de recipientes,
 *    balanza con pesaje dinámico, mechero Bunsen con calentamiento y ebullición,
 *    bureta dosificadora con titulación, trasvase (verter) entre recipientes.
 * 2. ParticleKineticSimulation: Simulación de cinética de gases y cambios de fase.
 * 3. AtomicModelVisualizer: Constructor dinámico de átomos con órbitas de Bohr.
 * 4. MixtureSeparationSimulation: Filtración, decantación y destilación.
 * 5. Molecular3DViewer: Renderizado 3D quimioinformático rotativo en 360°.
 */

const SimulationCanvas = (function () {
  'use strict';

  // =========================================================================
  // 1. MESA DE LABORATORIO TOTALMENTE INTERACTIVA (ChemCollective Style)
  // =========================================================================
  class InteractiveLabBench {
    constructor(benchCanvasId, meniscusCanvasId, graphCanvasId) {
      this.benchCanvas = document.getElementById(benchCanvasId);
      this.meniscusCanvas = document.getElementById(meniscusCanvasId);
      this.graphCanvas = document.getElementById(graphCanvasId);

      this.ctx = this.benchCanvas ? this.benchCanvas.getContext('2d') : null;
      this.ctxMeniscus = this.meniscusCanvas ? this.meniscusCanvas.getContext('2d') : null;
      this.ctxGraph = this.graphCanvas ? this.graphCanvas.getContext('2d') : null;

      // Dimensiones ampliadas de la mesa (Alta Resolución y Amplitud)
      if (this.benchCanvas) {
        this.benchCanvas.width = 1120;
        this.benchCanvas.height = 620;
      }

      // Colección de Recipientes sobre la mesa (Beakers, Erlenmeyers, Probetas, Tubos)
      this.vessels = [];
      this.vesselCounter = 1;

      // Recipiente seleccionado y arrastrado
      this.selectedVessel = null;
      this.draggedVessel = null;
      this.selectedInstrument = null; // 'bunsen' | 'balance' | 'burette' | null
      this.draggedInstrument = null; // 'bunsen' | 'balance' | 'burette' | null
      this.dragOffsetX = 0;
      this.dragOffsetY = 0;

      // Equipos fijos o configurables en la mesa (Ampliados y Espaciosos)
      this.balance = {
        x: 50,
        y: 440,
        width: 175,
        height: 130,
        plateX: 75,
        plateY: 432,
        plateW: 125,
        tareOffset: 0.00,
        currentMass: 0.00,
        visible: true
      };

      this.bunsen = {
        x: 290,
        y: 450,
        width: 55,
        height: 120,
        isOn: false,
        tripodX: 260,
        tripodY: 400,
        tripodW: 120,
        tripodH: 160,
        visible: true
      };

      this.buretteStand = {
        baseX: 460,
        baseY: 570,
        baseW: 150,
        baseH: 18,
        rodX: 490,
        rodY: 45,
        rodW: 14,
        buretteX: 550,
        buretteY: 60,
        buretteW: 30,
        buretteH: 270,
        tipX: 565,
        tipY: 350,
        totalCapacityMl: 50.0,
        volumeAddedMl: 0.0,
        isDripping: false,
        dripRate: 0.05,
        isPurged: false,
        visible: true
      };

      // Animación de gota y vertido
      this.dripAnimY = 0;
      this.pouringState = null; // { fromVessel, toVessel, progress, maxProgress }

      // Gráfica de titulación
      this.titrationHistory = [{ v: 0, ph: 1.0 }];

      // Toasts informativos en pantalla (canvas HUD)
      this.notifications = [];

      // Inicializar objetos base en la mesa
      this.initDefaultObjects();

      // Bucle de animación
      this.animFrameId = null;

      // Enlazar eventos de ratón
      this.bindMouseEvents();
    }

    initDefaultObjects() {
      // 1. Matraz Erlenmeyer inicial colocado bajo la bureta (Espacioso y Centrado)
      const flask = this.createVessel('erlenmeyer', 527, 395, 'Matraz de Reacción (250 mL)');
      flask.contents.water = 25.0;
      flask.contents.hcl = 25.0; // 25 mL de HCl 0.1 M
      flask.contents.phenolphthalein = 3; // 3 gotas de fenolftaleína
      this.vessels.push(flask);
      this.selectedVessel = flask;

      // 2. Vaso de precipitados sobre la mesa (Espacioso y en la superficie)
      const beaker = this.createVessel('beaker', 750, 405, 'Vaso de Precipitados (250 mL)');
      beaker.contents.water = 50.0;
      this.vessels.push(beaker);
    }

    createVessel(type, x, y, customName) {
      const id = `vessel_${this.vesselCounter++}`;
      let w = 68, h = 85, cap = 250, tare = 95.0, defaultName = 'Vaso de precipitados';
      if (type === 'beaker') {
        w = 68; h = 85; cap = 250; tare = 95.0; defaultName = 'Vaso de precipitados';
      } else if (type === 'erlenmeyer') {
        w = 75; h = 95; cap = 250; tare = 115.0; defaultName = 'Matraz Erlenmeyer';
      } else if (type === 'cylinder') {
        w = 34; h = 130; cap = 100; tare = 85.0; defaultName = 'Probeta graduada';
      } else if (type === 'tube') {
        w = 75; h = 90; cap = 50; tare = 40.0; defaultName = 'Gradilla con Tubos';
      } else if (type === 'pipette') {
        w = 26; h = 135; cap = 10; tare = 25.0; defaultName = 'Pipeta graduada con propipeta';
      } else if (type === 'funnel') {
        w = 65; h = 105; cap = 100; tare = 65.0; defaultName = 'Embudo con papel de filtro';
      } else if (type === 'mortar') {
        w = 75; h = 60; cap = 150; tare = 135.0; defaultName = 'Mortero y pistilo de porcelana';
      } else if (type === 'distillation') {
        w = 135; h = 110; cap = 250; tare = 180.0; defaultName = 'Aparato de Destilación Simple';
      } else if (type === 'centrifuge') {
        w = 85; h = 75; cap = 60; tare = 220.0; defaultName = 'Centrífuga de Laboratorio';
      } else if (type === 'thermometer') {
        w = 28; h = 115; cap = 1; tare = 30.0; defaultName = 'Termómetro Digital (-20 a 150°C)';
      } else if (type === 'ph_meter') {
        w = 30; h = 115; cap = 1; tare = 35.0; defaultName = 'pH-metro digital y tiras';
      }

      return {
        id,
        type,
        name: customName || `${defaultName} #${this.vesselCounter - 1}`,
        x,
        y,
        width: w,
        height: h,
        capacity: cap,
        tareWeight: tare,
        tareMass: tare,
        temperature: 22.5,
        isStirring: false,
        rotation: 0,
        tiltAngle: 0,
        bubbles: [],
        contents: {
          water: 0,
          hcl: 0,
          naoh: 0,
          vinegar: 0,
          nahco3: 0,
          nacl: 0,
          sand: 0,
          oil: 0,
          ethanol: 0,
          cuso4: 0,
          phenolphthalein: 0
        }
      };
    }

    addVesselToBench(type) {
      // Posición espaciada sobre el área de trabajo (a la derecha de la bureta, descansando en la encimera)
      const count = this.vessels.length;
      const freeX = 660 + (count * 60) % 360;
      const newVessel = this.createVessel(type, freeX, 350);
      newVessel.y = 430 - newVessel.height; // Base apoyada sobre la encimera de la mesa
      this.vessels.push(newVessel);
      this.selectedVessel = newVessel;
      this.selectedInstrument = null;
      this.showToast(`✨ ${newVessel.name} colocado en la mesa.`);
      ChemEngine.logTelemetry('add_vessel_bench', type, newVessel.id);
      return newVessel;
    }

    showToast(message) {
      this.notifications.push({
        text: message,
        createdAt: Date.now(),
        opacity: 1.0
      });
      if (this.notifications.length > 4) {
        this.notifications.shift();
      }
    }

    start() {
      if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
      const loop = () => {
        this.update();
        this.render();
        this.renderMeniscus();
        this.renderGraph();
        this.animFrameId = requestAnimationFrame(loop);
      };
      this.animFrameId = requestAnimationFrame(loop);
    }

    stop() {
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
    }

    // =======================================================================
    // 2. FÍSICA Y QUÍMICA DE LA MESA (Loop Update)
    // =======================================================================
    update() {
      // 1. Goteo de bureta
      if (this.buretteStand && this.buretteStand.visible !== false && this.buretteStand.isDripping) {
        if (this.buretteStand.volumeAddedMl >= 50.0) {
          this.buretteStand.isDripping = false;
          this.showToast('⚠️ La bureta se ha vaciado (50 mL dosificados). Pulse [Rellenar Bureta] para recargarla.');
          if (window.App && window.App.updateDigitalSensorsUI) window.App.updateDigitalSensorsUI();
        } else {
          this.buretteStand.volumeAddedMl = Math.min(50.0, this.buretteStand.volumeAddedMl + this.buretteStand.dripRate);
          this.dripAnimY += 12;

          // Comprobar si hay un recipiente bajo la punta de la bureta (zona ampliada)
          const tipX = this.buretteStand.tipX;
          const tipY = this.buretteStand.tipY;
          const receivingVessel = this.vessels.find(v => (
            tipX >= v.x - 12 && tipX <= v.x + v.width + 12 &&
            v.y >= tipY && v.y <= tipY + 140
          ));

          if (this.dripAnimY > 60) {
            this.dripAnimY = 0;
            if (receivingVessel) {
              const rid = this.buretteStand.reagentId || 'naoh';
              if (!receivingVessel.contents) {
                receivingVessel.contents = { water: 0, hcl: 0, naoh: 0, indicator: 0, kmno4: 0, vinegar: 0, ethanol: 0, oil: 0, phenolphthalein: 0, nacl: 0, sand: 0, nahco3: 0, cuso4: 0 };
              }
              const dose = this.buretteStand.dripRate * 5;
              if (rid === 'naoh') receivingVessel.contents.naoh += dose;
              else if (rid === 'hcl') receivingVessel.contents.hcl += dose;
              else if (rid === 'h2o') receivingVessel.contents.water += dose;
              else if (receivingVessel.contents[rid] !== undefined) receivingVessel.contents[rid] += dose;
              else receivingVessel.contents.naoh += dose;

              if (receivingVessel.volume < receivingVessel.capacity) {
                receivingVessel.volume = Math.min(receivingVessel.capacity, receivingVessel.volume + dose);
              }
              this.recordTitrationStep(receivingVessel);
            }
          }
        }
      }

      // 2. Interacción con la Balanza Analítica
      if (this.balance && this.balance.visible !== false) {
        let massOnPlate = 0.0;
        this.vessels.forEach(v => {
          // Si el recipiente está posicionado sobre el plato de la balanza
          const vCenter = v.x + v.width / 2;
          const vBottom = v.y + v.height;
          if (vCenter >= this.balance.x && vCenter <= this.balance.x + this.balance.width &&
              vBottom >= this.balance.plateY - 15 && vBottom <= this.balance.plateY + 25) {
            massOnPlate += this.getVesselTotalMass(v);
          }
        });
        this.balance.currentMass = massOnPlate;
      }

      // 3. Interacción con el Mechero Bunsen (Calentamiento)
      if (this.bunsen && this.bunsen.visible !== false) {
        this.vessels.forEach(v => {
          const vCenter = v.x + v.width / 2;
          const vBottom = v.y + v.height;
          const onTripod = (
            vCenter >= this.bunsen.tripodX - 15 && vCenter <= this.bunsen.tripodX + this.bunsen.tripodW + 15 &&
            vBottom >= this.bunsen.tripodY - 20 && vBottom <= this.bunsen.tripodY + 30
          );

          if (onTripod && this.bunsen.isOn) {
          if (v.temperature < 100.0) {
            v.temperature += 0.35; // Calentamiento progresivo
          }
          if (v.temperature >= 95.0) {
            // Generar burbujas de ebullición
            if (Math.random() < 0.4 && v.bubbles.length < 20) {
              v.bubbles.push({
                x: v.x + 10 + Math.random() * (v.width - 20),
                y: v.y + v.height - 10,
                radius: 2 + Math.random() * 3,
                vy: 1.5 + Math.random() * 2
              });
            }
          }
        } else {
          // Enfriamiento natural hacia temperatura ambiente
          if (v.temperature > 22.5) {
            v.temperature -= 0.05;
          }
        }

        // Actualizar burbujas activas
        v.bubbles.forEach((b, idx) => {
          b.y -= b.vy;
          if (b.y < v.y + 25) {
            v.bubbles.splice(idx, 1);
          }
        });
      });
    }

      // 4. Animación de trasvase / vertido
      if (this.pouringState) {
        this.updatePouring();
      }
    }

    getVesselContentsSummary(v) {
      if (!v || !v.contents) return [];
      const c = v.contents;
      const items = [];
      const map = [
        { key: 'water', name: 'Agua destilada (H₂O)', unit: 'mL', color: '#0284C7', icon: '💧' },
        { key: 'hcl', name: 'Ácido Clorhídrico (HCl 0.1 M)', unit: 'mL', color: '#EF4444', icon: '⚠️' },
        { key: 'naoh', name: 'Hidróxido de Sodio (NaOH 0.1 M)', unit: 'mL', color: '#3B82F6', icon: '🧪' },
        { key: 'phenolphthalein', name: 'Fenolftaleína (Indicador)', unit: 'gotas', color: '#EC4899', icon: '🌸' },
        { key: 'vinegar', name: 'Vinagre (Ác. Acético)', unit: 'mL', color: '#EAB308', icon: '🍶' },
        { key: 'nahco3', name: 'Bicarbonato de Sodio', unit: 'g', color: '#10B981', icon: '🧂' },
        { key: 'nacl', name: 'Cloruro de Sodio (Sal)', unit: 'g', color: '#64748B', icon: '🧂' },
        { key: 'sand', name: 'Arena de sílice', unit: 'g', color: '#F59E0B', icon: '🏖️' },
        { key: 'oil', name: 'Aceite vegetal', unit: 'mL', color: '#CA8A04', icon: '🛢️' },
        { key: 'ethanol', name: 'Alcohol Etílico 96%', unit: 'mL', color: '#8B5CF6', icon: '🔥' },
        { key: 'cuso4', name: 'Sulfato de Cobre', unit: 'g', color: '#06B6D4', icon: '🔷' }
      ];

      map.forEach(item => {
        const val = c[item.key];
        if (val && val > 0) {
          items.push({
            name: item.name,
            amount: val,
            unit: item.unit,
            color: item.color,
            icon: item.icon
          });
        }
      });
      return items;
    }

    getVesselTotalVolume(v) {
      const c = v.contents;
      return (c.water || 0) + (c.hcl || 0) + (c.naoh || 0) + (c.vinegar || 0) + (c.oil || 0) + (c.ethanol || 0);
    }

    getVesselTotalMass(v) {
      const c = v.contents;
      const liquidMass = (c.water * 1.00) + (c.hcl * 1.01) + (c.naoh * 1.02) +
                         (c.vinegar * 1.01) + (c.oil * 0.92) + (c.ethanol * 0.789);
      const solidMass = (c.nacl * 1.0) + (c.sand * 1.0) + (c.nahco3 * 1.0) + (c.cuso4 * 1.0);
      return v.tareWeight + liquidMass + solidMass;
    }

    getVesselPH(v) {
      const c = v.contents;
      const acidMoles = (c.hcl / 1000) * 0.10;
      const baseMoles = (c.naoh / 1000) * 0.10;
      const totalVolL = Math.max(0.001, this.getVesselTotalVolume(v) / 1000);

      if (acidMoles > baseMoles) {
        const hConc = (acidMoles - baseMoles) / totalVolL;
        return Math.max(0.0, Math.min(7.0, -Math.log10(Math.max(1e-14, hConc))));
      } else if (baseMoles > acidMoles) {
        const ohConc = (baseMoles - acidMoles) / totalVolL;
        const poh = -Math.log10(Math.max(1e-14, ohConc));
        return Math.max(7.0, Math.min(14.0, 14.0 - poh));
      } else if (c.vinegar > 0) {
        return 2.87;
      } else {
        return 7.00;
      }
    }

    getVesselLiquidColor(v) {
      const c = v.contents;
      const ph = this.getVesselPH(v);

      if (c.cuso4 > 0) {
        return 'rgba(2, 132, 199, 0.88)'; // Azul celeste brillante intenso sulfato cúprico
      }
      if (c.oil > 0) {
        if (c.water > 0) return 'rgba(234, 179, 8, 0.85)'; // Emulsión dorada de aceite en agua
        return 'rgba(245, 158, 11, 0.90)'; // Aceite vegetal ámbar cálido
      }
      if (c.phenolphthalein > 0) {
        if (ph >= 8.2 && ph <= 10.0) {
          const intensity = (ph - 8.2) / 1.8;
          return `rgba(244, 63, 94, ${0.45 + intensity * 0.50})`;
        } else if (ph > 10.0) {
          return 'rgba(225, 29, 72, 0.95)'; // Fucsia intenso vibrante
        }
      }
      if (c.vinegar > 0) {
        return 'rgba(163, 230, 53, 0.65)'; // Ácido acético verde manzana translúcido
      }
      if (c.hcl > 0) {
        return 'rgba(248, 113, 113, 0.55)'; // Ácido clorhídrico tintado coral reactivo
      }
      if (c.naoh > 0) {
        return 'rgba(167, 139, 250, 0.55)'; // Hidróxido de sodio tintado lavanda reactivo
      }
      if (c.ethanol > 0) {
        return 'rgba(56, 189, 248, 0.55)'; // Alcohol etílico con brillo cristalino
      }
      if (c.sand > 0) {
        return 'rgba(217, 119, 6, 0.85)'; // Partículas sedimentadas de arena
      }
      if (c.nahco3 > 0) {
        return 'rgba(241, 245, 249, 0.85)'; // Bicarbonato efervescente blanquecino
      }
      if (c.nacl > 0) {
        return 'rgba(199, 210, 254, 0.60)'; // Solución salina cristalina
      }
      // Agua destilada pura celeste limpia y claramente visible
      return 'rgba(56, 189, 248, 0.55)';
    }

    recordTitrationStep(vessel) {
      const ph = this.getVesselPH(vessel);
      const vAdded = this.buretteStand.volumeAddedMl;
      const last = this.titrationHistory[this.titrationHistory.length - 1];
      if (!last || Math.abs(last.v - vAdded) >= 0.25 || vAdded >= 50.0) {
        this.titrationHistory.push({ v: vAdded, ph: parseFloat(ph.toFixed(2)) });
      }
    }

    // =======================================================================
    // 3. TRASVASE (VERTER) LÍQUIDO ENTRE RECIPIENTES
    // =======================================================================
    startPouring(fromVessel, toVessel, amountMl = 25) {
      if (!fromVessel || !toVessel || fromVessel === toVessel) return;
      const availableVol = this.getVesselTotalVolume(fromVessel);
      if (availableVol <= 0) {
        this.showToast(`⚠️ ${fromVessel.name} está vacío.`);
        return;
      }

      const pourAmount = Math.min(availableVol, amountMl);
      this.pouringState = {
        from: fromVessel,
        to: toVessel,
        amountToTransfer: pourAmount,
        transferredSoFar: 0,
        origX: fromVessel.x,
        origY: fromVessel.y
      };

      // Mover el vertedor sobre el receptor con inclinación
      fromVessel.x = toVessel.x - 40;
      fromVessel.y = toVessel.y - fromVessel.height - 15;
      fromVessel.tiltAngle = 45;

      this.showToast(`💧 Trasvasando ${pourAmount.toFixed(1)} mL de ${fromVessel.name} a ${toVessel.name}...`);
      ChemEngine.logTelemetry('pour_liquid', fromVessel.id, toVessel.id, { amountMl: pourAmount });
    }

    updatePouring() {
      const p = this.pouringState;
      const stepMl = 0.8;
      if (p.transferredSoFar < p.amountToTransfer) {
        p.transferredSoFar += stepMl;

        // Proporción de transferencia de contenidos
        const totalV = Math.max(0.1, this.getVesselTotalVolume(p.from));
        const fraction = stepMl / totalV;

        for (const key in p.from.contents) {
          const transferredPart = p.from.contents[key] * fraction;
          p.from.contents[key] = Math.max(0, p.from.contents[key] - transferredPart);
          p.to.contents[key] = (p.to.contents[key] || 0) + transferredPart;
        }

        // Si se mezcla bicarbonato con vinagre -> Efervescencia
        if (p.to.contents.nahco3 > 0 && p.to.contents.vinegar > 0) {
          for (let i = 0; i < 3; i++) {
            p.to.bubbles.push({
              x: p.to.x + 10 + Math.random() * (p.to.width - 20),
              y: p.to.y + p.to.height - 8,
              radius: 2 + Math.random() * 3,
              vy: 2.5 + Math.random() * 2
            });
          }
        }
      } else {
        // Fin de vertido
        p.from.x = p.origX;
        p.from.y = p.origY;
        p.from.tiltAngle = 0;
        this.showToast(`✅ Trasvase completado a ${p.to.name}.`);
        this.pouringState = null;
      }
    }

    // =======================================================================
    // 4. AGREGAR REACTIVOS DIRECTAMENTE A UN RECIPIENTE
    // =======================================================================
    addReagentToVessel(vessel, reagentId, amount = 25) {
      // 1. Si la bureta está seleccionada o especificada, cargar o rellenar la bureta
      if (this.selectedInstrument === 'burette' || vessel === 'burette') {
        const r = ChemEngine.reagents[reagentId] || { name: 'Hidróxido de Sodio (NaOH 0.1 M)' };
        this.buretteStand.reagentId = reagentId;
        this.buretteStand.reagentName = r.name;
        // Restablecer el volumen dosificado a 0 (bureta 100% llena con 50.0 mL)
        this.buretteStand.volumeAddedMl = 0.0;
        this.buretteStand.isDripping = false;
        this.showToast(`🧪 Bureta enrasada y rellenada al tope: 50.0 mL de ${r.name}.`);
        if (window.App && window.App.updateDigitalSensorsUI) window.App.updateDigitalSensorsUI();
        return;
      }

      if (!vessel) {
        if (this.selectedVessel) vessel = this.selectedVessel;
        else if (this.vessels.length > 0) vessel = this.vessels[0];
        else {
          this.showToast('⚠️ No hay ningún recipiente en la mesa. Coloque un vaso o matraz primero.');
          return;
        }
      }

      const r = ChemEngine.reagents[reagentId];
      if (!r) return;

      if (reagentId === 'h2o') vessel.contents.water += amount;
      else if (reagentId === 'hcl') vessel.contents.hcl += amount;
      else if (reagentId === 'naoh') vessel.contents.naoh += amount;
      else if (reagentId === 'vinegar') vessel.contents.vinegar += amount;
      else if (reagentId === 'ethanol') vessel.contents.ethanol += amount;
      else if (reagentId === 'oil') vessel.contents.oil += amount;
      else if (reagentId === 'phenolphthalein') vessel.contents.phenolphthalein += 3;
      else if (reagentId === 'nacl') vessel.contents.nacl += (amount > 10 ? 5 : amount);
      else if (reagentId === 'sand') vessel.contents.sand += (amount > 10 ? 5 : amount);
      else if (reagentId === 'nahco3') vessel.contents.nahco3 += (amount > 10 ? 5 : amount);
      else if (reagentId === 'cuso4') vessel.contents.cuso4 += (amount > 10 ? 5 : amount);
      else vessel.contents.water += amount;

      this.showToast(`🧪 Añadido +${amount} ${r.state === 'solid' ? 'g' : 'mL'} de ${r.name} a ${vessel.name} (Total: ${this.getVesselTotalVolume(vessel).toFixed(1)} mL).`);
      ChemEngine.logTelemetry('add_reagent_vessel', reagentId, vessel.id, { amount });
    }

    refillBurette(reagentId = null) {
      if (!this.buretteStand) return;
      const rid = reagentId || this.buretteStand.reagentId || 'naoh';
      const r = ChemEngine.reagents[rid] || { name: 'Hidróxido de Sodio (NaOH 0.1 M)' };
      this.buretteStand.reagentId = rid;
      this.buretteStand.reagentName = r.name;
      this.buretteStand.volumeAddedMl = 0.0;
      this.buretteStand.isDripping = false;
      this.showToast(`✨ Bureta rellenada y enrasada al tope (50.0 mL de ${r.name}).`);
      if (window.App && window.App.updateDigitalSensorsUI) window.App.updateDigitalSensorsUI();
    }

    alignVesselUnderBurette(vessel = null) {
      if (!this.buretteStand || this.buretteStand.visible === false) {
        this.showToast('⚠️ No hay bureta colocada en la mesa.');
        return;
      }
      const target = vessel || this.selectedVessel || this.vessels.find(v => v.type === 'erlenmeyer') || this.vessels[0];
      if (!target) {
        this.showToast('⚠️ No hay ningún matraz o vaso en la mesa. Coloque uno desde el estante.');
        return;
      }
      target.x = this.buretteStand.tipX - target.width / 2;
      target.y = 405; // Base normal sobre la encimera
      this.selectedVessel = target;
      this.selectedInstrument = null;
      this.showToast(`🎯 ${target.name} posicionado exactamente bajo la punta de la bureta.`);
      if (window.App && window.App.updateDigitalSensorsUI) window.App.updateDigitalSensorsUI();
    }

    // =======================================================================
    // 5. RENDERIZADO DEL ENTORNO COMPLETO 2D
    // =======================================================================
    render() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const w = this.benchCanvas.width;
      const h = this.benchCanvas.height;
      ctx.clearRect(0, 0, w, h);

      // 1. Fondo de laboratorio y pared superior
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(0, 0, w, h);

      // Baldosas de azulejo blanco de laboratorio
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 430); ctx.stroke();
      }
      for (let y = 0; y < 430; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // 2. Encimera de la mesa de experimentación ampliada
      const tableY = 430;
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(0, tableY, w, 18); // Borde biselado
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(0, tableY + 18, w, h - tableY - 18);

      // Líneas de perspectiva de mesa
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(0, tableY + 16, w, 2);

      // 3. Renderizar Balanza Analítica Digital
      if (this.balance && this.balance.visible !== false) {
        this.renderBalance(ctx);
        if (this.selectedInstrument === 'balance') {
          ctx.save();
          ctx.strokeStyle = '#0284C7';
          ctx.lineWidth = 3;
          ctx.setLineDash([6, 3]);
          ctx.strokeRect(this.balance.x - 5, this.balance.y - 5, this.balance.width + 10, this.balance.height + 10);
          ctx.restore();
        }
      }

      // 4. Renderizar Mechero Bunsen y Trípode
      if (this.bunsen && this.bunsen.visible !== false) {
        this.renderBunsen(ctx);
        if (this.selectedInstrument === 'bunsen') {
          ctx.save();
          ctx.strokeStyle = '#0284C7';
          ctx.lineWidth = 3;
          ctx.setLineDash([6, 3]);
          ctx.strokeRect(this.bunsen.tripodX - 6, this.bunsen.tripodY - 6, this.bunsen.tripodW + 12, (this.bunsen.y + this.bunsen.height) - this.bunsen.tripodY + 12);
          ctx.restore();
        }
      }

      // 5. Renderizar Soporte Universal con Bureta de 50 mL
      if (this.buretteStand && this.buretteStand.visible !== false) {
        this.renderBuretteStand(ctx);
        if (this.selectedInstrument === 'burette') {
          ctx.save();
          ctx.strokeStyle = '#0284C7';
          ctx.lineWidth = 3;
          ctx.setLineDash([6, 3]);
          ctx.strokeRect(this.buretteStand.baseX - 6, this.buretteStand.rodY - 6, this.buretteStand.baseW + 12, (this.buretteStand.baseY + this.buretteStand.baseH) - this.buretteStand.rodY + 12);
          ctx.restore();
        }
      }

      // 6. Renderizar Recipientes sobre la mesa
      this.vessels.forEach(v => this.renderVessel(ctx, v));

      // 7. Chorro de líquido si está trasvasando
      if (this.pouringState) {
        const p = this.pouringState;
        ctx.strokeStyle = this.getVesselLiquidColor(p.from);
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(p.from.x + p.from.width / 2 + 15, p.from.y + 15);
        ctx.lineTo(p.to.x + p.to.width / 2, p.to.y + 20);
        ctx.stroke();
      }

      // 8. Notificaciones HUD / Toasts en la base inferior
      this.renderNotifications(ctx, w);
    }

    renderBalance(ctx) {
      const b = this.balance;
      // Cuerpo de la balanza
      ctx.fillStyle = '#334155';
      ctx.fillRect(b.x, b.y, b.width, b.height);
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 2;
      ctx.strokeRect(b.x, b.y, b.width, b.height);

      // Plato de pesaje superior de acero inox
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(b.plateX, b.plateY, b.plateW, 8);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(b.plateX + 35, b.plateY + 8, 30, 6); // Soporte célula de carga

      // Pantalla LCD digital verde/azul
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(b.x + 15, b.y + 35, b.width - 30, 36);
      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 15px monospace';
      ctx.textAlign = 'right';
      const displayMass = Math.max(0, b.currentMass - b.tareOffset);
      ctx.fillText(`${displayMass.toFixed(2)} g`, b.x + b.width - 22, b.y + 58);

      // Botón TARA
      ctx.fillStyle = '#475569';
      ctx.fillRect(b.x + 20, b.y + 78, 45, 18);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TARA', b.x + 42, b.y + 90);

      // Marca
      ctx.fillStyle = '#94A3B8';
      ctx.font = '8px sans-serif';
      ctx.fillText('± 0.01g', b.x + 95, b.y + 90);
    }

    renderBunsen(ctx) {
      const b = this.bunsen;
      // Trípode con tela de asbesto (rejilla)
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(b.tripodX, b.tripodY + 140);
      ctx.lineTo(b.tripodX + 15, b.tripodY);
      ctx.lineTo(b.tripodX + b.tripodW - 15, b.tripodY);
      ctx.lineTo(b.tripodX + b.tripodW, b.tripodY + 140);
      ctx.stroke();

      // Malla de alambre con centro cerámico blanco
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(b.tripodX + 8, b.tripodY - 3, b.tripodW - 16, 6);
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(b.tripodX + 30, b.tripodY - 3, b.tripodW - 60, 6);

      // Mechero Bunsen abajo
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(b.x + 5, b.y + 75, b.width - 10, 15); // Base pesada
      ctx.fillStyle = '#64748B';
      ctx.fillRect(b.x + 20, b.y + 25, 10, 50); // Tubo de combustión

      // Llama animada si está encendido
      if (b.isOn) {
        const time = Date.now() / 60;
        const flicker = Math.sin(time) * 3;

        // Llama azul cónica interior (oxidante no luminosa)
        const flameGrad = ctx.createLinearGradient(b.x + 25, b.y + 25, b.x + 25, b.y - 30);
        flameGrad.addColorStop(0, '#38BDF8');
        flameGrad.addColorStop(0.5, '#60A5FA');
        flameGrad.addColorStop(1, '#93C5FD');

        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(b.x + 18, b.y + 25);
        ctx.quadraticCurveTo(b.x + 15, b.y - 10, b.x + 25 + flicker, b.y - 35);
        ctx.quadraticCurveTo(b.x + 35, b.y - 10, b.x + 32, b.y + 25);
        ctx.closePath();
        ctx.fill();
      }
    }

    renderBuretteStand(ctx) {
      const s = this.buretteStand;
      // Base y varilla del soporte universal
      ctx.fillStyle = '#334155';
      ctx.fillRect(s.baseX, s.baseY, s.baseW, s.baseH);
      ctx.fillRect(s.rodX, s.rodY, s.rodW, s.baseY - s.rodY);

      // Doble nuez y pinza de bureta
      ctx.fillStyle = '#64748B';
      ctx.fillRect(s.rodX, s.buretteY + 30, 48, 8);
      ctx.fillRect(s.rodX, s.buretteY + 160, 48, 8);

      // Tubo de vidrio de la bureta
      const bx = s.buretteX;
      const by = s.buretteY;
      const bw = s.buretteW;
      const bh = s.buretteH;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, by, bw, bh);

      // Nivel de NaOH dentro de la bureta
      const fillRatio = (50.0 - s.volumeAddedMl) / 50.0;
      const liquidH = bh * fillRatio;
      const liquidY = by + (bh - liquidH);

      ctx.fillStyle = 'rgba(186, 230, 253, 0.7)';
      ctx.fillRect(bx + 2, liquidY, bw - 4, liquidH);

      // Graduaciones milimétricas
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 50; i += 5) {
        const markY = by + (i / 50) * bh;
        ctx.beginPath();
        ctx.moveTo(bx + bw - 6, markY);
        ctx.lineTo(bx + bw, markY);
        ctx.stroke();
      }

      // Llave de paso (Stopcock) interactiva
      const stopY = by + bh + 8;
      ctx.fillStyle = s.isDripping ? '#22C55E' : '#EF4444';
      ctx.fillRect(bx + 4, stopY - 5, bw - 8, 10);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(bx - 3, stopY - 2, bw + 6, 4);

      // Punta cónica de vidrio
      ctx.fillStyle = 'rgba(226, 232, 240, 0.8)';
      ctx.beginPath();
      ctx.moveTo(bx + 8, stopY + 5);
      ctx.lineTo(bx + 16, stopY + 5);
      ctx.lineTo(s.tipX + 1, s.tipY);
      ctx.lineTo(s.tipX - 1, s.tipY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Gota cayendo
      if (s.isDripping) {
        ctx.fillStyle = '#60A5FA';
        ctx.beginPath();
        ctx.arc(s.tipX, s.tipY + (this.dripAnimY % 45), 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Placa identificadora del reactivo cargado en la parte superior de la bureta
      ctx.save();
      const tagX = bx + bw / 2;
      const tagY = by - 10;
      const chemName = s.reagentName || 'Hidróxido de Sodio (NaOH 0.1 M)';
      const tagText = chemName.length > 22 ? chemName.slice(0, 20) + '...' : chemName;
      const tagVol = `${Math.max(0, 50.0 - s.volumeAddedMl).toFixed(1)} / 50 mL`;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 1.5;
      const boxW = Math.max(105, ctx.measureText ? ctx.measureText(tagText).width + 24 : 105);
      const boxH = 24;
      const boxX = tagX - boxW / 2;
      const boxY = tagY - boxH;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(boxX, boxY, boxW, boxH, 4);
      else ctx.rect(boxX, boxY, boxW, boxH);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tagText, tagX, boxY + 10);
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 8.5px monospace';
      ctx.fillText(tagVol, tagX, boxY + 20);

      // Rótulo descriptivo completo al pie del soporte universal
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Bureta: ${chemName}`, s.baseX + s.baseW / 2, s.baseY + s.baseH + 13);
      ctx.fillStyle = s.isDripping ? '#16A34A' : '#475569';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`Dosificado: ${s.volumeAddedMl.toFixed(1)} mL | ${s.isDripping ? '💧 FLUJO ACTIVO' : '⏸️ LLAVE CERRADA'}`, s.baseX + s.baseW / 2, s.baseY + s.baseH + 25);
      ctx.restore();
    }

    renderVessel(ctx, v) {
      ctx.save();
      ctx.translate(v.x + v.width / 2, v.y + v.height / 2);
      if (v.tiltAngle) {
        ctx.rotate((v.tiltAngle * Math.PI) / 180);
      }
      ctx.translate(-(v.x + v.width / 2), -(v.y + v.height / 2));

      // Resaltar si está seleccionado
      if (v === this.selectedVessel) {
        ctx.strokeStyle = '#0284C7';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(v.x - 4, v.y - 4, v.width + 8, v.height + 8);
      }

      const totalVol = this.getVesselTotalVolume(v);
      const fillRatio = Math.min(1.0, totalVol / v.capacity);
      const liquidColor = this.getVesselLiquidColor(v);

      if (v.type === 'beaker') {
        // Vaso de Precipitados
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fillRect(v.x, v.y, v.width, v.height);
        ctx.strokeRect(v.x, v.y, v.width, v.height);

        // Pico vertedor a la izquierda
        ctx.beginPath();
        ctx.moveTo(v.x, v.y);
        ctx.lineTo(v.x - 6, v.y - 4);
        ctx.stroke();

        // Líquido
        if (fillRatio > 0) {
          const lH = (v.height - 10) * fillRatio;
          ctx.fillStyle = liquidColor;
          ctx.fillRect(v.x + 2, v.y + v.height - lH, v.width - 4, lH);
        }

      } else if (v.type === 'erlenmeyer') {
        // Matraz Erlenmeyer cónico
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(v.x + v.width * 0.35, v.y); // Cuello
        ctx.lineTo(v.x + v.width * 0.35, v.y + 20);
        ctx.lineTo(v.x, v.y + v.height); // Fondo
        ctx.lineTo(v.x + v.width, v.y + v.height);
        ctx.lineTo(v.x + v.width * 0.65, v.y + 20);
        ctx.lineTo(v.x + v.width * 0.65, v.y);
        ctx.closePath();

        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();

        ctx.clip();

        // Líquido cónico
        if (fillRatio > 0) {
          const lH = (v.height - 15) * fillRatio;
          ctx.fillStyle = liquidColor;
          ctx.fillRect(v.x, v.y + v.height - lH, v.width, lH);
        }
        ctx.restore();

      } else if (v.type === 'cylinder') {
        // Probeta graduada alargada
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fillRect(v.x, v.y, v.width, v.height);
        ctx.strokeRect(v.x, v.y, v.width, v.height);

        // Base ancha hexagonal
        ctx.fillRect(v.x - 10, v.y + v.height - 8, v.width + 20, 8);

        // Líquido
        if (fillRatio > 0) {
          const lH = (v.height - 15) * fillRatio;
          ctx.fillStyle = liquidColor;
          ctx.fillRect(v.x + 2, v.y + v.height - 8 - lH, v.width - 4, lH);
        }

      } else if (v.type === 'tube') {
        // Gradilla de acrílico con tubos
        ctx.fillStyle = '#CBD5E1';
        ctx.fillRect(v.x, v.y + v.height - 10, v.width, 10);
        ctx.fillRect(v.x, v.y + 24, v.width, 6);
        ctx.fillStyle = '#94A3B8';
        ctx.fillRect(v.x + 2, v.y + 24, 4, v.height - 24);
        ctx.fillRect(v.x + v.width - 6, v.y + 24, 4, v.height - 24);

        // 3 tubos de ensayo
        const tubeSpacing = (v.width - 24) / 2;
        for (let i = 0; i < 3; i++) {
          const tx = v.x + 6 + i * tubeSpacing;
          const ty = v.y + 5;
          const tw = 12;
          const th = v.height - 15;
          ctx.strokeStyle = '#64748B';
          ctx.lineWidth = 1.5;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
          ctx.strokeRect(tx, ty, tw, th);
          ctx.fillRect(tx, ty, tw, th);
          if (fillRatio > 0) {
            const tlH = (th - 8) * fillRatio;
            ctx.fillStyle = liquidColor;
            ctx.fillRect(tx + 1, ty + th - tlH - 1, tw - 2, tlH);
          }
        }

      } else if (v.type === 'pipette') {
        const cx = v.x + v.width / 2;
        // Tubo de vidrio alargado
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 1.5;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.strokeRect(cx - 4, v.y + 35, 8, v.height - 45);
        ctx.fillRect(cx - 4, v.y + 35, 8, v.height - 45);

        // Punta fina
        ctx.beginPath();
        ctx.moveTo(cx - 4, v.y + v.height - 10);
        ctx.lineTo(cx, v.y + v.height);
        ctx.lineTo(cx + 4, v.y + v.height - 10);
        ctx.stroke();

        if (fillRatio > 0) {
          const lH = (v.height - 50) * fillRatio;
          ctx.fillStyle = liquidColor;
          ctx.fillRect(cx - 3, v.y + v.height - 10 - lH, 6, lH);
        }

        // Pera de propipeta de goma roja
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.ellipse(cx, v.y + 18, 10, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#B91C1C';
        ctx.stroke();

      } else if (v.type === 'funnel') {
        const cx = v.x + v.width / 2;
        // Aro soporte
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 3;
        ctx.strokeRect(v.x, v.y + 32, v.width, 4);

        // Embudo cónico de vidrio
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.moveTo(v.x + 5, v.y + 10);
        ctx.lineTo(cx - 3, v.y + 55);
        ctx.lineTo(cx - 3, v.y + v.height);
        ctx.lineTo(cx + 3, v.y + v.height);
        ctx.lineTo(cx + 3, v.y + 55);
        ctx.lineTo(v.x + v.width - 5, v.y + 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Papel de filtro blanco interior
        ctx.fillStyle = '#F8FAFC';
        ctx.beginPath();
        ctx.moveTo(v.x + 10, v.y + 14);
        ctx.lineTo(cx, v.y + 50);
        ctx.lineTo(v.x + v.width - 10, v.y + 14);
        ctx.closePath();
        ctx.fill();

        if (fillRatio > 0) {
          ctx.fillStyle = liquidColor;
          ctx.beginPath();
          ctx.moveTo(cx - 10, v.y + 32);
          ctx.lineTo(cx, v.y + 48);
          ctx.lineTo(cx + 10, v.y + 32);
          ctx.closePath();
          ctx.fill();
        }

      } else if (v.type === 'mortar') {
        const cx = v.x + v.width / 2;
        // Cuenco de porcelana blanca
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(cx, v.y + v.height - 15, v.width / 2, 14, 0, 0, Math.PI);
        ctx.lineTo(v.x + 4, v.y + 16);
        ctx.ellipse(cx, v.y + 16, v.width / 2 - 4, 8, 0, Math.PI, 0, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Pico vertedor
        ctx.beginPath();
        ctx.moveTo(v.x + 2, v.y + 16);
        ctx.lineTo(v.x - 6, v.y + 13);
        ctx.stroke();

        if (fillRatio > 0) {
          ctx.fillStyle = liquidColor;
          ctx.beginPath();
          ctx.ellipse(cx, v.y + v.height - 18, v.width / 2 - 12, 6, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Pistilo de porcelana
        ctx.save();
        ctx.translate(cx + 6, v.y + 18);
        ctx.rotate(-0.35);
        ctx.fillStyle = '#E2E8F0';
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 2;
        ctx.fillRect(-6, -20, 12, 45);
        ctx.strokeRect(-6, -20, 12, 45);
        ctx.restore();

      } else if (v.type === 'distillation') {
        const bx = v.x + 28;
        const by = v.y + v.height - 28;
        // Balón de destilación redondo
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(bx, by, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Cuello y termómetro
        ctx.fillRect(bx - 5, v.y + 15, 10, by - 15);
        ctx.strokeRect(bx - 5, v.y + 15, 10, by - 15);
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(bx - 2, v.y + 6, 4, 18);

        // Tubo condensador Liebig inclinado
        ctx.save();
        ctx.strokeStyle = '#0284C7';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(bx + 4, v.y + 35);
        ctx.lineTo(v.x + v.width - 15, v.y + 70);
        ctx.stroke();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();

        // Matraz receptor
        const rx = v.x + v.width - 25;
        const ry = v.y + v.height - 25;
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(rx - 8, ry - 10, 16, 20);

        if (fillRatio > 0) {
          ctx.fillStyle = liquidColor;
          ctx.beginPath();
          ctx.arc(bx, by + 4, 16, 0, Math.PI);
          ctx.fill();
        }

      } else if (v.type === 'centrifuge') {
        // Carcasa cilíndrica de centrífuga
        ctx.fillStyle = '#E2E8F0';
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 2.5;
        ctx.fillRect(v.x, v.y + 12, v.width, v.height - 12);
        ctx.strokeRect(v.x, v.y + 12, v.width, v.height - 12);

        // Tapa abovedada
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.ellipse(v.x + v.width / 2, v.y + 14, v.width / 2 - 4, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tacómetro digital
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(v.x + 8, v.y + 34, v.width - 16, 20);
        ctx.fillStyle = '#22C55E';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('3000 RPM', v.x + v.width / 2, v.y + 48);

        // Botón Start
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(v.x + v.width / 2, v.y + v.height - 10, 5, 0, Math.PI * 2);
        ctx.fill();

      } else if (v.type === 'thermometer') {
        const cx = v.x + v.width / 2;
        // Cuerpo digital
        ctx.fillStyle = '#F59E0B';
        ctx.strokeStyle = '#D97706';
        ctx.lineWidth = 2;
        ctx.fillRect(v.x + 2, v.y, v.width - 4, 45);
        ctx.strokeRect(v.x + 2, v.y, v.width - 4, 45);

        // Pantalla
        ctx.fillStyle = '#FEF08A';
        ctx.fillRect(v.x + 4, v.y + 8, v.width - 8, 16);
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${v.temperature.toFixed(1)}°C`, cx, v.y + 20);

        // Sonda metálica
        ctx.fillStyle = '#94A3B8';
        ctx.fillRect(cx - 2, v.y + 45, 4, v.height - 45);

      } else if (v.type === 'ph_meter') {
        const cx = v.x + v.width / 2;
        // Cuerpo tester
        ctx.fillStyle = '#0284C7';
        ctx.strokeStyle = '#0369A1';
        ctx.lineWidth = 2;
        ctx.fillRect(v.x + 2, v.y, v.width - 4, 52);
        ctx.strokeRect(v.x + 2, v.y, v.width - 4, 52);

        // LCD
        ctx.fillStyle = '#E0F2FE';
        ctx.fillRect(v.x + 4, v.y + 8, v.width - 8, 18);
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`pH ${this.getVesselPH(v).toFixed(1)}`, cx, v.y + 21);

        // Electrodo
        ctx.fillStyle = '#334155';
        ctx.fillRect(cx - 2, v.y + 52, 4, v.height - 60);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.beginPath();
        ctx.arc(cx, v.y + v.height - 4, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Burbujas de ebullición / efervescencia
      v.bubbles.forEach(b => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Etiqueta compacta inferior en la base del recipiente
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${totalVol.toFixed(1)} mL`, v.x + v.width / 2, v.y + v.height + 14);
      ctx.fillStyle = '#475569';
      ctx.font = '9px monospace';
      ctx.fillText(`pH: ${this.getVesselPH(v).toFixed(1)} | ${v.temperature.toFixed(0)}°C`, v.x + v.width / 2, v.y + v.height + 26);

      // Mostrar el contenido químico debajo del recipiente
      const summary = this.getVesselContentsSummary(v);
      if (summary.length > 0) {
        ctx.fillStyle = '#0284C7';
        ctx.font = 'bold 8.5px sans-serif';
        const chemNames = summary.map(item => item.name.split('(')[0].trim()).slice(0, 2).join(' + ');
        ctx.fillText(chemNames, v.x + v.width / 2, v.y + v.height + 38);
      } else {
        ctx.fillStyle = '#94A3B8';
        ctx.font = 'italic 8.5px sans-serif';
        ctx.fillText('(Vacío)', v.x + v.width / 2, v.y + v.height + 38);
      }

      ctx.restore();
    }

    renderVesselFloatingHUD(ctx, v) {
      if (!v) return;
      const totalVol = this.getVesselTotalVolume(v);
      const totalMass = this.getVesselTotalMass(v);
      const ph = this.getVesselPH(v);
      const summary = this.getVesselContentsSummary(v);

      const cardW = 280;
      const lineH = 16;
      const cardH = 58 + (summary.length > 0 ? summary.length * lineH + 18 : 28);
      // Posicionar abajo centrado respecto al recipiente para nunca tapar el instrumental
      let cardX = Math.max(16, Math.min(this.benchCanvas.width - cardW - 16, v.x + v.width / 2 - cardW / 2));
      let cardY = this.benchCanvas.height - cardH - 10;

      ctx.save();
      // Fondo oscuro translúcido con sombra
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.5;
      this.drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 8);
      ctx.fill();
      ctx.stroke();
      ctx.shadowColor = 'transparent';

      // Título del recipiente
      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`⚗️ ${v.name}`, cardX + 12, cardY + 18);

      // Volumen y masa
      ctx.fillStyle = '#CBD5E1';
      ctx.font = '10px sans-serif';
      ctx.fillText(`Volumen: ${totalVol.toFixed(1)} mL / ${v.capacity} mL • Masa: ${totalMass.toFixed(1)} g (Tara: ${v.tareMass}g)`, cardX + 12, cardY + 34);

      // Línea divisoria
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cardX + 10, cardY + 40);
      ctx.lineTo(cardX + cardW - 10, cardY + 40);
      ctx.stroke();

      // Lista detallada de sustancias y cantidades
      let curY = cardY + 54;
      if (summary.length === 0) {
        ctx.fillStyle = '#94A3B8';
        ctx.font = 'italic 10px sans-serif';
        ctx.fillText('Recipiente vacío (Listo para verter reactivos)', cardX + 12, curY);
        curY += 14;
      } else {
        ctx.font = '10px sans-serif';
        summary.forEach(item => {
          ctx.fillStyle = item.color;
          ctx.fillText(`${item.icon} ${item.name}: ${item.amount.toFixed(1)} ${item.unit}`, cardX + 12, curY);
          curY += lineH;
        });
      }

      // Parámetros fisicoquímicos en la base
      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`pH: ${ph.toFixed(2)} • Temp: ${v.temperature.toFixed(0)}°C`, cardX + 12, curY + 6);
      ctx.restore();
    }

    
    drawRoundedRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    renderNotifications(ctx, w) {
      const now = Date.now();
      const h = this.benchCanvas.height;
      let bottomY = h - 14;
      this.notifications.slice(-3).reverse().forEach((notif) => {
        const age = (now - notif.createdAt) / 1000;
        if (age > 4.5) return;
        const alpha = Math.max(0, 1.0 - (age / 4.5));

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        this.drawRoundedRect(ctx, w / 2 - 180, bottomY - 24, 360, 24, 6);
        ctx.fill();
        ctx.strokeStyle = '#0284C7';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#F8FAFC';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(notif.text, w / 2, bottomY - 8);
        ctx.restore();

        bottomY -= 28;
      });
    }

    renderMeniscus() {
      if (!this.ctxMeniscus) return;
      const ctx = this.ctxMeniscus;
      const w = this.meniscusCanvas.width;
      const h = this.meniscusCanvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) / 2 - 4;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(0, 0, w, h);

      const meniscusY = cy;
      ctx.fillStyle = 'rgba(147, 197, 253, 0.65)';
      ctx.beginPath();
      ctx.moveTo(20, meniscusY);
      ctx.quadraticCurveTo(cx, meniscusY + 18, w - 20, meniscusY);
      ctx.lineTo(w - 20, h);
      ctx.lineTo(20, h);
      ctx.closePath();
      ctx.fill();

      // Borde cóncavo azul
      ctx.strokeStyle = '#1D4ED8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(20, meniscusY);
      ctx.quadraticCurveTo(cx, meniscusY + 18, w - 20, meniscusY);
      ctx.stroke();

      // Graduaciones milimétricas
      const curV = this.buretteStand.volumeAddedMl;
      ctx.strokeStyle = '#0F172A';
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 9px sans-serif';

      for (let offset = -4; offset <= 4; offset++) {
        const lineY = meniscusY + (offset * 14);
        const val = (curV + (offset * 0.1)).toFixed(1);
        ctx.beginPath();
        if (offset % 2 === 0) {
          ctx.lineWidth = 2;
          ctx.moveTo(w - 35, lineY);
          ctx.lineTo(w - 10, lineY);
          ctx.stroke();
          ctx.fillText(`${val}`, w - 62, lineY + 3);
        } else {
          ctx.lineWidth = 1;
          ctx.moveTo(w - 25, lineY);
          ctx.lineTo(w - 10, lineY);
          ctx.stroke();
        }
      }

      // Tangente roja de lectura
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(10, meniscusY + 18);
      ctx.lineTo(w - 10, meniscusY + 18);
      ctx.stroke();
      ctx.setLineDash([]);

      // Identificador del reactivo dentro de la lente de aumento
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('NaOH 0.1 M (Base)', cx, 20);
      ctx.fillStyle = '#0284C7';
      ctx.font = 'bold 9.5px monospace';
      ctx.fillText(`V: ${curV.toFixed(2)} mL`, cx, h - 12);

      ctx.restore();

      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    renderGraph() {
      if (!this.ctxGraph) return;
      const ctx = this.ctxGraph;
      const w = this.graphCanvas.width;
      const h = this.graphCanvas.height;
      ctx.clearRect(0, 0, w, h);

      const padL = 35;
      const padR = 15;
      const padT = 20;
      const padB = 25;
      const plotW = w - padL - padR;
      const plotH = h - padT - padB;

      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padL, padT);
      ctx.lineTo(padL, h - padB);
      ctx.lineTo(w - padR, h - padB);
      ctx.stroke();

      // Cuadrícula y pH
      ctx.font = '9px sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.textAlign = 'right';

      [0, 4, 7, 10, 14].forEach(phVal => {
        const y = h - padB - (phVal / 14) * plotH;
        ctx.fillText(`${phVal}`, padL - 5, y + 3);
        ctx.strokeStyle = (phVal === 7) ? '#FCA5A5' : '#E2E8F0';
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(w - padR, y);
        ctx.stroke();
      });

      // Zona de viraje fenolftaleína (8.2 - 10.0)
      const yVirajeTop = h - padB - (10.0 / 14) * plotH;
      const yVirajeBottom = h - padB - (8.2 / 14) * plotH;
      ctx.fillStyle = 'rgba(244, 63, 94, 0.15)';
      ctx.fillRect(padL, yVirajeTop, plotW, yVirajeBottom - yVirajeTop);

      // Trazo
      if (this.titrationHistory.length > 1) {
        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        this.titrationHistory.forEach((pt, idx) => {
          const x = padL + (pt.v / 50) * plotW;
          const y = h - padB - (pt.ph / 14) * plotH;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }
    }

    // =======================================================================
    // 6. EVENTOS DE ARRASTRE Y CLIC DE RATÓN (FLUIDO, 60 FPS, TOUCH & MOUSE)
    // =======================================================================
    bindMouseEvents() {
      if (!this.benchCanvas) return;

      const getPos = (e) => {
        const rect = this.benchCanvas.getBoundingClientRect();
        const clientX = (e.touches && e.touches.length > 0) ? e.touches[0].clientX : (e.clientX || 0);
        const clientY = (e.touches && e.touches.length > 0) ? e.touches[0].clientY : (e.clientY || 0);
        const scaleX = rect.width > 0 ? (this.benchCanvas.width / rect.width) : 1;
        const scaleY = rect.height > 0 ? (this.benchCanvas.height / rect.height) : 1;
        return {
          x: (clientX - rect.left) * scaleX,
          y: (clientY - rect.top) * scaleY
        };
      };

      const onStart = (e) => {
        const pos = getPos(e);

        // 1. Verificar primero recipientes para selección o arrastre (Painter's order: de arriba hacia abajo)
        let clickedVessel = null;
        for (let i = this.vessels.length - 1; i >= 0; i--) {
          const v = this.vessels[i];
          if (pos.x >= v.x - 12 && pos.x <= v.x + v.width + 12 &&
              pos.y >= v.y - 12 && pos.y <= v.y + v.height + 12) {
            clickedVessel = v;
            if (e.cancelable) e.preventDefault();
            this.draggedVessel = v;
            this.selectedVessel = v;
            this.selectedInstrument = null;
            this.dragOffsetX = pos.x - v.x;
            this.dragOffsetY = pos.y - v.y;
            this.benchCanvas.style.cursor = 'grabbing';

            // Traer el recipiente seleccionado al frente
            this.vessels.splice(i, 1);
            this.vessels.push(v);
            break;
          }
        }

        if (clickedVessel) {
          if (window.App && window.App.updateDigitalSensorsUI) window.App.updateDigitalSensorsUI();
          return;
        }

        // 2. Verificar clic en la Bureta o Soporte Universal
        if (this.buretteStand && this.buretteStand.visible !== false) {
          const s = this.buretteStand;
          const bx = s.buretteX;
          const by = s.buretteY + s.buretteH;
          // Clic directo en la llave
          if (pos.x >= bx - 15 && pos.x <= bx + 45 && pos.y >= by - 5 && pos.y <= by + 30) {
            if (e.cancelable) e.preventDefault();
            s.isDripping = !s.isDripping;
            this.selectedInstrument = 'burette';
            this.selectedVessel = null;
            this.showToast(s.isDripping ? '💧 Llave de bureta abierta (Flujo activo).' : '⏸️ Llave de bureta cerrada.');
            if (window.App && window.App.updateDigitalSensorsUI) window.App.updateDigitalSensorsUI();
            return;
          }
          // Clic en soporte o bureta completa (Selección y Arrastre libre por la mesa)
          if (pos.x >= s.baseX - 10 && pos.x <= s.baseX + s.baseW + 10 &&
              pos.y >= s.rodY - 10 && pos.y <= s.baseY + s.baseH + 10) {
            if (e.cancelable) e.preventDefault();
            this.selectedInstrument = 'burette';
            this.selectedVessel = null;
            this.draggedInstrument = 'burette';
            this.dragOffsetX = pos.x - s.baseX;
            this.benchCanvas.style.cursor = 'grabbing';
            this.showToast('💧 Soporte y Bureta seleccionados. Arrastre con el ratón para reubicar.');
            if (window.App && window.App.updateDigitalSensorsUI) window.App.updateDigitalSensorsUI();
            return;
          }
        }

        // 3. Verificar clic en la Balanza Analítica Digital (Selección y Arrastre)
        if (this.balance && this.balance.visible !== false) {
          const b = this.balance;
          if (pos.x >= b.x - 5 && pos.x <= b.x + b.width + 5 &&
              pos.y >= b.y - 5 && pos.y <= b.y + b.height + 5) {
            if (e.cancelable) e.preventDefault();
            // Botón TARA
            if (pos.x >= b.x + 10 && pos.x <= b.x + 75 && pos.y >= b.y + 65 && pos.y <= b.y + 110) {
              b.tareOffset = b.currentMass;
              this.showToast('⚖️ Balanza tarada a 0.00 g.');
            } else {
              this.showToast('⚖️ Balanza analítica seleccionada. Arrastre con el ratón para reubicar.');
            }
            this.selectedInstrument = 'balance';
            this.selectedVessel = null;
            this.draggedInstrument = 'balance';
            this.dragOffsetX = pos.x - b.x;
            this.benchCanvas.style.cursor = 'grabbing';
            if (window.App && window.App.updateDigitalSensorsUI) window.App.updateDigitalSensorsUI();
            return;
          }
        }

        // 4. Verificar clic en el Mechero Bunsen (Selección y Arrastre)
        if (this.bunsen && this.bunsen.visible !== false) {
          const bu = this.bunsen;
          if (pos.x >= bu.tripodX - 15 && pos.x <= bu.tripodX + bu.tripodW + 15 &&
              pos.y >= bu.tripodY - 15 && pos.y <= bu.y + bu.height + 15) {
            if (e.cancelable) e.preventDefault();
            this.selectedInstrument = 'bunsen';
            this.selectedVessel = null;
            this.draggedInstrument = 'bunsen';
            this.dragOffsetX = pos.x - bu.x;
            this.benchCanvas.style.cursor = 'grabbing';
            this.showToast(bu.isOn ? '🔥 Mechero Bunsen activo. Arrastre con el ratón para reubicar.' : '💨 Mechero Bunsen apagado. Arrastre con el ratón para reubicar.');
            if (window.App && window.App.updateDigitalSensorsUI) window.App.updateDigitalSensorsUI();
            return;
          }
        }
      };

      const onMove = (e) => {
        const pos = getPos(e);
        if (this.draggedVessel) {
          if (e.cancelable) e.preventDefault();
          let targetX = Math.max(10, Math.min(this.benchCanvas.width - this.draggedVessel.width - 10, pos.x - this.dragOffsetX));
          let targetY = Math.max(40, Math.min(this.benchCanvas.height - this.draggedVessel.height - 10, pos.y - this.dragOffsetY));

          // Magnetismo / Snap si se acerca a la punta de la bureta
          if (this.buretteStand && this.buretteStand.visible !== false) {
            const underBuretteX = this.buretteStand.tipX - this.draggedVessel.width / 2;
            if (Math.abs(targetX - underBuretteX) < 32 && targetY >= this.buretteStand.tipY - 15) {
              targetX = underBuretteX;
              targetY = 405; // Centrado perfecto sobre la mesa
            }
          }

          this.draggedVessel.x = targetX;
          this.draggedVessel.y = targetY;
          this.benchCanvas.style.cursor = 'grabbing';
        } else if (this.draggedInstrument === 'balance') {
          if (e.cancelable) e.preventDefault();
          const newX = Math.max(10, Math.min(this.benchCanvas.width - this.balance.width - 10, pos.x - this.dragOffsetX));
          this.balance.x = newX;
          this.balance.plateX = newX + 25;
          this.benchCanvas.style.cursor = 'grabbing';
          if (window.App && window.App.updateDigitalSensorsUI) window.App.updateDigitalSensorsUI();
        } else if (this.draggedInstrument === 'bunsen') {
          if (e.cancelable) e.preventDefault();
          const newX = Math.max(35, Math.min(this.benchCanvas.width - this.bunsen.tripodW - 10, pos.x - this.dragOffsetX));
          this.bunsen.x = newX;
          this.bunsen.tripodX = newX - 30;
          this.benchCanvas.style.cursor = 'grabbing';
          if (window.App && window.App.updateDigitalSensorsUI) window.App.updateDigitalSensorsUI();
        } else if (this.draggedInstrument === 'burette') {
          if (e.cancelable) e.preventDefault();
          const newBaseX = Math.max(10, Math.min(this.benchCanvas.width - this.buretteStand.baseW - 10, pos.x - this.dragOffsetX));
          this.buretteStand.baseX = newBaseX;
          this.buretteStand.rodX = newBaseX + 30;
          this.buretteStand.buretteX = newBaseX + 90;
          this.buretteStand.tipX = newBaseX + 105;
          this.benchCanvas.style.cursor = 'grabbing';
          if (window.App && window.App.updateDigitalSensorsUI) window.App.updateDigitalSensorsUI();
        } else {
          // Si el cursor pasa sobre un recipiente o instrumento arrastrable, cambiar a 'grab'
          let isOver = false;
          for (let i = this.vessels.length - 1; i >= 0; i--) {
            const v = this.vessels[i];
            if (pos.x >= v.x && pos.x <= v.x + v.width && pos.y >= v.y && pos.y <= v.y + v.height) {
              isOver = true;
              break;
            }
          }
          if (!isOver && this.balance && this.balance.visible !== false) {
            const b = this.balance;
            if (pos.x >= b.x && pos.x <= b.x + b.width && pos.y >= b.y && pos.y <= b.y + b.height) isOver = true;
          }
          if (!isOver && this.bunsen && this.bunsen.visible !== false) {
            const bu = this.bunsen;
            if (pos.x >= bu.tripodX && pos.x <= bu.tripodX + bu.tripodW && pos.y >= bu.tripodY && pos.y <= bu.y + bu.height) isOver = true;
          }
          if (!isOver && this.buretteStand && this.buretteStand.visible !== false) {
            const s = this.buretteStand;
            if (pos.x >= s.baseX && pos.x <= s.baseX + s.baseW && pos.y >= s.rodY && pos.y <= s.baseY + s.baseH) isOver = true;
          }
          this.benchCanvas.style.cursor = isOver ? 'grab' : 'default';
        }
      };

      const onEnd = () => {
        if (this.draggedInstrument) {
          this.draggedInstrument = null;
          this.benchCanvas.style.cursor = 'default';
          if (window.App && window.App.updateDigitalSensorsUI) window.App.updateDigitalSensorsUI();
        }
        if (this.draggedVessel) {
          const v1 = this.draggedVessel;
          // Comprobar si se soltó sobre otro recipiente para trasvasar automáticamente
          const target = this.vessels.find(v2 => v2 !== v1 && (
            Math.abs((v1.x + v1.width / 2) - (v2.x + v2.width / 2)) < 55 &&
            Math.abs(v1.y - v2.y) < 70
          ));

          if (target) {
            this.startPouring(v1, target, 25);
          } else {
            // Comprobar si se colocó en la balanza
            const vCenter = v1.x + v1.width / 2;
            const vBottom = v1.y + v1.height;
            if (vCenter >= this.balance.x && vCenter <= this.balance.x + this.balance.width &&
                vBottom >= this.balance.plateY - 35 && vBottom <= this.balance.plateY + 45) {
              v1.y = this.balance.plateY - v1.height;
              this.showToast(`⚖️ ${v1.name} colocado en el plato de la balanza.`);
            }

            // Comprobar si se colocó sobre el trípode del mechero
            if (vCenter >= this.bunsen.tripodX && vCenter <= this.bunsen.tripodX + this.bunsen.tripodW &&
                vBottom >= this.bunsen.tripodY - 35 && vBottom <= this.bunsen.tripodY + 45) {
              v1.y = this.bunsen.tripodY - v1.height;
              this.showToast(`🔥 ${v1.name} colocado sobre el trípode del mechero Bunsen.`);
            }
          }

          this.draggedVessel = null;
          this.benchCanvas.style.cursor = 'default';
        }
      };

      // Listeners de Ratón
      this.benchCanvas.addEventListener('mousedown', onStart);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);

      // Listeners de Touch
      this.benchCanvas.addEventListener('touchstart', onStart, { passive: false });
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onEnd);
    }
  }

  // =========================================================================
  // 2. MÓDULO CINÉTICA: PARTÍCULAS Y ESTADOS DE LA MATERIA
  // =========================================================================
  class ParticleKineticSimulation {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.particles = [];
      this.temperatureC = 25.0;
      this.stateMode = 'liquid';
      this.particleCount = 50;
      this.animId = null;
      this.initParticles();
    }

    initParticles() {
      this.particles = [];
      const w = this.canvas ? this.canvas.width : 400;
      const h = this.canvas ? this.canvas.height : 260;
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
          x: 40 + Math.random() * (w - 80),
          y: 40 + Math.random() * (h - 80),
          baseX: 50 + (i % 10) * 28,
          baseY: 120 + Math.floor(i / 10) * 24,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: 6
        });
      }
    }

    setTemperature(tempC) {
      this.temperatureC = parseFloat(tempC);
      if (this.temperatureC < 0) this.stateMode = 'solid';
      else if (this.temperatureC <= 100) this.stateMode = 'liquid';
      else this.stateMode = 'gas';
    }

    start() {
      if (this.animId) cancelAnimationFrame(this.animId);
      const loop = () => {
        this.update();
        this.render();
        this.animId = requestAnimationFrame(loop);
      };
      this.animId = requestAnimationFrame(loop);
    }

    stop() {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    }

    update() {
      if (!this.canvas) return;
      const w = this.canvas.width;
      const h = this.canvas.height;
      const speedFactor = Math.max(0.2, (this.temperatureC + 60) / 70);

      this.particles.forEach(p => {
        if (this.stateMode === 'solid') {
          const jitter = (this.temperatureC + 60) * 0.03;
          p.x = p.baseX + (Math.random() - 0.5) * jitter;
          p.y = p.baseY + (Math.random() - 0.5) * jitter;
        } else if (this.stateMode === 'liquid') {
          p.x += p.vx * speedFactor;
          p.y += (p.vy * speedFactor) + 0.35;
          if (p.x < 20 || p.x > w - 20) p.vx *= -1;
          if (p.y > h - 25) { p.y = h - 25; p.vy *= -0.7; }
          if (p.y < h - 110) p.vy += 0.2;
        } else {
          p.x += p.vx * speedFactor * 2.2;
          p.y += p.vy * speedFactor * 2.2;
          if (p.x < 15 || p.x > w - 15) p.vx *= -1;
          if (p.y < 15 || p.y > h - 20) p.vy *= -1;
        }
      });
    }

    render() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 3;
      ctx.strokeRect(10, 10, w - 20, h - 20);

      this.particles.forEach(p => {
        let pColor = '#38BDF8';
        if (this.stateMode === 'solid') pColor = '#818CF8';
        else if (this.stateMode === 'gas') pColor = '#F87171';

        ctx.fillStyle = pColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`Estado: ${this.stateMode.toUpperCase()}`, 20, 30);
      ctx.fillText(`Temp: ${this.temperatureC.toFixed(1)} °C`, 20, 48);
    }
  }

  // =========================================================================
  // 3. CONSTRUCTOR ATÓMICO: ÓRBITAS DE BOHR
  // =========================================================================
  class AtomicModelVisualizer {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.protons = 6;
      this.neutrons = 6;
      this.electrons = 6;
      this.orbitAngle = 0;
      this.animId = null;
    }

    setComposition(p, n, e) {
      this.protons = parseInt(p, 10);
      this.neutrons = parseInt(n, 10);
      this.electrons = parseInt(e, 10);
    }

    start() {
      if (this.animId) cancelAnimationFrame(this.animId);
      const loop = () => {
        this.update();
        this.render();
        this.animId = requestAnimationFrame(loop);
      };
      this.animId = requestAnimationFrame(loop);
    }

    stop() {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    }

    update() {
      this.orbitAngle += 0.025;
    }

    render() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = '#0B1120';
      ctx.fillRect(0, 0, w, h);

      const shells = [];
      let rem = this.electrons;
      [2, 8, 18, 32].forEach((cap, idx) => {
        if (rem > 0) {
          const take = Math.min(rem, cap);
          shells.push({ level: idx + 1, radius: 45 + idx * 32, count: take });
          rem -= take;
        }
      });

      shells.forEach((shell, sIdx) => {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.arc(cx, cy, shell.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        for (let i = 0; i < shell.count; i++) {
          const angle = this.orbitAngle * (sIdx % 2 === 0 ? 1 : -1) + (i * (Math.PI * 2) / shell.count);
          const ex = cx + shell.radius * Math.cos(angle);
          const ey = cy + shell.radius * Math.sin(angle);
          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.arc(ex, ey, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Núcleo
      const totalNucleons = this.protons + this.neutrons;
      const nRad = Math.max(14, Math.min(30, 10 + Math.sqrt(totalNucleons) * 3));
      for (let p = 0; p < this.protons; p++) {
        const pAng = (p * 2.39996) + 0.2;
        const pDist = (p / Math.max(1, this.protons)) * (nRad - 5);
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(cx + Math.cos(pAng) * pDist, cy + Math.sin(pAng) * pDist, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let n = 0; n < this.neutrons; n++) {
        const nAng = (n * 2.39996) + 1.4;
        const nDist = (n / Math.max(1, this.neutrons)) * (nRad - 5);
        ctx.fillStyle = '#94A3B8';
        ctx.beginPath();
        ctx.arc(cx + Math.cos(nAng) * nDist, cy + Math.sin(nAng) * nDist, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // =========================================================================
  // 4. MÓDULO SEPARACIÓN DE MEZCLAS
  // =========================================================================
  class MixtureSeparationSimulation {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.mode = 'filtration';
      this.progress = 0.0;
      this.isActive = false;
      this.animId = null;
    }

    setMode(mode) {
      this.mode = mode;
      this.progress = 0.0;
      this.isActive = false;
    }

    startSeparation() {
      this.isActive = true;
    }

    reset() {
      this.progress = 0.0;
      this.isActive = false;
    }

    start() {
      if (this.animId) cancelAnimationFrame(this.animId);
      const loop = () => {
        if (this.isActive && this.progress < 1.0) {
          this.progress = Math.min(1.0, this.progress + 0.005);
        }
        this.render();
        this.animId = requestAnimationFrame(loop);
      };
      this.animId = requestAnimationFrame(loop);
    }

    stop() {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    }

    render() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      const cx = w / 2;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, w, h);

      if (this.mode === 'filtration') {
        // Embudo
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 50, 60);
        ctx.lineTo(cx + 50, 60);
        ctx.lineTo(cx + 8, 130);
        ctx.lineTo(cx + 8, 175);
        ctx.lineTo(cx - 8, 175);
        ctx.lineTo(cx - 8, 130);
        ctx.closePath();
        ctx.stroke();

        // Papel de filtro
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.moveTo(cx - 42, 65);
        ctx.lineTo(cx + 42, 65);
        ctx.lineTo(cx, 126);
        ctx.closePath();
        ctx.fill();

        // Residuo arena
        ctx.fillStyle = '#D97706';
        ctx.beginPath();
        ctx.arc(cx, 105, 12 * Math.min(1.0, this.progress + 0.3), 0, Math.PI * 2);
        ctx.fill();

        // Matraz recolector
        ctx.strokeRect(cx - 30, 215, 60, 40);
        const fillH = 36 * this.progress;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.fillRect(cx - 28, 255 - fillH, 56, fillH);
      }
    }
  }

  // =========================================================================
  // 5. VISOR MOLECULAR 3D INTERACTIVO
  // =========================================================================
  class Molecular3DViewer {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.rotX = 0.3;
      this.rotY = 0.4;
      this.isDragging = false;
      this.lastMouseX = 0;
      this.lastMouseY = 0;
      this.currentMoleculeKey = 'methane';
      this.animId = null;
      this.bindEvents();
    }

    bindEvents() {
      if (!this.canvas) return;
      this.canvas.addEventListener('mousedown', (e) => {
        this.isDragging = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      });
      window.addEventListener('mouseup', () => { this.isDragging = false; });
      this.canvas.addEventListener('mousemove', (e) => {
        if (!this.isDragging) return;
        const dx = e.clientX - this.lastMouseX;
        const dy = e.clientY - this.lastMouseY;
        this.rotY += dx * 0.01;
        this.rotX += dy * 0.01;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      });
    }

    setMolecule(key) {
      if (ChemEngine.organicMolecules[key]) {
        this.currentMoleculeKey = key;
      }
    }

    start() {
      if (this.animId) cancelAnimationFrame(this.animId);
      const loop = () => {
        if (!this.isDragging) this.rotY += 0.006;
        this.render();
        this.animId = requestAnimationFrame(loop);
      };
      this.animId = requestAnimationFrame(loop);
    }

    stop() {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    }

    render() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#090D16';
      ctx.fillRect(0, 0, w, h);

      // Metano tetraédrico simple
      const atoms = [
        { element: 'C', x: 0, y: 0, z: 0, radius: 20, color: '#334155' },
        { element: 'H', x: 0, y: -50, z: 0, radius: 11, color: '#F8FAFC' },
        { element: 'H', x: 45, y: 18, z: -18, radius: 11, color: '#F8FAFC' },
        { element: 'H', x: -45, y: 18, z: -18, radius: 11, color: '#F8FAFC' },
        { element: 'H', x: 0, y: 18, z: 50, radius: 11, color: '#F8FAFC' }
      ];

      const cosY = Math.cos(this.rotY);
      const sinY = Math.sin(this.rotY);
      const cosX = Math.cos(this.rotX);
      const sinX = Math.sin(this.rotX);

      const proj = atoms.map(a => {
        const x1 = a.x * cosY + a.z * sinY;
        const z1 = -a.x * sinY + a.z * cosY;
        const y2 = a.y * cosX - z1 * sinX;
        const z2 = a.y * sinX + z1 * cosX;
        return {
          element: a.element,
          screenX: cx + x1 * 1.5,
          screenY: cy + y2 * 1.5,
          radius: a.radius,
          z: z2,
          color: a.color
        };
      });

      // Enlaces
      proj.slice(1).forEach(hAtom => {
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(proj[0].screenX, proj[0].screenY);
        ctx.lineTo(hAtom.screenX, hAtom.screenY);
        ctx.stroke();
      });

      // Átomos
      proj.sort((a, b) => a.z - b.z).forEach(a => {
        ctx.fillStyle = a.color;
        ctx.beginPath();
        ctx.arc(a.screenX, a.screenY, a.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = a.element === 'H' ? '#0F172A' : '#FFFFFF';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(a.element, a.screenX, a.screenY);
      });
    }
  }

  return {
    InteractiveLabBench,
    ParticleKineticSimulation,
    AtomicModelVisualizer,
    MixtureSeparationSimulation,
    Molecular3DViewer
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimulationCanvas;
}
if (typeof window !== 'undefined') {
  window.SimulationCanvas = SimulationCanvas;
}
