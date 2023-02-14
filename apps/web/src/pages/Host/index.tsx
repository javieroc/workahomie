import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Profile } from './views/Profile';
import { HostLayout } from './components/HostLayout';

const Host: FC = () => {
  return (
    <HostLayout>
      <Routes>
        <Route index element={<Navigate replace to="/host/profile" />} />
        <Route path="profile" element={<Profile />} />
        <Route path="place" element={<h1>Place</h1>} />
      </Routes>
    </HostLayout>
  );
};

export { Host };
