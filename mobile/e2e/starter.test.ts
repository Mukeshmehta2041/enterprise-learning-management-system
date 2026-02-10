import { device, element, by, expect } from 'detox';

describe('LMS Mobile App E2E', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show login screen on start', async () => {
    await expect(element(by.text('Welcome Back'))).toBeVisible();
  });

  it('should allow user to navigate to courses after login', async () => {
    // Example login flow (pseudo-detox)
    await element(by.text('Email')).replaceText('student@example.com');
    await element(by.text('Password')).replaceText('password123');
    await element(by.text('Log In')).tap();

    await expect(element(by.text('Explore Courses'))).toBeVisible();
  });

  it('should view course details', async () => {
    // Navigate to courses tab if needed
    await element(by.id('tab-courses')).tap();

    // Tap on the first course
    await element(by.id('course-list-item-0')).tap();

    await expect(element(by.text('Course Details'))).toBeVisible();
  });
});
