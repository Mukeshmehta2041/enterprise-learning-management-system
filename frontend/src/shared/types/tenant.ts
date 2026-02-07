import { z } from 'zod';

export const TenantBrandingSchema = z.object({
  primaryColor: z.string().default('#4f46e5'), // Default Indigo-600
  secondaryColor: z.string().default('#0f172a'), // Default Slate-900
  logoUrl: z.string().nullable().optional(),
  faviconUrl: z.string().nullable().optional(),
  fontFamily: z.string().default('Inter, sans-serif'),
  institutionName: z.string().default('LMS Platform'),
});

export type TenantBranding = z.infer<typeof TenantBrandingSchema>;

export const TenantSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  branding: TenantBrandingSchema,
  active: z.boolean().default(true),
});

export type Tenant = z.infer<typeof TenantSchema>;
