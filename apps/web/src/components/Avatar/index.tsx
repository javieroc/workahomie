import { Avatar as ChakraAvatar, Box, AvatarProps } from '@chakra-ui/react';
import { FC } from 'react';

const Avatar: FC<AvatarProps> = (props) => {
  return (
    <Box
      backgroundImage="linear-gradient(to bottom right, #805AD5, #ED8936, #D53F8C)"
      padding="3px"
      borderRadius="50%"
    >
      <ChakraAvatar name="Avatar" {...props} />
    </Box>
  );
};

export { Avatar };
