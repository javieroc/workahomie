import { Box, Flex, Heading, Icon } from '@chakra-ui/react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { IconType } from 'react-icons';

type SidebarProps = {
  links: { to: string; title: string; icon: IconType }[];
};

const Sidebar: FC<SidebarProps> = ({ links }) => {
  return (
    <Box
      borderRight="1px solid"
      borderColor="gray.200"
      height="100vh"
      width={['60px', '60px', '200px']}
      transition="width 0.3s ease"
    >
      {links.map((link) => (
        <Link to={link.to} key={link.to}>
          <Flex
            p={4}
            role="group"
            cursor="pointer"
            align="center"
            justify={['center', 'flex-start']}
            _hover={{ bg: 'purple.100' }}
            gap={[0, 3]}
          >
            <Icon as={link.icon} boxSize={6} />
            <Heading size="md" display={['none', 'none', 'block']}>
              {link.title}
            </Heading>
          </Flex>
        </Link>
      ))}
    </Box>
  );
};

export { Sidebar };
