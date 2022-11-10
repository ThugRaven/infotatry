import {
  Button,
  Checkbox,
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
import {
  AdminMapControls,
  CoordinatesBox,
  NodeAdminPopup,
  TrailAdminPopup,
  TrailNodePopup,
} from '@components/map';
import { SearchInput } from '@components/search';
import { CameraAction } from '@components/search/SearchInput/SearchInput';
import {
  nodesDrawLocalLayer,
  trailNodesLocalLayer,
  trailNodesSelectedLayer,
  trailsDataLocalLayer,
  trailsDrawLocalLayer,
  trailsDrawOffset1in2Layer,
  trailsDrawOffset1in3Layer,
  trailsDrawOffset2in2Layer,
  trailsDrawOffset3in3Layer,
} from '@config/layer-styles';
import {
  createLineString,
  createPoint,
  decode,
  encode,
  swapCoordinates,
} from '@lib/utils';
import s from '@styles/DashboardAdminMap.module.css';
import distance from '@turf/distance';
import { saveAs } from 'file-saver';
import mapboxgl, { LngLat, LngLatBounds } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Map, { Layer, MapRef, NavigationControl, Source } from 'react-map-gl';
import features from '../../../../public/features.json';

interface PopupInfo {
  lngLat: mapboxgl.LngLat;
  features: mapboxgl.MapboxGeoJSONFeature[];
  trail: Trail | null;
}

export type TrailColor = 'red' | 'blue' | 'green' | 'yellow' | 'black';

export type Trail = {
  id: number;
  name: {
    start: string;
    end: string;
  };
  color: TrailColor[];
  distance: number;
  time: {
    start_end: number;
    end_start: number;
  };
  encoded: string;
  node_id: {
    start: number;
    end: number;
  };
};

export type Node = {
  id: number;
  name: string;
  type: string;
  lat: number;
  lng: number;
  elevation: number;
};

type Results = {
  nodes: Node[];
  trails: Trail[];
};

const initialNodeValues = {
  name: '',
  latitude: 0,
  longitude: 0,
  nodeType: 'node',
  elevation: 0,
};

const initialTrailValues = {
  name_start: '',
  name_end: '',
  path: '',
  color_1: '',
  color_2: '',
  color_3: '',
  distance: 0,
  time_start_end: 0,
  time_end_start: 0,
  node_start: -1,
  node_end: -1,
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
  const [trailEditForm, setTrailEditForm] = useState(initialTrailValues);
  const [nodeEditForm, setNodeEditForm] = useState(initialNodeValues);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);
  const [startNodeIndex, setStartNodeIndex] = useState<number | null>(null);
  const [endNodeIndex, setEndNodeIndex] = useState<number | null>(null);
  const [terrainMode, setTerrainMode] = useState(false);
  const [visibility, setVisibility] = useState({
    server: true,
    local: true,
  });
  const [filteredResults, setFilteredResults] = useState<Results>({
    nodes: [],
    trails: [],
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

  const trailNodesData: GeoJSON.FeatureCollection = useMemo(() => {
    const features: GeoJSON.Feature<GeoJSON.Point>[] = [];

    if (selectedTrail) {
      const trail = trails.find((trail) => trail.id === selectedTrail.id);

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

  const trailNodesSelectedData: GeoJSON.FeatureCollection = useMemo(() => {
    const features: GeoJSON.Feature<GeoJSON.Point>[] = [];

    let startIndex = startNodeIndex;
    let endIndex = endNodeIndex;

    if (startIndex != null && endIndex == null) {
      endIndex = startIndex;
    }

    if (selectedTrail && startIndex != null && endIndex != null) {
      const decoded = decode(selectedTrail.encoded);

      if (startIndex < decoded.length && endIndex < decoded.length) {
        for (let i = startIndex; i < endIndex + 1; i++) {
          const node = decoded[i];
          const point = createPoint(
            {
              i,
              lat: node[0],
              lng: node[1],
            },
            new LngLat(node[1], node[0]),
          );
          features.push(point);
        }
      }
    }

    console.log('Recalculate trailNodesSelectedData');

    return {
      type: 'FeatureCollection',
      features,
    };
  }, [selectedTrail, startNodeIndex, endNodeIndex]);

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

    const lastId = nodes[nodes.length - 1].id;
    const newNode: Node = {
      id: lastId + 1,
      name: nodeForm.name,
      type: nodeForm.nodeType,
      lat: nodeForm.latitude,
      lng: nodeForm.longitude,
      elevation: nodeForm.elevation,
    };

    setNodes((state) => [...state, newNode]);
    console.log(nodes);
    onClose();
  };

  const handleSubmitTrail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(trailForm);
    setTrailForm(initialTrailValues);

    let colors = [trailForm.color_1];
    if (trailForm.color_2) {
      colors.push(trailForm.color_2);
    }
    if (trailForm.color_3) {
      colors.push(trailForm.color_3);
    }

    const path = JSON.parse(trailForm.path);
    const swapped = swapCoordinates(path);
    const lastId = trails[trails.length - 1].id;
    const newTrail: Trail = {
      id: lastId + 1,
      name: {
        start: trailForm.name_start,
        end: trailForm.name_end,
      },
      color: colors as TrailColor[],
      distance: 0,
      time: {
        start_end: 0,
        end_start: 0,
      },
      encoded: encode(swapped),
      node_id: {
        start: -1,
        end: -1,
      },
    };

    setTrails((state) => [...state, newTrail]);
    console.log(trails);
    onClose();
  };

  const handleSave = () => {
    const data = features;
    const newData = {
      nodes: [...nodes],
      trails: [...trails],
    };

    let lastNodeId = data.nodes[data.nodes.length - 1].id;
    let lastTrailId = data.trails[data.trails.length - 1].id;

    for (let i = 0; i < newData.nodes.length; i++) {
      const node = newData.nodes[i];
      if (node.id > lastNodeId) {
        node.id = ++lastNodeId;
      }
    }

    for (let i = 0; i < newData.trails.length; i++) {
      const trail = newData.trails[i];
      if (trail.id > lastTrailId) {
        trail.id = ++lastTrailId;
      }
    }

    const blob = new Blob([JSON.stringify(newData, null, 0)], {
      type: 'application/json',
    });

    saveAs(blob, 'features.json');
  };

  const handleStartSelection = (index: number) => {
    setStartNodeIndex(index);
  };

  const handleEndSelection = (index: number) => {
    setEndNodeIndex(index);
  };

  useEffect(() => {
    setStartNodeIndex(null);
    setEndNodeIndex(null);
  }, [selectedTrail]);

  const handleOnCopySelection = () => {
    const nodes: Array<[number, number]> = [];
    if (!selectedTrail || startNodeIndex == null || endNodeIndex == null) {
      return;
    }

    const decoded = decode(selectedTrail.encoded);

    for (let i = startNodeIndex; i < endNodeIndex + 1; i++) {
      const point = decoded[i];
      nodes.push([point[1], point[0]]);
    }

    navigator.clipboard.writeText(JSON.stringify(nodes, null, 2)).then(
      () => {
        console.log('Copied to clipboard!');
      },
      () => {
        console.log('Failed to copy!');
      },
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVisibility((state) => ({ ...state, [e.target.name]: e.target.checked }));
  };

  const handleAddSelected = () => {
    const nodes: Array<[number, number]> = [];
    if (!selectedTrail || startNodeIndex == null || endNodeIndex == null) {
      return;
    }

    const decoded = decode(selectedTrail.encoded);

    for (let i = startNodeIndex; i < endNodeIndex + 1; i++) {
      const point = decoded[i];
      nodes.push([point[1], point[0]]);
    }

    let nameStart = '';
    let nameEnd = '';

    if (nodes.length > 0) {
      nodes.forEach((node) => {
        if (node[0] === decoded[0][1] && node[1] === decoded[0][0]) {
          nameEnd = selectedTrail.name.end;
        }
        if (
          node[0] === decoded[decoded.length - 1][1] &&
          node[1] === decoded[decoded.length - 1][0]
        ) {
          nameStart = selectedTrail.name.start;
        }
      });
    }

    setType('trail');
    setTrailForm((values) => ({
      ...values,
      nameStart: nameStart,
      nameEnd: nameEnd,
      path: JSON.stringify(nodes, null, 2),
      color_1: selectedTrail.color[0],
      color_2: selectedTrail.color[1],
      color_3: selectedTrail.color[2],
    }));
    onOpen();
  };

  const handleAddNode = (lat: number, lng: number, name: string) => {
    setType('node');
    setNodeForm((values) => ({
      ...values,
      name: name,
      latitude: lat,
      longitude: lng,
    }));
    onOpen();
  };

  const handleRemoveTrail = (id: number) => {
    setTrails((state) => state.filter((trail) => trail.id !== id));
    setSelectedTrail(null);
    setPopupInfo(null);
  };

  const handleRemoveNode = (id: number) => {
    setNodes((state) => state.filter((node) => node.id !== id));
    setPopupInfo(null);
  };

  const handleFeatureChange = (id: number) => {
    const trail = trails.find((trail) => trail.id === id) ?? null;
    setSelectedTrail(trail);
  };

  const handleZoomOnFeature = (id: number) => {
    const trail = trails.find((trail) => trail.id === id) ?? null;

    if (trail) {
      let decoded = decode(trail.encoded);
      const bounds = new LngLatBounds(
        new LngLat(decoded[0][1], decoded[0][0]),
        new LngLat(decoded[0][1], decoded[0][0]),
      );

      decoded.forEach((node) => {
        bounds.extend([node[1], node[0]]);
      });

      mapRef.current?.fitBounds(bounds, { padding: 100 });
    }
  };

  const handleSearch = (query: string) => {
    if (!query) {
      return setFilteredResults({ nodes: [], trails: [] });
    }

    const resultNodes = nodes.filter((node) =>
      node.name.trim().toLowerCase().includes(query),
    );
    const resultTrails = trails.filter((trail) =>
      `${trail.name.start} - ${trail.name.end}`
        .trim()
        .toLowerCase()
        .includes(query),
    );

    setFilteredResults({
      nodes: resultNodes.slice(0, 5),
      trails: resultTrails.slice(0, 5),
    });
  };

  const handleSearchResultClick = (cameraAction: CameraAction) => {
    mapRef.current?.fitBounds(cameraAction.bounds, cameraAction.options);
  };

  const handleChangeEditTrail = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setTrailEditForm({
      ...trailEditForm,
      [name]: value,
    });
  };

  const handleChangeEditNode = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setNodeEditForm({
      ...nodeEditForm,
      [name]: value,
    });
  };

  useEffect(() => {
    if (selectedTrail) {
      const trail = selectedTrail;
      let decoded = decode(trail.encoded);
      decoded = swapCoordinates(decoded);
      setTrailEditForm({
        name_start: trail.name.start,
        name_end: trail.name.end,
        path: JSON.stringify(decoded, null, 2),
        color_1: trail.color[0],
        color_2: trail.color[1],
        color_3: trail.color[2],
        distance: trail.distance,
        time_start_end: trail.time.start_end,
        time_end_start: trail.time.end_start,
        node_start: trail.node_id?.start ?? -1,
        node_end: trail.node_id?.end ?? -1,
      });
    } else {
      setTrailEditForm(initialTrailValues);
    }
  }, [selectedTrail]);

  useEffect(() => {
    if (selectedNode) {
      const node = selectedNode;

      setNodeEditForm({
        name: node.name,
        latitude: node.lat,
        longitude: node.lng,
        nodeType: node.type,
        elevation: node.elevation ?? 0,
      });
    } else {
      setNodeEditForm(initialNodeValues);
    }
  }, [selectedNode]);

  const handleEditTrail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTrail) {
      return;
    }
    const index = trails.findIndex((trail) => trail.id === selectedTrail.id);

    let colors = [trailEditForm.color_1];
    if (trailEditForm.color_2) {
      colors.push(trailEditForm.color_2);
    }
    if (trailEditForm.color_3) {
      colors.push(trailEditForm.color_3);
    }

    const path = JSON.parse(trailEditForm.path);
    const swapped = swapCoordinates(path);
    const editedTrail: Trail = {
      id: selectedTrail.id,
      name: {
        start: trailEditForm.name_start,
        end: trailEditForm.name_end,
      },
      color: colors as TrailColor[],
      distance: 0,
      time: {
        start_end: trailEditForm.time_start_end,
        end_start: trailEditForm.time_end_start,
      },
      encoded: encode(swapped),
      node_id: {
        start: trailEditForm.node_start,
        end: trailEditForm.node_end,
      },
    };
    const updatedTrails = [...trails];
    updatedTrails[index] = editedTrail;
    setTrails(updatedTrails);
    setTrailEditForm(initialTrailValues);
    setSelectedTrail(null);
    setPopupInfo(null);
  };

  const handleEditNode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedNode) {
      return;
    }
    const index = nodes.findIndex((node) => node.id === selectedNode.id);

    const editedNode: Node = {
      id: selectedNode.id,
      name: nodeEditForm.name,
      type: nodeEditForm.nodeType,
      lat: nodeEditForm.latitude,
      lng: nodeEditForm.longitude,
      elevation: nodeEditForm.elevation,
    };
    const updatedNodes = [...nodes];
    updatedNodes[index] = editedNode;
    setNodes(updatedNodes);
    setNodeEditForm(initialNodeValues);
    setSelectedNode(null);
    setPopupInfo(null);
  };

  const handleCancelEdit = () => {
    setSelectedTrail(null);
    setSelectedNode(null);
  };

  const handleCalculateDistance = () => {
    if (selectedTrail) {
      const trail = selectedTrail;
      let decoded = decode(trail.encoded);
      decoded = swapCoordinates(decoded);
      let trailDistance = 0;
      for (let i = 0; i < decoded.length - 1; i++) {
        const node = decoded[i];
        const nextNode = decoded[i + 1];
        trailDistance += distance(
          [node[0], node[1]],
          [nextNode[0], nextNode[1]],
          { units: 'meters' },
        );
      }

      setTrailEditForm({
        ...trailEditForm,
        distance: trailDistance,
      });
    } else {
      setTrailEditForm(initialTrailValues);
    }
  };

  const handleComputeTrailNodes = () => {
    if (!selectedTrail) {
      return;
    }

    const trail = selectedTrail;
    let decoded = decode(trail.encoded);

    const firstNode = nodes.find(
      (node) => node.lat === decoded[0][0] && node.lng === decoded[0][1],
    );
    const lastNode = nodes.find(
      (node) =>
        node.lat === decoded[decoded.length - 1][0] &&
        node.lng === decoded[decoded.length - 1][1],
    );
    console.log(firstNode, lastNode);

    if (firstNode && lastNode) {
      setTrailEditForm({
        ...trailEditForm,
        node_start: firstNode?.id,
        node_end: lastNode?.id,
      });
    }
  };

  const handleReversePath = () => {
    if (!selectedTrail) {
      return;
    }

    let decoded = decode(selectedTrail.encoded);
    decoded = swapCoordinates(decoded);
    decoded.reverse();

    setTrailEditForm({
      ...trailEditForm,
      path: JSON.stringify(decoded, null, 2),
    });
  };

  const handleSwapNames = () => {
    if (!selectedTrail) {
      return;
    }

    setTrailEditForm({
      ...trailEditForm,
      name_start: trailEditForm.name_end,
      name_end: trailEditForm.name_start,
    });
  };

  const handleCalculateNodeElevation = () => {
    if (!selectedNode) {
      return;
    }

    const elevation = mapRef.current?.queryTerrainElevation(
      [selectedNode.lng, selectedNode.lat],
      { exaggerated: false },
    );
    console.log(elevation);

    if (elevation) {
      setNodeEditForm({
        ...nodeEditForm,
        elevation,
      });
    }
  };

  const handleChangeMapMode = () => {
    setTerrainMode((state) => !state);
  };

  return (
    <>
      <SEO title="Admin Dashboard - Map" />
      <div className={s.container}>
        <div className={s.header}>
          <SearchInput
            results={filteredResults}
            onSearch={handleSearch}
            onClick={handleSearchResultClick}
          />
          <div className={s.options}>
            <div className={s.layer__visibility}>
              <Checkbox isChecked={terrainMode} onChange={handleChangeMapMode}>
                3D Terrain
              </Checkbox>
              <Checkbox
                name="server"
                isChecked={visibility['server']}
                onChange={handleChange}
              >
                Server layer
              </Checkbox>
              <Checkbox
                name="local"
                isChecked={visibility['local']}
                onChange={handleChange}
              >
                Local layer
              </Checkbox>
            </div>
            <Button onClick={handleSave}>Save file</Button>
          </div>
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
            terrain={terrainMode ? { source: 'mapbox-dem' } : undefined}
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

              let trail = selectedTrail;

              if (
                features[0].properties &&
                features[0].layer.id !== 'trail-nodes-local-layer' &&
                features[0].layer.id !== 'nodes-draw-local-layer'
              ) {
                const id = features[0].properties.id;
                trail = trails.find((trail) => trail.id === id) ?? null;

                setSelectedTrail(trail);
                setSelectedNode(null);
              } else if (
                features[0].properties &&
                features[0].layer.id === 'nodes-draw-local-layer'
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
            <Source
              id="mapbox-dem"
              type="raster-dem"
              url="mapbox://mapbox.mapbox-terrain-dem-v1"
              tileSize={512}
              maxzoom={14}
            />
            {popupInfo &&
              (popupInfo.trail &&
              popupInfo.features[0].layer.id !== 'nodes-draw-local-layer' ? (
                popupInfo.features[0] &&
                popupInfo.features[0].layer.id === 'trail-nodes-local-layer' ? (
                  <TrailNodePopup
                    lngLat={popupInfo.lngLat}
                    features={popupInfo.features}
                    trail={popupInfo.trail}
                    onClose={() => {
                      setPopupInfo(null);
                    }}
                    onStartSelection={handleStartSelection}
                    onEndSelection={handleEndSelection}
                    onCopySelection={handleOnCopySelection}
                    onAddSelected={handleAddSelected}
                    onAddNode={handleAddNode}
                  />
                ) : (
                  <TrailAdminPopup
                    lngLat={popupInfo.lngLat}
                    features={popupInfo.features}
                    trail={popupInfo.trail}
                    key={popupInfo.trail.name.start + popupInfo.trail.name.end}
                    onClose={() => {
                      setPopupInfo(null);
                    }}
                    onRemove={handleRemoveTrail}
                    onChange={handleFeatureChange}
                    onZoomOnFeature={handleZoomOnFeature}
                  />
                )
              ) : (
                <NodeAdminPopup
                  lngLat={popupInfo.lngLat}
                  features={popupInfo.features}
                  onClose={() => {
                    setPopupInfo(null);
                  }}
                  onRemove={handleRemoveNode}
                />
              ))}
            <Source type="geojson" data={trailsData}>
              <Layer
                {...trailsDataLocalLayer}
                beforeId="trails-data-layer"
                layout={{
                  visibility: visibility['local'] ? 'visible' : 'none',
                }}
              />
              <Layer
                {...trailsDrawLocalLayer}
                beforeId="trails-data-layer"
                layout={{
                  visibility: visibility['local'] ? 'visible' : 'none',
                }}
              />
              <Layer
                {...trailsDrawOffset1in2Layer}
                beforeId="trails-data-layer"
                layout={{
                  visibility: visibility['local'] ? 'visible' : 'none',
                }}
              />
              <Layer
                {...trailsDrawOffset2in2Layer}
                beforeId="trails-data-layer"
                layout={{
                  visibility: visibility['local'] ? 'visible' : 'none',
                }}
              />
              <Layer
                {...trailsDrawOffset1in3Layer}
                beforeId="trails-data-layer"
                layout={{
                  visibility: visibility['local'] ? 'visible' : 'none',
                }}
              />
              <Layer
                {...trailsDrawOffset3in3Layer}
                beforeId="trails-data-layer"
                layout={{
                  visibility: visibility['local'] ? 'visible' : 'none',
                }}
              />
            </Source>
            <Source type="geojson" data={nodesData}>
              <Layer
                {...nodesDrawLocalLayer}
                layout={{
                  ...nodesDrawLocalLayer.layout,
                  visibility: visibility['local'] ? 'visible' : 'none',
                }}
              />
            </Source>
            <Source type="geojson" data={trailNodesData}>
              <Layer
                {...trailNodesLocalLayer}
                layout={{
                  visibility: visibility['local'] ? 'visible' : 'none',
                }}
              />
            </Source>
            <Source type="geojson" data={trailNodesSelectedData}>
              <Layer {...trailNodesSelectedLayer} />
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
                          name="name_start"
                          value={trailForm.name_start}
                          mb={2}
                          onChange={handleChangeTrail}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Name end</FormLabel>
                        <Input
                          type="text"
                          name="name_end"
                          value={trailForm.name_end}
                          mb={2}
                          onChange={handleChangeTrail}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Path</FormLabel>
                        <Textarea
                          name="path"
                          value={trailForm.path}
                          mb={2}
                          onChange={handleChangeTrail}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Color</FormLabel>
                        <Select
                          placeholder="Select color"
                          name="color_1"
                          value={trailForm.color_1}
                          mb={2}
                          onChange={handleChangeTrail}
                        >
                          <option value="red">red</option>
                          <option value="blue">blue</option>
                          <option value="yellow">yellow</option>
                          <option value="green">green</option>
                          <option value="black">black</option>
                        </Select>
                      </FormControl>
                      <Select
                        placeholder="Select color"
                        name="color_2"
                        value={trailForm.color_2}
                        mb={2}
                        onChange={handleChangeTrail}
                      >
                        <option value="red">red</option>
                        <option value="blue">blue</option>
                        <option value="yellow">yellow</option>
                        <option value="green">green</option>
                        <option value="black">black</option>
                      </Select>
                      <Select
                        placeholder="Select color"
                        name="color_3"
                        value={trailForm.color_3}
                        mb={2}
                        onChange={handleChangeTrail}
                      >
                        <option value="red">red</option>
                        <option value="blue">blue</option>
                        <option value="yellow">yellow</option>
                        <option value="green">green</option>
                        <option value="black">black</option>
                      </Select>
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
        <aside className={s.sidebar}>
          {selectedTrail ? (
            <form onSubmit={handleEditTrail}>
              <FormLabel>ID</FormLabel>
              <Input type="text" mb={2} value={selectedTrail.id} disabled />
              <FormControl isRequired>
                <FormLabel>Name start</FormLabel>
                <Input
                  type="text"
                  name="name_start"
                  value={trailEditForm.name_start}
                  mb={2}
                  onChange={handleChangeEditTrail}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Name end</FormLabel>
                <Input
                  type="text"
                  name="name_end"
                  value={trailEditForm.name_end}
                  mb={2}
                  onChange={handleChangeEditTrail}
                />
              </FormControl>
              <Button colorScheme="blue" mr={3} onClick={handleSwapNames}>
                Swap names
              </Button>
              <FormControl isRequired>
                <FormLabel>Path</FormLabel>
                <Textarea
                  name="path"
                  value={trailEditForm.path}
                  mb={2}
                  onChange={handleChangeEditTrail}
                />
              </FormControl>
              <Button colorScheme="blue" mr={3} onClick={handleReversePath}>
                Reverse path
              </Button>
              <FormControl isRequired>
                <FormLabel>Color</FormLabel>
                <Select
                  placeholder="Select color"
                  name="color_1"
                  value={trailEditForm.color_1}
                  mb={2}
                  onChange={handleChangeEditTrail}
                >
                  <option value="red">red</option>
                  <option value="blue">blue</option>
                  <option value="yellow">yellow</option>
                  <option value="green">green</option>
                  <option value="black">black</option>
                </Select>
              </FormControl>
              <Select
                placeholder="Select color"
                name="color_2"
                value={trailEditForm.color_2}
                mb={2}
                onChange={handleChangeEditTrail}
              >
                <option value="red">red</option>
                <option value="blue">blue</option>
                <option value="yellow">yellow</option>
                <option value="green">green</option>
                <option value="black">black</option>
              </Select>
              <Select
                placeholder="Select color"
                name="color_3"
                value={trailEditForm.color_3}
                mb={2}
                onChange={handleChangeEditTrail}
              >
                <option value="red">red</option>
                <option value="blue">blue</option>
                <option value="yellow">yellow</option>
                <option value="green">green</option>
                <option value="black">black</option>
              </Select>
              <FormControl isRequired>
                <FormLabel>Distance</FormLabel>
                <Input
                  type="text"
                  name="distance"
                  value={trailEditForm.distance}
                  mb={2}
                  onChange={handleChangeEditTrail}
                />
                <Button
                  colorScheme="blue"
                  mr={3}
                  mb={2}
                  onClick={handleCalculateDistance}
                >
                  Calculate
                </Button>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Time start-end</FormLabel>
                <Input
                  type="text"
                  name="time_start_end"
                  value={trailEditForm.time_start_end}
                  mb={2}
                  onChange={handleChangeEditTrail}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Time end-start</FormLabel>
                <Input
                  type="text"
                  name="time_end_start"
                  value={trailEditForm.time_end_start}
                  mb={2}
                  onChange={handleChangeEditTrail}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Node start</FormLabel>
                <Input
                  type="text"
                  name="node_start"
                  value={trailEditForm.node_start}
                  mb={2}
                  onChange={handleChangeEditTrail}
                  disabled
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Node end</FormLabel>
                <Input
                  type="text"
                  name="node_end"
                  value={trailEditForm.node_end}
                  mb={2}
                  onChange={handleChangeEditTrail}
                  disabled
                />
              </FormControl>

              <Button
                colorScheme="blue"
                mr={3}
                onClick={handleComputeTrailNodes}
              >
                Compute nodes
              </Button>
              <Button colorScheme="blue" mr={3} type="submit">
                Save
              </Button>
              <Button onClick={handleCancelEdit}>Cancel</Button>
            </form>
          ) : selectedNode ? (
            <form onSubmit={handleEditNode}>
              <FormLabel>ID</FormLabel>
              <Input type="text" mb={2} value={selectedNode.id} disabled />
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  mb={2}
                  value={nodeEditForm.name}
                  onChange={handleChangeEditNode}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Latitude</FormLabel>
                <Input
                  type="text"
                  name="latitude"
                  mb={2}
                  value={nodeEditForm.latitude}
                  onChange={handleChangeEditNode}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Longitude</FormLabel>
                <Input
                  type="text"
                  name="longitude"
                  mb={2}
                  value={nodeEditForm.longitude}
                  onChange={handleChangeEditNode}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Type</FormLabel>
                <Select
                  placeholder="Select type"
                  name="nodeType"
                  mb={2}
                  value={nodeEditForm.nodeType}
                  onChange={handleChangeEditNode}
                >
                  <option value="node">node</option>
                  <option value="peak">peak</option>
                  <option value="shelter">shelter</option>
                  <option value="cave">cave</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Elevation</FormLabel>
                <Input
                  type="text"
                  name="elevation"
                  mb={2}
                  value={nodeEditForm.elevation}
                  onChange={handleChangeEditNode}
                />
                <Button
                  colorScheme="blue"
                  mb={2}
                  onClick={handleCalculateNodeElevation}
                >
                  Get elevation
                </Button>
              </FormControl>

              <Button colorScheme="blue" mr={3} type="submit">
                Save
              </Button>
              <Button onClick={handleCancelEdit}>Cancel</Button>
            </form>
          ) : null}
        </aside>
      </div>
    </>
  );
};

DashboardAdminMap.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardAdminMap;
