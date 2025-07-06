package com.travelplanner.dto;

import lombok.Data;

@Data
public class Places {
    private String name;
    private String address;
    private double rating;
    private Double lat;
    private Double lng;
}