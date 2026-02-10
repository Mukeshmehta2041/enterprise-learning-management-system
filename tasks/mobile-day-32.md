# Mobile Day 32 – Bundle size, code splitting, and asset optimization

**Focus:** Reduce the mobile bundle size and optimize assets to improve startup time and install size.

**References:** React Native bundler docs, image optimization guides, [docs/mobile/01-architecture-mobile.md](../docs/mobile/01-architecture-mobile.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | |
| ✅ Done | Bundle and asset optimizations in progress. |
| ✅ Done | Mobile app bundle is leaner with optimized assets. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 32 is done_

---

## Checklist

### 1. Analyze bundle and dependencies

- [ ] Inspect JS bundle composition to find large dependencies and unused modules.
- [ ] Remove or replace heavy libraries where suitable alternatives exist.

### 2. Code splitting / lazy loading

- [ ] Consider lazy-loading rare or heavy screens (e.g. advanced analytics, admin views).
- [ ] Ensure lazy loading doesn’t introduce awkward UX (provide loading indicators).

### 3. Asset optimization

- [ ] Audit images and other static assets; compress or resize where appropriate.
- [ ] Use vector assets or icon fonts where possible to reduce size.

### 4. Verification

- [ ] Measure bundle size and startup time before and after changes.
- [ ] Test on target devices to ensure no regressions in visual quality.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 32 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 32 is complete. Next: [Mobile Day 33](mobile-day-33.md) (Large lists, virtualization, and infinite scroll on mobile).

