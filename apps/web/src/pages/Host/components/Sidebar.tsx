import { Box, Flex, Heading } from '@chakra-ui/react';
import { FC } from 'react';
import { Link } from 'react-router-dom';

type SidebarProps = {
  links: { to: string; title: string }[];
};

const Sidebar: FC<SidebarProps> = ({ links }) => {
  return (
    <Box backgroundColor="gray.50" height="100%">
      {links.map((link) => (
        <Link to={link.to} key={link.to}>
          <Flex
            p={4}
            role="group"
            cursor="pointer"
            _hover={{
              bg: 'gray.200',
            }}
          >
            <Heading size="md">{link.title}</Heading>
          </Flex>
        </Link>
      ))}
    </Box>
  );
};

export { Sidebar };
