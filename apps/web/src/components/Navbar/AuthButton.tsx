import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@chakra-ui/react';
import { FC } from 'react';

const AuthButton: FC = () => {
  const { isAuthenticated, logout, loginWithRedirect } = useAuth0();

  return !isAuthenticated ? (
    <Button colorScheme="purple" size="sm" borderRadius="50px" onClick={() => loginWithRedirect()}>
      Sign in
    </Button>
  ) : (
    <Button
      colorScheme="purple"
      variant="outline"
      size="sm"
      borderRadius="50px"
      onClick={() => logout()}
    >
      Sign out
    </Button>
  );
};

export { AuthButton };
