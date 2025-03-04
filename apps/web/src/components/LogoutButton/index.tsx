import { FC } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@chakra-ui/react';

const LogoutButton: FC = () => {
  const { logout } = useAuth0();

  return (
    <Button
      colorScheme="purple"
      variant="outline"
      size="sm"
      borderRadius="50px"
      onClick={() =>
        logout({
          logoutParams: {
            returnTo: `${window.location.origin}/workahomie/`,
          },
        })
      }
    >
      Sign out
    </Button>
  );
};

export { LogoutButton };
