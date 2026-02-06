import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import type { Plan, PaymentIntent, CreatePaymentRequest, PaymentHistory } from '@/shared/types/payment';

export const usePlans = () => {
  return useQuery<Plan[]>({
    queryKey: ['plans'],
    queryFn: async () => {
      const response = await apiClient.get('/payments/plans');
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const usePaymentHistory = () => {
  return useQuery<PaymentHistory[]>({
    queryKey: ['payment-history'],
    queryFn: async () => {
      const response = await apiClient.get('/payments/history');
      return response.data;
    },
    staleTime: 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useCreatePayment = () => {
  return useMutation<PaymentIntent, Error, CreatePaymentRequest>({
    mutationFn: async (request) => {
      const response = await apiClient.post('/payments/create-intent', request);
      return response.data;
    },
  });
};
