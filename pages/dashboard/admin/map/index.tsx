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
  useDisclosure,
} from '@chakra-ui/react';
import { SEO } from '@components/common';
import { DashboardLayout } from '@components/layouts';
import { AdminMapControls, CoordinatesBox, MapPopup } from '@components/map';
import {
  nodesDataLocalLayer,
  nodesDrawLocalLayer,
  trailsDataLocalLayer,
  trailsDrawLocalLayer,
} from '@config/layer-styles';
import { createLineString, createPoint } from '@lib/utils';
import s from '@styles/DashboardAdminMap.module.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { ReactElement, useCallback, useRef, useState } from 'react';
import Map, { Layer, MapRef, NavigationControl, Source } from 'react-map-gl';

interface PopupInfo {
  lngLat: mapboxgl.LngLat;
  features: mapboxgl.MapboxGeoJSONFeature[];
}

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
  'nodes-data-layer',
  'nodes-data-local-layer',
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
  const [trailsData, setTrailsData] = useState<GeoJSON.FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  });
  const [nodesData, setNodesData] = useState<GeoJSON.FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  });

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
      | React.ChangeEvent<HTMLSelectElement>,
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
    const features = [...nodesData.features];
    const node = createPoint(
      nodeForm.name,
      new mapboxgl.LngLat(nodeForm.longitude, nodeForm.latitude),
    );
    features.push(node);
    setNodesData((state) => ({ ...state, features }));
    console.log(nodesData);
    onClose();
  };

  const handleSubmitTrail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(trailForm);
    setTrailForm(initialTrailValues);
    const features = [...trailsData.features];
    const trail = createLineString(
      `${trailForm.nameStart} - ${trailForm.nameEnd}`,
      trailForm.color,
      JSON.parse(trailForm.path),
    );
    features.push(trail);
    console.log(trail);

    setTrailsData((state) => ({ ...state, features }));
    console.log(trailsData);

    onClose();
  };

  return (
    <>
      <SEO title="Admin Dashboard - Map" />
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
            if (
              !mapRef.current ||
              !features ||
              features.length === 0 ||
              !interactiveLayerIds.some((id) => id === features[0].layer.id)
            ) {
              setPopupInfo(null);
              return;
            }

            let trailInfo = {
              lngLat: e.lngLat,
              features,
            };

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
          {popupInfo && (
            <MapPopup
              lngLat={popupInfo.lngLat}
              features={popupInfo.features}
              onClose={() => {
                setPopupInfo(null);
              }}
            />
          )}
          <Source type="geojson" data={trailsData}>
            <Layer {...trailsDataLocalLayer} />
            <Layer {...trailsDrawLocalLayer} />
          </Source>
          <Source type="geojson" data={nodesData}>
            <Layer {...nodesDataLocalLayer} />
            <Layer {...nodesDrawLocalLayer} />
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
                      <Input
                        type="text"
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
    </>
  );
};

DashboardAdminMap.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardAdminMap;
