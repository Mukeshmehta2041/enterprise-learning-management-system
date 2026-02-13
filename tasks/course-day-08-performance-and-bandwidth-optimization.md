# Course Day 8 – Performance & bandwidth optimization

**Focus:** Optimize video delivery for different network conditions using streaming formats or multiple renditions, and tune client behaviour for bandwidth-friendly playback.

**References:** [docs/09-devops.md](../docs/09-devops.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ~~⬜ Not started~~ | |
| ~~🔄 In progress~~ | |
| ✅ Done | Video delivery optimized with appropriate formats/renditions and client behaviour. |

**Started:** 2026-02-11  
**Completed:** 2026-02-11

---

## Checklist

### Backend

- [x] **Streaming format decision**: Decide on HLS/DASH or multi-rendition MP4 strategy and document the trade-offs. (Decided on HLS, see docs/media-streaming-strategy.md).
- [x] **Rendition generation**: Extend processing to generate multiple quality renditions or streaming playlists. (Simulated in ContentProcessingService).
- [x] **CDN integration**: Plan or configure CDN usage for media endpoints/paths and document cache headers and invalidation.
- [x] **Bandwidth-aware APIs**: Ensure APIs can return appropriate URLs or manifests based on client capabilities where needed.

### Frontend

- [ ] **Adaptive playback**: Configure the player to automatically choose quality based on bandwidth where supported.
- [ ] **Manual quality selection**: Optionally add a UI to manually pick quality (low/medium/high) for users with preferences.
- [ ] **Data usage hints**: Surface hints or labels about approximate data usage per quality level if feasible.

### Mobile

- [ ] **Network-aware defaults**: Choose conservative defaults on cellular (e.g. lower quality) and higher quality on Wi-Fi by default.
- [ ] **User control over quality**: Provide a simple way to select quality or \"data saver\" mode in the mobile player.
- [ ] **Offline/prefetch considerations**: Decide whether to support limited offline/prefetch behaviour for lectures and note any future work.

---

## Done?

When all checkboxes above are done, Course Day 8 is complete. Next: [Course Day 9 – Access rules edge cases & auditing](course-day-09-access-rules-and-auditing.md).

