import { HStack, Heading, Switch } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { FC } from 'react';
import { mapVisibleAtom } from '../../../store';

const Actions: FC = () => {
  const [isMapVisible, setShowMap] = useAtom(mapVisibleAtom);
  return (
    <HStack justifyContent="space-between" padding="32px" boxShadow="base">
      <Heading />
      <HStack>
        <Heading size="xs">Show map</Heading>
        <Switch
          isChecked={isMapVisible}
          id="email-alerts"
          colorScheme="purple"
          onChange={(event) => setShowMap(event.target.checked)}
        />
      </HStack>
    </HStack>
  );
};

export { Actions };
