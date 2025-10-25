import { FC, useState } from 'react';
import { Box, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import { FormProvider, TextFieldInput } from 'src/components';
import { useNotification } from 'src/hooks/useNotification';
import { useCreateReview } from 'src/pages/Hosts/hooks';
import { CreateReviewDto } from 'src/pages/Hosts/types';
import { BsStar, BsStarFill } from 'react-icons/bs';

interface ReviewFormProps {
  hostId: string;
  onSuccess?: () => void;
}

const ReviewForm: FC<ReviewFormProps> = ({ hostId, onSuccess }) => {
  const { isAuthenticated, user } = useAuth0();
  const notification = useNotification();
  const [rating, setRating] = useState(0);

  const { mutate: createReview, isPending } = useCreateReview(hostId, {
    onSuccess: () => {
      notification({
        title: 'Review',
        description: 'Your review was submitted!',
        status: 'success',
      });
      setRating(0);
      onSuccess?.();
    },
  });

  if (!isAuthenticated) {
    return null;
  }

  const handleSubmit = (formValues: { review: string }) => {
    if (rating === 0) {
      notification({
        title: 'Review',
        description: 'Please select a rating.',
        status: 'warning',
      });
      return;
    }

    const reviewData: CreateReviewDto = {
      ...formValues,
      rating,
      userName: user?.name ?? '',
      userAvatar: user?.picture ?? '',
      date: new Date().toISOString(),
    };
    createReview(reviewData);
  };

  return (
    <Box width="100%">
      <FormProvider<CreateReviewDto>
        onSubmit={handleSubmit}
        submitButtonText="Submit Review"
        isSubmitting={isPending}
      >
        <TextFieldInput
          label="Review"
          name="review"
          withAs="textarea"
          placeholder="Write your review..."
          size={['md', 'lg']}
        />
        <VStack align="flex-start" mt={4}>
          <Text>Rating</Text>
          <HStack spacing={1}>
            {[1, 2, 3, 4, 5].map((star) => (
              <IconButton
                key={star}
                aria-label={`${star} star`}
                icon={star <= rating ? <BsStarFill /> : <BsStar />}
                colorScheme={star <= rating ? 'yellow' : 'gray'}
                variant="ghost"
                onClick={() => setRating(star)}
              />
            ))}
          </HStack>
        </VStack>
      </FormProvider>
    </Box>
  );
};

export { ReviewForm };
