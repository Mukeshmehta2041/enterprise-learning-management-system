import { useState } from 'react';
import { usePlans, useCreatePayment } from '../api/paymentHooks';
import { Card, Container } from '@/shared/ui/Layout';
import { Button } from '@/shared/ui';
import { Check, Shield, Zap, Star, Loader2 } from 'lucide-react';
import { Heading4, TextMuted, TextSmall } from '@/shared/ui/Typography';
import { cn } from '@/shared/utils/cn';

export function PricingPage() {
  const { data: plans, isLoading } = usePlans();
  const createPayment = useCreatePayment();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setSelectedPlanId(planId);
    try {
      const intent = await createPayment.mutateAsync({ planId });
      // In a real app, you'd redirect to Stripe checkout or open a modal
      console.log('Payment intent created:', intent);
      window.location.href = `/payments/checkout/${intent.id}`;
    } catch (error) {
      console.error('Failed to create payment intent:', error);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading subscription plans...</div>;
  }

  return (
    <Container size="md">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto">
          Choose the plan that's right for your learning journey. All plans include access to our core features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {plans?.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "relative flex flex-col h-full",
              plan.name.toLowerCase().includes('pro') && "border-2 border-indigo-500 shadow-indigo-100 shadow-lg"
            )}
          >
            {plan.name.toLowerCase().includes('pro') && (
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500 text-white shadow-sm">
                  MOST POPULAR
                </span>
              </div>
            )}

            <div className="mb-8">
              <Heading4 className="text-xl font-bold text-slate-900">{plan.name}</Heading4>
              <TextMuted className="mt-2 min-h-[48px]">{plan.description}</TextMuted>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                <span className="ml-1 text-slate-500">/{plan.interval.toLowerCase().replace('_time', '')}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              {plan.features.map((feature: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check className="h-3 w-3 text-emerald-600" />
                  </div>
                  <TextSmall className="text-slate-600">{feature}</TextSmall>
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              variant={plan.name.toLowerCase().includes('pro') ? 'primary' : 'outline'}
              size="lg"
              onClick={() => handleSubscribe(plan.id)}
              disabled={createPayment.isPending}
            >
              {createPayment.isPending && selectedPlanId === plan.id ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Get Started'
              )}
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-slate-900">Secure Payments</h3>
          <p className="mt-2 text-sm text-slate-500">Your payment information is always encrypted and never stored on our servers.</p>
        </div>
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-slate-900">Instant Access</h3>
          <p className="mt-2 text-sm text-slate-500">Get immediate access to all courses and features as soon as your payment is processed.</p>
        </div>
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
            <Star className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-slate-900">Cancel Anytime</h3>
          <p className="mt-2 text-sm text-slate-500">Not satisfied? Cancel your subscription anytime with one click in your settings.</p>
        </div>
      </div>
    </Container>
  );
}
