import { Search2Icon } from '@chakra-ui/icons';
import { Button, ButtonGroup, IconButton } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { Popup, PopupEvent } from 'react-map-gl';
import s from './TrailAdminPopup.module.css';

interface TrailAdminPopupProps {
  lngLat: mapboxgl.LngLat;
  features: mapboxgl.MapboxGeoJSONFeature[];
  onClose: (e: PopupEvent) => void;
  onRemove: (id: number) => void;
  onChange: (id: number) => void;
  onZoomOnFeature: (id: number) => void;
}

const TrailAdminPopup = ({
  lngLat,
  features,
  onClose,
  onRemove,
  onChange,
  onZoomOnFeature,
}: TrailAdminPopupProps) => {
  const [index, setIndex] = useState(0);

  const handleRemove = () => {
    const feature = features[index];
    if (feature && feature.properties) {
      onRemove(feature.properties.id);
    }
  };

  const handlePreviousFeature = () => {
    if (index > 0) {
      const idx = index - 1;
      setIndex(idx);
      onChange(features[idx].properties?.id);
    }
  };

  const handleNextFeature = () => {
    const length = features.length;
    if (index < length - 1) {
      const idx = index + 1;
      setIndex(idx);
      onChange(features[idx].properties?.id);
    }
  };

  const handleZoomOnFeature = () => {
    const feature = features[index];
    if (feature && feature.properties) {
      onZoomOnFeature(feature.properties.id);
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
          <IconButton
            icon={<Search2Icon />}
            size={'sm'}
            aria-label={'Zoom'}
            onClick={handleZoomOnFeature}
          />
        </div>
      ) : (
        <div>Brak informacji</div>
      )}
    </Popup>
  );
};

export default TrailAdminPopup;
