import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { SEO } from '@components/common';
import { DashboardLayout } from '@components/layouts';
import { AdminMapControls, CoordinatesBox, MapPopup } from '@components/map';
import TrailNodePopup from '@components/map/TrailNodePopup';
import {
  nodesDrawLocalLayer,
  trailNodesLocalLayer,
  trailsDataLocalLayer,
  trailsDrawLocalLayer,
} from '@config/layer-styles';
import {
  createLineString,
  createPoint,
  decode,
  encode,
  swapCoordinates,
} from '@lib/utils';
import s from '@styles/DashboardAdminMap.module.css';
import { saveAs } from 'file-saver';
import mapboxgl, { LngLat } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, {
  ReactElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import Map, { Layer, MapRef, NavigationControl, Source } from 'react-map-gl';

interface PopupInfo {
  lngLat: mapboxgl.LngLat;
  features: mapboxgl.MapboxGeoJSONFeature[];
  trail: Trail | null;
}

export type Trail = {
  name: {
    start: string;
    end: string;
  };
  color: string[];
  distance: number;
  time: {
    start_end: number;
    end_start: number;
  };
  encoded: string;
};

type Node = {
  name: string;
  type: string;
  lat: number;
  lng: number;
};

const initialNodeValues = {
  name: '',
  latitude: 0,
  longitude: 0,
  nodeType: 'node',
};

const initialTrailValues = {
  nameStart: '',
  nameEnd: '',
  path: '',
  color: '',
};

const interactiveLayerIds = [
  'trails-data-layer',
  'trails-data-local-layer',
  'nodes-draw-layer',
  'nodes-draw-local-layer',
  'trail-nodes-local-layer',
];

const DashboardAdminMap = () => {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    latitude: 49.23,
    longitude: 19.93,
    zoom: 11,
  });
  const [cursor, setCursor] = useState('grab');
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);

  const onMouseEnter = useCallback(() => setCursor('pointer'), []);
  const onMouseLeave = useCallback(() => setCursor('grab'), []);
  const onDragStart = useCallback(() => setCursor('grabbing'), []);
  const onDragEnd = useCallback(() => setCursor('grab'), []);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [type, setType] = useState('trail');
  const [nodeForm, setNodeForm] = useState(initialNodeValues);
  const [trailForm, setTrailForm] = useState(initialTrailValues);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);

  const trailsData: GeoJSON.FeatureCollection = useMemo(() => {
    const features: GeoJSON.Feature<GeoJSON.LineString>[] = [];

    trails.forEach((trail) => {
      let decoded = decode(trail.encoded);
      decoded = swapCoordinates(decoded);
      const lineString = createLineString(
        {
          name: `${trail.name.start} - ${trail.name.end}`,
          color: trail.color[0],
        },
        decoded,
      );
      features.push(lineString);
    });
    console.log('Recalculate trailsData');

    return {
      type: 'FeatureCollection',
      features,
    };
  }, [trails]);

  const nodesData: GeoJSON.FeatureCollection = useMemo(() => {
    const features: GeoJSON.Feature<GeoJSON.Point>[] = [];

    nodes.forEach((node) => {
      const point = createPoint(
        { name: node.name },
        new LngLat(node.lng, node.lat),
      );
      features.push(point);
    });
    console.log('Recalculate nodesData');

    return {
      type: 'FeatureCollection',
      features,
    };
  }, [nodes]);

  const trailNodesData: GeoJSON.FeatureCollection = useMemo(() => {
    const features: GeoJSON.Feature<GeoJSON.Point>[] = [];

    if (selectedTrail) {
      const trail = trails.find(
        (trail) =>
          `${trail.name.start} - ${trail.name.end}` ===
          `${selectedTrail.name.start} - ${selectedTrail.name.end}`,
      );

      if (trail) {
        let decoded = decode(trail.encoded);

        decoded.forEach((node, index) => {
          const point = createPoint(
            {
              index,
              lat: node[0],
              lng: node[1],
            },
            new LngLat(node[1], node[0]),
          );
          features.push(point);
        });
        console.log('Recalculate trailNodesData');
      }
    }

    return {
      type: 'FeatureCollection',
      features,
    };
  }, [selectedTrail]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.name);
    setType(e.currentTarget.name);
    const lat = parseFloat(viewState.latitude.toFixed(5));
    const lng = parseFloat(viewState.longitude.toFixed(5));
    setNodeForm((values) => ({
      ...values,
      latitude: lat,
      longitude: lng,
    }));
    onOpen();
  };

  const handleChangeNode = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    console.log(name, value);

    setNodeForm({
      ...nodeForm,
      [name]: value,
    });
  };

  const handleChangeTrail = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    console.log(name, value);

    setTrailForm({
      ...trailForm,
      [name]: value,
    });
  };

  const handleSubmitNode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(nodeForm);
    setNodeForm(initialNodeValues);

    const newNode: Node = {
      name: nodeForm.name,
      type: nodeForm.nodeType,
      lat: nodeForm.latitude,
      lng: nodeForm.longitude,
    };

    setNodes((state) => [...state, newNode]);
    console.log(nodes);
    onClose();
  };

  const handleSubmitTrail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(trailForm);
    setTrailForm(initialTrailValues);

    const path = JSON.parse(trailForm.path);
    const swapped = swapCoordinates(path);
    const newTrail: Trail = {
      name: {
        start: trailForm.nameStart,
        end: trailForm.nameEnd,
      },
      color: [trailForm.color],
      distance: 0,
      time: {
        start_end: 0,
        end_start: 0,
      },
      encoded: encode(swapped),
    };

    setTrails((state) => [...state, newTrail]);
    console.log(trails);
    onClose();
  };

  const handleSave = () => {
    const data = {
      nodes: [...nodes],
      trails: [...trails],
    };
    console.log(data);

    const blob = new Blob([JSON.stringify(data, null, 0)], {
      type: 'application/json',
    });

    saveAs(blob, 'features.json');
  };

  return (
    <>
      <SEO title="Admin Dashboard - Map" />
      <div className={s.container}>
        <div className={s.header}>
          <Button onClick={handleSave}>Save file</Button>
        </div>
        <div className={s.wrapper}>
          <CoordinatesBox
            latitude={viewState.latitude}
            longitude={viewState.longitude}
            zoom={viewState.zoom}
          />
          <Map
            ref={mapRef}
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            maxPitch={60}
            reuseMaps
            // mapStyle="mapbox://styles/mapbox/streets-v9"
            mapStyle="mapbox://styles/thugraven/cl7rzd4h3004914lfputsqkg9"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            interactiveLayerIds={interactiveLayerIds}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            cursor={cursor}
            onClick={(e) => {
              // console.log(mapRef.current?.getStyle().layers);
              const features = e.features;
              // console.log(features);

              if (
                !mapRef.current ||
                !features ||
                features.length === 0 ||
                !interactiveLayerIds.some((id) => id === features[0].layer.id)
              ) {
                setPopupInfo(null);
                return;
              }

              if (
                features.length > 0 &&
                features[0].properties &&
                features[0].layer.id !== 'trail-nodes-local-layer'
              ) {
                const name = features[0].properties.name;
                const trail =
                  trails.find(
                    (trail) =>
                      `${trail.name.start} - ${trail.name.end}` === name,
                  ) ?? null;

                setSelectedTrail(trail);
              }

              let trailInfo = {
                lngLat: e.lngLat,
                features: features,
                trail: selectedTrail,
              };

              console.log(trailInfo);

              // Return when the coordinates are the same to skip unnecessary render
              if (
                popupInfo &&
                trailInfo.lngLat.lng === popupInfo.lngLat.lng &&
                trailInfo.lngLat.lat === popupInfo.lngLat.lat
              )
                return;

              setPopupInfo(trailInfo);

              // mapRef.current.flyTo({
              //   center: e.lngLat,
              //   zoom: 12,
              //   duration: 500,
              // });
            }}
            onZoom={(e) => {
              // console.log(e.viewState);
            }}
          >
            {popupInfo &&
              (popupInfo.features[0] &&
              popupInfo.features[0].layer.id === 'trail-nodes-local-layer' &&
              popupInfo.trail ? (
                <TrailNodePopup
                  lngLat={popupInfo.lngLat}
                  features={popupInfo.features}
                  trail={popupInfo.trail}
                  onClose={() => {
                    setPopupInfo(null);
                  }}
                />
              ) : (
                <MapPopup
                  lngLat={popupInfo.lngLat}
                  features={popupInfo.features}
                  onClose={() => {
                    setPopupInfo(null);
                  }}
                />
              ))}
            <Source type="geojson" data={trailsData}>
              <Layer {...trailsDataLocalLayer} beforeId="trails-data-layer" />
              <Layer {...trailsDrawLocalLayer} beforeId="trails-data-layer" />
            </Source>
            <Source type="geojson" data={nodesData}>
              <Layer {...nodesDrawLocalLayer} />
            </Source>
            <Source type="geojson" data={trailNodesData}>
              <Layer {...trailNodesLocalLayer} />
            </Source>
            <NavigationControl />
          </Map>
          <AdminMapControls onClick={handleClick} />
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                {type === 'trail' ? 'Add a new trail' : 'Add a new node'}
              </ModalHeader>
              <ModalCloseButton />
              {type === 'trail' ? (
                <>
                  <form onSubmit={handleSubmitTrail}>
                    <ModalBody>
                      <FormControl isRequired>
                        <FormLabel>Name start</FormLabel>
                        <Input
                          type="text"
                          name="nameStart"
                          mb={2}
                          value={trailForm.nameStart}
                          onChange={handleChangeTrail}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Name end</FormLabel>
                        <Input
                          type="text"
                          name="nameEnd"
                          mb={2}
                          value={trailForm.nameEnd}
                          onChange={handleChangeTrail}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Path</FormLabel>
                        <Textarea
                          name="path"
                          mb={2}
                          value={trailForm.path}
                          onChange={handleChangeTrail}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Color</FormLabel>
                        <Select
                          placeholder="Select colors"
                          name="color"
                          value={trailForm.color}
                          onChange={handleChangeTrail}
                        >
                          <option value="red">red</option>
                          <option value="blue">blue</option>
                          <option value="yellow">yellow</option>
                          <option value="green">green</option>
                          <option value="black">black</option>
                        </Select>
                      </FormControl>
                    </ModalBody>

                    <ModalFooter>
                      <Button colorScheme="blue" mr={3} type="submit">
                        Save
                      </Button>
                      <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                  </form>
                </>
              ) : (
                <>
                  <form onSubmit={handleSubmitNode}>
                    <ModalBody>
                      <FormControl isRequired>
                        <FormLabel>Name</FormLabel>
                        <Input
                          type="text"
                          name="name"
                          mb={2}
                          value={nodeForm.name}
                          onChange={handleChangeNode}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Latitude</FormLabel>
                        <Input
                          type="text"
                          name="latitude"
                          mb={2}
                          value={nodeForm.latitude}
                          onChange={handleChangeNode}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Longitude</FormLabel>
                        <Input
                          type="text"
                          name="longitude"
                          mb={2}
                          value={nodeForm.longitude}
                          onChange={handleChangeNode}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Type</FormLabel>
                        <Select
                          placeholder="Select type"
                          name="nodeType"
                          value={nodeForm.nodeType}
                          onChange={handleChangeNode}
                        >
                          <option value="node">node</option>
                          <option value="peak">peak</option>
                          <option value="shelter">shelter</option>
                          <option value="cave">cave</option>
                        </Select>
                      </FormControl>
                    </ModalBody>

                    <ModalFooter>
                      <Button colorScheme="blue" mr={3} type="submit">
                        Save
                      </Button>
                      <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                  </form>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </>
  );
};

DashboardAdminMap.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardAdminMap;
