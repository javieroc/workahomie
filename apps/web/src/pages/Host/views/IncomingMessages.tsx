import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useHostMe } from 'src/hooks/useHostMe';
import { Loading } from 'src/components';
import { ChatBox } from '../components/ChatBox';

const IncomingMessages: FC = () => {
  const { data: hostMe, isLoading } = useHostMe();

  if (isLoading) {
    return <Loading />;
  }

  if (hostMe) {
    return <ChatBox />;
  }

  return <Navigate to="/try-hosting" />;
};

export { IncomingMessages };
