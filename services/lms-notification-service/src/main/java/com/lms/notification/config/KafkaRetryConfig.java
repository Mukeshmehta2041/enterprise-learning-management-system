package com.lms.notification.config;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Slf4j
@Configuration
public class KafkaRetryConfig {

    @Bean
    public DefaultErrorHandler errorHandler(KafkaTemplate<String, String> template) {
        // Retry 3 times with 2 seconds interval
        FixedBackOff backOff = new FixedBackOff(2000L, 3L);
        
        // On failure, send to DLQ topic: originalTopic.DLQ
        DeadLetterPublishingRecoverer recoverer = new DeadLetterPublishingRecoverer(template,
            (r, e) -> {
                log.error("Failed to process message after retries, sending to DLQ. Topic: {}, Partition: {}, Offset: {}", 
                    r.topic(), r.partition(), r.offset(), e);
                return new org.apache.kafka.common.TopicPartition(r.topic() + ".DLQ", r.partition());
            });

        return new DefaultErrorHandler(recoverer, backOff);
    }
}
