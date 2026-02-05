package com.lms.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentPlanDTO {
  private Long id;
  private String code;
  private String name;
  private String description;
  private BigDecimal price;
  private Integer durationDays;
  private Boolean active;
}
