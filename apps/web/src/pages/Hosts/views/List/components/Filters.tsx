import { FC, useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  Checkbox,
  SimpleGrid,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { OCCUPATIONS } from 'src/constants/occupations';
import { FACILITIES } from 'src/constants/facilities';
import { FiltersParams } from 'src/types';
import { filtersAtom } from '../../../store';

interface FiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

const Filters: FC<FiltersProps> = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useAtom(filtersAtom);
  const [localFilters, setLocalFilters] = useState<FiltersParams>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  const handleOccupationChange = (occupation: string) => {
    const newOccupations = localFilters.occupations?.includes(occupation)
      ? localFilters.occupations.filter((o) => o !== occupation)
      : [...(localFilters.occupations || []), occupation];
    setLocalFilters({ ...localFilters, occupations: newOccupations });
  };

  const handleFacilityChange = (facility: string) => {
    const lowerCaseFacility = facility.toLowerCase();
    const newFacilities = localFilters.facilities?.includes(lowerCaseFacility)
      ? localFilters.facilities.filter((f) => f !== lowerCaseFacility)
      : [...(localFilters.facilities || []), lowerCaseFacility];
    setLocalFilters({ ...localFilters, facilities: newFacilities });
  };

  const handleRateChange = (rate: number) => {
    setLocalFilters({ ...localFilters, rate });
  };

  const handleApply = () => {
    setFilters(localFilters);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Filters</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={8} align="stretch">
            <Box>
              <Text fontWeight="bold" mb={4}>
                Occupation
              </Text>
              <SimpleGrid columns={3} spacing={4}>
                {OCCUPATIONS.map((occupation) => (
                  <Checkbox
                    key={occupation.name}
                    isChecked={localFilters.occupations?.includes(occupation.name)}
                    onChange={() => handleOccupationChange(occupation.name)}
                  >
                    {occupation.name}
                  </Checkbox>
                ))}
              </SimpleGrid>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={4}>
                Facilities
              </Text>
              <SimpleGrid columns={3} spacing={4}>
                {FACILITIES.map((facility) => (
                  <Checkbox
                    key={facility}
                    isChecked={localFilters.facilities?.includes(facility.toLowerCase())}
                    onChange={() => handleFacilityChange(facility)}
                  >
                    {facility}
                  </Checkbox>
                ))}
              </SimpleGrid>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={4}>
                Rate
              </Text>
              <Slider
                aria-label="rate-slider"
                defaultValue={localFilters.rate || 0}
                min={0}
                max={5}
                step={0.5}
                onChangeEnd={handleRateChange}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={6}>
                  <Box color="tomato" />
                </SliderThumb>
              </Slider>
              <Text textAlign="center" mt={2}>
                {localFilters.rate || 0} stars
              </Text>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="purple" mr={3} onClick={handleApply}>
            Apply
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export { Filters };
