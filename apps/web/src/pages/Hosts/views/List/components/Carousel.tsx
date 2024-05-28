import { FC } from 'react';
import { Image, List, ListItem } from '@chakra-ui/react';

interface CarouselProps {
  images: string[];
}

const Carousel: FC<CarouselProps> = ({ images }) => {
  return (
    <div style={{ timelineScope: '--carousel', overflow: 'hidden', width: '100%' }}>
      <ul
        style={{
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'scroll',
          scrollTimeline: '--carousel x',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          scrollBehavior: 'smooth',
          listStyle: 'none',
        }}
      >
        {images.map((imageSrc) => (
          <li style={{ display: 'flex', flex: '100% 1 0' }} key={imageSrc}>
            {/* <a href="#" name={`carousel_${index}`}> */}
            <Image
              src={imageSrc}
              borderRadius="md"
              minWidth="306px"
              height="188px"
              objectFit="cover"
            />
            {/* </a> */}
          </li>
        ))}
      </ul>
      <List>
        {images.map((imageSrc, index) => (
          <ListItem key={imageSrc}>
            <a
              href={`/hosts/#carousel_${index}`}
              style={{
                display: 'block',
                width: '0.8em',
                aspectRatio: '1',
                background: '#6300ff',
                borderRadius: '50%',
                animation: 'colorize-dot linear',
                animationTimeline: '--carousel',
                animationRange: 'calc((var(--i) - 1) * 20%) calc(var(--i) * 20% + 1px)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  width: '1px',
                  height: '1px',
                  padding: '0',
                  margin: '-1px',
                  overflow: 'hidden',
                  clip: 'rect(0, 0, 0, 0)',
                  whiteSpace: 'nowrap',
                  borderWidth: '0',
                }}
              >
                Photo {index}
              </span>
            </a>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export { Carousel };
