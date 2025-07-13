package com.travelplanner.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatResponse {
    @JsonProperty("recommendation")
    private AiRecommendation aiRecommendation;
}
