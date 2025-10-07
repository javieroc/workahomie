import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useHostMe } from 'src/hooks';
import { Loading } from 'src/components';
import { Request } from './views/Requests';
import { HostLayout } from './components/HostLayout';
import { Profile } from './views/Profile';
import { MyPlace } from './views/MyPlace';
import { Messages } from './views/Messages';

const Host: FC = () => {
  const { isLoading: isAuthLoading } = useAuth0();
  const { data: host, isLoading: isHostLoading } = useHostMe();

  if (isAuthLoading || isHostLoading) {
    return <Loading />;
  }

  return (
    <HostLayout host={host}>
      <Routes>
        <Route index element={<Navigate replace to="/host/profile" />} />
        <Route path="profile" element={<Profile />} />
        <Route path="place" element={<MyPlace />} />
        <Route path="incoming-requests" element={<Request isIncoming host={host} />}>
          <Route path=":requestId" element={<Messages />} />
        </Route>
        <Route path="outgoing-requests" element={<Request host={host} />}>
          <Route path=":requestId" element={<Messages />} />
        </Route>
      </Routes>
    </HostLayout>
  );
};

export { Host };
