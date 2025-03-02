import { FC } from 'react';
import { Image } from '@chakra-ui/react';
import BannerImage from 'src/assets/banner.png';

const Banner: FC = () => {
  return (
    <Image
      backgroundImage={`url(${BannerImage})`}
      width="100%"
      height={{ base: '200px', md: '300px' }}
      backgroundSize="cover"
      backgroundPosition="bottom"
      alignItems="center"
      justifyContent="center"
    />
  );
};

export { Banner };
