import { Spinner } from '@chakra-ui/react';
import {
  nodesDrawLayer,
  routeLayer,
  trailsClosedLayer,
  trailsDataLayer,
  trailsDrawLayer,
  trailsDrawOffset1in2Layer,
  trailsDrawOffset1in2OutlineLayer,
  trailsDrawOffset1in3Layer,
  trailsDrawOffset1in3OutlineLayer,
  trailsDrawOffset2in2Layer,
  trailsDrawOffset2in2OutlineLayer,
  trailsDrawOffset3in3Layer,
  trailsDrawOffset3in3OutlineLayer,
  trailsDrawOutlineLayer,
} from '@config/layer-styles';
import {
  createLineString,
  createPoint,
  decode,
  swapCoordinates,
} from '@lib/utils';
import { INTERACTIVE_LAYER_IDS } from 'constants/constants';
import mapboxgl, { LngLat, LngLatBounds } from 'mapbox-gl';
import { Node, Trail } from 'pages/dashboard/admin/map';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, {
  Layer,
  MapRef,
  NavigationControl,
  PaddingOptions,
  Source,
} from 'react-map-gl';
import { useQuery } from 'react-query';
import features from '../../../public/features.json';
import MapPopup from '../MapPopup';
import s from './MapContainer.module.css';

type MapContainerProps = {
  trailIds?: number[];
  hike?: any;
  children?: React.ReactNode;
  padding?: number;
  isLoading?: boolean;
};

interface PopupInfo {
  lngLat: mapboxgl.LngLat;
  features: mapboxgl.MapboxGeoJSONFeature[];
}

type Announcement = {
  type: string;
  title: string;
  featuresType: string;
  featuresIds: number[];
  reason: string;
  since: Date | null;
  until: Date | null;
  description: string;
  source: string | null;
};

const MapContainer = ({
  trailIds,
  hike,
  children,
  padding,
  isLoading = false,
}: MapContainerProps) => {
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const data = features;
    setTrails(data.trails as Trail[]);
    setNodes(data.nodes as Node[]);
  }, []);

  useEffect(() => {
    if (mapRef.current && !isLoaded) {
      console.log('Map loaded');
      setIsLoaded(true);
    }
  }, [mapRef.current]);

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
        { id: node.id, name: node.name, type: node.type },
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

  const routeData: GeoJSON.FeatureCollection = useMemo(() => {
    const features: GeoJSON.Feature<GeoJSON.LineString>[] = [];

    const bounds = new LngLatBounds();
    console.log(trailIds, hike);

    if (trailIds) {
      trailIds?.forEach((id) => {
        const trail = trails.find((trail) => trail.id === id);
        if (trail) {
          let decoded = decode(trail.encoded);
          decoded = swapCoordinates(decoded);

          decoded.forEach((node) => {
            bounds.extend([node[0], node[1]]);
          });

          let properties: GeoJSON.GeoJsonProperties = {
            id: trail.id,
            name: `${trail.name.start} - ${trail.name.end}`,
          };

          const lineString = createLineString(properties, decoded);
          features.push(lineString);
        }
      });
    } else if (hike) {
      let decoded = decode(hike.encoded);
      decoded = swapCoordinates(decoded);

      decoded.forEach((node) => {
        bounds.extend([node[0], node[1]]);
      });

      let properties: GeoJSON.GeoJsonProperties = {
        id: hike._id,
        name: `${hike.name.start} - ${hike.name.end}`,
      };

      const lineString = createLineString(properties, decoded);
      features.push(lineString);
    }

    if (!bounds.isEmpty()) {
      mapRef.current?.fitBounds(bounds, { padding: 100 });
    }
    console.log('Recalculate routeData');
    return {
      type: 'FeatureCollection',
      features,
    };
  }, [trailIds, hike, isLoaded]);

  const fetchAnnouncements = async () => {
    try {
      console.log('fetch announcements');

      const response = await fetch(
        `http://localhost:8080/announcements/closures`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      return response.json();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  };

  const {
    isLoading: isQueryLoading,
    error,
    data,
  } = useQuery<Announcement[], Error>(['announcements'], fetchAnnouncements, {
    refetchOnWindowFocus: false,
    retry: false,
    cacheTime: 15 * 60 * 1000, // 15 minutes
    staleTime: 10 * 60 * 1000, // 10 minutes
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const closedTrailsData: GeoJSON.FeatureCollection = useMemo(() => {
    const features: GeoJSON.Feature<GeoJSON.LineString>[] = [];

    if (data) {
      const closures = data;
      closures.forEach((announcement) => {
        announcement.featuresIds.forEach((id) => {
          const trail = trails.find((trail) => trail.id === id);

          if (
            trail &&
            (!announcement.since ||
              new Date(announcement.since).getTime() <= Date.now()) &&
            (!announcement.until ||
              new Date(announcement.until).getTime() >= Date.now())
          ) {
            let decoded = decode(trail.encoded);
            decoded = swapCoordinates(decoded);

            let properties: GeoJSON.GeoJsonProperties = {
              id: trail.id,
              name: `${trail.name.start} - ${trail.name.end}`,
            };

            const lineString = createLineString(properties, decoded);
            features.push(lineString);
          }
        });
      });
    }

    console.log('Recalculate closedTrailsData');
    return {
      type: 'FeatureCollection',
      features,
    };
  }, [trails, data]);

  useEffect(() => {
    if (padding === undefined) {
      return;
    }

    let mapPadding: PaddingOptions = { top: 0, bottom: 0, left: 0, right: 0 };
    if (padding > 0) {
      mapPadding.left = padding;
    } else {
      mapPadding.left = 0;
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
      // mapStyle="mapbox://styles/thugraven/cl7rzd4h3004914lfputsqkg9"
      mapStyle="mapbox://styles/thugraven/clb2uwq4o000a14rpcner8xhe"
      // terrain={terrainMode ? { source: 'mapbox-dem' } : undefined}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      interactiveLayerIds={INTERACTIVE_LAYER_IDS}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onLoad={() => mapRef.current?.resize()}
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
      {(isLoading || !isLoaded) && (
        <Spinner
          thickness="5px"
          size="xl"
          color="black"
          className={s.spinner}
        />
      )}
      {children}
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
        <Layer {...trailsDrawOutlineLayer} />
        <Layer {...trailsDrawOffset1in2OutlineLayer} />
        <Layer {...trailsDrawOffset2in2OutlineLayer} />
        <Layer {...trailsDrawOffset1in3OutlineLayer} />
        <Layer {...trailsDrawOffset3in3OutlineLayer} />
        <Layer {...trailsDrawLayer} />
        <Layer {...trailsDrawOffset1in2Layer} />
        <Layer {...trailsDrawOffset2in2Layer} />
        <Layer {...trailsDrawOffset1in3Layer} />
        <Layer {...trailsDrawOffset3in3Layer} />
      </Source>
      <Source type="geojson" data={nodesData}>
        <Layer {...nodesDrawLayer} />
      </Source>
      <Source type="geojson" data={routeData} lineMetrics={true}>
        <Layer {...routeLayer} />
      </Source>
      <Source type="geojson" data={closedTrailsData}>
        <Layer {...trailsClosedLayer} />
      </Source>
      <NavigationControl />
    </Map>
  );
};

export default MapContainer;
