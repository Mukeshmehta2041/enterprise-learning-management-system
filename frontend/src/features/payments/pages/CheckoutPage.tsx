import { useNavigate, useParams } from 'react-router-dom';
import { Card, Container } from '@/shared/ui/Layout';
import { Button } from '@/shared/ui';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Heading4, TextMuted } from '@/shared/ui/Typography';
import { useState, useEffect } from 'react';

export function CheckoutPage() {
  const { intentId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success'>('processing');

  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      setStatus('success');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container size="sm" className="py-20">
      <Card className="text-center py-12">
        {status === 'processing' ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
            <Heading4>Processing your payment...</Heading4>
            <TextMuted>Please do not refresh the page.</TextMuted>
            <TextMuted className="text-xs mt-2">Intent ID: {intentId}</TextMuted>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <Heading4 className="text-2xl">Payment Successful!</Heading4>
            <TextMuted className="mt-2 text-lg">
              Welcome to the community! Your subscription is now active.
            </TextMuted>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Button onClick={() => navigate('/dashboard')} className="px-8">
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate('/courses')} className="px-8">
                Explore Courses
              </Button>
            </div>
          </div>
        )}
      </Card>
    </Container>
  );
}
