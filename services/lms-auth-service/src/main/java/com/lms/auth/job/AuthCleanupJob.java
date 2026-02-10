package com.lms.auth.job;

import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Set;

@Slf4j
@Component
public class AuthCleanupJob {

  @Autowired
  private RedisTemplate<String, Object> redisTemplate;

  /**
   * Clean up orphaned user token sets in Redis.
   * Although keys have TTL, we periodically scan for any leaks.
   */
  @Scheduled(cron = "0 0 3 * * *") // 3 AM
  @SchedulerLock(name = "authRedisCleanupJob", lockAtLeastFor = "1m", lockAtMostFor = "10m")
  public void cleanupOrphanedTokens() {
    log.info("Starting Auth Redis Cleanup Job...");

    try {
      Set<String> keys = redisTemplate.keys("user:tokens:*");
      if (keys != null) {
        int count = 0;
        for (String key : keys) {
          Long size = redisTemplate.opsForSet().size(key);
          if (size == null || size == 0) {
            redisTemplate.delete(key);
            count++;
          }
        }
        log.info("Auth Redis Cleanup completed. Removed {} orphaned user token sets.", count);
      }
    } catch (Exception e) {
      log.error("Error during Auth Redis Cleanup Job", e);
    }
  }
}
