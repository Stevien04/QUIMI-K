package com.quimik.simulab.infrastructure.adapters.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "telemetry_evaluations")
public class TelemetryRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "practice_id", nullable = false)
    private String practiceId;

    @Column(name = "score", nullable = false)
    private Double score;

    @Column(name = "letter_grade", length = 5)
    private String letterGrade;

    @Column(name = "qualitative_feedback", columnDefinition = "TEXT")
    private String qualitativeFeedback;

    @Column(name = "telemetry_log", columnDefinition = "TEXT")
    private String telemetryLog;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public TelemetryRecordEntity() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getPracticeId() { return practiceId; }
    public void setPracticeId(String practiceId) { this.practiceId = practiceId; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public String getLetterGrade() { return letterGrade; }
    public void setLetterGrade(String letterGrade) { this.letterGrade = letterGrade; }

    public String getQualitativeFeedback() { return qualitativeFeedback; }
    public void setQualitativeFeedback(String qualitativeFeedback) { this.qualitativeFeedback = qualitativeFeedback; }

    public String getTelemetryLog() { return telemetryLog; }
    public void setTelemetryLog(String telemetryLog) { this.telemetryLog = telemetryLog; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
