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
      width={['60px', '60px', '300px']}
      transition="width 0.3s ease"
      minH="calc(100vh - 80px)"
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
            <Icon as={link.icon} boxSize={5} />
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
