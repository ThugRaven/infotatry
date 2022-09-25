import { CircleLayer, LineLayer } from 'mapbox-gl';

export const trailsDrawLayer: LineLayer = {
  id: 'trails-draw-layer',
  type: 'line',
  source: 'composite',
  'source-layer': 'Trails',
  paint: {
    'line-color': [
      'match',
      ['get', 'colour'],
      ['red'],
      'hsl(0, 100%, 55%)',
      '#000000',
    ],
    'line-width': ['interpolate', ['linear'], ['zoom'], 9, 1, 11, 3, 22, 3],
    'line-dasharray': [4, 2],
  },
};

export const trailsDataLayer: LineLayer = {
  id: 'trails-data-layer',
  type: 'line',
  source: 'composite',
  'source-layer': 'Trails',
  paint: {
    'line-width': ['interpolate', ['linear'], ['zoom'], 0, 2, 10, 10, 22, 15],
    'line-opacity': 0,
  },
};

export const nodesDrawLayer: CircleLayer = {
  id: 'nodes-draw-layer',
  type: 'circle',
  source: 'composite',
  paint: {
    'circle-color': 'hsl(0, 100%, 100%)',
    'circle-stroke-width': 1,
  },
};

export const nodesDrawLocalLayer: CircleLayer = {
  ...nodesDrawLayer,
  id: 'nodes-draw-local-layer',
};

export const nodesDataLayer: CircleLayer = {
  id: 'nodes-data-layer',
  type: 'circle',
  source: 'composite',
  layout: {},
  paint: { 'circle-radius': 10, 'circle-opacity': 0 },
};

export const nodesDataLocalLayer: CircleLayer = {
  ...nodesDataLayer,
  id: 'nodes-data-local-layer',
};
