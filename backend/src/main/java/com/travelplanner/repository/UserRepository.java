package com.travelplanner.repository;

import com.travelplanner.model.Role;
import com.travelplanner.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setEmail(rs.getString("email"));
        user.setName(rs.getString("name"));
        user.setPicture(rs.getString("picture"));
        user.setRole(Role.valueOf(rs.getString("role")));
        user.setTravelPreferences(loadPreferences(rs.getLong("id")));
        return user;
    };

    public Optional<User> findByEmail(String email) {
        List<User> users = jdbcTemplate.query(
            "SELECT * FROM users WHERE email = ?",
            userRowMapper,
            email
        );
        return users.stream().findFirst();
    }

    public Optional<User> findById(Long id) {
        List<User> users = jdbcTemplate.query(
            "SELECT * FROM users WHERE id = ?",
            userRowMapper,
            id
        );
        return users.stream().findFirst();
    }

    public User save(User user) {
        if (user.getId() == null) {
            // Insert new user
            jdbcTemplate.update(
                "INSERT INTO users (email, name, picture, role) VALUES (?, ?, ?, ?)",
                user.getEmail(), user.getName(), user.getPicture(), user.getRole().name()
            );
            Long id = jdbcTemplate.queryForObject("SELECT LASTVAL()", Long.class);
            user.setId(id);
        } else {
            // Update user
            jdbcTemplate.update(
                "UPDATE users SET name = ?, picture = ?, role = ? WHERE id = ?",
                user.getName(), user.getPicture(), user.getRole().name(), user.getId()
            );
        }

        // Save preferences
        savePreferences(user.getId(), user.getTravelPreferences());

        return user;
    }

    private void savePreferences(Long userId, List<String> preferences) {
        jdbcTemplate.update("DELETE FROM user_preferences WHERE user_id = ?", userId);
        if (preferences != null) {
            for (String pref : preferences) {
                jdbcTemplate.update(
                    "INSERT INTO user_preferences (user_id, preference) VALUES (?, ?)",
                    userId, pref
                );
            }
        }
    }

    private List<String> loadPreferences(Long userId) {
        return jdbcTemplate.queryForList(
            "SELECT preference FROM user_preferences WHERE user_id = ?",
            String.class,
            userId
        );
    }
}
