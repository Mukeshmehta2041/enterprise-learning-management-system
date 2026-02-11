package com.lms.content.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaybackTokenResponse {
    private String playbackUrl;
    private String token;
    private LocalDateTime expiresAt;
    private List<CaptionDTO> captions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CaptionDTO {
        private String languageCode;
        private String label;
        private String url;
    }
}
