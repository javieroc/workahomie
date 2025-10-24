import { Button, HStack, Heading, Switch, useDisclosure } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { FC } from 'react';
import { VscSettings } from 'react-icons/vsc';
import { FiTrash2 } from 'react-icons/fi';
import { filtersAtom, mapVisibleAtom } from '../../../store';
import { Filters } from './Filters';

const Actions: FC = () => {
  const [isMapVisible, setShowMap] = useAtom(mapVisibleAtom);
  const [filters, setFilters] = useAtom(filtersAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClearFilters = () => {
    setFilters({ lat: filters.lat, lng: filters.lng });
  };

  return (
    <HStack justifyContent="space-between" padding="32px" boxShadow="base">
      <HStack>
        <Button leftIcon={<VscSettings />} colorScheme="purple" variant="solid" onClick={onOpen}>
          Filters
        </Button>
        <Button
          leftIcon={<FiTrash2 />}
          colorScheme="purple"
          variant="outline"
          onClick={handleClearFilters}
        >
          Clear filters
        </Button>
      </HStack>
      <HStack>
        <Heading size="xs">Show map</Heading>
        <Switch
          isChecked={isMapVisible}
          id="email-alerts"
          colorScheme="purple"
          onChange={(event) => setShowMap(event.target.checked)}
        />
      </HStack>
      <Filters isOpen={isOpen} onClose={onClose} />
    </HStack>
  );
};

export { Actions };
