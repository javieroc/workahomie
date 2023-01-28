import { FC } from 'react';
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
  Text,
} from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';

const UserAvatar: FC<{ picture: string }> = ({ picture }) => {
  return (
    <Box
      backgroundImage="linear-gradient(to bottom right, #805AD5, #ED8936, #D53F8C)"
      padding="3px"
      borderRadius="50%"
    >
      <Avatar name="User Avatar" size="md" src={picture} />
    </Box>
  );
};

const UserMenu: FC = () => {
  const { isAuthenticated, user, logout } = useAuth0();
  return isAuthenticated ? (
    <Menu>
      <MenuButton
        as={Button}
        transition="all 0.3s"
        _focus={{ boxShadow: 'none' }}
        _active={{ boxShadow: 'none' }}
        _hover={{ boxShadow: 'none' }}
        bg="transparent"
        py={2}
        my={2}
      >
        <UserAvatar picture={user?.picture ?? ''} />
      </MenuButton>
      <Portal>
        <MenuList>
          <MenuItem>
            <Text>{user?.email}</Text>
          </MenuItem>
          <MenuItem>
            <Text>{user?.name}</Text>
          </MenuItem>
          <MenuDivider />
          <MenuItem onClick={() => logout()}>Sign out</MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  ) : null;
};

export { UserMenu };
