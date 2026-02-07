package com.lms.payment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "payment_plans")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentPlan {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String code;

  @Column(nullable = false)
  private String name;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(nullable = false)
  private BigDecimal price;

  @Builder.Default
  @Column(nullable = false)
  private String currency = "USD";

  @Builder.Default
  @Column(nullable = false)
  private String planInterval = "MONTHLY"; // MONTHLY, YEARLY, ONE_TIME

  @ElementCollection
  @CollectionTable(name = "payment_plan_features", joinColumns = @JoinColumn(name = "plan_id"))
  @Column(name = "feature")
  private List<String> features;

  @Column(nullable = false)
  private Integer durationDays;

  @Column(name = "is_active")
  private Boolean active;

  @Column(name = "created_at")
  private Instant createdAt;

  @PrePersist
  protected void onCreate() {
    createdAt = Instant.now();
  }
}
