package com.travelplanner.model;

import lombok.Data;
import java.util.Date;

@Data
public class ChatSession {
    private Long id;
    private Long userId;
    private String title;
    private Date timestamp;
}
