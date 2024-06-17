import { FC } from 'react';
import { Box, Flex, Heading, HStack, Stack, IconButton, useDisclosure } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import Logo from 'src/assets/logo.svg?react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, useLocation } from 'react-router-dom';
import { Divider } from './Divider';
import { UserMenu } from './UserMenu';
import { SearchInput } from './SearchInput';
import { LoginButton } from '../LoginButton';
import { LogoutButton } from '../LogoutButton';

const Navbar: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated } = useAuth0();
  const { pathname } = useLocation();

  const links = [
    {
      label: 'How It Works',
      to: '#',
    },
    {
      label: 'Experiences',
      to: '#',
    },
    {
      label: 'About Us',
      to: '#',
    },
  ];

  return (
    <Flex direction="column">
      <Flex height="80px" align="center" justify="space-between" padding="0px 32px">
        <Link to="/">
          <Logo />
        </Link>
        {pathname !== '/' && <SearchInput />}
        <IconButton
          size="sm"
          variant="outline"
          colorScheme="purple"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing="24px" display={{ base: 'none', md: 'flex' }}>
          <HStack spacing="16px">
            {links.map((link) => (
              <Heading size="sm" color="orange.500" key={link.label}>
                {link.label}
              </Heading>
            ))}
          </HStack>
          <HStack>{isAuthenticated ? <UserMenu /> : <LoginButton />}</HStack>
        </HStack>
      </Flex>
      {isOpen && (
        <Box padding={4} display={{ md: 'none' }}>
          <Stack as="nav" spacing={4} alignItems="center">
            {links.map((link) => (
              <Heading size="sm" color="orange.500" key={link.label}>
                {link.label}
              </Heading>
            ))}
            {isAuthenticated && <LogoutButton />}
          </Stack>
        </Box>
      )}
      <Divider />
    </Flex>
  );
};

export { Navbar };
