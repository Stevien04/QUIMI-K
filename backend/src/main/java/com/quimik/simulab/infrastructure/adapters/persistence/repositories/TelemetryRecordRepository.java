package com.quimik.simulab.infrastructure.adapters.persistence.repositories;

import com.quimik.simulab.infrastructure.adapters.persistence.entities.TelemetryRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TelemetryRecordRepository extends JpaRepository<TelemetryRecordEntity, Long> {
    List<TelemetryRecordEntity> findByStudentId(String studentId);
    List<TelemetryRecordEntity> findByPracticeId(String practiceId);
}
