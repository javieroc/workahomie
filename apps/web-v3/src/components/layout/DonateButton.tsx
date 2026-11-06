import { useMutation } from '@tanstack/react-query';
import { HeartHandshake } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { api, apiErrorMessage } from '@/lib/api';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';

export function DonateButton() {
  const [open, setOpen] = useState(false);
  const donate = useMutation({
    mutationFn: async (amount: number) =>
      (await api.post<{ url: string }>('/payments/donate', { amount })).data,
    onSuccess: ({ url }) => {
      if (url) window.location.href = url;
    },
    onError: (e) => toast.error(apiErrorMessage(e, 'Could not start the donation')),
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-2 hover:bg-ink/5"
      >
        <HeartHandshake className="size-4 text-tangerine" /> Support
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Keep Workahomies free">
        <p className="text-ink-2">
          Workahomies has no fees and no ads. A small donation pays for servers and keeps the
          Android app free for everyone.
        </p>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[3, 5, 10].map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="lg"
              loading={donate.isPending && donate.variables === amount}
              onClick={() => donate.mutate(amount)}
            >
              €{amount}
            </Button>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">Secure checkout by Stripe.</p>
      </Dialog>
    </>
  );
}
