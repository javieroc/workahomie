import { FC } from 'react';
import { Box } from '@chakra-ui/react';
import BannerImage from 'src/assets/banner.jpg';

const Banner: FC = () => {
  return (
    <Box
      width="100%"
      height={{ base: '260px', sm: '340px', md: '460px', lg: '560px' }}
      backgroundImage={`url(${BannerImage})`}
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
      backgroundPosition={{
        base: 'center 60%',
        sm: 'center 65%',
        md: 'center 70%',
        lg: 'center 75%',
      }}
    />
  );
};

export { Banner };
