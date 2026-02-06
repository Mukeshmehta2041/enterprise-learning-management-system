import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 20 }, // ramp up to 20 users
    { duration: '3m', target: 20 }, // stay at 20 users
    { duration: '1m', target: 0 },  // ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must be below 500ms
    http_req_failed: ['rate<0.01'],    // less than 1% failures
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export default function () {
  // 1. Auth: Get Token
  const loginRes = http.post(`${BASE_URL}/api/v1/auth/token`, JSON.stringify({
    grant_type: 'password',
    username: 'student@example.com',
    password: 'password123'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'logged in successfully': (r) => r.status === 200,
  });

  if (loginRes.status !== 200) {
    sleep(1);
    return;
  }

  const token = loginRes.json('access_token');
  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // 2. Course Catalog
  const coursesRes = http.get(`${BASE_URL}/api/v1/courses?status=PUBLISHED&limit=10`, params);
  check(coursesRes, {
    'list courses successful': (r) => r.status === 200,
  });

  // 3. User Profile
  const profileRes = http.get(`${BASE_URL}/api/v1/users/me`, params);
  check(profileRes, {
    'get profile successful': (r) => r.status === 200,
  });

  // 4. Enrollments (if catalog is not empty, get one course and list)
  const courses = coursesRes.json('items');
  if (courses && courses.length > 0) {
    const courseId = courses[0].id;
    const enrollRes = http.get(`${BASE_URL}/api/v1/enrollments/my-courses`, params);
    check(enrollRes, {
      'get enrollments successful': (r) => r.status === 200,
    });
  }

  sleep(Math.random() * 3 + 1); // think time between 1 and 4 seconds
}
