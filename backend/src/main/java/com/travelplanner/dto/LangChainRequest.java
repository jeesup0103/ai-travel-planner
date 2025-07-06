package com.travelplanner.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class LangChainRequest {
    private String message;
    private List<String> preferences;
}
