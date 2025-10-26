import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

interface MapResizerProps {
  isMapVisible: boolean;
}

const MapResizer = ({ isMapVisible }: MapResizerProps) => {
  const map = useMap();

  useEffect(() => {
    // The animation duration is 0.8s. We should invalidate the size after the animation is complete.
    // A timeout is needed to ensure the container has the correct size.
    if (isMapVisible) {
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 800); // Should match the animation duration

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isMapVisible, map]);

  return null;
};

export { MapResizer };
