import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { Config } from '../config'
import { useAuthStore } from '../state/useAuthStore'

export function useRealtime(namespace: string = '/') {
  const { token } = useAuthStore()
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!token) return

    const socket = io(`${Config.socketUrl}${namespace}`, {
      auth: {
        token,
      },
      transports: ['websocket'],
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setIsConnected(true)
      console.log('Realtime connected')
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
      console.log('Realtime disconnected')
    })

    socket.on('connect_error', (error) => {
      console.error('Realtime connection error:', error)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [token, namespace])

  const emit = (event: string, data: any) => {
    socketRef.current?.emit(event, data)
  }

  const on = (event: string, callback: (data: any) => void) => {
    socketRef.current?.on(event, callback)
    return () => {
      socketRef.current?.off(event, callback)
    }
  }

  return { isConnected, emit, on }
}
