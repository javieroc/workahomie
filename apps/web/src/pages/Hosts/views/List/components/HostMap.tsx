import 'leaflet/dist/leaflet.css';
import { FC, useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { Host, ListResponse } from 'src/types';
import { useFilters } from 'src/pages/Hosts/hooks';
import { mapVisibleAtom } from '../../../store';
import { CustomMarker } from './CustomMarker';
import { MapResizer } from './MapResizer';

type HostMapProps = {
  hosts: ListResponse<Host> | undefined;
};

const HostMap: FC<HostMapProps> = ({ hosts }) => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number }>();
  const { filters } = useFilters();
  const isMapVisible = useAtomValue(mapVisibleAtom);
  const [hidden, setHidden] = useState(!isMapVisible);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const lat = filters.lat ?? latitude;
        const lng = filters.lng ?? longitude;
        setCurrentLocation({ latitude: lat, longitude: lng });
      });
    }
  }, [filters.lat, filters.lng]);

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
            key={currentLocation.latitude.toString()}
            center={[currentLocation?.latitude, currentLocation?.longitude]}
            zoom={13}
            style={{ height: '100vh' }}
          >
            <MapResizer isMapVisible={isMapVisible} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {hosts?.data.map(
              (host) => host.location && <CustomMarker key={host._id} host={host} />,
            )}
          </MapContainer>
        )}
      </motion.div>
    </Box>
  );
};

export { HostMap };
