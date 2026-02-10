package com.lms.common.features.experiment;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class ExperimentManager {

  private final Map<String, ExperimentDefinition> experiments = new ConcurrentHashMap<>();

  public record ExperimentDefinition(String id, Map<String, Integer> variantWeights) {
  }

  public void defineExperiment(String id, Map<String, Integer> variantWeights) {
    experiments.put(id, new ExperimentDefinition(id, variantWeights));
  }

  public String getVariant(String userId, String experimentId) {
    ExperimentDefinition def = experiments.get(experimentId);
    if (def == null || userId == null) {
      return "control";
    }

    int bucket = calculateBucket(userId, experimentId);
    int cumulativeWeight = 0;

    for (Map.Entry<String, Integer> entry : def.variantWeights().entrySet()) {
      cumulativeWeight += entry.getValue();
      if (bucket < cumulativeWeight) {
        return entry.getKey();
      }
    }

    return "control";
  }

  private int calculateBucket(String userId, String experimentId) {
    try {
      String input = userId + ":" + experimentId;
      MessageDigest md = MessageDigest.getInstance("MD5");
      byte[] hash = md.digest(input.getBytes(StandardCharsets.UTF_8));

      // Use last 4 bytes for bucket calculation
      int val = ((hash[hash.length - 1] & 0xFF) << 24) |
          ((hash[hash.length - 2] & 0xFF) << 16) |
          ((hash[hash.length - 3] & 0xFF) << 8) |
          (hash[hash.length - 4] & 0xFF);

      return Math.abs(val) % 100;
    } catch (NoSuchAlgorithmException e) {
      log.error("Failed to calculate experiment bucket", e);
      return 0;
    }
  }
}
