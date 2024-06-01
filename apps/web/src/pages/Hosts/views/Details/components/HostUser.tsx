import { FC } from 'react';
import { HStack, Heading, List, ListIcon, ListItem, Stack, Text } from '@chakra-ui/react';
import { Avatar } from 'src/components';
import { IconType } from 'react-icons';
import { FaCoffee, FaShower, FaParking, FaWifi } from 'react-icons/fa';
import { GiFireFlower } from 'react-icons/gi';
import { MdKitchen } from 'react-icons/md';
import { CiFries } from 'react-icons/ci';
import { Facilities } from 'src/types/host';
import { Host } from 'src/types';

type HostUserProps = {
  host: Host;
};

const IconList: Record<Facilities, IconType> = {
  coffee: FaCoffee,
  garden: GiFireFlower,
  kitchen: MdKitchen,
  parking: FaParking,
  showers: FaShower,
  snacks: CiFries,
  wifi: FaWifi,
};

const HostUser: FC<HostUserProps> = ({ host }) => {
  return (
    <Stack>
      <HStack>
        <Avatar src={host?.profileImages[0]} size="xl" />
        <Stack>
          <Heading size="lg">{`${host?.firstName} ${host?.lastName}`}</Heading>
          <Heading size="md" color="orange.500">
            {host?.occupation}
          </Heading>
        </Stack>
      </HStack>
      <Heading size="lg">About Me</Heading>
      <Text fontSize="xl">{host?.aboutMe}</Text>
      <Heading size="lg">What this place offer</Heading>
      <List>
        {host?.facilities?.map((facility) => (
          <ListItem key={facility} fontSize="xl">
            <ListIcon as={IconList[facility]} />
            {facility}
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};

export { HostUser };
