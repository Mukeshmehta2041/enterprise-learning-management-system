# Frontend Day 17 – Complex forms, validation, and wizards

**Focus:** Build robust form experiences for multi-step flows like course creation, assignment setup, and profile management.

**References:** [docs/frontend/02-design-system.md](../docs/frontend/02-design-system.md), [docs/frontend/03-routing-and-layout.md](../docs/frontend/03-routing-and-layout.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Complex forms and wizards being implemented. |

**Started:** 2026-02-06  
**Completed:** 2026-02-06

---

## Checklist

### 1. Form primitives and validation strategy

- [x] Choose or confirm your form library (e.g. React Hook Form, Formik) and validation approach (`zod`, `yup`, custom).
- [x] Implement shared form components (inputs, selects, textareas, date pickers) wired into the design system.
- [x] Standardize error display patterns (field-level errors, summary at top for complex forms).

### 2. Multi-step wizards

- [x] Implement at least one multi-step wizard (e.g. course creation or assignment creation) with clear progress indication.
- [x] Support “save draft” or partial progress where appropriate (e.g. course not yet published).
- [x] Handle navigation between steps gracefully, preserving entered data.

### 3. Edge cases and resilience

- [x] Ensure forms handle slow network responses (disable submit button, show spinner, prevent duplicate submissions).
- [x] Add client-side guards for common backend validation failures (required fields, basic formats) to reduce round trips.
- [x] Provide safe cancel/exit paths that prevent accidental data loss (confirmation dialog if there are unsaved changes).

### 4. Tests and accessibility

- [x] Add tests for at least one complex form covering happy path, validation errors, and server errors.
- [x] Verify forms are keyboard accessible and screen reader friendly (labels, descriptions, error associations).

### 5. Progress update

- [x] Update the **Progress** table at the top of this file when Frontend Day 17 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 17 is complete. Next: [Frontend Day 18](frontend-day-18.md) (Search, sorting, filtering, and pagination UX).

