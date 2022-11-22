import { Button, ButtonGroup } from '@chakra-ui/react';
import { Popup, PopupEvent } from 'react-map-gl';
import s from './NodeAdminPopup.module.css';

interface NodeAdminPopupProps {
  lngLat: mapboxgl.LngLat;
  features: mapboxgl.MapboxGeoJSONFeature[];
  onClose: (e: PopupEvent) => void;
  onRemove: (id: number) => void;
  onSetStartPoint: (name: string) => void;
  onSetGoThroughPoint: (name: string) => void;
  onSetEndPoint: (name: string) => void;
}

const NodeAdminPopup = ({
  lngLat,
  features,
  onClose,
  onRemove,
  onSetStartPoint,
  onSetGoThroughPoint,
  onSetEndPoint,
}: NodeAdminPopupProps) => {
  const feature = features[0];

  const handleRemove = () => {
    if (feature && feature.properties) {
      onRemove(feature.properties.id);
    }
  };

  const handleSetStartPoint = () => {
    onSetStartPoint(feature.properties?.name);
  };

  const handleSetGoThroughPoint = () => {
    onSetGoThroughPoint(feature.properties?.name);
  };

  const handleSetEndPoint = () => {
    onSetEndPoint(feature.properties?.name);
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
            <Button onClick={handleSetStartPoint}>Set as starting point</Button>
            <Button onClick={handleSetGoThroughPoint}>Go through</Button>
            <Button onClick={handleSetEndPoint}>Set as end point</Button>
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
