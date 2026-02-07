import { useEffect, useRef, useState, useCallback } from 'react'
import { useAuth } from '@/shared/context/AuthContext'

interface RealtimeOptions<T> {
  url: string
  onMessage?: (data: T) => void
  onError?: (error: Event) => void
  onOpen?: () => void
  autoReconnect?: boolean
  reconnectInterval?: number
}

export function useRealtimeChannel<T = any>({
  url,
  onMessage,
  onError,
  onOpen,
  autoReconnect = true,
  reconnectInterval = 5000
}: RealtimeOptions<T>) {
  const { token } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<any>(null)

  const connect = useCallback(() => {
    if (!token || eventSourceRef.current) return

    const baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin
    // Append token as query parameter
    const streamUrl = new URL(url, baseUrl)
    streamUrl.searchParams.append('token', token)

    console.log(`Connecting to real-time channel: ${streamUrl.toString()}`)
    const es = new EventSource(streamUrl.toString())

    es.onopen = () => {
      console.log(`Real-time channel opened: ${url}`)
      setIsConnected(true)
      onOpen?.()
    }

    es.onerror = (e) => {
      console.error(`Real-time channel error: ${url}`, e)
      setIsConnected(false)
      onError?.(e)

      es.close()
      eventSourceRef.current = null

      if (autoReconnect) {
        reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval)
      }
    }

    // Standard Message handler if needed, but we usually use named events in SSE
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage?.(data)
      } catch (err) {
        console.error('Failed to parse real-time message', err)
      }
    }

    eventSourceRef.current = es
  }, [url, token, onMessage, onError, onOpen, autoReconnect, reconnectInterval])

  const subscribe = useCallback((eventName: string, handler: (data: T) => void) => {
    if (!eventSourceRef.current) return

    const wrappedHandler = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        handler(data)
      } catch (err) {
        console.error(`Failed to parse real-time event: ${eventName}`, err)
      }
    }

    eventSourceRef.current.addEventListener(eventName, wrappedHandler as EventListener)

    return () => {
      eventSourceRef.current?.removeEventListener(eventName, wrappedHandler as EventListener)
    }
  }, [])

  useEffect(() => {
    connect()

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      setIsConnected(false)
    }
  }, [connect])

  return {
    isConnected,
    subscribe,
    reconnect: connect
  }
}
