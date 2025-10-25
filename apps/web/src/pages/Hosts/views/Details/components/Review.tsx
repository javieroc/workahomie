import { Heading, HStack, Text, VStack, Flex } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { FC } from 'react';
import { Avatar } from 'src/components';

interface ReviewProps {
  userName: string;
  userAvatar: string;
  date: string;
  review: string;
  rating: number;
}

const Review: FC<ReviewProps> = ({ date, review, userName, userAvatar, rating }) => {
  return (
    <VStack align="flex-start" maxW="460px">
      <HStack>
        <Avatar src={userAvatar} name={userName} />
        <VStack align="flex-start" spacing={1}>
          <Heading size="sm">{userName}</Heading>
          <Heading size="xs" color="gray.600">
            {date}
          </Heading>
        </VStack>
      </HStack>
      <Text noOfLines={4} fontSize="sm">
        {review}
      </Text>
      <Flex width="100%" justifyContent="flex-end" mt={2} alignItems="center">
        {Array(5)
          .fill('')
          .map((_, i) => (
            <StarIcon key={i} color={i < rating ? '#D53F8C' : 'gray.300'} boxSize={3} />
          ))}
      </Flex>
    </VStack>
  );
};

export { Review };
