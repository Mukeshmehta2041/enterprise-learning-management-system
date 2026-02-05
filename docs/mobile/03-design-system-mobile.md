# 3. Mobile Design System

The mobile app should visually align with the web app while respecting native platform conventions.

## Tokens and Theming

Define a theme object (or use a theming library) that includes:

- **Colors**: primary, secondary, accent, success, warning, danger, neutral grays.
- **Typography**: font families, sizes, and weights for headings, body, captions.
- **Spacing**: a consistent spacing scale used across screens and components.
- **Radius and shadows**: for cards, modals, and buttons.

Use React Native’s `useColorScheme` or similar to support **light/dark mode**, mapping design tokens accordingly.

## Shared Primitives

Create shared components under `src/components` such as:

- `AppText` – wrapper around `Text` applying typography and color from the theme.
- `Button` – primary/secondary/outline variants with loading and disabled states.
- `Input` – text input with label, helper, and error text.
- `Card` – surface with padding, radius, and optional header/footer.
- `ListItem` – row with title, subtitle, icon/chevron, and press feedback.
- `Badge` – small status label (e.g. for enrollment status, difficulty).
- `Modal` / `BottomSheet` – for dialogs and context actions.

These should mirror the intent of your web components but use **native** interactions (ripples on Android, bounce/elastic scrolling, etc.).

## Accessibility

- Ensure **touch targets** are large enough (minimum ~44x44 points).
- Support **screen readers** with proper `accessibilityLabel` and `accessibilityRole` props.
- Respect **dynamic font sizes** where possible (do not hard-code text sizes that ignore system settings).
- Maintain adequate **color contrast** in both light and dark themes.

