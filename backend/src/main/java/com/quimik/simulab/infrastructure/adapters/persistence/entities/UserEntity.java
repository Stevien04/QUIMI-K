package com.quimik.simulab.infrastructure.adapters.persistence.entities;

/**
 * Entidad JPA: User.
 * Basada en el Diagrama Relacional de Base de Datos de FD04 (Figura 3.6.1).
 */
public class UserEntity {
    private Long id;
    private String username;
    private String email;
    private String role; // ESTUDIANTE, DOCENTE, ADMINISTRADOR

    public UserEntity() {}

    public UserEntity(Long id, String username, String email, String role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
