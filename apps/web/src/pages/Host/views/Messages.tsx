import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Host } from 'src/types';
import { ChatBox } from '../components/ChatBox';
import { useRequest } from '../hooks';
import { WithHostMe } from '../HOCs/WithHostMe';

interface MessagesWithHostProps {
  host: Host;
}

const MessagesWithHost: FC<MessagesWithHostProps> = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { data: request } = useRequest(requestId!);

  return <ChatBox initialMessages={request?.messages ?? []} requestId={requestId!} />;
};

const Messages = WithHostMe(MessagesWithHost);

export { Messages };
