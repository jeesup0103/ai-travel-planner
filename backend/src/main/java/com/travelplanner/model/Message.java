package com.travelplanner.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Data
public class Message {
    private Long id;
    private Long chatSessionId;
    private String text;
    private String sender; // "user" or "ai"
    private Date timestamp;
}
