package com.travelplanner.repository;

import com.travelplanner.model.Message;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Repository
public class MessageRepository {

    private final JdbcTemplate jdbcTemplate;

    public MessageRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Message> messageRowMapper = (rs, rowNum) -> {
        Message message = new Message();
        message.setId(rs.getLong("id"));
        message.setChatSessionId(rs.getLong("chat_session_id"));
        message.setText(rs.getString("text"));
        message.setSender(rs.getString("sender"));
        message.setTimestamp(rs.getTimestamp("timestamp"));
        return message;
    };

    public Long save(Long chatSessionId, String sender, String text) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(conn -> {
            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO messages (chat_session_id, text, sender, timestamp) VALUES (?, ?, ?, ?)",
                    new String[]{"id"}             // return the auto-generated “id” column
            );
            ps.setLong(1, chatSessionId);
            ps.setString(2, text);
            ps.setString(3, sender);
            ps.setTimestamp(4, new Timestamp(new Date().getTime()));
            return ps;
        }, keyHolder);
        return Objects.requireNonNull(keyHolder.getKey()).longValue();
    }

    public List<Message> findByChatSessionId(Long chatSessionId) {
        String sql = "SELECT * FROM messages WHERE chat_session_id = ? ORDER BY timestamp";
        return jdbcTemplate.query(sql, messageRowMapper, chatSessionId);
    }

    public void deleteByChatSessionId(Long chatSessionId) {
        jdbcTemplate.update("DELETE FROM messages WHERE chat_session_id = ?", chatSessionId);
    }
}
