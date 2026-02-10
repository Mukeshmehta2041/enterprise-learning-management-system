import { useState, useEffect } from 'react'
import * as Network from 'expo-network'

export function useNetwork() {
  const [isConnected, setIsConnected] = useState<boolean | null>(true)
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(true)

  useEffect(() => {
    const checkNetwork = async () => {
      const state = await Network.getNetworkStateAsync()
      setIsConnected(state.isConnected ?? false)
      setIsInternetReachable(state.isInternetReachable ?? false)
    }

    checkNetwork()

    // In a real app, you would use NetInfo.addEventListener if you wanted real-time updates
    // but expo-network is fine for periodic checks or manual triggers.
    const interval = setInterval(checkNetwork, 5000)
    return () => clearInterval(interval)
  }, [])

  return { isConnected, isInternetReachable }
}
