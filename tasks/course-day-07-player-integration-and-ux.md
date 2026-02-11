# Course Day 7 – Player integration & UX

**Focus:** Integrate a resilient video player on web and mobile with essential controls (seek, speed, resume position, captions) and solid error states.

**References:** [docs/frontend/02-ux-principles.md](../docs/frontend/02-ux-principles.md), [docs/10-best-practices.md](../docs/10-best-practices.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Video player UX implemented with core controls and failure handling across platforms. |

**Started:**  
**Completed:**  

---

## Checklist

### Backend

- [ ] **Playback telemetry schema**: Define events for play, pause, seek, completion, and errors; add API or ingestion endpoints to record them.
- [ ] **Captions/subtitles model**: Extend the media model to track subtitle/caption files and their languages where applicable.

### Frontend

- [ ] **Player selection**: Choose and integrate a video player library that supports controls like seek, speed change, and captions.
- [ ] **Resume position**: Implement logic to resume playback at the last watched position (using backend progress or local storage backed by APIs).
- [ ] **Error overlays**: Design and implement friendly player error overlays for network issues, access errors, or unsupported formats.
- [ ] **Keyboard & accessibility**: Ensure keyboard control and basic accessibility for the player controls.

### Mobile

- [ ] **Native player integration**: Integrate with the platform’s native video component or a cross-platform player that supports full-screen playback.
- [ ] **Orientation handling**: Implement orientation and full-screen behaviour (landscape during playback, safe navigation between screens).
- [ ] **Playback controls**: Ensure basic controls (play/pause, seek, mute, captions where available) are intuitive on small screens.
- [ ] **Error states**: Match web’s key error states with mobile-appropriate messaging and retry options.

---

## Done?

When all checkboxes above are done, Course Day 7 is complete. Next: [Course Day 8 – Performance & bandwidth optimization](course-day-08-performance-and-bandwidth-optimization.md).

