package com.lms.payment.dto;

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
public class CreatePaymentRequest {
  private UUID userId;
  private Long planId;
  private UUID courseId;
  private BigDecimal amount;
  private String idempotencyKey;
}
