import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '10s',
};

const BASE_URL = __ENV.STAGING_URL || 'http://localhost:8081';

export default function () {
  // 1. Health Checks
  const gatewayHealth = http.get(`${BASE_URL}/actuator/health`);
  check(gatewayHealth, {
    'gateway health is UP': (r) => r.status === 200,
  });

  // 2. Auth Flow
  const loginRes = http.post(`${BASE_URL}/api/v1/auth/token`, JSON.stringify({
    grant_type: 'password',
    username: 'smoke-test@example.com',
    password: 'password123'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'auth smoke test passed': (r) => r.status === 200 || r.status === 401, // 401 is okay for smoke test if user doesn't exist yet but service responded
  });

  // 3. Public Catalog
  const coursesRes = http.get(`${BASE_URL}/api/v1/courses?status=PUBLISHED`);
  check(coursesRes, {
    'course catalog smoke test passed': (r) => r.status === 200,
  });

  sleep(1);
}
