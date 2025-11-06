package org.example.conferenceservice.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@AllArgsConstructor @NoArgsConstructor @Getter @Setter @ToString @Builder
public class Conference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titre;
    private String type; //change it to enum (académique ou commerciale),
    private Date date;
    private String duree; // min or hours
    private int score;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "conference")
    @JsonManagedReference
    private List<Review> reviews = new ArrayList<>();
}
