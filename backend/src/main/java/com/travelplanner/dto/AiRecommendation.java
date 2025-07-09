package com.travelplanner.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AiRecommendation {
    private Long    messageId;
    private String query;
    private List<Route> routes;
    private List<Places> places;
    private List<String> tips;
    private String summaryResponse;
}