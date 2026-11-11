package com.quimik.simulab.domain.model;

import java.time.LocalDateTime;
import java.util.Map;

public class GradingEvaluation {
    private String studentId;
    private String practiceId;
    private double score; // 0 a 20
    private String letterGrade; // AD, A, B, C
    private String qualitativeFeedback;
    private Map<String, Double> rubricScores;
    private LocalDateTime evaluatedAt;

    public GradingEvaluation() {
        this.evaluatedAt = LocalDateTime.now();
    }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getPracticeId() { return practiceId; }
    public void setPracticeId(String practiceId) { this.practiceId = practiceId; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public String getLetterGrade() { return letterGrade; }
    public void setLetterGrade(String letterGrade) { this.letterGrade = letterGrade; }

    public String getQualitativeFeedback() { return qualitativeFeedback; }
    public void setQualitativeFeedback(String qualitativeFeedback) { this.qualitativeFeedback = qualitativeFeedback; }

    public Map<String, Double> getRubricScores() { return rubricScores; }
    public void setRubricScores(Map<String, Double> rubricScores) { this.rubricScores = rubricScores; }

    public LocalDateTime getEvaluatedAt() { return evaluatedAt; }
    public void setEvaluatedAt(LocalDateTime evaluatedAt) { this.evaluatedAt = evaluatedAt; }
}
