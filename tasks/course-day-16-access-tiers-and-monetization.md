# Course Day 16 – Access tiers & monetization

**Focus:** Align course and lecture access with billing, defining free vs paid content, pricing, and purchase/enrollment flows across platforms.

**References:** [docs/02-billing.md](../docs/02-billing.md), [docs/03-api-gateway.md](../docs/03-api-gateway.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Access tiers integrated with courses/lectures and surfaced in UI/flows. |

**Started:** 2026-02-12  
**Completed:** 2026-02-12  

---

## Checklist

### Backend

- [x] **Pricing model**: Define fields and tables for course pricing, bundles, and trial/free tiers.
- [x] **Access rules by tier**: Implement rules for which lectures are free previews vs locked behind purchase or subscription.
- [x] **APIs for entitlements**: Provide APIs for clients to check entitlements and access level for a user/course combination.

### Frontend

- [x] **Locked/unlocked indicators**: Show lock icons or similar indicators for lectures the user cannot access yet.
- [x] **Purchase/enroll CTAs**: Implement CTAs on course and lecture pages to enroll or purchase based on the user’s state.
- [x] **Post-purchase UX**: Ensure the transition from purchase completion to course access feels smooth and clear.

### Mobile

- [x] **Access state in lists**: Show locked vs unlocked state for lectures and courses in mobile lists and details.
- [x] **Mobile purchase flow**: If applicable, design mobile-appropriate purchase/enroll flows (respecting app store constraints where relevant).
- [x] **Graceful failure handling**: Handle entitlement check failures with clear messaging and retry options on mobile.

---

## Done?

When all checklists above are done, Course Day 16 is complete. Next: [Course Day 17 – Course analytics for instructors](course-day-17-course-analytics-for-instructors.md).

