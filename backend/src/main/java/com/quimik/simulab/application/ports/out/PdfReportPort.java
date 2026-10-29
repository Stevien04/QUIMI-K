package com.quimik.simulab.application.ports.out;

import java.io.OutputStream;

/**
 * Puerto de Salida (Output Port) para generación de reportes en PDF según Alcance 007 de FD06 y FD04.
 */
public interface PdfReportPort {
    void generatePracticeReport(String studentName, String practiceTitle, int score, OutputStream outputStream);
}
