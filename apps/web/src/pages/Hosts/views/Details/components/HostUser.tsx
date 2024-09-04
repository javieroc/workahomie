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
        <Avatar src={host?.profileImages[0]} size={['md', 'xl']} />
        <Stack>
          <Heading size={['sm', 'lg']}>{`${host?.firstName} ${host?.lastName}`}</Heading>
          <Heading size={['xs', 'md']} color="orange.500">
            {host?.occupation}
          </Heading>
        </Stack>
      </HStack>
      <Heading size={['sm', 'lg']}>About Me</Heading>
      <Text fontSize={['sm', 'xl']}>{host?.aboutMe}</Text>
      <Heading size={['sm', 'lg']}>What this place offer</Heading>
      <List>
        {host?.facilities?.map((facility) => (
          <ListItem key={facility} fontSize={['md', 'xl']}>
            <ListIcon as={IconList[facility]} />
            {facility}
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};

export { HostUser };
