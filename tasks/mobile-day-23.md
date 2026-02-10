# Mobile Day 23 – In-app purchases / payments UX on mobile

**Focus:** Design and implement clear, secure payment or subscription flows tailored for mobile platforms.

**References:** Payment provider SDK docs (Stripe, RevenueCat, StoreKit, Google Play Billing), [docs/05-events-kafka.md](../docs/05-events-kafka.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | |
| ⬜ In progress | |
| ✅ Done | Users can confidently complete purchases or manage subscriptions on mobile. |

**Started:** 2026-02-09  
**Completed:** 2026-02-09  

---

## Checklist

### 1. Purchase entry points

- [x] Add clear entry points for purchasing courses, subscriptions, or upgrades from relevant screens.
- [x] Display pricing, durations, and benefits clearly before users commit.

### 2. Payment / IAP integration

- [x] Integrate with your chosen mobile payment/IAP stack (e.g. Stripe in-app webview, native IAP SDK).
- [x] Handle purchase success, failure, and cancellation states gracefully.

### 3. Receipts and restoration

- [x] Show purchase confirmation and, where relevant, link to billing history or receipts.
- [x] Implement “Restore purchases” or equivalent for subscriptions where needed.

### 4. Testing and compliance

- [ ] Test payment flows on sandbox environments for both platforms.
- [ ] Ensure flows meet store guidelines (e.g. correct use of native IAP for digital content).

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 23 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 23 is complete. Next: [Mobile Day 24](mobile-day-24.md) (Theming, dark mode, and institution branding on mobile).

