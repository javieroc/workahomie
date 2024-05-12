import { FC } from 'react';
import { Layout } from 'src/components';
import { Route, Routes } from 'react-router-dom';
import { Details, List } from './views';

const Hosts: FC = () => {
  return (
    <Layout>
      <Routes>
        <Route index element={<List />} />
        <Route path=":hostId" element={<Details />} />
      </Routes>
    </Layout>
  );
};

export { Hosts };
