import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SkeletonText,
  useDisclosure,
  VStack,
  SimpleGrid,
} from '@chakra-ui/react';
import { FC } from 'react';
import { usePagination, useReviews } from 'src/pages/Hosts/hooks';
import { Review } from './Review';
import { ReviewForm } from './ReviewForm';

interface ReviewsProps {
  hostId: string;
}

const Reviews: FC<ReviewsProps> = ({ hostId }) => {
  const { paginationParams } = usePagination();
  const { data: response, isLoading } = useReviews(hostId, paginationParams);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <VStack align="flex-start">
      <Flex justify="space-between" w="100%">
        <Heading size="lg">Reviews</Heading>
        <Button onClick={onOpen}>Leave a review</Button>
      </Flex>
      {isLoading ? (
        <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
          {response?.data?.map((review) => <Review key={review._id} {...review} />)}
        </SimpleGrid>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Leave a Review</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ReviewForm hostId={hostId} onSuccess={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export { Reviews };
