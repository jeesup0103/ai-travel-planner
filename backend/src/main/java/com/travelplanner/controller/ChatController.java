package com.travelplanner.controller;

import com.travelplanner.model.ChatSession;
import com.travelplanner.model.Message;
import com.travelplanner.model.User;
import com.travelplanner.repository.ChatRepository;
import com.travelplanner.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;

    private ResponseEntity<String> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
    }

    @GetMapping("/chats")
    public ResponseEntity<?> getChatSessions(@AuthenticationPrincipal User user) {
        if (user == null) {
            return unauthorized();
        }
        List<ChatSession> sessions = chatRepository.findByUserId(user.getId());
        return ResponseEntity.ok(sessions);
    }

    @PostMapping("/chats")
    public ResponseEntity<?> createChat(@RequestBody ChatSession body, @AuthenticationPrincipal User user) {
        if (user == null) {
            return unauthorized();
        }
        try {
            ChatSession session = chatRepository.create(user.getId(), body.getTitle());
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Server error");
        }
    }

    @GetMapping("/chats/{id}")
    public ResponseEntity<?> getMessages(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (user == null) {
            return unauthorized();
        }
        ChatSession session = chatRepository.findById(id).orElse(null);
        if (session == null || !session.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
        }

        List<Message> messages = messageRepository.findByChatSessionId(id);
        return ResponseEntity.ok(messages);
    }

    @DeleteMapping("/chats/{id}")
    public ResponseEntity<?> deleteChat(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (user == null) {
            return unauthorized();
        }
        ChatSession session = chatRepository.findById(id).orElse(null);
        if (session == null || !session.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
        }

        messageRepository.deleteByChatSessionId(id);
        chatRepository.deleteById(id);
        return ResponseEntity.ok("Chat deleted");
    }

    @PostMapping("/chat/message")
    public ResponseEntity<?> sendMessage(@RequestBody Message body, @AuthenticationPrincipal User user) {
        if (user == null) {
            return unauthorized();
        }
        ChatSession session = chatRepository.findById(body.getChatSessionId()).orElse(null);
        if (session == null || !session.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
        }

        messageRepository.save(body.getChatSessionId(), "user", body.getText());

        // TODO
        String aiResponse = "This is a mock AI response to: " + body.getText();
        messageRepository.save(body.getChatSessionId(), "ai", aiResponse);

        return ResponseEntity.ok(new MessageResponse(aiResponse));
    }

    static class MessageResponse {
        public String response;
        public MessageResponse(String response) {
            this.response = response;
        }
    }
}
