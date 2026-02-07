# LMS Mobile App

This is the React Native (Expo) mobile application for the Learning Management System.

## Tech Stack

- **Framework:** React Native with Expo Router
- **Language:** TypeScript
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **State Management:** Zustand & React Query
- **Storage:** SecureStore & AsyncStorage
- **API Client:** Axios

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Setup:**
    Create a `.env` file or set environment variables:
    ```
    EXPO_PUBLIC_API_URL=http://<your-gateway-ip>:8080/api
    ```

3.  **Run in development:**
    ```bash
    npx expo start
    ```
    Press `i` for iOS simulator or `a` for Android emulator.

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

### Android
For development build:
```bash
npx expo run:android
```
For production build (AAB/APK):
```bash
eas build --platform android
```

### iOS
For development build:
```bash
npx expo run:ios
```
For production build (IPA):
```bash
eas build --platform ios
```

## Performance & Optimization

- All lists use `FlatList` with `memo` where applicable.
- Images are handled via Expo Image (cached).
- API data is cached via React Query with configurable stale times.
