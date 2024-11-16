import { Flex, Heading, Icon } from '@chakra-ui/react';
import { FC } from 'react';
import { BsGithub } from 'react-icons/bs';

const Footer: FC = () => {
  return (
    <Flex
      padding="20px"
      backgroundColor="purple.800"
      justifyContent={['center', 'flex-end']}
      color="white"
    >
      <Heading size="md" marginRight="16px">
        Dev by Dev&Coffee
      </Heading>
      <Icon as={BsGithub} boxSize="24px" />
    </Flex>
  );
};

export { Footer };
