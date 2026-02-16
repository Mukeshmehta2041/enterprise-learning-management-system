package com.lms.payment.service;

import com.lms.payment.dto.CreatePaymentRequest;
import com.lms.payment.dto.PaymentDTO;
import com.lms.payment.dto.PaymentPlanDTO;
import com.lms.payment.gateway.MockPaymentGateway;
import com.lms.payment.gateway.PaymentIntent;
import com.lms.payment.model.Payment;
import com.lms.payment.model.PaymentPlan;
import com.lms.payment.repository.PaymentRepository;
import com.lms.payment.repository.PaymentPlanRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import com.lms.common.events.EventEnvelope;
import com.lms.common.events.PaymentCompletedEvent;
import java.util.UUID;

@Slf4j
@Service
public class PaymentService {

  @Autowired
  private PaymentRepository paymentRepository;

  @Autowired
  private PaymentPlanRepository planRepository;

  @Autowired
  private MockPaymentGateway paymentGateway;

  @Autowired
  private KafkaTemplate<String, Object> kafkaTemplate;

  public List<PaymentPlanDTO> listPlans() {
    return planRepository.findByActiveTrue().stream()
        .map(this::toPlanDTO)
        .toList();
  }

  @Transactional
  public PaymentDTO createPayment(CreatePaymentRequest request) {
    // Validation: must have either planId or courseId
    if (request.getPlanId() == null && request.getCourseId() == null) {
      throw new IllegalArgumentException("Payment must be associated with either a plan or a course");
    }

    // Check idempotency
    Optional<Payment> existing = paymentRepository.findByIdempotencyKey(request.getIdempotencyKey());
    if (existing.isPresent()) {
      log.info("Idempotent payment request: returning existing payment {}", existing.get().getId());
      return PaymentDTO.fromEntity(existing.get());
    }

    // Create payment intent with gateway
    PaymentIntent intent = paymentGateway.createPaymentIntent(request.getAmount(), "USD");

    // Save payment to database
    Payment payment = Payment.builder()
        .userId(request.getUserId())
        .planId(request.getPlanId())
        .courseId(request.getCourseId())
        .amount(request.getAmount())
        .idempotencyKey(request.getIdempotencyKey())
        .status(Payment.PaymentStatus.PENDING)
        .paymentIntentId(intent.getId())
        .build();

    payment = paymentRepository.save(payment);
    log.info("Payment created: {}", payment.getId());

    return PaymentDTO.fromEntity(payment);
  }

  @Transactional
  public PaymentDTO webhookPaymentCompleted(String intentId) {
    Optional<Payment> paymentOpt = paymentRepository.findAll().stream()
        .filter(p -> intentId.equals(p.getPaymentIntentId()))
        .findFirst();

    if (paymentOpt.isEmpty()) {
      log.warn("Payment intent not found: {}", intentId);
      return null;
    }

    Payment payment = paymentOpt.get();
    payment.setStatus(Payment.PaymentStatus.COMPLETED);
    payment = paymentRepository.save(payment);

    // Publish event
    publishPaymentEvent(payment);

    log.info("Payment completed: {}", payment.getId());
    return PaymentDTO.fromEntity(payment);
  }

  private void publishPaymentEvent(Payment payment) {
    PaymentCompletedEvent payload = PaymentCompletedEvent.builder()
        .userId(payment.getUserId())
        .courseId(payment.getCourseId())
        .planId(payment.getPlanId())
        .amount(payment.getAmount())
        .build();

    EventEnvelope<PaymentCompletedEvent> event = EventEnvelope.of(
        "PaymentCompleted",
        payment.getId().toString(),
        payload,
        null);

    kafkaTemplate.send("payment.events", event);
  }

  private PaymentPlanDTO toPlanDTO(PaymentPlan plan) {
    return PaymentPlanDTO.builder()
        .id(plan.getId().toString())
        .code(plan.getCode())
        .name(plan.getName())
        .description(plan.getDescription())
        .price(plan.getPrice())
        .currency(plan.getCurrency())
        .interval(plan.getPlanInterval())
        .features(plan.getFeatures())
        .durationDays(plan.getDurationDays())
        .active(plan.getActive())
        .build();
  }
}
