import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { HostLayout } from './components/HostLayout';
import { Profile } from './views/Profile';
import { MyPlace } from './views/MyPlace';

const Host: FC = () => {
  return (
    <HostLayout>
      <Routes>
        <Route index element={<Navigate replace to="/host/profile" />} />
        <Route path="profile" element={<Profile />} />
        <Route path="place" element={<MyPlace />} />
      </Routes>
    </HostLayout>
  );
};

export { Host };
