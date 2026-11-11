package com.quimik.simulab.domain.service;

import com.quimik.simulab.domain.model.GradingEvaluation;
import com.quimik.simulab.domain.model.TelemetryPayload;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 🎓 GradingService - Procesamiento de Telemetría JSONB y Rúbrica Vigesimal (0-20)
 * Conforme a Sección 14 de Producción/README.md:
 * - Procesa telemetría en tiempo real
 * - Calcula notas vigesimales con rúbrica pedagógica por competencias
 * - Emite retroalimentación formativa y cualitativa personalizada
 */
@Service
public class GradingService {

    public GradingEvaluation evaluateTelemetry(TelemetryPayload telemetry) {
        GradingEvaluation eval = new GradingEvaluation();
        eval.setStudentId(telemetry.getStudentId() != null ? telemetry.getStudentId() : "anon_student");
        eval.setPracticeId(telemetry.getPracticeId() != null ? telemetry.getPracticeId() : "titulacion_acido_base");

        Map<String, Double> rubric = new HashMap<>();

        // 1. Exactitud Volumétrica y Punto de Viraje (0 a 8 puntos)
        double volTarget = telemetry.getTargetVolumeMl() > 0 ? telemetry.getTargetVolumeMl() : 25.0;
        double volDispensed = telemetry.getDispensedVolumeMl();
        double volDiff = Math.abs(volDispensed - volTarget);

        double scoreVol;
        if (volDiff <= 0.10) {
            scoreVol = 8.0;
        } else if (volDiff <= 0.25) {
            scoreVol = 6.5;
        } else if (volDiff <= 0.50) {
            scoreVol = 5.0;
        } else if (volDiff <= 1.0) {
            scoreVol = 3.0;
        } else {
            scoreVol = 1.0;
        }
        rubric.put("exactitud_volumetrica", scoreVol);

        // 2. Técnica Operatoria y Lectura de Menisco (0 a 5 puntos)
        double meniscusError = Math.abs(telemetry.getMeniscusErrorMl());
        double scoreMeniscus;
        if (meniscusError <= 0.02) {
            scoreMeniscus = 5.0;
        } else if (meniscusError <= 0.05) {
            scoreMeniscus = 3.5;
        } else if (meniscusError <= 0.10) {
            scoreMeniscus = 2.0;
        } else {
            scoreMeniscus = 1.0;
        }
        rubric.put("lectura_menisco", scoreMeniscus);

        // 3. Agitación y Homogeneización (0 a 4 puntos)
        double scoreStirring = telemetry.isMagneticStirringActive() ? 4.0 : 1.5;
        rubric.put("agitacion_cinetica", scoreStirring);

        // 4. Seguridad, Purga y Buenas Prácticas (0 a 3 puntos)
        double scoreSafety = telemetry.isPurgedBurette() ? 3.0 : 1.0;
        rubric.put("seguridad_y_purga", scoreSafety);

        // Cálculo total (0 a 20)
        double totalScore = scoreVol + scoreMeniscus + scoreStirring + scoreSafety;
        totalScore = Math.min(20.0, Math.max(0.0, Math.round(totalScore * 10.0) / 10.0));
        eval.setScore(totalScore);
        eval.setRubricScores(rubric);

        // Calificación cualitativa por escala escolar peruana
        StringBuilder feedback = new StringBuilder();
        if (totalScore >= 18.0) {
            eval.setLetterGrade("AD");
            feedback.append("¡Logro Destacado (AD)! Demostró un dominio excepcional de las técnicas cuantitativas de laboratorio. ");
        } else if (totalScore >= 14.0) {
            eval.setLetterGrade("A");
            feedback.append("Logro Esperado (A). Ejecución metodológica satisfactoria con control adecuado de las variables. ");
        } else if (totalScore >= 11.0) {
            eval.setLetterGrade("B");
            feedback.append("En Proceso (B). Cumple con los procedimientos básicos pero requiere mayor precisión en la dosificación gota a gota. ");
        } else {
            eval.setLetterGrade("C");
            feedback.append("En Inicio (C). Se evidenciaron desviaciones significativas en el volumen o falta de purga/agitación. ");
        }

        if (volDiff <= 0.15) {
            feedback.append("Punto de viraje detectado con gran precisión volumétrica (ΔV = ").append(String.format("%.2f", volDiff)).append(" mL). ");
        } else {
            feedback.append("Desviación en el volumen dispensado respecto al valor estequiométrico teórico (ΔV = ").append(String.format("%.2f", volDiff)).append(" mL). Se recomienda cerrar la llave y dosificar gota a gota cerca del viraje. ");
        }

        if (!telemetry.isPurgedBurette()) {
            feedback.append("Recuerde siempre purgar las burbujas de aire de la punta de la bureta antes de comenzar la valoración. ");
        }
        if (!telemetry.isMagneticStirringActive()) {
            feedback.append("La agitación continua es indispensable para evitar gradientes locales de pH y sobretitulaciones. ");
        }

        eval.setQualitativeFeedback(feedback.toString());
        return eval;
    }
}
