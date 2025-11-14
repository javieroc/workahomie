import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNotification } from 'src/hooks';

export const DonationToastHandler = () => {
  const [params] = useSearchParams();
  const notify = useNotification();
  const hasShown = useRef(false);

  useEffect(() => {
    if (hasShown.current) return;

    const donationStatus = params.get('donation');
    if (!donationStatus) return;

    hasShown.current = true;

    if (donationStatus === 'success') {
      notify({ title: 'Thank you for your donation! 💖', status: 'success' });
    } else if (donationStatus === 'cancel') {
      notify({ title: 'Donation canceled', status: 'info' });
    }
  }, [params, notify]);

  return null;
};
