import { FC } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@chakra-ui/react';

const LoginButton: FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button colorScheme="purple" size="sm" borderRadius="50px" onClick={() => loginWithRedirect()}>
      Sign in
    </Button>
  );
};

export { LoginButton };
