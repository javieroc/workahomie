import 'leaflet/dist/leaflet.css';
import { FC, useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useHosts } from 'src/hooks';
import { Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { mapVisibleAtom } from '../store';

const HostMap: FC = () => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number }>();
  const { data: hosts } = useHosts();
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
        animate={{ width: isMapVisible ? 600 : 0 }}
        transition={{ duration: 0.8 }}
        style={{ overflow: 'hidden' }}
      >
        {currentLocation && (
          <MapContainer
            center={[currentLocation?.latitude, currentLocation?.longitude]}
            zoom={13}
            // scrollWheelZoom={false}
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
            {hosts?.map(
              (host) =>
                host.place.addressObj?.lat &&
                host.place.addressObj?.lng && (
                  <Marker
                    key={host._id}
                    position={[host.place.addressObj?.lat, host.place.addressObj?.lng]}
                  >
                    <Popup>
                      <Text>{host.place.addressObj.label}</Text>
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
