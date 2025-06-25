package com.travelplanner.controller;

import com.travelplanner.dto.UpdateUserRequest;
import com.travelplanner.model.User;
import com.travelplanner.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(
    origins = "http://localhost:3000",
    allowedHeaders = {"Authorization", "Content-Type"},
    allowCredentials = "true"
)
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUserPrincipal(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No authenticated user found");
        }
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/me")
    public ResponseEntity<?> updateCurrentUserPreferences(
            @AuthenticationPrincipal User user,
            @RequestBody UpdateUserRequest updateRequest
    ) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No authenticated user found");
        }

        user.setTravelPreferences(updateRequest.getTravelPreferences());
        User saved = userRepository.save(user);

        return ResponseEntity.ok(saved);
    }
}