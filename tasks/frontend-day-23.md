# Frontend Day 23 – Payments UX, invoices, and billing history

**Focus:** Build clear, trustworthy flows for payments, invoices, and billing history.

**References:** [docs/05-events-kafka.md](../docs/05-events-kafka.md), any payment provider docs you use.

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Payments and billing UX being implemented. |
| ✅ Done | Users can complete payments and review billing history confidently. |

**Started:** _fill when you begin_  
**Completed:** _fill when Frontend Day 23 is done_

---

## Checklist

### 1. Checkout and payment flows

- [ ] Implement or refine checkout screens for buying courses, subscriptions, or bundles.
- [ ] Surface pricing, taxes, discounts, and totals clearly before confirmation.
- [ ] Make errors from the payment provider understandable and actionable (e.g. card declined, 3DS required).

### 2. Billing history and invoices

- [ ] Add a “Billing” or “Payments” section where users can see past transactions.
- [ ] Show status (paid, pending, refunded) and links to download invoices/receipts where supported.

### 3. Security and trust

- [ ] Ensure sensitive payment fields are hosted or handled by the payment provider where possible.
- [ ] Display security cues (e.g. lock icons, brief copy) without overdoing it.

### 4. Tests and validation

- [ ] Add tests for the main payment initiation and success/failure UI flows (mocking provider responses).
- [ ] Manually test common edge cases (network issues, back button, refresh mid-flow).

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Frontend Day 23 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 23 is complete. Next: [Frontend Day 24](frontend-day-24.md) (Multi-tenant theming and branding).

