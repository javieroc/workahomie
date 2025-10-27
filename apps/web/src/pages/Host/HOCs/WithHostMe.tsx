import { FC, ComponentType } from 'react';
import { Navigate } from 'react-router-dom';
import { useHostMe } from 'src/hooks/useHostMe';
import { Loading } from 'src/components';
import { Host as HostType } from 'src/types';

export function WithHostMe<P extends { host: HostType }>(
  WrappedComponent: ComponentType<P>,
): FC<Omit<P, 'host'>> {
  const ComponentWithHostMe: FC<Omit<P, 'host'>> = (props) => {
    const { data: host, isLoading } = useHostMe();

    if (isLoading) return <Loading />;

    if (!host) return <Navigate to="/try-hosting" replace />;

    return <WrappedComponent {...(props as P)} host={host} />;
  };

  return ComponentWithHostMe;
}
