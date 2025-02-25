import { Spinner } from '@chakra-ui/react';
import {
  nodeHighlightLayer,
  nodesDrawLayer,
  nodeSelectedLayer,
  routeLayer,
  trailHighlightLayer,
  trailsClosedLayer,
  trailsDataLayer,
  trailsDirectionEndStartLayer,
  trailsDirectionStartEndLayer,
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
  trailSelectedLayer,
} from '@config/layer-styles';
import {
  createLineString,
  createPoint,
  decode,
  swapCoordinates,
} from '@lib/geo-utils';
import { INITIAL_VIEW_STATE, INTERACTIVE_LAYER_IDS } from 'constants/constants';
import { useKeyboard } from 'hooks/useKeyboard';
import mapboxgl, { LngLat, LngLatBounds } from 'mapbox-gl';
import { PopupAction } from 'pages';
import { Node, Trail } from 'pages/dashboard/admin/map';
import {
  Dispatch,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import Map, {
  Layer,
  MapRef,
  NavigationControl,
  PaddingOptions,
  Source,
} from 'react-map-gl';
import { useQuery } from 'react-query';
import { CompletedHike } from 'types/hikes-types';
import features from '../../../public/features.json';
import MapPopup from '../MapPopup';
import MapStyles from '../MapStyles';
import s from './MapContainer.module.css';

type MapContainerProps = {
  trailIds?: number[];
  hike?: CompletedHike;
  children?: React.ReactNode;
  padding?: number;
  isLoading?: boolean;
  popup?: boolean;
  popupDispatch?: Dispatch<PopupAction>;
  hoveredNode?: number;
  selectedNode?: number;
  hoveredTrail?: number;
  selectedTrail?: number;
  bounds?: [[number, number], [number, number]];
};

interface PopupInfo {
  lngLat: mapboxgl.LngLat;
  features: mapboxgl.MapboxGeoJSONFeature[];
  isClosed: boolean;
}

export type Announcement = {
  _id: string;
  type: string;
  title: string;
  featuresType: string;
  featuresIds: number[];
  reason: string;
  since: Date | null;
  until: Date | null;
  description: string;
  source: string | null;
  isClosed?: boolean;
};

export interface MapStyleState {
  type: 'DEFAULT' | 'SATELLITE';
  terrain: boolean;
}

export interface MapStyleAction {
  type: 'DEFAULT' | 'SATELLITE' | '3D';
}

const mapStyleReducer = (
  state: MapStyleState,
  action: MapStyleAction,
): MapStyleState => {
  switch (action.type) {
    case 'DEFAULT': {
      return {
        type: 'DEFAULT',
        terrain: state.terrain,
      };
    }
    case 'SATELLITE': {
      return {
        type: 'SATELLITE',
        terrain: state.terrain,
      };
    }
    case '3D': {
      return {
        type: state.type,
        terrain: !state.terrain,
      };
    }
    default:
      return state;
  }
};

const MapContainer = ({
  trailIds,
  hike,
  children,
  padding,
  isLoading = false,
  popup = true,
  popupDispatch,
  hoveredNode,
  selectedNode,
  hoveredTrail,
  selectedTrail,
  bounds,
}: MapContainerProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapRef | null>(null);
  const mapInitializeRef = useCallback((node: MapRef) => {
    console.log('mapInitializeRef');
    mapRef.current = node;

    if (node !== null) {
      console.log('mapInitializeRef node', node);
      setIsMapRefLoaded(true);
    }
  }, []);
  const [cursor, setCursor] = useState('grab');
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);

  const onMouseEnter = useCallback(() => setCursor('pointer'), []);
  const onMouseLeave = useCallback(() => setCursor('grab'), []);
  const onDragStart = useCallback(() => setCursor('grabbing'), []);
  const onDragEnd = useCallback(() => setCursor('grab'), []);

  const [trails, setTrails] = useState<Trail[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isMapRefLoaded, setIsMapRefLoaded] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const [style, styleDispatch] = useReducer(mapStyleReducer, {
    type: 'DEFAULT',
    terrain: false,
  });

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
        distance: trail.distance,
        time_start_end: trail.time.start_end,
        time_end_start: trail.time.end_start,
        bounds: trail.bounds,
      };
      if (trail.color.length === 1) {
        properties = {
          ...properties,
          offset: '1-1',
          color: trail.color[0],
          direction: trail.direction,
        };
      } else if (trail.color.length === 2) {
        properties = {
          ...properties,
          offset: ['1-2', '2-2'],
          color_left: trail.color[0],
          color_right: trail.color[1],
          direction: trail.direction,
        };
      } else if (trail.color.length === 3) {
        properties = {
          ...properties,
          offset: ['1-3', '1-1', '3-3'],
          color_left: trail.color[0],
          color: trail.color[1],
          color_right: trail.color[2],
          direction: trail.direction,
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
        {
          id: node.id,
          name: node.name,
          type: node.type,
          lat: node.lat,
          lng: node.lng,
          elevation: node.elevation,
        },
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

    if (!isMapRefLoaded) {
      return {
        type: 'FeatureCollection',
        features,
      };
    }

    if (trailIds) {
      trailIds?.forEach((id) => {
        const trail = trails.find((trail) => trail.id === id);
        if (trail) {
          let decoded = decode(trail.encoded);
          decoded = swapCoordinates(decoded);

          decoded.forEach((node) => {
            bounds.extend([node[0], node[1]]);
          });

          const properties: GeoJSON.GeoJsonProperties = {
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

      const properties: GeoJSON.GeoJsonProperties = {
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
  }, [trailIds, hike, trails, isMapRefLoaded]);

  const fetchAnnouncements = async () => {
    try {
      console.log('fetch announcements');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/announcements/closures`,
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

  const { data } = useQuery<Announcement[], Error>(
    ['announcements'],
    fetchAnnouncements,
    {
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 15 * 60 * 1000, // 15 minutes
      staleTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log(data);
      },
    },
  );

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

            const properties: GeoJSON.GeoJsonProperties = {
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

    const mapPadding: PaddingOptions = { top: 0, bottom: 0, left: 0, right: 0 };
    if (padding > 0) {
      mapPadding.left = padding;
    } else {
      mapPadding.left = 0;
    }

    mapRef.current?.easeTo({
      padding: mapPadding,
      duration: 250,
    });
  }, [padding, isMapRefLoaded]);

  const handleClosePopup = useCallback(() => {
    setPopupInfo(null);
  }, []);

  useEffect(() => {
    if (bounds && mapRef.current) {
      const _bounds = new LngLatBounds(bounds);
      mapRef.current.fitBounds(_bounds, {
        padding: 100,
        maxZoom: 18,
        bearing: mapRef.current.getTerrain() ? mapRef.current.getBearing() : 0,
      });
    }
  }, [bounds]);

  useEffect(() => {
    const trail = trails.find((trail) => trail.id === selectedTrail);
    const bounds = new LngLatBounds();

    if (trail) {
      let decoded = decode(trail.encoded);
      decoded = swapCoordinates(decoded);

      decoded.forEach((node) => {
        bounds.extend([node[0], node[1]]);
      });
    }
    if (!bounds.isEmpty()) {
      mapRef.current?.fitBounds(bounds, { padding: 100 });
    }
  }, [selectedTrail, trails]);

  useEffect(() => {
    const node = nodes.find((node) => node.id === selectedNode);

    if (node) {
      mapRef.current?.flyTo({ center: [node.lng, node.lat], padding: 100 });
    }
  }, [selectedNode, nodes]);

  useKeyboard(['Z', 'X', ' '], ref.current, [
    () => {
      mapRef.current?.zoomIn({ duration: 150 });
    },
    () => {
      mapRef.current?.zoomOut({ duration: 150 });
    },
    () => {
      mapRef.current?.flyTo({
        center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
        zoom: INITIAL_VIEW_STATE.zoom,
      });
    },
  ]);

  return (
    <div ref={ref} className={s.container}>
      <Map
        id="map"
        ref={mapInitializeRef}
        initialViewState={INITIAL_VIEW_STATE}
        maxPitch={85}
        reuseMaps
        mapStyle={
          style.type === 'DEFAULT'
            ? process.env.NEXT_PUBLIC_MAPBOX_STYLE_DEFAULT
            : process.env.NEXT_PUBLIC_MAPBOX_STYLE_SATELLITE
        }
        terrain={style.terrain ? { source: 'mapbox-dem' } : undefined}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        interactiveLayerIds={isMapLoaded ? INTERACTIVE_LAYER_IDS : undefined}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onLoad={() => {
          mapRef.current?.resize();
          setIsMapLoaded(true);
        }}
        cursor={cursor}
        onClick={(e) => {
          const features = e.features;

          if (
            !mapRef.current ||
            !features ||
            features.length === 0 ||
            !INTERACTIVE_LAYER_IDS.some((id) => id === features[0].layer.id)
          ) {
            setPopupInfo(null);
            return;
          }

          let lngLat = e.lngLat;

          if (
            features[0].properties &&
            features[0].layer.id === 'nodes-draw-layer'
          ) {
            lngLat = new LngLat(
              features[0].properties.lng,
              features[0].properties.lat,
            );
          }

          const isClosed =
            features[0].layer.id === 'trails-data-layer' &&
            closedTrailsData.features.find(
              (trail) => trail.properties?.id === features[0].properties?.id,
            )
              ? true
              : false;

          const trailInfo = {
            lngLat,
            features,
            isClosed,
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
        }}
      >
        {(isLoading || !isMapRefLoaded) && (
          <Spinner
            thickness="5px"
            size="xl"
            color="black"
            className={s.spinner}
          />
        )}
        {children}
        {popupInfo && popup && ref.current && (
          <MapPopup
            lngLat={popupInfo.lngLat}
            features={popupInfo.features}
            isClosed={popupInfo.isClosed}
            onClose={handleClosePopup}
            dispatch={popupDispatch}
            ref={ref}
          />
        )}
        <MapStyles padding={padding} style={style} dispatch={styleDispatch} />
        <Source
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          maxzoom={14}
        />
        <Source type="geojson" data={trailsData}>
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
          <Layer {...trailsDirectionStartEndLayer} />
          <Layer {...trailsDirectionEndStartLayer} />
          <Layer
            {...trailHighlightLayer}
            filter={['==', hoveredTrail ?? null, ['get', 'id']]}
          />
          <Layer
            {...trailSelectedLayer}
            filter={['==', selectedTrail ?? null, ['get', 'id']]}
          />
        </Source>
        <Source type="geojson" data={routeData} lineMetrics={true}>
          <Layer {...routeLayer} />
        </Source>
        <Source type="geojson" data={nodesData}>
          <Layer {...nodesDrawLayer} />
          <Layer
            {...nodeHighlightLayer}
            filter={['==', hoveredNode ?? null, ['get', 'id']]}
          />
          <Layer
            {...nodeSelectedLayer}
            filter={['==', selectedNode ?? null, ['get', 'id']]}
          />
        </Source>
        <Source type="geojson" data={closedTrailsData}>
          <Layer {...trailsClosedLayer} />
        </Source>
        <NavigationControl />
      </Map>
    </div>
  );
};

export default memo(MapContainer);
