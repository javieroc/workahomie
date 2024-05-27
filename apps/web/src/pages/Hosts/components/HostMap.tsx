import 'leaflet/dist/leaflet.css';
import { FC, useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useHosts } from 'src/hooks';
import { Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { LatLngTuple } from 'leaflet';
import { mapVisibleAtom } from '../store';
import { usePagination } from '../hooks';

const HostMap: FC = () => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number }>();
  const { paginationParams } = usePagination();
  const { data: hosts } = useHosts(paginationParams);
  const isMapVisible = useAtomValue(mapVisibleAtom);
  const [hidden, setHidden] = useState(!isMapVisible);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
      });
    }
  }, []);

  return (
    <Box>
      <motion.div
        hidden={hidden}
        initial={false}
        onAnimationStart={() => setHidden(false)}
        onAnimationComplete={() => setHidden(!isMapVisible)}
        animate={{ width: isMapVisible ? 680 : 0 }}
        transition={{ duration: 0.8 }}
        style={{ overflow: 'hidden', position: 'sticky', top: 0 }}
      >
        {currentLocation && (
          <MapContainer
            center={[currentLocation?.latitude, currentLocation?.longitude]}
            zoom={13}
            style={{ height: '100vh' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[currentLocation?.latitude, currentLocation?.longitude]}>
              <Popup>
                <Text>You are here!</Text>
              </Popup>
            </Marker>
            {hosts?.data.map(
              (host) =>
                host.place.location && (
                  <Marker key={host._id} position={host.place.location.coordinates as LatLngTuple}>
                    <Popup>
                      <Text>{host.place?.addressObj?.label}</Text>
                      <Text>{host.place.description}</Text>
                    </Popup>
                  </Marker>
                ),
            )}
          </MapContainer>
        )}
      </motion.div>
    </Box>
  );
};

export { HostMap };
