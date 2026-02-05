# 2. Design System and UX Guidelines

The LMS frontend uses **Tailwind CSS** as the foundation of its design system. All screens should be built using shared primitives and consistent interaction patterns.

## Design Tokens

Define Tailwind configuration (in `tailwind.config.[ts|js]`) to express LMS design tokens:

- **Colors**: brand primary/secondary, accent, success, warning, danger, neutral grays.
- **Typography**: font families (base, mono), font sizes and line heights for headings, body, captions.
- **Spacing**: standardized spacing scale (e.g. `1, 1.5, 2, 3, 4, 6, 8, 12`).
- **Breakpoints**: mobile-first (`sm`, `md`, `lg`, `xl`) targeting key LMS layouts (e.g. sidebar only on `md+`).

All components should prefer **semantic Tailwind classes** based on these tokens (avoid arbitrary values unless necessary).

## Component Taxonomy

Organize shared components under something like `src/shared/ui`:

- **Primitives**
  - `Button`, `IconButton`
  - `Input`, `Textarea`, `Select`
  - `Checkbox`, `Radio`, `Switch`
  - `Badge`, `Tag`, `Tooltip`
  - `Modal`, `Drawer`, `Popover`
  - `Alert`, `Toast`
- **Layout primitives**
  - `Container` (page max-widths and padding)
  - `PageHeader` (title, breadcrumbs, actions)
  - `Card` (surface with header/body/footer)
  - `Stack`, `Grid`, `Section`
- **Domain components**
  - `CourseCard`, `CourseList`
  - `LessonList`, `LessonItem`
  - `EnrollmentStatusBadge`
  - `AssignmentCard`, `SubmissionStatusBadge`
  - `NotificationItem`
  - `PlanCard` (for payments)

Each domain feature can extend these primitives but should reuse them where possible.

## Motion and Framer Motion

Use **Framer Motion** for:

- Page transitions (route changes).
- Enter/exit animations for dialogs, dropdowns, toasts.
- Micro-interactions (button hover, press states) where they add clarity.

Guidelines:

- Respect `prefers-reduced-motion` and disable non-essential animations for those users.
- Keep durations short (150–250ms) and easing subtle (`easeOut`, `easeInOut`).
- Avoid animating layout in ways that cause jank on low-end devices.

## Accessibility

Non-negotiable rules:

- Use **semantic HTML** (`<button>`, `<nav>`, `<main>`, `<header>`, `<section>`, `<form>`, etc.).
- Ensure all interactive elements are keyboard-focusable and have visible focus states.
- Provide `aria-label` or `aria-labelledby` where icons alone are used.
- Maintain color contrast ratios that meet WCAG AA at minimum.
- Manage focus correctly when opening/closing modals and drawers.

## Theming and Dark Mode (Optional)

If you support dark mode:

- Use Tailwind’s `dark:` variants.
- Store the theme preference in `localStorage` or rely on `prefers-color-scheme`.
- Ensure all pages are tested in both light and dark modes for readability and contrast.

