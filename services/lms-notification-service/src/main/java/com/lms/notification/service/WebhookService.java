package com.lms.notification.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.common.events.EventEnvelope;
import com.lms.notification.model.WebhookHistory;
import com.lms.notification.model.WebhookSubscription;
import com.lms.notification.repository.WebhookHistoryRepository;
import com.lms.notification.repository.WebhookSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebhookService {

  private final WebhookSubscriptionRepository subscriptionRepository;
  private final WebhookHistoryRepository historyRepository;
  private final WebClient webClient = WebClient.builder().build();
  private final ObjectMapper objectMapper;

  public void processEvent(EventEnvelope event) {
    String eventType = event.eventType();
    List<WebhookSubscription> subscriptions = subscriptionRepository.findAllByActiveTrue();

    subscriptions.stream()
        .filter(sub -> sub.getEventType().equals("*") || sub.getEventType().equalsIgnoreCase(eventType))
        .forEach(sub -> deliverWebhook(sub, event));
  }

  private void deliverWebhook(WebhookSubscription sub, EventEnvelope event) {
    String payload;
    try {
      payload = objectMapper.writeValueAsString(event);
    } catch (Exception e) {
      log.error("Failed to serialize event for webhook", e);
      return;
    }

    String signature = computeSignature(payload, sub.getSecret());
    UUID deliveryId = UUID.randomUUID();
    Instant startTime = Instant.now();

    log.info("Delivering webhook {} to {}", event.eventType(), sub.getTargetUrl());

    webClient.post()
        .uri(sub.getTargetUrl())
        .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
        .header("X-Webhook-Id", deliveryId.toString())
        .header("X-Webhook-Event", event.eventType())
        .header("X-Webhook-Signature", signature)
        .bodyValue(payload)
        .exchangeToMono(response -> {
          HttpStatus status = (HttpStatus) response.statusCode();
          return response.bodyToMono(String.class)
              .defaultIfEmpty("")
              .map(body -> {
                boolean success = status.is2xxSuccessful();
                saveHistory(deliveryId, sub, event, payload, status.value(), body, startTime, success);
                if (!success) {
                  throw new RuntimeException("Webhook return status: " + status);
                }
                return body;
              });
        })
        .retryWhen(reactor.util.retry.Retry.backoff(3, Duration.ofSeconds(2))
            .filter(throwable -> throwable instanceof java.util.concurrent.TimeoutException ||
                throwable instanceof org.springframework.web.reactive.function.client.WebClientResponseException))
        .timeout(Duration.ofSeconds(10))
        .onErrorResume(ex -> {
          log.error("Webhook delivery finally failed for Subscription {}: {}", sub.getId(), ex.getMessage());
          // History already saved in map above if it was a status error,
          // but if it's a completely failed connection we save it here
          if (ex instanceof java.util.concurrent.TimeoutException ||
              !(ex instanceof RuntimeException && ex.getMessage().contains("Webhook return status"))) {
            saveHistory(deliveryId, sub, event, payload, 0, ex.getMessage(), startTime, false);
          }
          return Mono.empty();
        })
        .subscribe();
  }

  private void saveHistory(UUID id, WebhookSubscription sub, EventEnvelope event, String payload,
      int status, String responseBody, Instant startTime, boolean success) {
    WebhookHistory history = WebhookHistory.builder()
        .id(id)
        .subscription(sub)
        .eventId(event.eventId().toString())
        .eventType(event.eventType())
        .payload(payload)
        .responseCode(status)
        .responseBody(responseBody != null && responseBody.length() > 2000
            ? responseBody.substring(0, 2000)
            : responseBody)
        .sentAt(Instant.now())
        .durationMs(Duration.between(startTime, Instant.now()).toMillis())
        .success(success && status >= 200 && status < 300)
        .build();
    historyRepository.save(history);
  }

  private String computeSignature(String payload, String secret) {
    try {
      Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
      SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
      sha256_HMAC.init(secret_key);
      byte[] hash = sha256_HMAC.doFinal(payload.getBytes(StandardCharsets.UTF_8));
      return HexFormat.of().formatHex(hash);
    } catch (Exception e) {
      throw new RuntimeException("Failed to compute signature", e);
    }
  }
}
