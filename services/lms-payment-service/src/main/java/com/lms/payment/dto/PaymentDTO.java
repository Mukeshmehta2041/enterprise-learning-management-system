package com.lms.payment.dto;

import com.lms.payment.model.Payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
  private Long id;
  private UUID userId;
  private String planId; // Changed to string for easier frontend formatting
  private UUID courseId;
  private BigDecimal amount;
  private String currency; // Added currency
  private String status;
  private String paymentIntentId;
  private Instant createdAt; // Added creating date

  public static PaymentDTO fromEntity(Payment payment) {
    return PaymentDTO.builder()
        .id(payment.getId())
        .userId(payment.getUserId())
        .planId(payment.getPlanId() != null ? payment.getPlanId().toString() : "COURSE_PURCHASE")
        .courseId(payment.getCourseId())
        .amount(payment.getAmount())
        .currency("USD") // Hardcoded for now as it's missing from model but used by frontend
        .status(payment.getStatus().name())
        .paymentIntentId(payment.getPaymentIntentId())
        .createdAt(payment.getCreatedAt())
        .build();
  }
}
