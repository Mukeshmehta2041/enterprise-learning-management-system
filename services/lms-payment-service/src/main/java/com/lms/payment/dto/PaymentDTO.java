package com.lms.payment.dto;

import com.lms.payment.model.Payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
  private Long id;
  private UUID userId;
  private Long planId;
  private UUID courseId;
  private BigDecimal amount;
  private String status;
  private String paymentIntentId;

  public static PaymentDTO fromEntity(Payment payment) {
    return PaymentDTO.builder()
        .id(payment.getId())
        .userId(payment.getUserId())
        .planId(payment.getPlanId())
        .courseId(payment.getCourseId())
        .amount(payment.getAmount())
        .status(payment.getStatus().name())
        .paymentIntentId(payment.getPaymentIntentId())
        .build();
  }
}
