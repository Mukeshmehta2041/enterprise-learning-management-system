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
class MockEventSource {
  url: string
  onopen: any
  onmessage: any
  onerror: any
  readyState: number = 0
  listeners: Record<string, Function[]> = {}

  constructor(url: string) {
    this.url = url
    setTimeout(() => {
      if (this.onopen) {
        console.log('Real-time channel opened:', url)
        this.onopen({} as any)
      }
    }, 0)
  }

  addEventListener(type: string, listener: Function) {
    if (!this.listeners[type]) this.listeners[type] = []
    this.listeners[type].push(listener)
  }

  removeEventListener(type: string, listener: Function) {
    if (!this.listeners[type]) return
    this.listeners[type] = this.listeners[type].filter(l => l !== listener)
  }

  dispatchEvent(event: any): boolean {
    const type = event.type
    if (this.listeners[type]) {
      this.listeners[type].forEach(l => l(event))
    }
    return true
  }

  close() { }
}

if (typeof window !== 'undefined') {
  (window as any).EventSource = MockEventSource;
}
(global as any).EventSource = MockEventSource;
vi.stubGlobal('EventSource', MockEventSource);
vi.stubGlobal('matchMedia', mockMatchMedia);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

