import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { type Tenant, type TenantBranding } from '@/shared/types/tenant';
/* import { apiClient } from '@/shared/api/client'; */

interface TenantContextType {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
  updateBranding: (branding: Partial<TenantBranding>) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

// Default branding for fallbacks
const DEFAULT_BRANDING: TenantBranding = {
  primaryColor: '#4f46e5',
  secondaryColor: '#0f172a',
  institutionName: 'LMS Platform',
  fontFamily: 'Inter, sans-serif',
};

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyColors = useCallback((branding: TenantBranding) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', branding.primaryColor);
    root.style.setProperty('--color-secondary', branding.secondaryColor);

    // Simplistic approach for generating shades would be more complex, 
    // but for now we set the main variables used by Tailwind/CSS.
  }, []);

  const fetchTenant = useCallback(async () => {
    try {
      setIsLoading(true);
      // Determine tenant from subdomain (e.g., academy1.lms.local)
      const hostname = window.location.hostname;
      const parts = hostname.split('.');
      let slug = 'default';

      if (parts.length > 2) {
        slug = parts[0];
      }

      // In a real app, this would be an API call
      // const response = await apiClient.get<Tenant>(`/tenants/slug/${slug}`);
      // setTenant(TenantSchema.parse(response.data));

      // MOCK DATA for development
      const mockTenants: Record<string, Tenant> = {
        'default': {
          id: 'def-001',
          slug: 'default',
          name: 'Global Learning Academy',
          branding: DEFAULT_BRANDING,
          active: true,
        },
        'acme': {
          id: 'acme-001',
          slug: 'acme',
          name: 'Acme Corporate University',
          branding: {
            primaryColor: '#e11d48', // Rose-600
            secondaryColor: '#1e293b',
            institutionName: 'Acme Corp',
            fontFamily: 'Inter, sans-serif',
          },
          active: true,
        },
        'science': {
          id: 'sci-001',
          slug: 'science',
          name: 'Science Institute',
          branding: {
            primaryColor: '#059669', // Emerald-600
            secondaryColor: '#0f172a',
            institutionName: 'Science Inst',
            fontFamily: 'Inter, sans-serif',
          },
          active: true,
        }
      };

      const selectedTenant = mockTenants[slug] || mockTenants['default'];
      setTenant(selectedTenant);
      applyColors(selectedTenant.branding);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tenant configuration');
      applyColors(DEFAULT_BRANDING);
    } finally {
      setIsLoading(false);
    }
  }, [applyColors]);

  useEffect(() => {
    fetchTenant();
  }, [fetchTenant]);

  const updateBranding = (newBranding: Partial<TenantBranding>) => {
    if (tenant) {
      const updated = { ...tenant, branding: { ...tenant.branding, ...newBranding } };
      setTenant(updated);
      applyColors(updated.branding);
    }
  };

  return (
    <TenantContext.Provider value={{ tenant, isLoading, error, updateBranding }}>
      {children}
    </TenantContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
