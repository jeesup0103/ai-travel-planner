package com.travelplanner.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {
    GUEST("ROLE_GUEST", "GUEST"),
    USER("ROLE_USER", "Common User");
    private final String key;
    private final String title;
}
