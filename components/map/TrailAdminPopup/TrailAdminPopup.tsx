import { Button, ButtonGroup } from '@chakra-ui/react';
import { Trail } from 'pages/dashboard/admin/map';
import { useMemo, useState } from 'react';
import { Popup, PopupEvent } from 'react-map-gl';
import s from './TrailAdminPopup.module.css';

interface TrailAdminPopupProps {
  lngLat: mapboxgl.LngLat;
  features: mapboxgl.MapboxGeoJSONFeature[];
  trail: Trail;
  onClose: (e: PopupEvent) => void;
  onRemove: (name: string) => void;
  onChange: (name: string) => void;
}

const TrailAdminPopup = ({
  lngLat,
  features,
  trail,
  onClose,
  onRemove,
  onChange,
}: TrailAdminPopupProps) => {
  const [index, setIndex] = useState(0);

  const handleRemove = () => {
    const feature = features[index];
    if (feature && feature.properties) {
      onRemove(feature.properties.name);
    }
  };

  const handlePreviousFeature = () => {
    if (index > 0) {
      const idx = index - 1;
      setIndex(idx);
      onChange(features[idx].properties?.name);
    }
  };

  const handleNextFeature = () => {
    const length = features.length;
    if (index < length - 1) {
      const idx = index + 1;
      setIndex(idx);
      onChange(features[idx].properties?.name);
    }
  };

  const feature = useMemo(() => {
    console.log('useMemo');

    return features[index];
  }, [features, index]);

  return (
    <Popup
      latitude={lngLat.lat}
      longitude={lngLat.lng}
      anchor="bottom"
      onClose={onClose}
      closeOnClick={false}
      closeButton={false}
    >
      {features.length > 1 && (
        <div className={s.controls}>
          <div>
            <Button onClick={handlePreviousFeature}>{'<'}</Button>
            <Button onClick={handleNextFeature}>{'>'}</Button>
          </div>
          {index + 1} | {features.length}
        </div>
      )}

      {feature && feature.properties ? (
        <div className={s.container}>
          {feature.properties.name}
          <ButtonGroup size="xs" display={'flex'} flexWrap={'wrap'} spacing={0}>
            <Button onClick={handleRemove}>Remove trail</Button>
          </ButtonGroup>
        </div>
      ) : (
        <div>Brak informacji</div>
      )}
    </Popup>
  );
};

export default TrailAdminPopup;
