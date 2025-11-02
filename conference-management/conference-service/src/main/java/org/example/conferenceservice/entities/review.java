package org.example.conferenceservice.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.util.Date;


@Entity
@AllArgsConstructor @NoArgsConstructor @Getter
@Setter @ToString @Builder
public class review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date date;
    private String text;
    private int note;
}
