# Frontend Day 17 – Complex forms, validation, and wizards

**Focus:** Build robust form experiences for multi-step flows like course creation, assignment setup, and profile management.

**References:** [docs/frontend/02-design-system.md](../docs/frontend/02-design-system.md), [docs/frontend/03-routing-and-layout.md](../docs/frontend/03-routing-and-layout.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Complex forms and wizards being implemented. |
| ✅ Done | Key multi-step flows are validated, resilient, and user-friendly. |

**Started:** _fill when you begin_  
**Completed:** _fill when Frontend Day 17 is done_

---

## Checklist

### 1. Form primitives and validation strategy

- [ ] Choose or confirm your form library (e.g. React Hook Form, Formik) and validation approach (`zod`, `yup`, custom).
- [ ] Implement shared form components (inputs, selects, textareas, date pickers) wired into the design system.
- [ ] Standardize error display patterns (field-level errors, summary at top for complex forms).

### 2. Multi-step wizards

- [ ] Implement at least one multi-step wizard (e.g. course creation or assignment creation) with clear progress indication.
- [ ] Support “save draft” or partial progress where appropriate (e.g. course not yet published).
- [ ] Handle navigation between steps gracefully, preserving entered data.

### 3. Edge cases and resilience

- [ ] Ensure forms handle slow network responses (disable submit button, show spinner, prevent duplicate submissions).
- [ ] Add client-side guards for common backend validation failures (required fields, basic formats) to reduce round trips.
- [ ] Provide safe cancel/exit paths that prevent accidental data loss (confirmation dialog if there are unsaved changes).

### 4. Tests and accessibility

- [ ] Add tests for at least one complex form covering happy path, validation errors, and server errors.
- [ ] Verify forms are keyboard accessible and screen reader friendly (labels, descriptions, error associations).

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Frontend Day 17 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 17 is complete. Next: [Frontend Day 18](frontend-day-18.md) (Search, sorting, filtering, and pagination UX).

