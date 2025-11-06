package org.example.conferenceservice.feign;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.example.conferenceservice.model.Keynote;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "keynote-service")
public interface KeynoteRestClient {
    @GetMapping("/keynotes")
    HalResponse getAllKeynotes();

    @GetMapping("/keynotes/{id}")
    Keynote getKeynoteById( @PathVariable Long id);

}

