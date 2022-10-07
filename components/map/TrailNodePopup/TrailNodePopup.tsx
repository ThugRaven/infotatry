import { Button, ButtonGroup } from '@chakra-ui/react';
import { decode } from '@lib/utils';
import { Trail } from 'pages/dashboard/admin/map';
import { Popup, PopupEvent } from 'react-map-gl';
import s from './TrailNodePopup.module.css';

interface TrailNodePopupProps {
  lngLat: mapboxgl.LngLat;
  features: mapboxgl.MapboxGeoJSONFeature[];
  trail: Trail;
  onClose: (e: PopupEvent) => void;
  onStartSelection: (index: number) => void;
  onEndSelection: (index: number) => void;
  onCopySelection: () => void;
  onAddSelected: () => void;
  onAddNode: (lat: number, lng: number, name: string) => void;
}

const TrailNodePopup = ({
  lngLat,
  features,
  trail,
  onClose,
  onStartSelection,
  onEndSelection,
  onCopySelection,
  onAddSelected,
  onAddNode,
}: TrailNodePopupProps) => {
  const feature = features[0];

  const handleCopyCoords = () => {
    if (feature.properties) {
      navigator.clipboard
        .writeText(`${feature.properties.lat} - ${feature.properties.lng}`)
        .then(
          () => {
            console.log('Copied to clipboard!');
          },
          () => {
            console.log('Failed to copy!');
          },
        );
    }
  };

  const handleCopyPathFromPoint = () => {
    const nodes: Array<[number, number]> = [];

    const decoded = decode(trail.encoded);

    let found = false;
    decoded.forEach((point) => {
      if (
        !found &&
        feature.properties &&
        point[0] === feature.properties.lat &&
        point[1] === feature.properties.lng
      ) {
        nodes.push([point[1], point[0]]);
        found = true;
      } else if (found) {
        nodes.push([point[1], point[0]]);
      }
    });

    navigator.clipboard.writeText(JSON.stringify(nodes, null, 2)).then(
      () => {
        console.log('Copied to clipboard!');
      },
      () => {
        console.log('Failed to copy!');
      },
    );
  };

  const handleCopyPathToPoint = () => {
    const nodes: Array<[number, number]> = [];

    const decoded = decode(trail.encoded);

    let found = false;
    decoded.forEach((point) => {
      if (
        !found &&
        feature.properties &&
        point[0] === feature.properties.lat &&
        point[1] === feature.properties.lng
      ) {
        nodes.push([point[1], point[0]]);
        found = true;
      } else if (!found) {
        nodes.push([point[1], point[0]]);
      }
    });

    navigator.clipboard.writeText(JSON.stringify(nodes, null, 2)).then(
      () => {
        console.log('Copied to clipboard!');
      },
      () => {
        console.log('Failed to copy!');
      },
    );
  };

  const handleStartSelection = () => {
    onStartSelection(feature.properties?.index);
  };

  const handleEndSelection = () => {
    onEndSelection(feature.properties?.index);
  };

  const handleCopySelection = () => {
    onCopySelection();
  };

  const handleAddSelected = () => {
    onAddSelected();
  };

  const handleAddNode = () => {
    if (feature && feature.properties) {
      const decoded = decode(trail.encoded);

      let name = '';
      if (feature.properties.index === 0) {
        name = trail.name.end;
      } else if (feature.properties.index === decoded.length - 1) {
        name = trail.name.start;
      }

      onAddNode(feature.properties.lat, feature.properties.lng, name);
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
          {feature.properties.lat} - {feature.properties.lng} |{' '}
          {feature.properties.index}
          <ButtonGroup size="xs" display={'flex'} flexWrap={'wrap'} spacing={0}>
            <Button onClick={handleCopyCoords}>Copy coordinates</Button>
            <Button onClick={handleCopyPathFromPoint}>
              Copy path from start to this point
            </Button>
            <Button onClick={handleCopyPathToPoint}>
              Copy path from end to this point
            </Button>
            <Button onClick={handleStartSelection}>Start selection</Button>
            <Button onClick={handleEndSelection}>End selection</Button>
            <Button onClick={handleCopySelection}>Copy selected path</Button>
            <Button onClick={handleAddSelected}>
              Add selected path as trail
            </Button>
            <Button onClick={handleAddNode}>Add as node</Button>
          </ButtonGroup>
        </div>
      ) : (
        <div>Brak informacji</div>
      )}
    </Popup>
  );
};

export default TrailNodePopup;
