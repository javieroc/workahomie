import { Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import { Avatar } from 'src/components';

interface ReviewProps {
  userName: string;
  userAvatar: string;
  date: string;
  review: string;
}

const Review: FC<ReviewProps> = ({ date, review, userName, userAvatar }) => {
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
    </VStack>
  );
};

export { Review };
