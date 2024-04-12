import { FC, useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useHosts } from 'src/hooks';
import { Text } from '@chakra-ui/react';

const HostMap: FC = () => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number }>();
  const { data: hosts } = useHosts();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
      });
    }
  }, []);

  return (
    currentLocation && (
      <MapContainer
        center={[currentLocation?.latitude, currentLocation?.longitude]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100vh', width: '100vw' }}
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
    )
  );
};

export { HostMap };
