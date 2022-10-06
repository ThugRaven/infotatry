import { Button, ButtonGroup } from '@chakra-ui/react';
import { Popup, PopupEvent } from 'react-map-gl';
import s from './NodeAdminPopup.module.css';

interface NodeAdminPopupProps {
  lngLat: mapboxgl.LngLat;
  features: mapboxgl.MapboxGeoJSONFeature[];
  onClose: (e: PopupEvent) => void;
  onRemove: (name: string) => void;
}

const NodeAdminPopup = ({
  lngLat,
  features,
  onClose,
  onRemove,
}: NodeAdminPopupProps) => {
  const feature = features[0];

  const handleRemove = () => {
    if (feature && feature.properties) {
      onRemove(feature.properties.name);
    }
  };

  return (
    <Popup
      latitude={lngLat.lat}
      longitude={lngLat.lng}
      anchor="bottom"
      onClose={onClose}
      closeOnClick={false}
      closeButton={false}
    >
      {feature && feature.properties ? (
        <div className={s.container}>
          {feature.properties.name}
          <ButtonGroup size="xs" display={'flex'} flexWrap={'wrap'} spacing={0}>
            <Button onClick={handleRemove}>Remove node</Button>
          </ButtonGroup>
        </div>
      ) : (
        <div>Brak informacji</div>
      )}
    </Popup>
  );
};

export default NodeAdminPopup;
