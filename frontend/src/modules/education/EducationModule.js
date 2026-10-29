/**
 * Módulo de Gestión Educativa (Capa de Presentación - Frontend)
 * Basado en Diagrama de Paquetes de FD04 (Figura 3.3.1).
 * Gestiona seguimiento de alumnos, quizzes y resultados.
 */
export class EducationModule {
  constructor() {
    this.studentRecords = [];
  }

  evaluateStudentQuiz(answers, answerKey) {
    let score = 0;
    answers.forEach((ans, idx) => {
      if (ans === answerKey[idx]) score += 5; // sobre 20
    });
    return {
      score,
      isPassed: score >= 14
    };
  }
}
