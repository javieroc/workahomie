import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { api } from 'src/api';
import { useNotification } from 'src/hooks/useNotification';

export interface DonateRequest {
  amount: number;
}

export interface DonateResponse {
  url: string;
}

const postDonation = async (payload: DonateRequest): Promise<DonateResponse> => {
  const { data } = await api.post<DonateResponse>('/payments/donate', payload);
  return data;
};

function useDonate(
  options: UseMutationOptions<DonateResponse, unknown, DonateRequest, unknown> = {},
): UseMutationResult<DonateResponse, unknown, DonateRequest, unknown> {
  const notify = useNotification();

  return useMutation({
    mutationFn: (payload: DonateRequest) => postDonation(payload),
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      } else {
        notify({
          title: 'Error starting donation',
          status: 'error',
        });
      }
    },
    onError: () => {
      notify({
        title: 'Error starting donation',
        status: 'error',
      });
    },
    ...options,
  });
}

export { useDonate };
