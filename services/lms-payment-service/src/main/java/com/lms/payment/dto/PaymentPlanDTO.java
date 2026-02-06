package com.lms.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentPlanDTO {
  private String id;
  private String code;
  private String name;
  private String description;
  private BigDecimal price;
  private String currency;
  private String interval;
  private List<String> features;
  private Integer durationDays;
  private Boolean active;
}
