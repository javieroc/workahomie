import { FC } from 'react';
import {
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../Avatar';

const UserMenu: FC = () => {
  const { isAuthenticated, user, logout } = useAuth0();
  const navigate = useNavigate();

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
        <Avatar src={user?.picture ?? ''} size="md" />
      </MenuButton>
      <Portal>
        <MenuList>
          <MenuItem onClick={() => navigate('/host', { replace: true })}>
            <VStack align="flex-start">
              <Text>{user?.email}</Text>
              <Text>{user?.name}</Text>
            </VStack>
          </MenuItem>
          <MenuDivider />
          <MenuItem
            onClick={() =>
              logout({
                logoutParams: {
                  returnTo: `${window.location.origin}/workahomie/`,
                },
              })
            }
          >
            Sign out
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  ) : null;
};

export { UserMenu };
