import { Flex, Heading, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import { Review } from './Review';

const Reviews: FC = () => {
  return (
    <VStack align="flex-start">
      <Heading size="lg">Reviews</Heading>
      <Flex wrap="wrap" gap={8}>
        <Review
          date="17th September, 2024"
          review="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis obcaecati, assumenda omnis dolor eaque inventore repudiandae iure voluptatum alias. Aut dolor doloremque aperiam nostrum accusantium nisi quos rerum odit tempore."
          userName="Jhon Slow"
          userPicture="asdas"
        />
        <Review
          date="17th September, 2024"
          review="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis obcaecati, assumenda omnis dolor eaque inventore repudiandae iure voluptatum alias. Aut dolor doloremque aperiam nostrum accusantium nisi quos rerum odit tempore."
          userName="Jhon Slow"
          userPicture="asdas"
        />
        <Review
          date="17th September, 2024"
          review="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis obcaecati, assumenda omnis dolor eaque inventore repudiandae iure voluptatum alias. Aut dolor doloremque aperiam nostrum accusantium nisi quos rerum odit tempore."
          userName="Jhon Slow"
          userPicture="asdas"
        />
        <Review
          date="17th September, 2024"
          review="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis obcaecati, assumenda omnis dolor eaque inventore repudiandae iure voluptatum alias. Aut dolor doloremque aperiam nostrum accusantium nisi quos rerum odit tempore."
          userName="Jhon Slow"
          userPicture="asdas"
        />
        <Review
          date="17th September, 2024"
          review="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis obcaecati, assumenda omnis dolor eaque inventore repudiandae iure voluptatum alias. Aut dolor doloremque aperiam nostrum accusantium nisi quos rerum odit tempore."
          userName="Jhon Slow"
          userPicture="asdas"
        />
        <Review
          date="17th September, 2024"
          review="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis obcaecati, assumenda omnis dolor eaque inventore repudiandae iure voluptatum alias. Aut dolor doloremque aperiam nostrum accusantium nisi quos rerum odit tempore."
          userName="Jhon Slow"
          userPicture="asdas"
        />
      </Flex>
    </VStack>
  );
};

export { Reviews };
