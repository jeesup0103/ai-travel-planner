package com.travelplanner.dto;

import lombok.Data;

@Data
public class Route {
    private String origin;
    private String destination;
    private String distance;
    private String duration;
    private String mode;
}