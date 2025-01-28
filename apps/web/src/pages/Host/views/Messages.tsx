import { FC } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useHostMe } from 'src/hooks/useHostMe';
import { Loading } from 'src/components';
import { ChatBox } from '../components/ChatBox';
import { useRequest } from '../hooks';

const Messages: FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { data: request } = useRequest(requestId!);
  const { data: hostMe, isLoading } = useHostMe();

  if (isLoading) {
    return <Loading />;
  }

  if (hostMe) {
    return <ChatBox initialMessages={request?.messages ?? []} />;
  }

  return <Navigate to="/try-hosting" />;
};

export { Messages };
