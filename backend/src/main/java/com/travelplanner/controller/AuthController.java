package com.travelplanner.controller;

import com.travelplanner.model.User;
import com.travelplanner.security.JwtTokenProvider;
import com.travelplanner.service.GoogleAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final GoogleAuthService googleAuthService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/google")
    public ResponseEntity<?> authenticateGoogle(@RequestBody Map<String, String> body) {
        try {
            String idToken = body.get("token");
            User user = googleAuthService.verifyAndGetUser(idToken);
            String jwt = tokenProvider.generateToken(user);

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("user", user);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid token");
        }
    }
}