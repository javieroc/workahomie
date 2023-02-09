import { withAuthenticationRequired } from '@auth0/auth0-react';
import { FC } from 'react';
import { WithAuth0Token } from 'src/api/WithAuth0Token';

type AuthenticationGuardProps = {
  component: FC;
};

export const AuthenticationGuard: FC<AuthenticationGuardProps> = ({ component }) => {
  // @TODO still need an improvement, first request is unauthorized.
  const Component = withAuthenticationRequired(WithAuth0Token(component), {
    // eslint-disable-next-line
    onRedirecting: () => <span>...Loading</span>,
  });

  return <Component />;
};
