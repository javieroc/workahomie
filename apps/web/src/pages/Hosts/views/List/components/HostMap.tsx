import 'leaflet/dist/leaflet.css';
import { FC, useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { Icon, LatLngTuple } from 'leaflet';
import { Host, ListResponse } from 'src/types';
import { useFilters } from 'src/pages/Hosts/hooks';
import IconMarkerImage from 'src/assets/marker-3.png';
import { mapVisibleAtom } from '../../../store';

type HostMapProps = {
  hosts: ListResponse<Host> | undefined;
};

const iconMarker = new Icon({
  iconUrl: IconMarkerImage,
  iconSize: [40, 40],
});

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
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {hosts?.data.map(
              (host) =>
                host.location && (
                  <Marker
                    key={host._id}
                    position={host.location.coordinates as LatLngTuple}
                    icon={iconMarker}
                  >
                    <Popup>
                      <Text>{host.addressObj?.label}</Text>
                      <Text>{host.placeDescription}</Text>
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
