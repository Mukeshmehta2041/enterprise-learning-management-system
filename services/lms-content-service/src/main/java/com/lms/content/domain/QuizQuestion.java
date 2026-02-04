package com.lms.content.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "quiz_questions", schema = "lms_content")
@Getter @Setter
@NoArgsConstructor
public class QuizQuestion {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_item_id", nullable = false)
    private ContentItem contentItem;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "options", nullable = false)
    private Map<String, String> options;

    @Column(name = "correct_option_id", nullable = false)
    private String correctOptionId;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    public QuizQuestion(UUID id, ContentItem contentItem, String questionText, Map<String, String> options, String correctOptionId, Integer sortOrder) {
        this.id = id;
        this.contentItem = contentItem;
        this.questionText = questionText;
        this.options = options;
        this.correctOptionId = correctOptionId;
        this.sortOrder = sortOrder;
    }
}
