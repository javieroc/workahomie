import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { IncomingRequests } from './views/IncomingRequests';
import { OutgoingRequests } from './views/OutgoingRequests';
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
        <Route path="incoming-requests" element={<IncomingRequests />}>
          <Route path=":requestId" element={<Messages />} />
        </Route>
        <Route path="outgoing-requests" element={<OutgoingRequests />}>
          <Route path=":requestId" element={<Messages />} />
        </Route>
      </Routes>
    </HostLayout>
  );
};

export { Host };
