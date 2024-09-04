import React from 'react';
import { Box, Image, IconButton, Flex } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useSlider } from 'src/hooks';

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const { currentIndex, prevSlide, nextSlide } = useSlider(images.length);

  return (
    <Box position="relative" width="100%" maxWidth="600px">
      <Image
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
        borderRadius="md"
        objectFit="cover"
        width="100%"
      />

      <IconButton
        icon={<ChevronLeftIcon />}
        aria-label="Previous Slide"
        onClick={prevSlide}
        position="absolute"
        isRound
        left="10px"
        top="50%"
        transform="translateY(-50%)"
        backgroundColor="purple.400"
        boxShadow="md"
        _hover={{ backgroundColor: 'purple.500' }}
      />

      <IconButton
        icon={<ChevronRightIcon />}
        aria-label="Next Slide"
        onClick={nextSlide}
        position="absolute"
        isRound
        right="10px"
        top="50%"
        transform="translateY(-50%)"
        backgroundColor="orange.400"
        boxShadow="md"
        _hover={{ backgroundColor: 'orange.500' }}
      />

      <Flex justifyContent="center" mt={4}>
        {images.map((_, index) => (
          <Box
            key={index}
            height="10px"
            width="10px"
            borderRadius="50%"
            backgroundColor={index === currentIndex ? 'blue.500' : 'gray.300'}
            margin="0 5px"
          />
        ))}
      </Flex>
    </Box>
  );
};

export { ImageCarousel };
