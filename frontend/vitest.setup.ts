import '@testing-library/jest-dom/vitest'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { server } from './src/test/mocks/server'

// Mock matchMedia
const mockMatchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(), // deprecated
  removeListener: vi.fn(), // deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

if (typeof window !== 'undefined') {
  window.matchMedia = mockMatchMedia
}
global.matchMedia = mockMatchMedia

// Mock EventSource
type SSECallback = (event: Event) => void

class MockEventSource {
  url: string
  onopen: SSECallback | null = null
  onmessage: SSECallback | null = null
  onerror: SSECallback | null = null
  readyState: number = 0
  listeners: Record<string, SSECallback[]> = {}

  constructor(url: string) {
    this.url = url
    setTimeout(() => {
      if (this.onopen) {
        console.log('Real-time channel opened:', url)
        this.onopen(new Event('open'))
      }
    }, 0)
  }

  addEventListener(type: string, listener: SSECallback) {
    if (!this.listeners[type]) this.listeners[type] = []
    this.listeners[type].push(listener)
  }

  removeEventListener(type: string, listener: SSECallback) {
    if (!this.listeners[type]) return
    this.listeners[type] = this.listeners[type].filter(l => l !== listener)
  }

  dispatchEvent(event: Event): boolean {
    const type = event.type
    if (this.listeners[type]) {
      this.listeners[type].forEach(l => l(event))
    }
    return true
  }

  close() { }
}

vi.stubGlobal('EventSource', MockEventSource);
vi.stubGlobal('matchMedia', mockMatchMedia);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

