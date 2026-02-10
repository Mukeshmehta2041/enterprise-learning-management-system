import { useState, useEffect } from 'react'
import { useAuthStore } from '../state/useAuthStore'
import { apiClient } from '../api/client'

interface Branding {
  primaryColor: string
  logoUrl?: string
  institutionName: string
}

export function useBranding() {
  const { user } = useAuthStore()
  const [branding, setBranding] = useState<Branding>({
    primaryColor: '#4f46e5',
    institutionName: 'LMS University',
  })

  useEffect(() => {
    async function fetchBranding() {
      if (user?.tenantId) {
        try {
          const response = await apiClient.get(`/api/v1/tenants/${user.tenantId}/branding`)
          setBranding(response.data)

          // In a real app with CSS variables support in NativeWind, we could do:
          // if (response.data.primaryColor) {
          //   const rgb = hexToRgb(response.data.primaryColor);
          //   variableManager.set('--color-primary', `${rgb.r} ${rgb.g} ${rgb.b}`);
          // }
        } catch (e) {
          console.log('Error fetching branding:', e)
        }
      }
    }
    fetchBranding()
  }, [user?.tenantId])

  return branding
}

// Helper to convert hex to RGB for CSS variables
/* function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 79, g: 70, b: 229 }
} */
