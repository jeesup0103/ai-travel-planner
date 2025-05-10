package com.travelplanner.repository;

import com.travelplanner.model.ChatSession;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public class ChatRepository {
    private final JdbcTemplate jdbcTemplate;
    public ChatRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<ChatSession> chatSessionRowMapper = (rs, rowNum) -> {
        ChatSession chatSession = new ChatSession();
        chatSession.setId(rs.getLong("id"));
        chatSession.setUserId(rs.getLong("user_id"));
        chatSession.setTitle(rs.getString("title"));
        chatSession.setTimestamp(rs.getTimestamp("timestamp"));
        return chatSession;
    };

    public List<ChatSession> findByUserId(Long userId) {
        String sql = "SELECT * FROM chat_sessions WHERE chat_sessions.user_id = ? ORDER BY timestamp DESC";
        return jdbcTemplate.query(sql, chatSessionRowMapper, userId);
    };

    public Optional<ChatSession> findById(Long id) {
        String sql = "SELECT * FROM chat_sessions WHERE id = ?";
        List<ChatSession> sessions = jdbcTemplate.query(sql, chatSessionRowMapper, id);
        return sessions.stream().findFirst();
    }

    public ChatSession create(Long userId, String title) {
        String sql = "INSERT  INTO chat_sessions (user_id, title) VALUES (?, ?)";
        jdbcTemplate.update(sql, userId, title);

        Long id = jdbcTemplate.queryForObject("SELECT LASTVAL()", Long.class);
        ChatSession chatSession = new ChatSession();
        chatSession.setId(id);
        chatSession.setUserId(userId);
        chatSession.setTitle(title);
        chatSession.setTimestamp(new Timestamp(new Date().getTime()));
        return chatSession;
    }

    public void deleteById(Long id) {
        jdbcTemplate.update("DELETE FROM chat_sessions WHERE id = ?", id);
    }

}
