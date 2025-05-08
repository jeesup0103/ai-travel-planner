package com.travelplanner.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Data
public class User {
    private Long id;
    private String email;
    private String name;
    private String picture;
    private Role role;
    private List<String> travelPreferences = new ArrayList<>();

    public User() {}

    public User(String email, String name, String picture, Role role) {
        this.email = email;
        this.name = name;
        this.picture = picture;
        this.role = role;
    }
}
