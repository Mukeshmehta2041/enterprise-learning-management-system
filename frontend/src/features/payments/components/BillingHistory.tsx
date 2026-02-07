import { usePaymentHistory } from '../api/paymentHooks';
import { Card, Heading4, TextMuted, TextSmall, Button } from '@/shared/ui';
import { CreditCard, Download, ExternalLink, Receipt, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { PaymentStatus } from '@/shared/types/payment';

const getStatusBadge = (status: PaymentStatus) => {
  switch (status) {
    case 'SUCCESS':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
          <CheckCircle2 size={10} />
          PAID
        </span>
      );
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
          <Clock size={10} />
          PENDING
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
          <XCircle size={10} />
          FAILED
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
          <AlertCircle size={10} />
          CANCELLED
        </span>
      );
    default:
      return null;
  }
};

export function BillingHistory() {
  const { data: history, isLoading, isError } = usePaymentHistory();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 w-full bg-slate-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="p-8 text-center border-dashed border-rose-200 bg-rose-50/50">
        <AlertCircle className="mx-auto h-8 w-8 text-rose-500 mb-2" />
        <Heading4>Failed to load billing history</Heading4>
        <TextMuted>We couldn't retrieve your transaction details at this time.</TextMuted>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard className="text-indigo-600" size={24} />
          <Heading4 className="m-0">Billing History</Heading4>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download size={16} />
          Export All
        </Button>
      </div>

      {!history || history.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-slate-200">
          <Receipt className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <Heading4 className="text-slate-900 font-semibold m-0">No transactions found</Heading4>
          <TextMuted className="mt-2">When you purchase a course or subscription, it will appear here.</TextMuted>
          <Button variant="outline" className="mt-6" onClick={() => window.location.href = '/pricing'}>
            View Plans
          </Button>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Plan / Type</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <TextSmall className="text-slate-600">
                      {new Date(tx.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TextSmall>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-900">
                      {tx.planId.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-900">
                      ${tx.amount.toFixed(2)} {tx.currency.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(tx.status)}
                  </td>
                  <td className="px-6 py-4">
                    {tx.status === 'SUCCESS' ? (
                      <button className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 font-medium transition-colors">
                        <Download size={14} />
                        <span className="text-xs">PDF</span>
                      </button>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
        <ExternalLink className="mt-0.5 text-blue-500 shrink-0" size={16} />
        <div>
          <p className="text-sm font-medium text-blue-900">Need help with a payment?</p>
          <p className="text-xs text-blue-700 mt-0.5">Contact our billing support if you have questions about a transaction or need a custom invoice.</p>
        </div>
      </div>
    </div>
  );
}
