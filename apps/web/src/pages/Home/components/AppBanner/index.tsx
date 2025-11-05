import { FC } from 'react';
import { Box, Button, Flex, Heading, Image, Stack, Text } from '@chakra-ui/react';
import PlayStoreIcon from 'src/assets/playstore.svg';
import AppScreenshots from 'src/assets/apk.png';

const AppBanner: FC = () => {
  return (
    <Box as="section" bg="gray.100" py={12} px={6}>
      <Stack
        direction={{ base: 'column', md: 'column', lg: 'row' }}
        spacing={{ base: 8, lg: 16 }}
        align="center"
        justify="center"
      >
        <Box
          flex="1"
          justifyItems="center"
          textAlign={{ base: 'center', lg: 'left' }}
          maxW={{ base: 'full', lg: 'md' }}
        >
          <Heading size="lg" mb={4}>
            Get Our Mobile App
          </Heading>

          <Text
            textAlign="center"
            maxW="lg"
            fontSize="lg"
            mb={8}
            color="gray.600"
            display={{ base: 'block', lg: 'block' }}
          >
            Experience our platform on the go. Download the app and connect with hosts anytime,
            anywhere.
          </Text>

          <Flex justify={{ base: 'center', lg: 'flex-start' }}>
            <Button
              as="a"
              href="https://github.com/javieroc/workahomie-android-app/releases/latest/download/app-release.apk"
              size="lg"
              colorScheme="purple"
              leftIcon={<Image src={PlayStoreIcon} alt="Play Store" boxSize={6} />}
            >
              Download for Android
            </Button>
          </Flex>
        </Box>

        <Box flex="1" display={{ base: 'none', md: 'block' }} maxW="lg">
          <Image src={AppScreenshots} alt="App screenshots" borderRadius="lg" width="100%" />
        </Box>
      </Stack>
    </Box>
  );
};

export { AppBanner };
