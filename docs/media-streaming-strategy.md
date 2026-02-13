# Media Streaming Strategy

## Decision: HLS (HTTP Live Streaming)

For the LMS platform, we have decided to use **HLS** for video delivery.

### Reasons for HLS:
1. **Adaptive Bitrate Streaming (ABS)**: Automatically adjusts video quality based on the user's network speed.
2. **Device Compatibility**: Native support on iOS and Android, and excellent browser support via `hls.js`.
3. **CDN Friendly**: Uses standard HTTP caching, making it easy to scale with any CDN.
4. **Encryption**: Supports AES-128 encryption for basic DRM.

### Renditions Plan:
- **1080p (Original)**: High quality for desktop users on strong Wi-Fi.
- **720p**: Default high quality.
- **480p**: Standard quality for mobile/moderate networks.
- **360p**: Low quality/Data saver mode.

### CDN Configuration:
- Cache HLS segments (.ts files) indefinitely.
- Set short TTL for Master manifests (.m3u8) to allow for updates.
- Use signed cookies or tokens for access control at the edge.
