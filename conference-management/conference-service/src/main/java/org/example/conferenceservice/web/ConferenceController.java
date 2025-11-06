package org.example.conferenceservice.web;

import lombok.AllArgsConstructor;
import org.example.conferenceservice.entities.Conference;
import org.example.conferenceservice.repositories.ConferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/conferences")
@AllArgsConstructor
public class ConferenceController {
    @Autowired
    private final ConferenceRepository conferenceRepository;

    @GetMapping("/all-with-reviews")
    public List<Conference> getAllConferencesWithReviews() {
        return conferenceRepository.findAllWithReviews();
    }
}
