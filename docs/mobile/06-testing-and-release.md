# 6. Testing, Performance, and Release (Mobile)

## Testing Strategy

Use **Jest** and **React Native Testing Library** for unit and interaction tests:

- Test shared components (buttons, inputs, list items) for rendering and behavior.
- Test screens with mocked navigation and API hooks (React Query) to cover key flows (login, course browsing, enroll).
- Keep tests close to implementation files (e.g. `Component.test.tsx` next to `Component.tsx`).

For higher confidence, consider E2E tests later (e.g. Detox) for critical user journeys.

## Performance Considerations

- Use `FlatList` / `SectionList` for any sizable lists (courses, assignments, notifications).
- Provide stable keys and avoid inline functions/objects in render items where possible.
- Minimize unnecessary re-renders by memoizing expensive components and using lightweight state management.
- Be mindful of image sizes and caching for thumbnails or cover images.

## Build and Release Basics

- Support running the app on both Android and iOS (emulator/simulator and physical devices).
- Document commands for:
  - Installing dependencies.
  - Running in development.
  - Building release APK/AAB (Android) and IPA (iOS) for distribution.
- Outline the basic steps for publishing to app stores (even if not implemented yet) and note any future plans for OTA updates (e.g. CodePush or EAS) as later phases.

