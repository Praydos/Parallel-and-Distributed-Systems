package org.example.conferenceservice.repositories;

import org.example.conferenceservice.entities.Conference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource
public interface ConferenceRepository extends JpaRepository<Conference,Long> {
    @Query("SELECT c FROM Conference c LEFT JOIN FETCH c.reviews")
    List<Conference> findAllWithReviews();
}
