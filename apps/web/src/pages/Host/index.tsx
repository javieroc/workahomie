import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Request } from './views/Requests';
import { HostLayout } from './components/HostLayout';
import { Profile } from './views/Profile';
import { MyPlace } from './views/MyPlace';
import { Messages } from './views/Messages';

const Host: FC = () => {
  return (
    <HostLayout>
      <Routes>
        <Route index element={<Navigate replace to="/host/profile" />} />
        <Route path="profile" element={<Profile />} />
        <Route path="place" element={<MyPlace />} />
        <Route path="incoming-requests" element={<Request isIncoming />}>
          <Route path=":requestId" element={<Messages />} />
        </Route>
        <Route path="outgoing-requests" element={<Request />}>
          <Route path=":requestId" element={<Messages />} />
        </Route>
      </Routes>
    </HostLayout>
  );
};

export { Host };
