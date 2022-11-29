import { FC } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { ReactComponent as Logo } from 'src/assets/logo.svg';
import { Divider } from './Divider';

const Navbar: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      <Flex color="gray.50" height="80px" align="center" justify="space-between" padding="0px 32px">
        <Logo />
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
          <HStack>
            <Button colorScheme="purple" size="sm" borderRadius="50px">
              Sign up
            </Button>
            <Button colorScheme="purple" variant="outline" size="sm" borderRadius="50px">
              Sign in
            </Button>
          </HStack>
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
            <Button width="200px" colorScheme="purple" size="sm" borderRadius="50px">
              Sign up
            </Button>
            <Button
              width="200px"
              colorScheme="purple"
              variant="outline"
              size="sm"
              borderRadius="50px"
            >
              Sign in
            </Button>
          </Stack>
        </Box>
      )}
      <Divider />
    </Flex>
  );
};

export { Navbar };
