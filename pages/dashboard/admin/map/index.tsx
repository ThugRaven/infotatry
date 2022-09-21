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
import s from '@styles/DashboardAdminMap.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { ReactElement, useCallback, useRef, useState } from 'react';
import Map, { MapRef, NavigationControl } from 'react-map-gl';

interface PopupInfo {
  lngLat: mapboxgl.LngLat;
  features: mapboxgl.MapboxGeoJSONFeature[];
}

const initialValues = {
  name: '',
  latitude: '',
  longitude: '',
  nodeType: 'node',
};

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
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.name);
    setType(e.currentTarget.name);
    onOpen();
  };

  const [values, setValues] = useState(initialValues);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    console.log(name, value);

    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(values);
    setValues(initialValues);
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
          interactiveLayerIds={['trails-data-layer']}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          cursor={cursor}
          onClick={(e) => {
            // console.log(mapRef.current?.getStyle().layers);
            if (
              !mapRef.current ||
              !e.features ||
              e.features.length === 0 ||
              e.features[0].layer.id !== 'trails-data-layer'
            ) {
              setPopupInfo(null);
              return;
            }

            let trailInfo = {
              lngLat: e.lngLat,
              features: e.features,
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
          <NavigationControl />
        </Map>
        <AdminMapControls onClick={handleClick} />
        {type === 'trail' ? (
          <></>
        ) : (
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                {type === 'trail' ? 'Add a new trail' : 'Add a new node'}
              </ModalHeader>
              <ModalCloseButton />
              <form onSubmit={handleSubmit}>
                <ModalBody>
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      name="name"
                      mb={2}
                      value={values.name}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Latitude</FormLabel>
                    <Input
                      type="text"
                      name="latitude"
                      mb={2}
                      value={values.latitude}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Longitude</FormLabel>
                    <Input
                      type="text"
                      name="longitude"
                      mb={2}
                      value={values.longitude}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Type</FormLabel>
                    <Select
                      placeholder="Select type"
                      name="nodeType"
                      value={values.nodeType}
                      onChange={handleChange}
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
            </ModalContent>
          </Modal>
        )}
      </div>
    </>
  );
};

DashboardAdminMap.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardAdminMap;
