import { Flex, Heading, Icon, Link } from '@chakra-ui/react';
import { FC } from 'react';
import { BsGithub } from 'react-icons/bs';

const Footer: FC = () => {
  return (
    <Flex
      padding="20px"
      backgroundColor="purple.800"
      justifyContent={['center', 'flex-end']}
      color="white"
      as={Link}
      href="https://javieroc.github.io/portfolio-astro/"
      isExternal
    >
      <Heading size="md" marginRight="16px">
        Crafted by Javier Ocampo
      </Heading>
      <Icon as={BsGithub} boxSize="24px" />
    </Flex>
  );
};

export { Footer };
