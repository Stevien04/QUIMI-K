package com.quimik.simulab.infrastructure.adapters.persistence.entities;

/**
 * Entidad JPA: Practice (Práctica curada).
 * Basada en el Diagrama Relacional de Base de Datos de FD04 (Figura 3.6.1).
 */
public class PracticeEntity {
    private Long id;
    private String title;
    private String description;

    public PracticeEntity() {}

    public PracticeEntity(Long id, String title, String description) {
        this.id = id;
        this.title = title;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
