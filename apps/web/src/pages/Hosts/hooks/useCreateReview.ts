import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { api } from 'src/api';
import { QUERY_KEYS } from 'src/constants/queryKey';
import { CreateReviewDto, Review } from '../types';

const createReview = async (hostId: string, reviewData: CreateReviewDto): Promise<Review> => {
  const { data } = await api.post<Review>(`/hosts/${hostId}/reviews`, reviewData);
  return data;
};

export const useCreateReview = (
  hostId: string,
  options?: UseMutationOptions<Review, Error, CreateReviewDto>,
) => {
  const queryClient = useQueryClient();
  return useMutation<Review, Error, CreateReviewDto>({
    ...options,
    mutationFn: (reviewData) => createReview(hostId, reviewData),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEWS, hostId] });
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
  });
};
