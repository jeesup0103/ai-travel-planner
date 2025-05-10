package com.travelplanner.controller;

import com.travelplanner.model.ChatSession;
import com.travelplanner.model.Message;
import com.travelplanner.model.User;
import com.travelplanner.repository.ChatRepository;
import com.travelplanner.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ChatController {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;

    @GetMapping("/chats")
    public ResponseEntity<?> getChatSessions(HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        List<ChatSession> sessions = chatRepository.findByUserId(user.getId());
        return ResponseEntity.ok(sessions);
    }

    @PostMapping("/chats")
    public ResponseEntity<?> createChat(@RequestBody ChatSession body, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        ChatSession session = chatRepository.create(user.getId(), body.getTitle());
        return ResponseEntity.ok(session);
    }

    @GetMapping("/chats/{id}")
    public ResponseEntity<?> getMessages(@PathVariable Long id, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");

        ChatSession session = chatRepository.findById(id).orElse(null);
        if (session == null || !session.getUserId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Access denied.");
        }

        List<Message> messages = messageRepository.findByChatSessionId(id);
        return ResponseEntity.ok(messages);
    }

    @DeleteMapping("/chats/{id}")
    public ResponseEntity<?> deleteChat(@PathVariable Long id, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");

        ChatSession session = chatRepository.findById(id).orElse(null);
        if (session == null || !session.getUserId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Access denied.");
        }

        messageRepository.deleteByChatSessionId(id);
        chatRepository.deleteById(id);
        return ResponseEntity.ok("Chat deleted");
    }

    @PostMapping("/chat/message")
    public ResponseEntity<?> sendMessage(@RequestBody Message body, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");

        ChatSession session = chatRepository.findById(body.getChatSessionId()).orElse(null);
        if (session == null || !session.getUserId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Access denied.");
        }

        // Save user message
        messageRepository.save(body.getChatSessionId(), "user", body.getText());

        // TODO: Replace this with real AI service
        String aiResponse = "This is a mock AI response to: " + body.getText();

        // Save AI response
        messageRepository.save(body.getChatSessionId(), "ai", aiResponse);

        return ResponseEntity.ok().body(new MessageResponse(aiResponse));
    }

    // Response wrapper for AI response
    static class MessageResponse {
        public String response;
        public MessageResponse(String response) {
            this.response = response;
        }
    }
}
