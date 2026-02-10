# LMS Mobile App

This is the React Native (Expo) mobile application for the Learning Management System.

## Tech Stack

- **Framework:** React Native with Expo Router
- **Language:** TypeScript
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **State Management:** Zustand & React Query
- **Storage:** SecureStore & AsyncStorage
- **API Client:** Axios
- **Real-time:** Socket.io-client
- **Analytics:** Custom analytics utility with provider integration

## Getting Started

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Environment Setup:**
  Create a `.env` file or set environment variables:

  ```
  EXPO_PUBLIC_ENV=development
  EXPO_PUBLIC_API_URL=http://<your-gateway-ip>:8080/api
  EXPO_PUBLIC_SOCKET_URL=http://<your-gateway-ip>:8080
  EXPO_PUBLIC_SENTRY_DSN=
  ```

3.  **Run in development:**
    ```bash
    npx expo start
    ```
    Press `i` for iOS simulator or `a` for Android emulator.

## Features & Advanced Implementation

### 🔄 Data & Offline

- **Persistence:** React Query is configured with `AsyncStorage` persistence (24-hour cache).
- **Background Sync:** Automatic unread count updates and badge management.

### 💬 Real-time Communication

- **Live Chat:** Real-time messaging in live sessions using `useRealtime` hook.
- **Presence:** Real-time user status indicators.

### 📈 Analytics & Tracking

- **Event Funnels:** Key user journeys (App Open -> Login -> Course View -> Enrollment) are tracked automatically.
- **Identity:** User traits (role, institution) are synchronized with analytics events.

### ♿ Accessibility

- **Screen Readers:** All base components include `accessibilityRole` and `accessibilityLabel`.
- **Contrast:** WCAG compliant colors for light and dark modes.

## Project Structure

- `app/`: Expo Router file-based navigation
  - `(auth)/`: Login and Registration
  - `(tabs)/`: Main bottom-tab navigation (Home, Courses, Assignments, Profile)
  - `course/`: Course details and lesson content
- `src/`: Core logic
  - `components/`: Atomic design primitives (Button, AppText, Card, etc.)
  - `api/`: API client and services
  - `state/`: Global store (Auth, etc.)
  - `constants/`: Theme and configuration

## Testing

Run unit tests with Jest:

```bash
npm test
```

## Deep Linking

The app supports the `lms-mobile://` scheme. You can test deep links using the following commands:

- **Open Course details:**
  ```bash
  npx uri-scheme open lms-mobile://course/course-id --ios
  ```
- **Open Lesson:**
  ```bash
  npx uri-scheme open lms-mobile://course/course-id/lesson/lesson-id --android
  ```

## Build and Release

EAS build profiles are defined in `eas.json` for development, staging, and production.

### Android

For development build:

```bash
npx expo run:android
```

For EAS internal builds:

```bash
eas build --platform android --profile staging
```

For production build (AAB/APK):

```bash
eas build --platform android --profile production
```

### iOS

For development build:

```bash
npx expo run:ios
```

For EAS internal builds:

```bash
eas build --platform ios --profile staging
```

For production build (IPA):

```bash
eas build --platform ios --profile production
```

## Performance & Optimization

- All lists use `FlatList` with `memo` where applicable.
- Images are handled via Expo Image (cached).
- API data is cached via React Query with configurable stale times.
