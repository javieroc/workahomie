import { FC } from 'react';
import { Heading, VStack, Image, Text } from '@chakra-ui/react';
import { Story } from 'src/types';

interface PeopleStoryCardProps {
  story: Story;
}

const PeopleStoryCard: FC<PeopleStoryCardProps> = ({ story }) => {
  return (
    <VStack
      backgroundColor="white"
      padding="16px"
      maxWidth="360px"
      height="320px"
      alignItems="flex-start"
    >
      <Image src={story.image} minWidth="328px" height="140px" objectFit="cover" />
      <Text fontSize="sm">{story.user}</Text>
      <Heading size="xs" marginTop="0px !important">
        {story.location}
      </Heading>
      <Text fontFamily="Gloria Hallelujah" noOfLines={4} fontSize="sm">
        {story.brief}
      </Text>
    </VStack>
  );
};

export { PeopleStoryCard };
