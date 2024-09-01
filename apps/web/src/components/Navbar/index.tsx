import { FC } from 'react';
import { Box, Flex, Heading, HStack, Stack, IconButton, useDisclosure } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import Logo from 'src/assets/logo.svg?react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useFilters } from 'src/pages/Hosts/hooks';
import { Divider } from './Divider';
import { UserMenu } from './UserMenu';
import { LoginButton } from '../LoginButton';
import { LogoutButton } from '../LogoutButton';
import { OSMSearchInput } from '../OSMSearchInput';

const Navbar: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated } = useAuth0();
  const { pathname } = useLocation();
  const { setFilters } = useFilters();
  const [, setSearchParams] = useSearchParams();

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
        {pathname === '/hosts' && (
          <OSMSearchInput
            size="md"
            onClick={(search) => {
              setFilters({ lat: search.lat, lng: search.lon });
              setSearchParams({
                search: search.display_name,
                lat: search.lat.toString(),
                lng: search.lon.toString(),
                place_id: search.place_id,
              });
            }}
          />
        )}
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
