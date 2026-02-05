export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'MONTHLY' | 'YEARLY' | 'ONE_TIME';
  features: string[];
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
}

export interface CreatePaymentRequest {
  planId: string;
  paymentMethodId?: string;
}

export interface PaymentHistory {
  id: string;
  planId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
}
