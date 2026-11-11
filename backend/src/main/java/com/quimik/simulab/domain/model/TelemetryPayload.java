package com.quimik.simulab.domain.model;

import java.util.List;
import java.util.Map;

public class TelemetryPayload {
    private String studentId;
    private String practiceId;
    private double targetVolumeMl;
    private double dispensedVolumeMl;
    private double finalPh;
    private double meniscusErrorMl;
    private boolean magneticStirringActive;
    private boolean purgedBurette;
    private int dropsDispensed;
    private List<Map<String, Object>> events;

    public TelemetryPayload() {}

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getPracticeId() { return practiceId; }
    public void setPracticeId(String practiceId) { this.practiceId = practiceId; }

    public double getTargetVolumeMl() { return targetVolumeMl; }
    public void setTargetVolumeMl(double targetVolumeMl) { this.targetVolumeMl = targetVolumeMl; }

    public double getDispensedVolumeMl() { return dispensedVolumeMl; }
    public void setDispensedVolumeMl(double dispensedVolumeMl) { this.dispensedVolumeMl = dispensedVolumeMl; }

    public double getFinalPh() { return finalPh; }
    public void setFinalPh(double finalPh) { this.finalPh = finalPh; }

    public double getMeniscusErrorMl() { return meniscusErrorMl; }
    public void setMeniscusErrorMl(double meniscusErrorMl) { this.meniscusErrorMl = meniscusErrorMl; }

    public boolean isMagneticStirringActive() { return magneticStirringActive; }
    public void setMagneticStirringActive(boolean magneticStirringActive) { this.magneticStirringActive = magneticStirringActive; }

    public boolean isPurgedBurette() { return purgedBurette; }
    public void setPurgedBurette(boolean purgedBurette) { this.purgedBurette = purgedBurette; }

    public int getDropsDispensed() { return dropsDispensed; }
    public void setDropsDispensed(int dropsDispensed) { this.dropsDropsDispensed(dropsDispensed); }
    public void setDropsDropsDispensed(int dropsDispensed) { this.dropsDispensed = dropsDispensed; }

    public List<Map<String, Object>> getEvents() { return events; }
    public void setEvents(List<Map<String, Object>> events) { this.events = events; }
}
