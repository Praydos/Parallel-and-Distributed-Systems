package org.example.conferenceservice.repositories;

import org.example.conferenceservice.entities.Conference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface ConferenceRepository extends JpaRepository<Conference,Long> {
}
