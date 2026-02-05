package com.lms.payment.controller;

import com.lms.common.security.RBACEnforcer;
import com.lms.common.security.UserContext;
import com.lms.payment.dto.CreatePaymentRequest;
import com.lms.payment.dto.PaymentDTO;
import com.lms.payment.dto.PaymentPlanDTO;
import com.lms.payment.service.PaymentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

  @Autowired
  private PaymentService paymentService;

  @Autowired(required = false)
  private RBACEnforcer rbacEnforcer;

  @GetMapping("/plans")
  public ResponseEntity<List<PaymentPlanDTO>> getPlans() {
    return ResponseEntity.ok(paymentService.listPlans());
  }

  @PostMapping
  public ResponseEntity<PaymentDTO> createPayment(
      @RequestBody CreatePaymentRequest request,
      @RequestAttribute(required = false) UserContext userContext) {

    // RBAC: Users can only create payments for themselves
    if (userContext != null && rbacEnforcer != null && !userContext.isAdmin()) {
      if (request.getUserId() != null && !request.getUserId().toString().equals(userContext.getUserId())) {
        throw new RBACEnforcer.AccessDeniedException("You can only create payments for your own account");
      }
    }

    PaymentDTO payment = paymentService.createPayment(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(payment);
  }

  @PostMapping("/webhook/completed")
  public ResponseEntity<PaymentDTO> webhookPaymentCompleted(@RequestParam String intentId) {
    log.info("Webhook received for payment intent: {}", intentId);
    PaymentDTO payment = paymentService.webhookPaymentCompleted(intentId);
    return ResponseEntity.ok(payment);
  }
}
