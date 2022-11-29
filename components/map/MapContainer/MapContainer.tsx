import {
  nodesDrawLayer,
  trailsDataLayer,
  trailsDrawLayer,
  trailsDrawOffset1in2Layer,
  trailsDrawOffset1in3Layer,
  trailsDrawOffset2in2Layer,
  trailsDrawOffset3in3Layer,
} from '@config/layer-styles';
import {
  createLineString,
  createPoint,
  decode,
  swapCoordinates,
} from '@lib/utils';
import { INTERACTIVE_LAYER_IDS } from 'constants/constants';
import mapboxgl, { LngLat } from 'mapbox-gl';
import { Node, Trail } from 'pages/dashboard/admin/map';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, {
  Layer,
  MapRef,
  NavigationControl,
  PaddingOptions,
  Source,
} from 'react-map-gl';
import features from '../../../public/features.json';
import MapPopup from '../MapPopup';

interface MapContainerProps {
  padding: number;
}

interface PopupInfo {
  lngLat: mapboxgl.LngLat;
  features: mapboxgl.MapboxGeoJSONFeature[];
}

const MapContainer = ({ padding }: MapContainerProps) => {
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

  const [trails, setTrails] = useState<Trail[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);

  useEffect(() => {
    const data = features;
    setTrails(data.trails as Trail[]);
    setNodes(data.nodes as Node[]);
  }, []);

  const trailsData: GeoJSON.FeatureCollection = useMemo(() => {
    const features: GeoJSON.Feature<GeoJSON.LineString>[] = [];

    trails.forEach((trail) => {
      let decoded = decode(trail.encoded);
      decoded = swapCoordinates(decoded);

      let properties: GeoJSON.GeoJsonProperties = {
        id: trail.id,
        name: `${trail.name.start} - ${trail.name.end}`,
      };
      if (trail.color.length === 1) {
        properties = {
          ...properties,
          offset: '1-1',
          color: trail.color[0],
        };
      } else if (trail.color.length === 2) {
        properties = {
          ...properties,
          offset: ['1-2', '2-2'],
          color_left: trail.color[0],
          color_right: trail.color[1],
        };
      } else if (trail.color.length === 3) {
        properties = {
          ...properties,
          offset: ['1-3', '1-1', '3-3'],
          color_left: trail.color[0],
          color: trail.color[1],
          color_right: trail.color[2],
        };
      }

      const lineString = createLineString(properties, decoded);
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
        { id: node.id, name: node.name },
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

  useEffect(() => {
    let mapPadding: PaddingOptions = { left: 0, right: 0, bottom: 0, top: 0 };
    if (padding > 0) {
      mapPadding.right = padding;
    } else {
      mapPadding.left = padding;
    }

    mapRef.current?.easeTo({
      padding: mapPadding,
      duration: 250,
    });
  }, [padding]);

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      maxPitch={60}
      reuseMaps
      // mapStyle="mapbox://styles/mapbox/streets-v9"
      mapStyle="mapbox://styles/thugraven/cl7rzd4h3004914lfputsqkg9"
      // terrain={terrainMode ? { source: 'mapbox-dem' } : undefined}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      interactiveLayerIds={INTERACTIVE_LAYER_IDS}
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
          !INTERACTIVE_LAYER_IDS.some((id) => id === features[0].layer.id)
        ) {
          setPopupInfo(null);
          return;
        }

        let trail = selectedTrail;

        if (
          features[0].properties &&
          features[0].layer.id !== 'nodes-draw-layer'
        ) {
          const id = features[0].properties.id;
          trail = trails.find((trail) => trail.id === id) ?? null;

          setSelectedTrail(trail);
          setSelectedNode(null);
        } else if (
          features[0].properties &&
          features[0].layer.id === 'nodes-draw-layer'
        ) {
          const id = features[0].properties.id;
          const node = nodes.find((node) => node.id === id) ?? null;

          setSelectedTrail(null);
          setSelectedNode(node);
        }

        let trailInfo = {
          lngLat: e.lngLat,
          features: features,
          trail: trail,
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
      {popupInfo && (
        <MapPopup
          lngLat={popupInfo.lngLat}
          features={popupInfo.features}
          onClose={() => {
            setPopupInfo(null);
          }}
        />
      )}
      <Source
        id="mapbox-dem"
        type="raster-dem"
        url="mapbox://mapbox.mapbox-terrain-dem-v1"
        tileSize={512}
        maxzoom={14}
      />
      <Source type="geojson" data={trailsData}>
        {/* <Layer {...trailsDataLayer} beforeId="trails-data-layer" /> */}
        <Layer {...trailsDataLayer} />
        <Layer {...trailsDrawLayer} />
        <Layer {...trailsDrawOffset1in2Layer} />
        <Layer {...trailsDrawOffset2in2Layer} />
        <Layer {...trailsDrawOffset1in3Layer} />
        <Layer {...trailsDrawOffset3in3Layer} />
      </Source>
      <Source type="geojson" data={nodesData}>
        <Layer {...nodesDrawLayer} />
      </Source>
      {/* <Source type="geojson" data={routeData} lineMetrics={true}>
          <Layer {...routeLayer} />
        </Source> */}
      <NavigationControl />
    </Map>
  );
};

export default MapContainer;
