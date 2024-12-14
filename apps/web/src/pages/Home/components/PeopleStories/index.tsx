import { FC } from 'react';
import { Flex, Heading, VStack } from '@chakra-ui/react';
import { Story } from 'src/types';
import { PeopleStoryCard } from '../PeopleStoryCard';

interface PeopleStoriesProps {
  stories: Story[];
}

const PeopleStories: FC<PeopleStoriesProps> = ({ stories }) => {
  return (
    <Flex backgroundColor="gray.50" justify="center" padding={{ base: '16px', lg: '64px' }}>
      <VStack maxWidth="1306px" minWidth="200px">
        <Flex alignItems="center" width="100%" marginBottom="16px">
          <Heading size="lg">People Stories</Heading>
        </Flex>
        <Flex
          gridGap="16px"
          overflowX="auto"
          width="100%"
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {stories.map((story) => (
            <PeopleStoryCard key={story.id} story={story} />
          ))}
        </Flex>
      </VStack>
    </Flex>
  );
};

export { PeopleStories };
