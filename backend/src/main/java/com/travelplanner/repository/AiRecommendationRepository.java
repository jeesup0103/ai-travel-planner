package com.travelplanner.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelplanner.dto.AiRecommendation;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AiRecommendationRepository {
    private final JdbcTemplate jdbc;
    private final ObjectMapper mapper = new ObjectMapper();

    public AiRecommendationRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void save(AiRecommendation rec) throws JsonProcessingException {
        String sql = "INSERT INTO ai_recommendations(message_id, query, summary, routes, places, tips) VALUES (?, ?, ?, ?::jsonb, ?::jsonb, ?::jsonb) ";

        jdbc.update(sql,
            rec.getMessageId(),
            rec.getQuery(),
            rec.getSummaryResponse(),
            mapper.writeValueAsString(rec.getRoutes()),
            mapper.writeValueAsString(rec.getPlaces()),
            mapper.writeValueAsString(rec.getTips())
        );
    }
}
