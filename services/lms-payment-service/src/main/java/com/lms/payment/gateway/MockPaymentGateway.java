package com.lms.payment.gateway;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
public class MockPaymentGateway {

  public PaymentIntent createPaymentIntent(BigDecimal amount, String currency) {
    String intentId = "pi_mock_" + UUID.randomUUID().toString().substring(0, 8);
    String clientSecret = intentId + "_secret_" + UUID.randomUUID().toString().substring(0, 12);

    log.info("Mock payment gateway: created intent {} for amount {}", intentId, amount);

    return PaymentIntent.builder()
        .id(intentId)
        .amount(amount)
        .currency(currency)
        .status("requires_payment_method")
        .clientSecret(clientSecret)
        .build();
  }

  public boolean confirmPayment(String intentId) {
    log.info("Mock payment gateway: confirming intent {}", intentId);
    // In real implementation, call actual payment gateway
    // For mock, assume 95% success rate
    return Math.random() < 0.95;
  }
}
