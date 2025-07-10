import { FC } from 'react';
import { DivIcon } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Host } from 'src/types';
import { OCCUPATIONS } from 'src/constants/occupations';
import { Icon, Text } from '@chakra-ui/react';
import './CustomMarker.css';

interface CustomMarkerProps {
  host: Host;
}

const CustomMarker: FC<CustomMarkerProps> = ({ host }) => {
  const occupation = OCCUPATIONS.find((o) => o.name === host.occupation);

  const iconMarkup = renderToStaticMarkup(
    <div className="custom-marker-container">
      <div className="custom-marker-content">
        {occupation && <Icon as={occupation.icon} />}
        <p className="custom-marker-name">{`${host.firstName} ${host.lastName}`}</p>
      </div>
      <p className="custom-marker-occupation">{host.occupation}</p>
    </div>,
  );

  const customMarkerIcon = new DivIcon({
    html: iconMarkup,
    className: 'custom-marker-icon',
  });

  return (
    <Marker position={host.location.coordinates as [number, number]} icon={customMarkerIcon}>
      <Popup>
        <Text>{host.addressObj?.label}</Text>
        <Text>{host.placeDescription}</Text>
      </Popup>
    </Marker>
  );
};

export { CustomMarker };
