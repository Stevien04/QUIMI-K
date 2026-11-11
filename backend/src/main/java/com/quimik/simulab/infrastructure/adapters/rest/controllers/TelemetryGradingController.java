package com.quimik.simulab.infrastructure.adapters.rest.controllers;

import com.quimik.simulab.domain.model.GradingEvaluation;
import com.quimik.simulab.domain.model.TelemetryPayload;
import com.quimik.simulab.domain.service.GradingService;
import com.quimik.simulab.infrastructure.adapters.persistence.entities.TelemetryRecordEntity;
import com.quimik.simulab.infrastructure.adapters.persistence.repositories.TelemetryRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class TelemetryGradingController {

    private final GradingService gradingService;
    private final TelemetryRecordRepository telemetryRepository;

    @Autowired
    public TelemetryGradingController(GradingService gradingService, 
                                      @Autowired(required = false) TelemetryRecordRepository telemetryRepository) {
        this.gradingService = gradingService;
        this.telemetryRepository = telemetryRepository;
    }

    @PostMapping("/telemetry/evaluate")
    public ResponseEntity<GradingEvaluation> evaluateTelemetry(@RequestBody TelemetryPayload payload) {
        GradingEvaluation evaluation = gradingService.evaluateTelemetry(payload);

        // Persistir en PostgreSQL si el repositorio JPA está activo
        if (telemetryRepository != null) {
            try {
                TelemetryRecordEntity entity = new TelemetryRecordEntity();
                entity.setStudentId(evaluation.getStudentId());
                entity.setPracticeId(evaluation.getPracticeId());
                entity.setScore(evaluation.getScore());
                entity.setLetterGrade(evaluation.getLetterGrade());
                entity.setQualitativeFeedback(evaluation.getQualitativeFeedback());
                entity.setTelemetryLog(payload.toString());
                telemetryRepository.save(entity);
            } catch (Exception ignored) {
                // Modo tolerante a desconexión de BD
            }
        }

        return ResponseEntity.ok(evaluation);
    }

    @GetMapping("/courses/templates")
    public ResponseEntity<List<Map<String, Object>>> getCourseTemplates() {
        List<Map<String, Object>> templates = new ArrayList<>();

        Map<String, Object> t1 = new HashMap<>();
        t1.put("id", "tpl_titulacion");
        t1.put("title", "Titulación Ácido-Base Fuerte (HCl + NaOH)");
        t1.put("unit", "Unidad 6: Soluciones y Reacciones Acuosas");
        t1.put("targetPh", 7.0);
        t1.put("targetVolumeMl", 25.0);
        t1.put("indicator", "Fenolftaleína (Viraje rosa tenue)");
        templates.add(t1);

        Map<String, Object> t2 = new HashMap<>();
        t2.put("id", "tpl_ebullicion");
        t2.put("title", "Determinación de Punto de Ebullición y Destilación");
        t2.put("unit", "Unidad 1: Materia y Métodos de Separación");
        t2.put("targetTempC", 78.37);
        t2.put("solvent", "Etanol 96%");
        templates.add(t2);

        Map<String, Object> t3 = new HashMap<>();
        t3.put("id", "tpl_solubilidad");
        t3.put("title", "Curva de Solubilidad Térmica y Cristalización");
        t3.put("unit", "Unidad 6: Concentración y Saturación");
        t3.put("solute", "CuSO4·5H2O");
        templates.add(t3);

        return ResponseEntity.ok(templates);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> status = new HashMap<>();
        status.put("service", "QUIMI-K Spring Boot 3.x API");
        status.put("version", "1.0.0");
        status.put("status", "UP");
        status.put("gradingEngine", "GradingService Vigesimal 0-20");
        return ResponseEntity.ok(status);
    }
}
