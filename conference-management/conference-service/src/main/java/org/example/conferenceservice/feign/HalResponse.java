package org.example.conferenceservice.feign;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.example.conferenceservice.model.Keynote;

import java.util.List;

@Data
public class HalResponse {
    @JsonProperty("_embedded")
    private Embedded embedded;

    @Data
    public static class Embedded {
        private List<Keynote> keynotes;
    }
}
