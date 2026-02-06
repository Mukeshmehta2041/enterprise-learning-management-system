import { z } from 'zod'

export const PaymentStatusSchema = z.enum(['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED']);

export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

export const PlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  currency: z.string(),
  interval: z.enum(['MONTHLY', 'YEARLY', 'ONE_TIME']),
  features: z.array(z.string()),
})

export type Plan = z.infer<typeof PlanSchema>;

export const PaymentIntentSchema = z.object({
  id: z.string(),
  clientSecret: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: PaymentStatusSchema,
})

export type PaymentIntent = z.infer<typeof PaymentIntentSchema>;

export const CreatePaymentRequestSchema = z.object({
  planId: z.string(),
  paymentMethodId: z.string().optional(),
})

export type CreatePaymentRequest = z.infer<typeof CreatePaymentRequestSchema>;

export const PaymentHistorySchema = z.object({
  id: z.string(),
  planId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: PaymentStatusSchema,
  createdAt: z.string(),
})

export type PaymentHistory = z.infer<typeof PaymentHistorySchema>;
