import { withAuthenticationRequired } from '@auth0/auth0-react';
import { FC } from 'react';
import { useAuthorizedApiCall } from 'src/api/useAuthorizedApiCall';

type AuthenticationGuardProps = {
  component: FC;
};

export const AuthenticationGuard: FC<AuthenticationGuardProps> = ({ component }) => {
  useAuthorizedApiCall();
  const Component = withAuthenticationRequired(component, {
    // eslint-disable-next-line
    onRedirecting: () => <span>...Loaging</span>,
  });

  return <Component />;
};
