package com.lms.enrollment.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "assignment_completions", schema = "lms_enrollment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentCompletion {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    @Column(name = "assignment_id", nullable = false)
    private UUID assignmentId;

    @Column(name = "lesson_id")
    private UUID lessonId;

    @Column(name = "completed_at", nullable = false)
    private Instant completedAt;
}
