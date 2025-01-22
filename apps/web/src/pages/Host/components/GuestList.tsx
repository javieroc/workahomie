import { Flex } from '@chakra-ui/react';
import { FC } from 'react';
import { GuestCard } from './GuestCard';

const GuestList: FC = () => {
  return (
    <Flex flexDirection="column" gap={2}>
      <GuestCard />
      <GuestCard />
      <GuestCard />
      <GuestCard />
      <GuestCard />
    </Flex>
  );
};

export { GuestList };
