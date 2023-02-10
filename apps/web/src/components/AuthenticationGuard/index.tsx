import { FC } from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

type AuthenticationGuardProps = {
  component: FC;
};

export const AuthenticationGuard: FC<AuthenticationGuardProps> = ({ component }) => {
  const Component = withAuthenticationRequired(component, {
    // eslint-disable-next-line
    onRedirecting: () => <span>...Loading</span>,
  });

  return <Component />;
};
