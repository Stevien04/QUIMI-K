package com.quimik.simulab.infrastructure.adapters.reports;

import com.quimik.simulab.application.ports.out.PdfReportPort;

import java.io.OutputStream;
import java.io.PrintWriter;

/**
 * Adaptador de Infraestructura para generación de Reportes en PDF.
 * Implementa PdfReportPort según los diagramas 3.2.1 y 3.3.1 de FD04.
 */
public class PdfReportGeneratorAdapter implements PdfReportPort {

    @Override
    public void generatePracticeReport(String studentName, String practiceTitle, int score, OutputStream outputStream) {
        PrintWriter writer = new PrintWriter(outputStream);
        writer.println("COLEGIO ALEXANDER FLEMING - TACNA");
        writer.println("REPORTE INDIVIDUAL DE LABORATORIO QUIMI-K");
        writer.println("Estudiante: " + studentName);
        writer.println("Práctica: " + practiceTitle);
        writer.println("Calificación: " + score + " / 20");
        writer.flush();
    }
}
