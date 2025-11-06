package org.example.conferenceservice.web;

import com.netflix.discovery.converters.Auto;
import lombok.AllArgsConstructor;
import org.example.conferenceservice.entities.Conference;
import org.example.conferenceservice.feign.KeynoteRestClient;
import org.example.conferenceservice.model.Keynote;
import org.example.conferenceservice.repositories.ConferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/conferences")
@AllArgsConstructor
public class ConferenceController {
    @Autowired
    private final ConferenceRepository conferenceRepository;
    @Autowired
    private KeynoteRestClient keynoteRestClient;

    @GetMapping("/all-with-reviews")
    public List<Conference> getAllConferencesWithReviews() {
        return conferenceRepository.findAllWithReviews();
    }

//    @GetMapping("/bills/{id}")
//    public Bill getBill(@PathVariable Long id) {
//        Bill bill = billRepository.findById(id).get();
//        bill.setCustomer(customerRestClient.getCustomerById(bill.getCustomerId()));
//        bill.getItems().forEach(item -> {
//            item.setProduct(productRestClient.getProductById(item.getProductId()));
//        });
//        return bill;
//    }

    @GetMapping("/{id}")
    public Conference getConferenceById(@PathVariable Long id) {
        Conference conference = conferenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conference not found"));

        // Populate keynote
        if (conference.getKeynoteId() != null) {
            Keynote keynote = keynoteRestClient.getKeynoteById(conference.getKeynoteId());
            conference.setKeynote(keynote);
        }

        return conference;
    }



}
