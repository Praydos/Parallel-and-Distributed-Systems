package org.example.conferenceservice.model;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class Keynote {

    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String fonction;
}
