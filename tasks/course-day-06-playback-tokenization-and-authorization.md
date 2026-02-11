# Course Day 6 – Playback tokenization & authorization

**Focus:** Ensure lecture playback is only available to authorized users by introducing short-lived playback tokens/URLs and enforcing enrollment and role-based access rules.

**References:** [docs/03-api-gateway.md](../docs/03-api-gateway.md), [docs/07-security.md](../docs/07-security.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Playback authorization rules and tokenization in place for all lectures. |

**Started:**  
**Completed:**  

---

## Checklist

### Backend

- [ ] **Authorization rules**: Define who can watch which lectures (enrolled learners, instructors, preview for non-enrolled users) and codify this in service logic.
- [ ] **Playback token endpoint**: Implement an endpoint that issues short-lived playback tokens/URLs after checking enrollment and access rules.
- [ ] **Token validation**: Ensure playback tokens are validated by the media/edge layer and expire correctly; define scopes (course, lecture, quality level).
- [ ] **Revocation scenarios**: Handle edge cases such as revoked enrollments, course unpublishing, or instructor removal.

### Frontend

- [ ] **Playback request flow**: Update the player integration to request a playback token/URL before starting playback.
- [ ] **Access-denied UX**: Show clear messaging and CTAs (e.g. enroll, upgrade) when playback is denied due to access rules.
- [ ] **Token expiry handling**: Decide and implement how the player refreshes tokens or handles expiry mid-session.

### Mobile

- [ ] **Token-based playback**: Ensure the mobile player also retrieves and uses playback tokens/URLs rather than static URLs.
- [ ] **Access rules alignment**: Confirm mobile uses the same access rules and error messaging patterns as the web frontend.
- [ ] **Session handling**: Handle token expiry or auth session loss gracefully during long playback sessions (e.g. prompt re-login if needed).

---

## Done?

When all checkboxes above are done, Course Day 6 is complete. Next: [Course Day 7 – Player integration & UX](course-day-07-player-integration-and-ux.md).

