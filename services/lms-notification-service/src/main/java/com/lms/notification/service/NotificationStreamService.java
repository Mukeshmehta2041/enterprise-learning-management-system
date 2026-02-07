package com.lms.notification.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.notification.model.InAppNotification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class NotificationStreamService implements MessageListener {

  private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

  @Autowired
  private RedisTemplate<String, Object> redisTemplate;

  @Autowired
  private RedisMessageListenerContainer redisMessageListenerContainer;

  @Autowired
  private ObjectMapper objectMapper;

  private static final String CHANNEL_PREFIX = "notifications:stream:";

  public SseEmitter createEmitter(String userId) {
    // High timeout to avoid frequent reconnects, though clients should handle it
    SseEmitter emitter = new SseEmitter(30 * 60 * 1000L); // 30 mins

    emitters.put(userId, emitter);

    emitter.onCompletion(() -> removeEmitter(userId));
    emitter.onTimeout(() -> removeEmitter(userId));
    emitter.onError((e) -> removeEmitter(userId));

    // Subscribe to user's redis channel
    redisMessageListenerContainer.addMessageListener(this, new ChannelTopic(CHANNEL_PREFIX + userId));

    log.info("Created SSE emitter for user: {}", userId);

    // Send initial heartbeat to establish connection
    try {
      emitter.send(SseEmitter.event().name("ping").data("heartbeat"));
    } catch (IOException e) {
      removeEmitter(userId);
    }

    return emitter;
  }

  private void removeEmitter(String userId) {
    emitters.remove(userId);
    redisMessageListenerContainer.removeMessageListener(this, new ChannelTopic(CHANNEL_PREFIX + userId));
    log.info("Removed SSE emitter for user: {}", userId);
  }

  public void broadcast(String userId, InAppNotification notification) {
    log.debug("Publishing notification to Redis channel: {}{}", CHANNEL_PREFIX, userId);
    redisTemplate.convertAndSend(CHANNEL_PREFIX + userId, notification);
  }

  @Override
  public void onMessage(Message message, byte[] pattern) {
    try {
      String channel = new String(message.getChannel());
      if (!channel.startsWith(CHANNEL_PREFIX))
        return;

      String userId = channel.substring(CHANNEL_PREFIX.length());
      InAppNotification notification = objectMapper.readValue(message.getBody(), InAppNotification.class);

      SseEmitter emitter = emitters.get(userId);
      if (emitter != null) {
        emitter.send(SseEmitter.event()
            .name("notification")
            .data(notification));
        log.debug("Sent notification to user {} via SSE", userId);
      }
    } catch (Exception e) {
      log.error("Failed to process Redis message or send via SSE", e);
    }
  }
}
