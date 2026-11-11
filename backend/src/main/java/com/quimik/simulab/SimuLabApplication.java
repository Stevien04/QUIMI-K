package com.quimik.simulab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 🔬 QUIMI-K • Laboratorio Virtual de Química
 * Arquitectura Tecnológica Sección 14 (Producción):
 * - Backend: Java 17 LTS, Spring Boot 3.x, Spring Security (JWT Stateless), Spring Data JPA
 * - Telemetría y Calificación: GradingService con escala vigesimal escolar (0-20)
 */
@SpringBootApplication
public class SimuLabApplication {

    public static void main(String[] args) {
        SpringApplication.run(SimuLabApplication.class, args);
    }
}
