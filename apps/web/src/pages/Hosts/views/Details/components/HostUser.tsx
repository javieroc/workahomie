import { FC } from 'react';
import {
  HStack,
  Heading,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  Link,
  Icon,
  SkeletonText,
} from '@chakra-ui/react';
import { Avatar } from 'src/components';
import { IconType } from 'react-icons';
import { FaCoffee, FaShower, FaParking, FaWifi, FaWhatsapp } from 'react-icons/fa';
import { GiFireFlower } from 'react-icons/gi';
import { MdKitchen } from 'react-icons/md';
import { CiFries } from 'react-icons/ci';
import { Host } from 'src/types';
import { OCCUPATIONS } from 'src/constants/occupations';
import { Facility } from 'src/constants/facilities';

type HostUserProps = {
  host?: Host;
  isLoading: boolean;
};

const IconList: Record<Facility, IconType> = {
  coffee: FaCoffee,
  garden: GiFireFlower,
  kitchen: MdKitchen,
  parking: FaParking,
  showers: FaShower,
  snacks: CiFries,
  wifi: FaWifi,
};

const HostUser: FC<HostUserProps> = ({ host, isLoading }) => {
  const occupation = OCCUPATIONS.find((o) => o.name === host?.occupation);

  if (isLoading) {
    return <SkeletonText mt="4" noOfLines={10} spacing="4" skeletonHeight="2" />;
  }

  return (
    <Stack>
      <HStack>
        <Avatar src={host?.profileImages[0]} size={['md', 'xl']} />
        <Stack>
          <HStack spacing={4}>
            <Heading size={['sm', 'lg']}>{`${host?.firstName} ${host?.lastName}`}</Heading>
            <Link
              href={`https://wa.me/${host?.phone}`}
              target="_blank"
              display="flex"
              alignItems="center"
            >
              <Icon as={FaWhatsapp} boxSize={[3, 4]} />
              <Heading size={['xs', 'sm']}>{host?.phone}</Heading>
            </Link>
          </HStack>
          <HStack>
            {occupation && <Icon as={occupation.icon} />}
            <Heading size={['xs', 'md']} color="orange.500">
              {host?.occupation}
            </Heading>
            {host?.occupation === 'Others' && (
              <Heading size={['xs', 'md']} color="orange.500">
                {host?.occupationDescription}
              </Heading>
            )}
          </HStack>
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
