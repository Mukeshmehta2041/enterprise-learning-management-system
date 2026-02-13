import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Card, Container } from '@/shared/ui/Layout';
import { Button, Heading4 } from '@/shared/ui';
import { CheckCircle2, Loader2, CreditCard, ShieldCheck, AlertCircle, ChevronLeft, Lock } from 'lucide-react';
import { useState } from 'react';
import { apiClient } from '@/shared/api/client';
import { useAuth } from '@/shared/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

export function CheckoutPage() {
  const { intentId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<'review' | 'processing' | 'success' | 'error'>('review');
  const [errorMsg, setErrorMsg] = useState('');

  const courseId = searchParams.get('courseId') || ''
  const courseName = searchParams.get('courseName') || 'Course Access'
  const currency = searchParams.get('currency') || 'USD'
  const priceValue = Number.parseFloat(searchParams.get('price') || '0')
  const orderTotal = Number.isFinite(priceValue) ? priceValue : 0
  const orderLabel = courseId ? courseName : 'Premium Access'

  const handlePayment = async () => {
    if (!user?.id) {
      setStatus('error');
      setErrorMsg('Please sign in to complete your purchase.');
      return;
    }

    setStatus('processing');
    setErrorMsg('');

    try {
      const response = await apiClient.post('/payments', {
        userId: user.id,
        planId: null,
        courseId: courseId || null,
        amount: orderTotal,
        idempotencyKey: intentId || `${user.id}-${courseId}`,
      });

      const payment = response.data;

      setTimeout(async () => {
        await apiClient.post(`/payments/webhook/completed?intentId=${payment.paymentIntentId}`);
        setStatus('success');
        await queryClient.invalidateQueries({ queryKey: ['enrollments'] });
        if (courseId) {
          await queryClient.invalidateQueries({ queryKey: ['course', courseId] });
          await queryClient.invalidateQueries({ queryKey: ['enrollment', courseId] });
        }
      }, 2000);
    } catch (error) {
      console.error('Payment failed', error);
      setStatus('error');
      setErrorMsg('Your card was declined. Please check your card details and try again.');
    }
  };

  if (status === 'success') {
    return (
      <Container size="sm" className="py-20">
        <Card className="text-center py-12 px-8 shadow-xl border-emerald-100">
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            </div>
            <Heading4 className="text-3xl font-bold text-slate-900">Payment Successful!</Heading4>
            <p className="mt-4 text-slate-600 text-lg leading-relaxed">
              Thanks for your purchase. Your access is now active and you can start learning right away.
            </p>
            <div className="mt-6 p-4 bg-slate-50 rounded-lg w-full max-w-xs text-left">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-medium text-slate-900">#LMS-{intentId?.substring(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-medium text-slate-900">{currency} {orderTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full">
              <Button
                onClick={() => navigate(courseId ? `/courses/${courseId}` : '/dashboard')}
                className="flex-1 py-6 text-lg"
              >
                {courseId ? 'Go to Course' : 'Start Learning'}
              </Button>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="mt-6 text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors"
            >
              View Billing History
            </button>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-12 max-w-5xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Payment Details */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Confirm and pay</h1>
            <p className="text-slate-500 mt-2">Securely complete your enrollment.</p>
          </div>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Heading4 className="m-0 flex items-center gap-2">
                <CreditCard className="text-indigo-600" size={20} />
                Payment Method
              </Heading4>
              <div className="flex gap-2">
                <div className="h-6 w-10 bg-slate-100 rounded border border-slate-200" />
                <div className="h-6 w-10 bg-slate-100 rounded border border-slate-200" />
                <div className="h-6 w-10 bg-slate-100 rounded border border-slate-200" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg border-2 border-indigo-600 bg-indigo-50/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded border shadow-sm">
                      <CreditCard size={24} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Visa ending in 4242</p>
                      <p className="text-xs text-slate-500">Expires 12/28</p>
                    </div>
                  </div>
                  <div className="h-5 w-5 rounded-full border-4 border-indigo-600 bg-white" />
                </div>
              </div>

              <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 text-sm font-medium hover:border-indigo-300 hover:text-indigo-600 transition-all">
                + Add new payment method
              </button>
            </div>

            {status === 'error' && (
              <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-lg flex gap-3 text-rose-800">
                <AlertCircle className="shrink-0" size={20} />
                <p className="text-sm font-medium">{errorMsg}</p>
              </div>
            )}
          </Card>

          <div className="flex items-center gap-3 text-slate-500 px-2">
            <ShieldCheck size={20} className="text-emerald-600" />
            <span className="text-sm">Your payment data is encrypted and handled securely by our payment processor. We never store your full card details.</span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <Card className="p-6 sticky top-8 border-slate-200 shadow-sm">
            <Heading4 className="mb-6">Order Summary</Heading4>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-start">
                <div className="pr-4">
                  <p className="font-semibold text-slate-900">{orderLabel}</p>
                  <p className="text-xs text-slate-500 mt-1">Secure access for this course</p>
                </div>
                <span className="font-medium text-slate-900">{currency} {orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{currency} {orderTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax</span>
                <span>{currency} 0.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-slate-900 pt-3 border-t border-slate-100">
                <span>Total</span>
                <span>{currency} {orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8">
              <Button
                className="w-full py-6 text-lg font-bold gap-2"
                size="lg"
                onClick={handlePayment}
                disabled={status === 'processing'}
              >
                {status === 'processing' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Complete Payment
                  </>
                )}
              </Button>
              <p className="text-[11px] text-center text-slate-400 mt-4 leading-relaxed">
                By completing your purchase you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
